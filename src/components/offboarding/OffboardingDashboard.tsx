import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatCard } from "../ui/stat-card";
import { StatusChip } from "../ui/status-chip";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { 
  TrendingDown, 
  FileText, 
  AlertTriangle, 
  UserMinus,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  Laptop,
  CreditCard,
  Smartphone,
  Monitor,
  Shield,
  Mail,
  ClipboardList
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const leavers = [
  {
    id: 1,
    name: "Zulkifli Hassan",
    manager: "Farah Kassim", 
    lastWorkingDay: "2025-09-12",
    completedTasks: 5,
    totalTasks: 9,
    progress: 56,
    status: "in-progress" as const
  },
  {
    id: 2,
    name: "Siti Rahmah",
    manager: "Nizam Salleh",
    lastWorkingDay: "2025-09-20", 
    completedTasks: 2,
    totalTasks: 8,
    progress: 25,
    status: "not-started" as const
  }
];

const allTasks = [
  {
    id: 1,
    task: "Exit Interview",
    assignee: "Zulkifli Hassan",
    due: "2025-09-10",
    type: "Meeting/Event",
    indicator: "Offboarding",
    status: "overdue" as const,
    assignedTo: "Manager"
  },
  {
    id: 2,
    task: "Collect Laptop & Access Card",
    assignee: "Siti Rahmah", 
    due: "2025-09-18",
    type: "Asset",
    indicator: "Offboarding",
    status: "pending" as const,
    assignedTo: "IT/PIC"
  },
  {
    id: 3,
    task: "Revoke System Access",
    assignee: "Zulkifli Hassan",
    due: "2025-09-12",
    type: "System/Access",
    indicator: "Offboarding",
    status: "pending" as const,
    assignedTo: "IT/PIC"
  },
  {
    id: 4,
    task: "Final Payroll Processing",
    assignee: "Siti Rahmah",
    due: "2025-09-20",
    type: "Information/Document",
    indicator: "Offboarding",
    status: "not-started" as const,
    assignedTo: "HR Coordinator"
  },
  {
    id: 5,
    task: "Return Office Keys",
    assignee: "Zulkifli Hassan",
    due: "2025-09-12",
    type: "Asset",
    indicator: "Offboarding",
    status: "pending" as const,
    assignedTo: "Staff"
  },
  {
    id: 6,
    task: "Clear Personal Items",
    assignee: "Siti Rahmah",
    due: "2025-09-19",
    type: "General Task",
    indicator: "Offboarding",
    status: "not-started" as const,
    assignedTo: "Staff"
  },
  {
    id: 7,
    task: "Knowledge Transfer Documents",
    assignee: "Zulkifli Hassan",
    due: "2025-09-11",
    type: "Information/Document",
    indicator: "Offboarding",
    status: "completed" as const,
    assignedTo: "Staff"
  }
];

const assetsToCollect = [
  {
    id: 1,
    employee: "Zulkifli Hassan",
    asset: "MacBook Pro 14",
    tag: "MBP-14-2024-072",
    status: "issued" as const
  },
  {
    id: 2,
    employee: "Zulkifli Hassan", 
    asset: "Access Card",
    tag: "AC-6671",
    status: "returned" as const
  },
  {
    id: 3,
    employee: "Siti Rahmah",
    asset: "iPhone 13",
    tag: "IP13-221", 
    status: "issued" as const
  },
  {
    id: 4,
    employee: "Siti Rahmah",
    asset: "Monitor",
    tag: "DELL-27-8841",
    status: "missing" as const
  }
];

const accessToRevoke = [
  {
    id: 1,
    employee: "Zulkifli Hassan",
    system: "Email (Google Workspace)",
    accessLevel: "User",
    status: "active" as const
  },
  {
    id: 2,
    employee: "Zulkifli Hassan",
    system: "HRMS", 
    accessLevel: "Staff",
    status: "revoked" as const
  },
  {
    id: 3,
    employee: "Siti Rahmah",
    system: "VPN",
    accessLevel: "Standard",
    status: "active" as const
  },
  {
    id: 4,
    employee: "Siti Rahmah",
    system: "GitHub",
    accessLevel: "Contributor", 
    status: "active" as const
  }
];

const getAssetIcon = (asset: string) => {
  if (asset.includes("MacBook") || asset.includes("Laptop")) return Laptop;
  if (asset.includes("Card")) return CreditCard;
  if (asset.includes("iPhone") || asset.includes("Phone")) return Smartphone;
  if (asset.includes("Monitor")) return Monitor;
  return FileText;
};

const getSystemIcon = (system: string) => {
  if (system.includes("Email")) return Mail;
  if (system.includes("VPN")) return Shield;
  return Shield;
};

interface OffboardingDashboardProps {
  currentUserRole?: string;
}

export function OffboardingDashboard({ currentUserRole = "HR Admin" }: OffboardingDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Offboarding Dashboard</h1>
          <p className="text-muted-foreground">Manage employee exits and offboarding processes</p>
        </div>
        <Button>
          <UserMinus className="w-4 h-4 mr-2" />
          Initiate Offboarding
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentUserRole === "Staff" ? (
          (() => {
            const staffTasks = allTasks.filter(task => task.assignedTo === "Staff");
            const completedTasks = staffTasks.filter(task => task.status === "completed");
            const pendingTasks = staffTasks.filter(task => task.status === "pending");
            const notStartedTasks = staffTasks.filter(task => task.status === "not-started");
            const totalTasks = staffTasks.length;
            const completionPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
            
            return (
              <>
                <StatCard
                  title="Offboarding Progress"
                  value={`${completionPercentage}%`}
                  icon={TrendingDown}
                  variant="primary"
                  subtitle={`${completedTasks.length}/${totalTasks} tasks completed`}
                  progress={{
                    value: completionPercentage,
                    message: completionPercentage >= 75 
                      ? "Almost done! Just a few more tasks to complete."
                      : completionPercentage >= 50
                      ? "You're making good progress with your transition."
                      : completionPercentage >= 25
                      ? "Keep going! Important tasks still need attention."
                      : "Let's work together to complete your transition."
                  }}
                />
                <StatCard
                  title="Completed Tasks" 
                  value={`${completedTasks.length}`}
                  icon={CheckCircle}
                  variant="success"
                  subtitle={`${totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0}% of total tasks`}
                />
                <StatCard
                  title="Pending Tasks"
                  value={`${pendingTasks.length}`}
                  icon={Clock}
                  variant="warning"
                  subtitle={`${totalTasks > 0 ? Math.round((pendingTasks.length / totalTasks) * 100) : 0}% of total tasks`}
                />
                <StatCard
                  title="Not Started"
                  value={`${notStartedTasks.length}`}
                  icon={AlertTriangle}
                  variant="danger"
                  subtitle={`${totalTasks > 0 ? Math.round((notStartedTasks.length / totalTasks) * 100) : 0}% of total tasks`}
                />
              </>
            );
          })()
        ) : (
          <>
            <StatCard
              title="Overall Progress"
              value="54%"
              icon={TrendingDown}
              variant="primary"
            />
            <StatCard
              title="Pending Documents" 
              value="4"
              icon={FileText}
              variant="warning"
            />
            <StatCard
              title="Overdue Tasks"
              value="2"
              icon={AlertTriangle}
              variant="danger"
            />
            <StatCard
              title="Exits This Month"
              value="3"
              icon={UserMinus}
              variant="success"
            />
          </>
        )}
      </div>

      <div className={`grid grid-cols-1 ${currentUserRole === "Staff" ? "lg:grid-cols-1" : "lg:grid-cols-2"} gap-6`}>
        {/* Progress by Leaver - Hidden for Staff */}
        {currentUserRole !== "Staff" && (
          <Card>
            <CardHeader>
              <CardTitle>Progress by Leaver</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Last Working Day</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leavers.map((leaver) => (
                    <TableRow key={leaver.id}>
                      <TableCell className="font-medium">{leaver.name}</TableCell>
                      <TableCell>{leaver.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {leaver.lastWorkingDay}
                        </div>
                      </TableCell>
                      <TableCell>{leaver.completedTasks}/{leaver.totalTasks}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={leaver.progress} className="w-16" />
                          <span className="text-sm text-muted-foreground">{leaver.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={leaver.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* My Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Tasks</CardTitle>
                {currentUserRole === "Staff" && (
                  <p className="text-sm text-muted-foreground mt-1">Tasks assigned specifically to you</p>
                )}
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allTasks
                .filter(task => {
                  if (currentUserRole === "IT/PIC" || currentUserRole === "Staff") {
                    return task.assignedTo === currentUserRole;
                  }
                  return true; // HR Admin, HR Coordinator, Manager see all tasks
                })
                .map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{task.task}</h4>
                    <StatusChip status={task.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{currentUserRole === "Staff" ? "Employee" : task.assignee}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {task.due}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.type}</Badge>
                      <Badge className="bg-red-100 text-red-800">{task.indicator}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets and Access tables - Hidden for Staff */}
      {currentUserRole !== "Staff" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets to Collect */}
          <Card>
            <CardHeader>
              <CardTitle>Assets to Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsToCollect.map((asset) => {
                    const Icon = getAssetIcon(asset.asset);
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.employee}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            {asset.asset}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{asset.tag}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            asset.status === "returned" ? "default" :
                            asset.status === "missing" ? "destructive" : "secondary"
                          } className={
                            asset.status === "returned" ? "bg-green-100 text-green-800" : undefined
                          }>
                            {asset.status === "issued" ? "Issued" : 
                             asset.status === "returned" ? "Returned" : "Missing"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {asset.status === "issued" && (
                            <Button variant="outline" size="sm">
                              Record Return
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Access to Revoke */}
          <Card>
            <CardHeader>
              <CardTitle>Access to Revoke</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessToRevoke.map((access) => {
                    const Icon = getSystemIcon(access.system);
                    return (
                      <TableRow key={access.id}>
                        <TableCell className="font-medium">{access.employee}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            {access.system}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{access.accessLevel}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={access.status === "revoked" ? "default" : "secondary"} 
                                 className={access.status === "revoked" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {access.status === "active" ? "Active" : "Revoked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {access.status === "active" && (
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}