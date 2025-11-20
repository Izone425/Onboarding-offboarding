import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatCard } from "../ui/stat-card";
import { StatusChip } from "../ui/status-chip";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
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
  ClipboardList,
  Plus,
  X,
  ChevronDown,
  Check,
  Search,
  ArrowLeft,
  Building2,
  Users,
  Briefcase,
  Bell,
  Trash2,
  Undo2
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { taskTemplates } from "../../utils/taskTemplatesData";

// Company data
const companies = [
  { id: "timetec-cloud", name: "TimeTec Cloud" },
  { id: "timetec-computing", name: "TimeTec Computing" },
  { id: "fingertech", name: "FingerTec" },
];

// All leavers data with company association
const allLeavers = [
  {
    id: 1,
    name: "Zulkifli Hassan",
    manager: "Farah Kassim",
    lastWorkingDay: "2025-09-12",
    completedTasks: 5,
    totalTasks: 9,
    progress: 56,
    status: "in-progress" as const,
    company: "timetec-cloud",
    stage: "final-week" as const,
    designation: "Senior Developer",
    department: "Engineering"
  },
  {
    id: 2,
    name: "Siti Rahmah",
    manager: "Nizam Salleh",
    lastWorkingDay: "2025-09-20",
    completedTasks: 2,
    totalTasks: 8,
    progress: 25,
    status: "not-started" as const,
    company: "timetec-cloud",
    stage: "notice-period" as const,
    designation: "Marketing Specialist",
    department: "Marketing"
  },
  {
    id: 3,
    name: "Ahmad Firdaus",
    manager: "Lim Wei Ting",
    lastWorkingDay: "2025-09-15",
    completedTasks: 7,
    totalTasks: 9,
    progress: 78,
    status: "in-progress" as const,
    company: "timetec-computing",
    stage: "final-week" as const,
    designation: "Sales Manager",
    department: "Sales"
  },
  {
    id: 4,
    name: "Nurul Izzah",
    manager: "Chen Li Ming",
    lastWorkingDay: "2025-09-10",
    completedTasks: 9,
    totalTasks: 9,
    progress: 100,
    status: "completed" as const,
    company: "fingertech",
    stage: "exit-day" as const,
    designation: "HR Executive",
    department: "Human Resources"
  }
];

// All tasks data
const allTasksData = [
  {
    id: 1,
    task: "Exit Interview",
    assignee: "Zulkifli Hassan",
    assignedTo: "HR",
    due: "2025-09-10",
    stage: "notice-period" as const,
    status: "overdue" as const,
    templateId: "exit-interview",
    company: "timetec-cloud",
    type: "Meeting/Event" as const,
    description: "Conduct comprehensive exit interview to gather feedback",
    pic: { category: "Department" as const, value: "Human Resources" }
  },
  {
    id: 2,
    task: "Revoke System Access",
    assignee: "Zulkifli Hassan",
    assignedTo: "IT",
    due: "2025-09-12",
    stage: "final-week" as const,
    status: "pending" as const,
    templateId: "revoke-collect",
    company: "timetec-cloud",
    type: "System/Access" as const,
    description: "Revoke all system access including email and applications",
    pic: { category: "Department" as const, value: "IT" }
  },
  {
    id: 3,
    task: "Final Payroll Processing",
    assignee: "Siti Rahmah",
    assignedTo: "HR",
    due: "2025-09-20",
    stage: "exit-day" as const,
    status: "not-started" as const,
    templateId: "final-pay",
    company: "timetec-cloud",
    type: "Information/Document" as const,
    description: "Process final payroll including outstanding payments",
    pic: { category: "Department" as const, value: "Finance" }
  },
  {
    id: 4,
    task: "Return Office Keys",
    assignee: "Zulkifli Hassan",
    assignedTo: "Staff",
    due: "2025-09-12",
    stage: "final-week" as const,
    status: "pending" as const,
    templateId: "revoke-collect",
    company: "timetec-cloud",
    type: "Asset" as const,
    description: "Return all office keys and access cards",
    pic: { category: "Employee" as const, value: "Zulkifli Hassan" }
  },
  {
    id: 5,
    task: "Knowledge Transfer Documents",
    assignee: "Zulkifli Hassan",
    assignedTo: "Staff",
    due: "2025-09-11",
    stage: "notice-period" as const,
    status: "completed" as const,
    templateId: "exit-interview",
    company: "timetec-cloud",
    type: "Information/Document" as const,
    description: "Prepare knowledge transfer documentation",
    pic: { category: "Employee" as const, value: "Zulkifli Hassan" }
  },
  {
    id: 6,
    task: "Exit Interview",
    assignee: "Ahmad Firdaus",
    assignedTo: "HR",
    due: "2025-09-13",
    stage: "notice-period" as const,
    status: "completed" as const,
    templateId: "exit-interview",
    company: "timetec-computing",
    type: "Meeting/Event" as const,
    description: "Conduct comprehensive exit interview",
    pic: { category: "Department" as const, value: "Human Resources" }
  },
  {
    id: 7,
    task: "Collect Assets",
    assignee: "Ahmad Firdaus",
    assignedTo: "IT",
    due: "2025-09-15",
    stage: "exit-day" as const,
    status: "in-progress" as const,
    templateId: "revoke-collect",
    company: "timetec-computing",
    type: "Asset" as const,
    description: "Collect all company assets",
    pic: { category: "Department" as const, value: "IT" }
  },
  {
    id: 8,
    task: "Final Pay Briefing",
    assignee: "Nurul Izzah",
    assignedTo: "HR",
    due: "2025-09-10",
    stage: "exit-day" as const,
    status: "completed" as const,
    templateId: "final-pay",
    company: "fingertech",
    type: "General Task" as const,
    description: "Provide final pay and benefits briefing",
    pic: { category: "Department" as const, value: "Human Resources" }
  }
];

