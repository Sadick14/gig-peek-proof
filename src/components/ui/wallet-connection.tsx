import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletConnectionProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  address?: string;
}

export function WalletConnection({ onConnect, isConnected, address }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x742d35Cc6635C0532925a3b8D40C8C3F8b29B2C1";
      onConnect(mockAddress);
      setIsConnecting(false);
    }, 1500);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Card className="p-4 bg-gradient-card border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Connected</p>
            <p className="text-xs text-muted-foreground font-mono">
              {formatAddress(address)}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </Card>
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