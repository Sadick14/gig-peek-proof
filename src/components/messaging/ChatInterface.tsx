import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Image, 
  File, 
  Download,
  Clock,
  CheckCheck,
  MoreVertical
} from 'lucide-react';
import { Message, User } from '@/types';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: Message[];
  currentUser: User;
  otherUser: User;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onFileUpload?: (files: File[]) => void;
  isLoading?: boolean;
  className?: string;
}

export function ChatInterface({
  messages,
  currentUser,
  otherUser,
  onSendMessage,
  onFileUpload,
  isLoading = false,
  className
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage.trim(), attachments);
      setNewMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    onFileUpload?.(files);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = message.sentAt.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return Object.entries(groups).map(([date, msgs]) => ({
      date: new Date(date),
      messages: msgs
    }));
  };

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === currentUser.id;
    const user = isCurrentUser ? currentUser : otherUser;

    return (
      <div
        key={message.id}
        className={cn(
          'flex gap-3 mb-4',
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {!isCurrentUser && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {user.displayName?.charAt(0) || user.address.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={cn(
          'max-w-[70%] space-y-1',
          isCurrentUser ? 'items-end' : 'items-start'
        )}>
          <div className={cn(
            'rounded-2xl px-4 py-2 break-words',
            isCurrentUser 
              ? 'bg-primary text-primary-foreground rounded-tr-md' 
              : 'bg-muted rounded-tl-md'
          )}>
            {message.type === 'system' ? (
              <p className="text-center text-xs text-muted-foreground italic">
                {message.content}
              </p>
            ) : (
              <>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Attachments */}
                {message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-2 bg-background/10 rounded-lg"
                      >
                        {attachment.fileType.startsWith('image/') ? (
                          <Image className="w-4 h-4" />
                        ) : (
                          <File className="w-4 h-4" />
                        )}
                        <span className="text-sm flex-1 truncate">
                          {attachment.fileName}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className={cn(
            'flex items-center gap-1 text-xs text-muted-foreground',
            isCurrentUser ? 'flex-row-reverse' : 'flex-row'
          )}>
            <span>{formatTime(message.sentAt)}</span>
            {isCurrentUser && (
              <>
                {message.isRead ? (
                  <CheckCheck className="w-3 h-3 text-primary" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("flex flex-col h-[600px] bg-gradient-card border-border/50", className)}>
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherUser.avatar} alt={otherUser.displayName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {otherUser.displayName?.charAt(0) || otherUser.address.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {otherUser.displayName || `User ${otherUser.address.slice(0, 6)}...`}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-5 text-xs">
                  {otherUser.level.name}
                </Badge>
                {otherUser.isOnline ? (
                  <span className="text-xs text-green-500">Online</span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Last seen {formatTime(otherUser.lastSeen)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {groupMessagesByDate(messages).map(({ date, messages: dayMessages }) => (
              <div key={date.toISOString()}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    {formatDate(date)}
                  </div>
                </div>
                
                {/* Messages for this day */}
                {dayMessages.map(renderMessage)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border/50">
        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                {file.type.startsWith('image/') ? (
                  <Image className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => removeAttachment(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="pr-12"
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && attachments.length === 0) || isLoading}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </Card>
  );
}