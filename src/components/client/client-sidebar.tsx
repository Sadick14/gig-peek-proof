import { Eye, Home, Plus, FileText, History, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface ClientSidebarProps {
  className?: string;
}

export function ClientSidebar({ className }: ClientSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Overview",
      url: "/client",
      icon: Home,
    },
    {
      title: "Create New Deal",
      url: "/client/new",
      icon: Plus,
    },
    {
      title: "Active Deals",
      url: "/client/active",
      icon: FileText,
    },
    {
      title: "Deal History",
      url: "/client/history",
      icon: History,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/client") {
      return location.pathname === "/client";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={className}>
      <SidebarContent>
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow/50">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                GigPeek
              </h2>
              <p className="text-xs text-muted-foreground">Client Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className={isActive(item.url) ? "bg-primary/10 text-primary font-medium" : ""}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Switch Role */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Role Selection</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}