import { MultiWalletConnection } from "@/components/ui/multi-wallet-connection";
import { Button } from "@/components/ui/button";
import { Eye, Zap } from "lucide-react";

interface HeaderProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  address?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ onConnect, isConnected, address, activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow/50">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                GigPeek
              </h1>
              <p className="text-xs text-muted-foreground">Secure Web3 Gigs</p>
            </div>
          </div>

          {/* Navigation */}
          {isConnected && (
            <nav className="flex items-center gap-2">
              <Button
                variant={activeTab === "client" ? "default" : "ghost"}
                onClick={() => onTabChange("client")}
                className="transition-all duration-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                Create Deal
              </Button>
              <Button
                variant={activeTab === "contractor" ? "default" : "ghost"}
                onClick={() => onTabChange("contractor")}
                className="transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                My Gigs
              </Button>
            </nav>
          )}

          {/* Wallet Connection */}
          <MultiWalletConnection onConnect={onConnect} />
        </div>
      </div>
    </header>
  );
}