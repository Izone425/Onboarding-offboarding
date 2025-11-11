import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { 
  Users, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown,
  UserPlus,
  BarChart3,
  UserMinus,
  Shield,
  ClipboardList,
  Workflow,
  FileText,
  Building2,
  Home,
  User,
  Clock,
  Calendar,
  Receipt,
  DollarSign,
  Target
} from "lucide-react";
import { cn } from "../ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
  currentUser?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onNavigate?: (view: string) => void;
  currentView?: string;
  onRoleSwitch?: (role: string) => void;
  availableRoles?: string[];
}

export function AppLayout({ children, currentUser, onNavigate, currentView, onRoleSwitch, availableRoles }: AppLayoutProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["onboard-offboard", "operation", "configuration"]);
  const [collapsed, setCollapsed] = useState(false);
  // Normalize currentView to map create workflow views to their parent workflow section
  const normalizeView = (view: string) => {
    if (view === "create-workflow-onboarding" || view === "create-workflow-offboarding") {
      return "workflow";
    }
    return view;
  };
  
  const activeSection = normalizeView(currentView || "onboarding-dashboard");

  const defaultUser = {
    name: "Sarah Ahmad",
    email: "sarah.ahmad@company.com", 
    role: "HR Admin",
    avatar: ""
  };

  const user = currentUser || defaultUser;

  const hrmsModules = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      hasSubmenu: false
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <Clock className="w-4 h-4" />,
      hasSubmenu: false
    },
    {
      id: 'leave',
      label: 'Leave',
      icon: <Calendar className="w-4 h-4" />,
      hasSubmenu: false
    },
    {
      id: 'reimbursement',
      label: 'Reimbursement',
      icon: <Receipt className="w-4 h-4" />,
      hasSubmenu: false
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: <DollarSign className="w-4 h-4" />,
      hasSubmenu: false
    },
    {
      id: 'appraisal',
      label: 'Appraisal',
      icon: <Target className="w-4 h-4" />,
      hasSubmenu: false
    },
    {
      id: 'onboard-offboard',
      label: 'Onboard & Offboard',
      icon: <Users className="w-4 h-4" />,
      hasSubmenu: true,
      children: [
        {
          id: 'operation',
          label: 'Operation',
          icon: <Home className="w-4 h-4" />,
          hasSubmenu: true,
          restricted: ["HR Admin", "HR Coordinator", "Manager", "IT/PIC", "Staff"],
          children: [
            { id: 'pre-hire-entry', label: 'Pre-hire Entry', icon: <UserPlus className="w-3 h-3" />, restricted: ["HR Admin", "HR Coordinator"] },
            { id: 'onboarding-dashboard', label: 'Onboarding', icon: <BarChart3 className="w-3 h-3" />, restricted: ["HR Admin", "HR Coordinator", "Manager", "IT/PIC", "Staff"] },
            { id: 'offboarding-dashboard', label: 'Offboarding', icon: <UserMinus className="w-3 h-3" />, restricted: ["HR Admin", "HR Coordinator", "Manager", "IT/PIC", "Staff"] }
          ]
        },
        {
          id: 'configuration',
          label: 'Configuration',
          icon: <Settings className="w-4 h-4" />,
          hasSubmenu: true,
          restricted: ["HR Admin"],
          children: [
            { id: 'general-settings', label: 'General Settings', icon: <Settings className="w-3 h-3" /> },
            { id: 'user-roles', label: 'User Roles', icon: <Shield className="w-3 h-3" /> },
            { id: 'role-permissions', label: 'Role Permissions', icon: <Shield className="w-3 h-3" /> },
            { id: 'task-templates', label: 'Task Templates', icon: <ClipboardList className="w-3 h-3" /> },
            { id: 'workflow', label: 'Workflow', icon: <Workflow className="w-3 h-3" /> },
            { id: 'audit-trail', label: 'Audit Trail', icon: <FileText className="w-3 h-3" /> }
          ]
        }
      ]
    }
  ];

  const canAccess = (item: any) => {
    if (!item.restricted) return true;
    return item.restricted.includes(user.role);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const shouldShowChildren = (module: any) => {
    return !collapsed && expandedSections.includes(module.id) && module.children;
  };

  const hasActiveChild = (module: any) => {
    if (!module.children) return false;
    return module.children.some((child: any) => {
      if (child.children) {
        return child.children.some((subChild: any) => activeSection === subChild.id);
      }
      return activeSection === child.id;
    });
  };

  const onSectionChange = (sectionId: string) => {
    onNavigate?.(sectionId);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">TimeTec HR</div>
                <div className="text-xs text-muted-foreground">Management System</div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <nav className={cn("flex-1 px-3 py-4 space-y-1", collapsed && "px-2")}>
              <div className="space-y-1">
                {hrmsModules.map((module) => (
                  canAccess(module) && (
                    <div key={module.id}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full h-10 transition-all duration-200",
                          collapsed ? "justify-center px-2" : "justify-between gap-3 px-3",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          activeSection === module.id && 
                          "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm",
                          hasActiveChild(module) && activeSection !== module.id && 
                          "text-black font-medium",
                          // Special handling for collapsed state when children are active
                          collapsed && hasActiveChild(module) && "font-bold"
                        )}
                        onClick={() => {
                          if (module.hasSubmenu) {
                            toggleSection(module.id);
                          } else {
                            onSectionChange(module.id);
                          }
                        }}
                        title={collapsed ? module.label : undefined}
                      >
                        <div className="flex items-center gap-3">
                          {module.icon}
                          {!collapsed && (
                            <span className="transition-opacity duration-200">
                              {module.label}
                            </span>
                          )}
                        </div>
                        {!collapsed && module.hasSubmenu && (
                          <ChevronDown className={cn(
                            "w-4 h-4 transition-transform duration-200 text-sidebar-foreground/50 flex-shrink-0",
                            expandedSections.includes(module.id) && "rotate-180"
                          )} />
                        )}
                      </Button>

                      {/* Module children */}
                      {shouldShowChildren(module) && (
                        <div className="ml-6 space-y-1 transition-all duration-200 mt-1">
                          {module.children?.map((category) => (
                            canAccess(category) && (
                              <div key={category.id} className="space-y-1">
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full h-9 transition-all duration-200 relative justify-between gap-3 px-3",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    activeSection === category.id && "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm",
                                    hasActiveChild(category) && activeSection !== category.id && "text-black font-medium"
                                  )}
                                  onClick={() => {
                                    if (category.hasSubmenu) {
                                      toggleSection(category.id);
                                    } else {
                                      onSectionChange(category.id);
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    {category.icon}
                                    <span className="transition-opacity duration-200">
                                      {category.label}
                                    </span>
                                  </div>
                                  {category.hasSubmenu && (
                                    <ChevronDown className={cn(
                                      "w-4 h-4 transition-transform duration-200",
                                      expandedSections.includes(category.id) && "rotate-180"
                                    )} />
                                  )}
                                </Button>
                                
                                {/* Category children */}
                                {shouldShowChildren(category) && (
                                  <div className="ml-6 space-y-1 transition-all duration-200">
                                    {category.children?.map((child) => (
                                      canAccess(child) && (
                                        <Button
                                          key={child.id}
                                          variant="ghost"
                                          size="sm"
                                          className={cn(
                                            "w-full justify-start gap-2 h-8 text-sm px-3 transition-all duration-200 relative",
                                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                            activeSection === child.id && "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                                          )}
                                          onClick={() => onSectionChange(child.id)}
                                        >
                                          {activeSection === child.id && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary-foreground rounded-r-sm" />
                                          )}
                                          {child.icon}
                                          <span className="transition-opacity duration-200">
                                            {child.label}
                                          </span>
                                        </Button>
                                      )
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </nav>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="border-b border-border bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search modules..." 
                    className="w-80 pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs bg-destructive text-destructive-foreground">
                    3
                  </Badge>
                </Button>
                
                <Button variant="ghost" size="sm">
                  <HelpCircle className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm">{user.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">{user.role}</div>
                          {onRoleSwitch && (
                            <Badge variant="outline" className="text-xs py-0 px-1.5 h-4">
                              View
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {onRoleSwitch && availableRoles && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Switch View As
                        </div>
                        {availableRoles.map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => onRoleSwitch(role)}
                            className={cn(
                              "relative",
                              user.role === role && "bg-accent"
                            )}
                          >
                            {user.role === role && (
                              <div className="absolute left-2 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                            <span className={cn("ml-4", user.role === role && "font-medium")}>
                              {role}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}