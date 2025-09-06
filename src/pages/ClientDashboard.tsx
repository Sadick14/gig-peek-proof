import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client/client-sidebar";
import { MultiWalletConnection } from "@/components/ui/multi-wallet-connection";
import { useApp } from "@/context/AppContext";

// Client Pages
import ClientOverview from "@/components/client/pages/client-overview";
import CreateNewDeal from "@/components/client/pages/create-new-deal";
import ActiveDeals from "@/components/client/pages/active-deals";
import DealHistory from "@/components/client/pages/deal-history";

const ClientDashboard = () => {
  const { user, connectWallet } = useApp();

  if (!user.isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <MultiWalletConnection onConnect={connectWallet} />
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<ClientOverview />} />
              <Route path="/new" element={<CreateNewDeal />} />
              <Route path="/active" element={<ActiveDeals />} />
              <Route path="/history" element={<DealHistory />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;