// Alerts data
const allAlerts = [
  {
    id: 1,
    type: "warning" as const,
    title: "Exit Interview Overdue",
    message: "Exit interview for Zulkifli Hassan is overdue by 2 days",
    time: "2 days ago",
    company: "timetec-cloud"
  },
  {
    id: 2,
    type: "info" as const,
    title: "Upcoming Last Working Day",
    message: "Nurul Izzah's last working day is today",
    time: "Today",
    company: "fingertech"
  },
  {
    id: 3,
    type: "urgent" as const,
    title: "Assets Not Collected",
    message: "Ahmad Firdaus still has 2 company assets pending collection",
    time: "1 day ago",
    company: "timetec-computing"
  }
];

// Assets to collect
const allAssetsToCollect = [
  {
    id: 1,
    employee: "Zulkifli Hassan",
    asset: "MacBook Pro 14",
    tag: "MBP-14-2024-072",
    status: "issued" as const,
    company: "timetec-cloud"
  },
  {
    id: 2,
    employee: "Zulkifli Hassan",
    asset: "Access Card",
    tag: "AC-6671",
    status: "returned" as const,
    company: "timetec-cloud"
  },
  {
    id: 3,
    employee: "Siti Rahmah",
    asset: "iPhone 13",
    tag: "IP13-221",
    status: "issued" as const,
    company: "timetec-cloud"
  },
  {
    id: 4,
    employee: "Ahmad Firdaus",
    asset: "Monitor",
    tag: "DELL-27-8841",
    status: "issued" as const,
    company: "timetec-computing"
  }
];

