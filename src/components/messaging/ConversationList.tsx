import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageCircle, Clock, Paperclip } from 'lucide-react';
import { Conversation } from '@/types';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onSearch,
  className
}: ConversationListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  const getOtherParticipant = (conversation: Conversation, currentUserId: string) => {
    return conversation.participants.find(p => p.id !== currentUserId) || conversation.participants[0];
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const renderMessagePreview = (conversation: Conversation) => {
    const lastMessage = conversation.lastMessage;
    
    if (lastMessage.attachments.length > 0 && !lastMessage.content) {
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Paperclip className="w-3 h-3" />
          <span className="text-sm">
            {lastMessage.attachments.length} attachment{lastMessage.attachments.length > 1 ? 's' : ''}
          </span>
        </div>
      );
    }
    
    return (
      <p className="text-sm text-muted-foreground">
        {truncateMessage(lastMessage.content)}
      </p>
    );
  };

  return (
    <Card className={cn("h-[600px] bg-gradient-card border-border/50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Messages
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[480px]">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground">
                Start a conversation by contacting a seller
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => {
                const otherUser = getOtherParticipant(conversation, ''); // TODO: Pass current user ID
                const isSelected = conversation.id === selectedConversationId;
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                      isSelected && "bg-primary/10 border-r-2 border-primary"
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={otherUser.avatar} alt={otherUser.displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {otherUser.displayName?.charAt(0) || otherUser.address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {otherUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">
                          {otherUser.displayName || `User ${otherUser.address.slice(0, 6)}...`}
                        </h4>
                        <div className="flex items-center gap-2">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="h-5 min-w-[20px] text-xs px-1.5">
                              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.sentAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-4 text-xs px-2">
                          {otherUser.level.name}
                        </Badge>
                        {conversation.orderId && (
                          <Badge variant="outline" className="h-4 text-xs px-2">
                            Order
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-1">
                        {renderMessagePreview(conversation)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}