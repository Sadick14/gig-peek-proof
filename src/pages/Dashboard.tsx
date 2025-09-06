import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Overview } from '@/components/dashboard/Overview';
import { CreateDeal } from '@/components/dashboard/CreateDeal';
import { ActiveDeals } from '@/components/dashboard/ActiveDeals';
import { DealHistory } from '@/components/dashboard/DealHistory';
import { OpenDeal } from '@/components/dashboard/OpenDeal';
import { MyGigs } from '@/components/dashboard/MyGigs';
import { PaymentHistory } from '@/components/dashboard/PaymentHistory';

const Dashboard = () => {
  const { currentRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if no role is selected
    if (!currentRole) {
      navigate('/');
    }
  }, [currentRole, navigate]);

  if (!currentRole) {
    return null;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        
        {/* Client-specific routes */}
        {currentRole === 'client' && (
          <>
            <Route path="/create-deal" element={<CreateDeal />} />
            <Route path="/active-deals" element={<ActiveDeals />} />
            <Route path="/deal-history" element={<DealHistory />} />
          </>
        )}
        
        {/* Contractor-specific routes */}
        {currentRole === 'contractor' && (
          <>
            <Route path="/open-deal" element={<OpenDeal />} />
            <Route path="/my-gigs" element={<MyGigs />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
          </>
        )}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