// Access to revoke
const allAccessToRevoke = [
  {
    id: 1,
    employee: "Zulkifli Hassan",
    system: "Email (Google Workspace)",
    accessLevel: "User",
    status: "active" as const,
    company: "timetec-cloud"
  },
  {
    id: 2,
    employee: "Zulkifli Hassan",
    system: "HRMS",
    accessLevel: "Staff",
    status: "revoked" as const,
    company: "timetec-cloud"
  },
  {
    id: 3,
    employee: "Siti Rahmah",
    system: "VPN",
    accessLevel: "Standard",
    status: "active" as const,
    company: "timetec-cloud"
  },
  {
    id: 4,
    employee: "Ahmad Firdaus",
    system: "GitHub",
    accessLevel: "Contributor",
    status: "active" as const,
    company: "timetec-computing"
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

const getStageColor = (stage: string) => {
  switch (stage) {
    case "notice-period":
      return "bg-blue-100 text-blue-800";
    case "final-week":
      return "bg-orange-100 text-orange-800";
    case "exit-day":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStageName = (stage: string) => {
  switch (stage) {
    case "notice-period":
      return "Pre-Offboarding";
    case "final-week":
      return "Last Day";
    case "exit-day":
      return "Post-Offboarding";
    default:
      return stage;
  }
};

interface OffboardingDashboardProps {
  currentUserRole?: string;
}

export function OffboardingDashboard({ currentUserRole = "HR Admin" }: OffboardingDashboardProps) {
  // Navigation states
  const [showEmployeeTasksPage, setShowEmployeeTasksPage] = useState(false);
  const [showProgressByLeaver, setShowProgressByLeaver] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof allLeavers[0] | null>(null);

  // Company filter state
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(companies.map(c => c.id));

  // Drawer states
  const [isTaskDetailsDrawerOpen, setIsTaskDetailsDrawerOpen] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<typeof allTasksData[0] | null>(null);
  const [isAddTaskDrawerOpen, setIsAddTaskDrawerOpen] = useState(false);
  const [isOverdueTaskDrawerOpen, setIsOverdueTaskDrawerOpen] = useState(false);
  const [selectedOverdueTask, setSelectedOverdueTask] = useState<typeof allTasksData[0] | null>(null);
  const [isTaskEmployeesDrawerOpen, setIsTaskEmployeesDrawerOpen] = useState(false);
  const [selectedTaskForEmployees, setSelectedTaskForEmployees] = useState<typeof allTasksData[0] | null>(null);
  const [isEmployeeTasksDrawerOpen, setIsEmployeeTasksDrawerOpen] = useState(false);
  const [selectedEmployeeForDrawer, setSelectedEmployeeForDrawer] = useState<typeof allLeavers[0] | null>(null);

  // Filter states for Progress page
  const [progressSearchQuery, setProgressSearchQuery] = useState("");
  const [progressStageFilter, setProgressStageFilter] = useState("all");
  const [progressStatusFilter, setProgressStatusFilter] = useState("all");
  const [progressActiveTab, setProgressActiveTab] = useState("by-employee");

  // Filter data by selected companies
  const leavers = allLeavers.filter(l => selectedCompanies.includes(l.company));
  const tasks = allTasksData.filter(t => selectedCompanies.includes(t.company));
  const alerts = allAlerts.filter(a => selectedCompanies.includes(a.company));
  const assetsToCollect = allAssetsToCollect.filter(a => selectedCompanies.includes(a.company));
  const accessToRevoke = allAccessToRevoke.filter(a => selectedCompanies.includes(a.company));

  // Toggle company selection
  const toggleCompany = (companyId: string) => {
    if (selectedCompanies.includes(companyId)) {
      if (selectedCompanies.length > 1) {
        setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
      }
    } else {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
  };

  // Handle view task details
  const handleViewTaskDetails = (task: typeof allTasksData[0]) => {
    setSelectedTaskForDetails(task);
    setIsTaskDetailsDrawerOpen(true);
  };

  // Handle mark task for review
  const handleMarkForReview = (task: typeof allTasksData[0]) => {
    toast.success(`Task "${task.task}" marked for review`);
  };

  // Handle send reminder
  const handleSendReminder = (to: "employee" | "pic" | "both") => {
    if (!selectedOverdueTask) return;

    const recipientText = to === "both" ? "Employee and PIC" : to === "employee" ? "Employee" : "PIC";
    toast.success(`Reminder sent to ${recipientText} for "${selectedOverdueTask.task}"`);
  };

  // Handle nudge task (send reminder from drawer)
  const handleNudgeTask = (task: typeof allTasksData[0]) => {
    toast.success(`Reminder sent for task "${task.task}"`);
  };

  // Handle complete task
  const handleCompleteTask = (task: typeof allTasksData[0]) => {
    toast.success(`Task "${task.task}" marked as completed`);
    // In a real application, this would update the task status in the database
  };

  // Handle delete task
  const handleDeleteTask = (task: typeof allTasksData[0]) => {
    if (window.confirm(`Are you sure you want to delete the task "${task.task}"?`)) {
      toast.success(`Task "${task.task}" has been deleted`);
      // In a real application, this would delete the task from the database
    }
  };

  // Handle revert completion status
  const handleRevertCompletion = (task: typeof allTasksData[0]) => {
    toast.success(`Task "${task.task}" status reverted to pending`);
    // In a real application, this would update the task status back to pending
  };

  // Handle view employee tasks
  const handleViewEmployeeTasks = (employee: typeof allLeavers[0]) => {
    setSelectedEmployee(employee);
    setShowEmployeeTasksPage(true);
  };

  // Calculate KPI metrics
  const totalLeavers = leavers.length;
  const completedLeavers = leavers.filter(l => l.status === "completed").length;
  const overdueTasks = tasks.filter(t => t.status === "overdue");
  const pendingDocuments = tasks.filter(t => t.type === "Information/Document" && t.status !== "completed").length;
  const exitsThisMonth = leavers.length;

  const overallProgress = leavers.length > 0
    ? Math.round(leavers.reduce((acc, l) => acc + l.progress, 0) / leavers.length)
    : 0;

  // Staff-specific metrics
  const staffTasks = tasks.filter(task => task.assignedTo === "Staff");
  const staffCompletedTasks = staffTasks.filter(task => task.status === "completed");
  const staffPendingTasks = staffTasks.filter(task => task.status === "pending");
  const staffNotStartedTasks = staffTasks.filter(task => task.status === "not-started");
  const staffTotalTasks = staffTasks.length;
  const staffCompletionPercentage = staffTotalTasks > 0 ? Math.round((staffCompletedTasks.length / staffTotalTasks) * 100) : 0;

  // EMPLOYEE TASKS PAGE VIEW
  if (showEmployeeTasksPage && selectedEmployee) {
    const employeeTasks = tasks.filter(t => t.assignee === selectedEmployee.name);
    const noticePeriodTasks = employeeTasks.filter(t => t.stage === "notice-period");
    const finalWeekTasks = employeeTasks.filter(t => t.stage === "final-week");
    const exitDayTasks = employeeTasks.filter(t => t.stage === "exit-day");

    // Drawer state for Employee Tasks Page
    const [isEmployeeTaskDrawerOpen, setIsEmployeeTaskDrawerOpen] = useState(false);
    const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<typeof allTasksData[0] | null>(null);

    const handleViewEmployeeTask = (task: typeof allTasksData[0]) => {
      setSelectedEmployeeTask(task);
      setIsEmployeeTaskDrawerOpen(true);
    };

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowEmployeeTasksPage(false);
                setSelectedEmployee(null);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{selectedEmployee.name}</h1>
              <p className="text-muted-foreground">
                {selectedEmployee.designation} • {selectedEmployee.department} • Last Working Day: {selectedEmployee.lastWorkingDay}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <div className="text-2xl font-semibold">{selectedEmployee.progress}%</div>
            </div>
            <Progress value={selectedEmployee.progress} className="w-32" />
          </div>
        </div>

        {/* Tasks by Stage */}
        <div className="space-y-6">
          {/* Pre-Offboarding Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Pre-Offboarding</h2>
                <Badge className="bg-blue-100 text-blue-800">
                  {noticePeriodTasks.length} tasks
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {noticePeriodTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewEmployeeTask(task)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{task.task}</CardTitle>
                      <StatusChip status={task.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.due}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned To</span>
                        <span className="font-medium">{task.assignedTo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Last Day Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Last Day</h2>
                <Badge className="bg-orange-100 text-orange-800">
                  {finalWeekTasks.length} tasks
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalWeekTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewEmployeeTask(task)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{task.task}</CardTitle>
                      <StatusChip status={task.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.due}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned To</span>
                        <span className="font-medium">{task.assignedTo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Post-Offboarding Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Post-Offboarding</h2>
                <Badge className="bg-green-100 text-green-800">
                  {exitDayTasks.length} tasks
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exitDayTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewEmployeeTask(task)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{task.task}</CardTitle>
                      <StatusChip status={task.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.due}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned To</span>
                        <span className="font-medium">{task.assignedTo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Task Details Drawer for Employee Tasks Page */}
        <Sheet open={isEmployeeTaskDrawerOpen} onOpenChange={setIsEmployeeTaskDrawerOpen}>
          <SheetContent className="sm:max-w-[540px] overflow-y-auto">
            {selectedEmployeeTask && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedEmployeeTask.task}</SheetTitle>
                  <SheetDescription>Task details and information</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Task Status */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-2">
                      <StatusChip status={selectedEmployeeTask.status} />
                    </div>
                  </div>

                  {/* Task Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <div className="mt-2">
                        <Badge variant="outline">{selectedEmployeeTask.type}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Stage</Label>
                      <div className="mt-2">
                        <Badge className={getStageColor(selectedEmployeeTask.stage)}>
                          {getStageName(selectedEmployeeTask.stage)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedEmployeeTask.due}</span>
                    </div>
                  </div>

                  {/* Assigned Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Employee</Label>
                      <div className="mt-2 font-medium">{selectedEmployeeTask.assignee}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                      <div className="mt-2 font-medium">{selectedEmployeeTask.assignedTo}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="mt-2 text-sm">{selectedEmployeeTask.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1" onClick={() => {
                      toast.success(`Task "${selectedEmployeeTask.task}" marked as completed`);
                      setIsEmployeeTaskDrawerOpen(false);
                    }}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => {
                      toast.success(`Task "${selectedEmployeeTask.task}" marked for review`);
                      setIsEmployeeTaskDrawerOpen(false);
                    }}>
                      Mark for Review
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // PROGRESS BY LEAVER PAGE VIEW
  if (showProgressByLeaver) {
    // Filter leavers for Progress page
    const filteredLeavers = leavers.filter(leaver => {
      const matchesSearch = leaver.name.toLowerCase().includes(progressSearchQuery.toLowerCase()) ||
                           leaver.department.toLowerCase().includes(progressSearchQuery.toLowerCase());
      const matchesStage = progressStageFilter === "all" || leaver.stage === progressStageFilter;
      const matchesStatus = progressStatusFilter === "all" || leaver.status === progressStatusFilter;
      return matchesSearch && matchesStage && matchesStatus;
    });

    // Group tasks by type for "By Task" view
    const tasksByType = tasks.reduce((acc, task) => {
      if (!acc[task.task]) {
        acc[task.task] = [];
      }
      acc[task.task].push(task);
      return acc;
    }, {} as Record<string, typeof tasks>);

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProgressByLeaver(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Offboarding Progress</h1>
              <p className="text-muted-foreground">Track progress by employee or by task</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or department..."
                    value={progressSearchQuery}
                    onChange={(e) => setProgressSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={progressStageFilter} onValueChange={setProgressStageFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="notice-period">Pre-Offboarding</SelectItem>
                  <SelectItem value="final-week">Last Day</SelectItem>
                  <SelectItem value="exit-day">Post-Offboarding</SelectItem>
                </SelectContent>
              </Select>
              <Select value={progressStatusFilter} onValueChange={setProgressStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for By Employee / By Task */}
        <Tabs value={progressActiveTab} onValueChange={setProgressActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="by-employee">By Employee</TabsTrigger>
            <TabsTrigger value="by-task">By Task</TabsTrigger>
          </TabsList>

          {/* By Employee Tab */}
          <TabsContent value="by-employee" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Last Working Day</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeavers.map((leaver) => (
                      <TableRow key={leaver.id}>
                        <TableCell className="font-medium">{leaver.name}</TableCell>
                        <TableCell>{leaver.department}</TableCell>
                        <TableCell>
                          <Badge className={getStageColor(leaver.stage)}>
                            {getStageName(leaver.stage)}
                          </Badge>
                        </TableCell>
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
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEmployeeTasks(leaver)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Task Tab */}
          <TabsContent value="by-task" className="mt-6">
            <div className="space-y-4">
              {Object.entries(tasksByType).map(([taskName, taskList]) => (
                <Card key={taskName}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{taskName}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {taskList.length} employee{taskList.length !== 1 ? 's' : ''} assigned
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTaskForEmployees(taskList[0]);
                          setIsTaskEmployeesDrawerOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {taskList.map((task) => {
                        const employee = leavers.find(l => l.name === task.assignee);
                        return (
                          <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex-1">
                                <div className="font-medium">{task.assignee}</div>
                                <div className="text-sm text-muted-foreground">
                                  {employee?.department} • Due: {task.due}
                                </div>
                              </div>
                              <StatusChip status={task.status} />
                              {employee && (
                                <div className="flex items-center gap-2">
                                  <Progress value={employee.progress} className="w-20" />
                                  <span className="text-sm text-muted-foreground">{employee.progress}%</span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (employee) {
                                  handleViewEmployeeTasks(employee);
                                }
                              }}
                            >
                              View Employee Details
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Task Employees Drawer */}
        <Sheet open={isTaskEmployeesDrawerOpen} onOpenChange={setIsTaskEmployeesDrawerOpen}>
          <SheetContent className="sm:max-w-[640px] overflow-y-auto">
            {selectedTaskForEmployees && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedTaskForEmployees.task}</SheetTitle>
                  <SheetDescription>
                    Employees assigned to this task
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Task Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{selectedTaskForEmployees.type}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <StatusChip status={selectedTaskForEmployees.status} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                      <div className="mt-1 font-medium">
                        {companies.find(c => c.id === selectedTaskForEmployees.company)?.name}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Stage</Label>
                      <div className="mt-1">
                        <Badge className={getStageColor(selectedTaskForEmployees.stage)}>
                          {getStageName(selectedTaskForEmployees.stage)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Employees */}
                  <div>
                    <h3 className="font-semibold mb-4">Assigned Employees</h3>
                    <div className="space-y-3">
                      {tasksByType[selectedTaskForEmployees.task]?.map((task) => {
                        const employee = leavers.find(l => l.name === task.assignee);
                        return (
                          <div key={task.id} className="p-4 rounded-lg border">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-medium">{task.assignee}</div>
                                <div className="text-sm text-muted-foreground">
                                  {employee?.designation} • {employee?.department}
                                </div>
                              </div>
                              <StatusChip status={task.status} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Due Date:</span>
                                <div className="font-medium">{task.due}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Overall Progress:</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Progress value={employee?.progress || 0} className="flex-1" />
                                  <span className="font-medium">{employee?.progress || 0}%</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => {
                                if (employee) {
                                  setIsTaskEmployeesDrawerOpen(false);
                                  handleViewEmployeeTasks(employee);
                                }
                              }}
                            >
                              View Employee Details
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // MAIN DASHBOARD VIEW
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Offboarding Dashboard</h1>
          <p className="text-muted-foreground">Manage employee exits and offboarding processes</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Company Filter */}
          {currentUserRole !== "Staff" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Building2 className="w-4 h-4 mr-2" />
                  Companies ({selectedCompanies.length})
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="font-medium text-sm">Select Companies</div>
                  {companies.map((company) => (
                    <div key={company.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={company.id}
                        checked={selectedCompanies.includes(company.id)}
                        onCheckedChange={() => toggleCompany(company.id)}
                      />
                      <label
                        htmlFor={company.id}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {company.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button onClick={() => setIsAddTaskDrawerOpen(true)}>
            <UserMinus className="w-4 h-4 mr-2" />
            Assign Offboarding Template
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Progress Card */}
        {currentUserRole !== "Staff" && (
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="w-5 h-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pre-offboarding */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Pre-offboarding</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {leavers.filter(l => l.stage === "notice-period").length} of {leavers.length} employees {leavers.length > 0 ? Math.round((leavers.filter(l => l.stage === "notice-period").length / leavers.length) * 100) : 0}%
                    </span>
                  </div>
                  <Progress
                    value={leavers.length > 0 ? (leavers.filter(l => l.stage === "notice-period").length / leavers.length) * 100 : 0}
                    className="w-full"
                  />
                </div>

                {/* Last day */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Last day</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {leavers.filter(l => l.stage === "final-week").length} of {leavers.length} employees {leavers.length > 0 ? Math.round((leavers.filter(l => l.stage === "final-week").length / leavers.length) * 100) : 0}%
                    </span>
                  </div>
                  <Progress
                    value={leavers.length > 0 ? (leavers.filter(l => l.stage === "final-week").length / leavers.length) * 100 : 0}
                    className="w-full"
                  />
                </div>

                {/* Post-offboarding */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Post-offboarding</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {leavers.filter(l => l.stage === "exit-day").length} of {leavers.length} employees {leavers.length > 0 ? Math.round((leavers.filter(l => l.stage === "exit-day").length / leavers.length) * 100) : 0}%
                    </span>
                  </div>
                  <Progress
                    value={leavers.length > 0 ? (leavers.filter(l => l.stage === "exit-day").length / leavers.length) * 100 : 0}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overdue Tasks Card */}
        {currentUserRole !== "Staff" && (
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Overdue Tasks
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Large Number Display */}
                <div className="flex flex-col items-start">
                  <div className="text-5xl font-bold text-red-600">{overdueTasks.length}</div>
                  {overdueTasks.length > 0 && (
                    <button
                      className="text-sm text-blue-600 hover:underline mt-2"
                      onClick={() => {
                        // Could navigate to full overdue tasks list
                      }}
                    >
                      Tasks overdue
                    </button>
                  )}
                </div>

                {/* Task List */}
                {overdueTasks.length > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    {overdueTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedOverdueTask(task);
                          setIsOverdueTaskDrawerOpen(true);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="font-medium text-sm flex-1">{task.task}</div>
                          <Eye className="w-4 h-4 text-red-600 flex-shrink-0" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assignee: {task.assignee} • Due: {task.due}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts Card */}
        {currentUserRole !== "Staff" && (
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p className="text-sm">No alerts at the moment</p>
                  </div>
                )}
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-0.5 ${
                        alert.type === "urgent" ? "text-red-600" :
                        alert.type === "warning" ? "text-orange-600" :
                        "text-blue-600"
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{alert.title}</div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                        <span className="text-xs text-muted-foreground mt-1.5 block">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Offboarding Progress Section */}
      {currentUserRole !== "Staff" && (
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setShowProgressByLeaver(true)}
          >
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Offboarding Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Reporting Manager</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leavers.slice(0, 3).map((leaver) => (
                  <TableRow
                    key={leaver.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedEmployeeForDrawer(leaver);
                      setIsEmployeeTasksDrawerOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">{leaver.name}</TableCell>
                    <TableCell>{leaver.manager}</TableCell>
                    <TableCell>
                      <Badge className={getStageColor(leaver.stage)}>
                        {getStageName(leaver.stage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={leaver.progress} className="w-24" />
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

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={currentUserRole === "Staff" ? "my-tasks" : "assigned-to-me"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="assigned-to-me">
                {currentUserRole === "Staff" ? "My Tasks" : "Assigned to Me"}
              </TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="assigned-to-me" className="mt-6">
              <div className="space-y-3">
                {tasks
                  .filter(task => {
                    if (currentUserRole === "IT/PIC" || currentUserRole === "Staff") {
                      return task.assignedTo === currentUserRole || task.assignedTo === "IT";
                    }
                    return task.assignedTo === "HR";
                  })
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{task.task}</h4>
                        <StatusChip status={task.status} />
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{currentUserRole === "Staff" ? "Employee" : task.assignee}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.due}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{task.type}</Badge>
                          <Badge className={getStageColor(task.stage)}>
                            {getStageName(task.stage)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTaskDetails(task)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast.success(`Task "${task.task}" marked as completed`);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{task.task}</h4>
                      <StatusChip status={task.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div>
                        <span className="text-xs">Employee:</span>
                        <div className="font-medium text-foreground">{task.assignee}</div>
                      </div>
                      <div>
                        <span className="text-xs">Due Date:</span>
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <Clock className="w-3 h-3" />
                          {task.due}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{task.type}</Badge>
                        <Badge className={getStageColor(task.stage)}>
                          {getStageName(task.stage)}
                        </Badge>
                        <Badge variant="secondary">{task.assignedTo}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTaskDetails(task)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Details Drawer */}
      <Sheet open={isTaskDetailsDrawerOpen} onOpenChange={setIsTaskDetailsDrawerOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          {selectedTaskForDetails && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTaskForDetails.task}</SheetTitle>
                <SheetDescription>Task details and information</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Task Status */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-2">
                    <StatusChip status={selectedTaskForDetails.status} />
                  </div>
                </div>

                {/* Task Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <div className="mt-2">
                      <Badge variant="outline">{selectedTaskForDetails.type}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Stage</Label>
                    <div className="mt-2">
                      <Badge className={getStageColor(selectedTaskForDetails.stage)}>
                        {getStageName(selectedTaskForDetails.stage)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedTaskForDetails.due}</span>
                  </div>
                </div>

                {/* Assigned Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employee</Label>
                    <div className="mt-2 font-medium">{selectedTaskForDetails.assignee}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                    <div className="mt-2 font-medium">{selectedTaskForDetails.assignedTo}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="mt-2 text-sm">{selectedTaskForDetails.description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={() => {
                    toast.success(`Task "${selectedTaskForDetails.task}" marked as completed`);
                    setIsTaskDetailsDrawerOpen(false);
                  }}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    handleMarkForReview(selectedTaskForDetails);
                    setIsTaskDetailsDrawerOpen(false);
                  }}>
                    Mark for Review
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Task Drawer */}
      <Sheet open={isAddTaskDrawerOpen} onOpenChange={setIsAddTaskDrawerOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Initiate Offboarding</SheetTitle>
            <SheetDescription>Create a new offboarding workflow for an employee</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            <div>
              <Label htmlFor="employee">Select Employee</Label>
              <Select>
                <SelectTrigger id="employee" className="mt-2">
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emp1">Ahmad Ibrahim</SelectItem>
                  <SelectItem value="emp2">Sarah Lee</SelectItem>
                  <SelectItem value="emp3">Michael Tan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="last-working-day">Last Working Day</Label>
              <Input id="last-working-day" type="date" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="reason">Reason for Leaving</Label>
              <Select>
                <SelectTrigger id="reason" className="mt-2">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resignation">Resignation</SelectItem>
                  <SelectItem value="termination">Termination</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="contract-end">Contract End</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information..."
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={() => {
                toast.success("Offboarding workflow initiated successfully");
                setIsAddTaskDrawerOpen(false);
              }}>
                Initiate Offboarding
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setIsAddTaskDrawerOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Overdue Task Details Drawer */}
      <Sheet open={isOverdueTaskDrawerOpen} onOpenChange={setIsOverdueTaskDrawerOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          {selectedOverdueTask && (
            <>
              <SheetHeader>
                <SheetTitle>Overdue Task Details</SheetTitle>
                <SheetDescription>{selectedOverdueTask.task}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Overdue Alert */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Task Overdue</h4>
                      <p className="text-sm text-red-700 mt-1">
                        This task was due on {selectedOverdueTask.due}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Task Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employee</Label>
                    <div className="mt-2 font-medium">{selectedOverdueTask.assignee}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                    <div className="mt-2">
                      <Badge variant="outline">{selectedOverdueTask.assignedTo}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Stage</Label>
                  <div className="mt-2">
                    <Badge className={getStageColor(selectedOverdueTask.stage)}>
                      {getStageName(selectedOverdueTask.stage)}
                    </Badge>
                  </div>
                </div>

                {/* Send Reminder Section */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Send Reminder</h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleSendReminder("employee")}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Remind Employee
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleSendReminder("pic")}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Remind PIC
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleSendReminder("both")}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Remind Both
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1" onClick={() => {
                    handleMarkForReview(selectedOverdueTask);
                    setIsOverdueTaskDrawerOpen(false);
                  }}>
                    Mark for Review
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Employee Tasks Drawer */}
      <Sheet open={isEmployeeTasksDrawerOpen} onOpenChange={setIsEmployeeTasksDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tasks for {selectedEmployeeForDrawer?.name}</SheetTitle>
            <SheetDescription>
              Viewing all assigned tasks across all offboarding stages
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {selectedEmployeeForDrawer && (() => {
              // Filter tasks by employee name (all stages)
              const employeeTasks = tasks.filter(
                task => task.assignee === selectedEmployeeForDrawer.name
              );

              // Group tasks by stage
              const tasksByStage = {
                "Pre-Offboarding": employeeTasks.filter(t => t.stage === "notice-period"),
                "Last Day": employeeTasks.filter(t => t.stage === "final-week"),
                "Post-Offboarding": employeeTasks.filter(t => t.stage === "exit-day")
              };

              // Calculate overall progress
              const completedTasksCount = employeeTasks.filter(task => task.status === "completed").length;
              const totalTasksCount = employeeTasks.length;
              const actualProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

              if (employeeTasks.length === 0) {
                return (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No tasks assigned to this employee</p>
                  </div>
                );
              }

              return (
                <>
                  {/* Employee Info Card */}
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Manager</p>
                          <p className="font-medium">{selectedEmployeeForDrawer.manager}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Working Day</p>
                          <p className="font-medium">{selectedEmployeeForDrawer.lastWorkingDay}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Stage</p>
                          <Badge className={getStageColor(selectedEmployeeForDrawer.stage)}>
                            {getStageName(selectedEmployeeForDrawer.stage)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={actualProgress} className="w-20" />
                            <span className="text-sm font-medium">{actualProgress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {completedTasksCount} of {totalTasksCount} tasks completed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasks List - Grouped by Stage */}
                  <div className="space-y-6">
                    {Object.entries(tasksByStage).map(([stage, stageTasks]) => {
                      if (stageTasks.length === 0) return null;

                      const stageColors = {
                        "Pre-Offboarding": "bg-blue-100 text-blue-800 border-blue-200",
                        "Last Day": "bg-orange-100 text-orange-800 border-orange-200",
                        "Post-Offboarding": "bg-green-100 text-green-800 border-green-200"
                      };

                      return (
                        <div key={stage} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className={stageColors[stage as keyof typeof stageColors]}>
                              {stage}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({stageTasks.length} {stageTasks.length === 1 ? 'task' : 'tasks'})
                            </span>
                          </div>

                          {stageTasks.map((task) => (
                            <Card key={task.id}>
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                  {task.status === "completed" ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  ) : task.status === "overdue" ? (
                                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="font-medium">{task.task}</h4>
                                      <StatusChip status={task.status} />
                                    </div>
                                    <div className="mt-2 space-y-1">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Badge variant="outline" className="text-xs">
                                          {task.type}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Assigned to:</span>
                                        <span className="font-medium text-foreground">{task.assignedTo}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Due: {task.due}</span>
                                      </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-2 mt-3">
                                      {task.status === "completed" ? (
                                        // Completed status: Show Revert button
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleRevertCompletion(task)}
                                        >
                                          <Undo2 className="w-4 h-4 mr-2" />
                                          Revert Completion
                                        </Button>
                                      ) : (
                                        // Pending/Overdue status: Show Nudge, Complete, Delete buttons
                                        <>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleNudgeTask(task)}
                                          >
                                            <Bell className="w-4 h-4 mr-2" />
                                            Nudge
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCompleteTask(task)}
                                          >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Complete
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteTask(task)}
                                            className="hover:text-red-600 hover:border-red-600"
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
