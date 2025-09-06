import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  ChevronDown, 
  Copy, 
  ExternalLink, 
  LogOut,
  Loader2,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MultiWalletConnectionProps {
  onConnect?: (address: string) => void;
  className?: string;
}

export function MultiWalletConnection({ onConnect, className }: MultiWalletConnectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = (connector: any) => {
    connect({ connector }, {
      onSuccess: (data) => {
        setIsDialogOpen(false);
        onConnect?.(data.accounts[0]);
        toast({
          title: "Wallet Connected!",
          description: `Successfully connected to ${connector.name}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Connection Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDisconnect = () => {
    disconnect();
    onConnect?.('');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const getWalletIcon = (connectorId: string) => {
    switch (connectorId) {
      case 'metaMask':
        return <Zap className="w-5 h-5" />;
      case 'walletConnect':
        return <Smartphone className="w-5 h-5" />;
      case 'coinbaseWallet':
        return <Globe className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`gap-2 ${className}`}>
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">
              {ensName || formatAddress(address)}
            </span>
            <span className="sm:hidden">
              {formatAddress(address)}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {ensName || 'Wallet Connected'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {formatAddress(address)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {chain && (
            <DropdownMenuItem className="flex items-center justify-between">
              <span>Network</span>
              <Badge variant="outline" className="ml-2">
                {chain.name}
              </Badge>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank')}
            className="cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Etherscan
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDisconnect}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={`gap-2 bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 ${className}`}>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to GigPeek. Make sure you're on the Sepolia testnet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="h-14 justify-start gap-4 hover:bg-accent"
              onClick={() => handleConnect(connector)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                getWalletIcon(connector.id)
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{connector.name}</span>
                <span className="text-xs text-muted-foreground">
                  {connector.id === 'metaMask' && 'Most popular wallet'}
                  {connector.id === 'walletConnect' && 'Connect with QR code'}
                  {connector.id === 'coinbaseWallet' && 'Coinbase users'}
                  {connector.id === 'injected' && 'Browser extension'}
                </span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  );
}
