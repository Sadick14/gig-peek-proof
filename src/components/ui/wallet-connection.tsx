import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, ChevronDown, AlertTriangle, LogOut, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { switchToSepolia, SEPOLIA_NETWORK_CONFIG } from "@/contracts/GigPeek";
import { toast } from "@/hooks/use-toast";

interface WalletConnectionProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  address?: string;
}

export function WalletConnection({ onConnect, isConnected, address }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    checkNetwork();
    
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleChainChanged = (newChainId: string) => {
    setChainId(newChainId);
    setIsWrongNetwork(newChainId !== SEPOLIA_NETWORK_CONFIG.chainId);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      onConnect("");
    } else {
      onConnect(accounts[0]);
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(currentChainId);
        setIsWrongNetwork(currentChainId !== SEPOLIA_NETWORK_CONFIG.chainId);
      } catch (error) {
        console.error("Error checking network:", error);
      }
    }
  };

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        onConnect(accounts[0]);
        
        // Check and switch to Sepolia if needed
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== SEPOLIA_NETWORK_CONFIG.chainId) {
          await switchToSepolia();
        }
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        alert("Please connect to MetaMask.");
      } else {
        alert("Error connecting to wallet: " + error.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    const success = await switchToSepolia();
    if (success) {
      await checkNetwork();
    }
  };

  const handleDisconnect = () => {
    // Clear the connection
    onConnect("");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard",
        });
      } catch (error) {
        console.error("Failed to copy address:", error);
      }
    }
  };

  const viewOnEtherscan = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Card className="p-4 bg-gradient-card border-border/50 backdrop-blur-sm cursor-pointer hover:shadow-elegant transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Connected</p>
                  {isWrongNetwork ? (
                    <Badge variant="destructive" className="text-xs">
                      Wrong Network
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Sepolia
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatAddress(address)}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            {isWrongNetwork && (
              <div className="mt-3 p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-xs font-medium">
                    Please switch to Sepolia testnet to use GigPeek
                  </p>
                </div>
              </div>
            )}
          </Card>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2">
            <p className="text-sm font-medium">Wallet Address</p>
            <p className="text-xs text-muted-foreground font-mono">{address}</p>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={viewOnEtherscan} className="cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Etherscan
          </DropdownMenuItem>
          
          {isWrongNetwork && (
            <DropdownMenuItem onClick={handleSwitchNetwork} className="cursor-pointer">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Switch to Sepolia
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className={cn(
        "bg-gradient-primary text-primary-foreground shadow-glow",
        "hover:shadow-glow/80 transition-all duration-300",
        "border-0 px-6 py-3 h-auto"
      )}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}