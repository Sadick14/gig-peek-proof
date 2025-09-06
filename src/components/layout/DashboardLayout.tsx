import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Plus, 
  CheckSquare, 
  History, 
  Search, 
  Briefcase, 
  DollarSign,
  ArrowLeftRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentRole, setUserRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const clientNavItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Plus, label: 'Create New Deal', path: '/dashboard/create-deal' },
    { icon: CheckSquare, label: 'My Active Deals', path: '/dashboard/active-deals' },
    { icon: History, label: 'Deal History', path: '/dashboard/deal-history' },
  ];

  const contractorNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Open a Deal', path: '/dashboard/open-deal' },
    { icon: Briefcase, label: 'My Gigs', path: '/dashboard/my-gigs' },
    { icon: DollarSign, label: 'Payment History', path: '/dashboard/payment-history' },
  ];

  const navItems = currentRole === 'client' ? clientNavItems : contractorNavItems;
  
  const switchRole = () => {
    const newRole = currentRole === 'client' ? 'contractor' : 'client';
    setUserRole(newRole);
    navigate('/dashboard');
  };

  const goHome = () => {
    setUserRole(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg">GigPeek</h1>
                <p className="text-sm text-gray-500 capitalize">{currentRole}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  collapsed && "px-2"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        <Separator />

        {/* Footer Actions */}
        <div className="p-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className={cn("w-full justify-start gap-2", collapsed && "px-2")}
            onClick={switchRole}
          >
            <ArrowLeftRight className="h-4 w-4" />
            {!collapsed && (
              <span>Switch to {currentRole === 'client' ? 'Contractor' : 'Client'}</span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full justify-start gap-2", collapsed && "px-2")}
            onClick={goHome}
          >
            <span className="text-xs">🏠</span>
            {!collapsed && <span>Home</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
            >
              ☰
            </Button>
            
            <div className="text-sm text-gray-500">
              Role: <span className="capitalize font-medium">{currentRole}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
