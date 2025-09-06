import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ContractorSidebar } from "@/components/contractor/contractor-sidebar";
import { WalletConnection } from "@/components/ui/wallet-connection";
import { useApp } from "@/context/AppContext";

// Contractor Pages
import ContractorOverview from "@/components/contractor/pages/contractor-overview";
import OpenDeal from "@/components/contractor/pages/open-deal";
import MyGigs from "@/components/contractor/pages/my-gigs";
import PaymentHistory from "@/components/contractor/pages/payment-history";

const ContractorDashboard = () => {
  const { user, connectWallet } = useApp();

  if (!user.isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ContractorSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <WalletConnection
              onConnect={connectWallet}
              isConnected={user.isConnected}
              address={user.address}
            />
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<ContractorOverview />} />
              <Route path="/open" element={<OpenDeal />} />
              <Route path="/gigs" element={<MyGigs />} />
              <Route path="/history" element={<PaymentHistory />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ContractorDashboard;