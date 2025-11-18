import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatCard } from "../ui/stat-card";
import { StatusChip } from "../ui/status-chip";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  TrendingUp,
  FileText,
  AlertTriangle,
  Users,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  ClipboardList,
  Building2,
  ChevronDown,
  X,
  Bell,
  User,
  Tag,
  Layers
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getWorkflowsByCategory, getWorkflowById } from "../../utils/workflowData";
import { toast } from "sonner";

const companies = [
  { id: "timetec-cloud", name: "TimeTec Cloud" },
  { id: "timetec-computing", name: "TimeTec Computing" },
  { id: "fingertech", name: "FingerTec" },
];

// Company-specific new hires data
const allNewHires = [
  // TimeTec Cloud employees
  {
    id: 1,
    name: "Aina Zulkifli",
    manager: "Farah Kassim",
    startDate: "2025-09-15",
    completedTasks: 8,
    totalTasks: 12,
    progress: 67,
    status: "in-progress" as const,
    currentStage: "1st Day-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 2,
    name: "Harith Rahman",
    manager: "Nizam Salleh",
    startDate: "2025-09-22",
    completedTasks: 3,
    totalTasks: 12,
    progress: 25,
    status: "not-started" as const,
    currentStage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 3,
    name: "Nur Iman",
    manager: "Ahmed Fauzi",
    startDate: "2025-10-01",
    completedTasks: 1,
    totalTasks: 12,
    progress: 8,
    status: "not-started" as const,
    currentStage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  // TimeTec Computing employees
  {
    id: 4,
    name: "Siti Aminah",
    manager: "Razak Hassan",
    startDate: "2025-09-18",
    completedTasks: 10,
    totalTasks: 12,
    progress: 83,
    status: "in-progress" as const,
    currentStage: "Next Day-Onboarding" as const,
    company: "timetec-computing"
  },
  {
    id: 5,
    name: "Amir Hamzah",
    manager: "Lina Wong",
    startDate: "2025-09-25",
    completedTasks: 5,
    totalTasks: 12,
    progress: 42,
    status: "in-progress" as const,
    currentStage: "Pre-Onboarding" as const,
    company: "timetec-computing"
  },
  // FingerTec employees
  {
    id: 6,
    name: "Daniel Lee",
    manager: "Jason Tan",
    startDate: "2025-09-20",
    completedTasks: 6,
    totalTasks: 12,
    progress: 50,
    status: "in-progress" as const,
    currentStage: "1st Day-Onboarding" as const,
    company: "fingertech"
  },
  {
    id: 7,
    name: "Sarah Ibrahim",
    manager: "Kamala Devi",
    startDate: "2025-10-05",
    completedTasks: 2,
    totalTasks: 12,
    progress: 17,
    status: "not-started" as const,
    currentStage: "Pre-Onboarding" as const,
    company: "fingertech"
  }
];

// Company-specific tasks data
const allTasksData = [
  // TimeTec Cloud tasks
  {
    id: 1,
    task: "Welcome Pack",
    assignee: "Aina Zulkifli",
    due: "2025-09-16",
    type: "General Task",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "HR Coordinator",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 2,
    task: "Grant Email & HRMS Access",
    assignee: "Harith Rahman",
    due: "2025-09-24",
    type: "System/Access",
    indicator: "Onboarding",
    status: "overdue" as const,
    assignedTo: "IT/PIC",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 3,
    task: "Day 1 Orientation",
    assignee: "Nur Iman",
    due: "2025-10-01",
    type: "Meeting/Event",
    indicator: "Onboarding",
    status: "not-started" as const,
    assignedTo: "Manager",
    stage: "1st Day-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 4,
    task: "Setup Workstation",
    assignee: "Harith Rahman",
    due: "2025-09-23",
    type: "Asset",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "IT/PIC",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 5,
    task: "Document Collection",
    assignee: "Aina Zulkifli",
    due: "2025-09-17",
    type: "Information/Document",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "Staff",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 6,
    task: "Verify Identity Documents",
    assignee: "Harith Rahman",
    due: "2025-09-25",
    type: "Information/Document",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "Staff",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 7,
    task: "Process Employment Forms",
    assignee: "Nur Iman",
    due: "2025-10-02",
    type: "Information/Document",
    indicator: "Onboarding",
    status: "not-started" as const,
    assignedTo: "Staff",
    stage: "Next Day-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 8,
    task: "Office Tour & Badge Photo",
    assignee: "Aina Zulkifli",
    due: "2025-09-16",
    type: "General Task",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "Staff",
    stage: "1st Day-Onboarding" as const,
    company: "timetec-cloud"
  },
  // TimeTec Computing tasks
  {
    id: 9,
    task: "Welcome Pack",
    assignee: "Siti Aminah",
    due: "2025-09-19",
    type: "General Task",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "HR Coordinator",
    stage: "Pre-Onboarding" as const,
    company: "timetec-computing"
  },
  {
    id: 10,
    task: "Setup Company Email",
    assignee: "Siti Aminah",
    due: "2025-09-20",
    type: "System/Access",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "IT/PIC",
    stage: "Pre-Onboarding" as const,
    company: "timetec-computing"
  },
  {
    id: 11,
    task: "Hardware Setup",
    assignee: "Amir Hamzah",
    due: "2025-09-26",
    type: "Asset",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "IT/PIC",
    stage: "Pre-Onboarding" as const,
    company: "timetec-computing"
  },
  {
    id: 12,
    task: "Team Introduction Meeting",
    assignee: "Siti Aminah",
    due: "2025-09-19",
    type: "Meeting/Event",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "Manager",
    stage: "1st Day-Onboarding" as const,
    company: "timetec-computing"
  },
  {
    id: 13,
    task: "Complete Training Modules",
    assignee: "Siti Aminah",
    due: "2025-09-22",
    type: "General Task",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "Staff",
    stage: "Next Day-Onboarding" as const,
    company: "timetec-computing"
  },
  // FingerTec tasks
  {
    id: 14,
    task: "Onboarding Checklist Review",
    assignee: "Daniel Lee",
    due: "2025-09-21",
    type: "General Task",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "HR Coordinator",
    stage: "Pre-Onboarding" as const,
    company: "fingertech"
  },
  {
    id: 15,
    task: "Security Access Setup",
    assignee: "Daniel Lee",
    due: "2025-09-22",
    type: "System/Access",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "IT/PIC",
    stage: "Pre-Onboarding" as const,
    company: "fingertech"
  },
  {
    id: 16,
    task: "Department Tour",
    assignee: "Daniel Lee",
    due: "2025-09-21",
    type: "Meeting/Event",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "Manager",
    stage: "1st Day-Onboarding" as const,
    company: "fingertech"
  },
  {
    id: 17,
    task: "Company Policy Briefing",
    assignee: "Sarah Ibrahim",
    due: "2025-10-06",
    type: "Meeting/Event",
    indicator: "Onboarding",
    status: "not-started" as const,
    assignedTo: "HR Coordinator",
    stage: "Pre-Onboarding" as const,
    company: "fingertech"
  },
  // Tasks specifically assigned to Sarah Ahmad (HR Admin)
  {
    id: 18,
    task: "Review Aina's Onboarding Progress",
    assignee: "Aina Zulkifli",
    due: "2025-09-17",
    type: "General Task",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "HR Admin",
    stage: "1st Day-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 19,
    task: "Approve Harith's Leave Request",
    assignee: "Harith Rahman",
    due: "2025-09-23",
    type: "General Task",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "HR Admin",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 20,
    task: "Schedule Performance Review Meeting",
    assignee: "Nur Iman",
    due: "2025-10-03",
    type: "Meeting/Event",
    indicator: "Onboarding",
    status: "not-started" as const,
    assignedTo: "HR Admin",
    stage: "Next Day-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 21,
    task: "Update Employee Handbook",
    assignee: "All New Hires",
    due: "2025-09-20",
    type: "Information/Document",
    indicator: "Onboarding",
    status: "overdue" as const,
    assignedTo: "HR Admin",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud"
  },
  {
    id: 22,
    task: "Verify Siti's Training Completion",
    assignee: "Siti Aminah",
    due: "2025-09-23",
    type: "General Task",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "HR Admin",
    stage: "Next Day-Onboarding" as const,
    company: "timetec-computing"
  },
  {
    id: 23,
    task: "Process Amir's Benefits Enrollment",
    assignee: "Amir Hamzah",
    due: "2025-09-27",
    type: "Information/Document",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "HR Admin",
    stage: "Pre-Onboarding" as const,
    company: "timetec-computing"
  }
];

// Company-specific alerts
const allAlertsData = [
  // TimeTec Cloud alerts
  {
    id: 1,
    message: "2 tasks overdue for Harith Rahman - requires manager escalation",
    type: "error" as const,
    time: "2 hours ago",
    company: "timetec-cloud"
  },
  {
    id: 2,
    message: "Aina Zulkifli pending laptop pickup - asset location confirmed",
    type: "warning" as const,
    time: "4 hours ago",
    company: "timetec-cloud"
  },
  // TimeTec Computing alerts
  {
    id: 3,
    message: "Amir Hamzah workstation setup delayed - IT team notified",
    type: "warning" as const,
    time: "1 hour ago",
    company: "timetec-computing"
  },
  {
    id: 4,
    message: "Siti Aminah training completion due tomorrow",
    type: "info" as const,
    time: "3 hours ago",
    company: "timetec-computing"
  },
  // FingerTec alerts
  {
    id: 5,
    message: "Daniel Lee security access pending approval",
    type: "warning" as const,
    time: "5 hours ago",
    company: "fingertech"
  },
  {
    id: 6,
    message: "Sarah Ibrahim onboarding scheduled for next week",
    type: "info" as const,
    time: "1 day ago",
    company: "fingertech"
  }
];

interface OnboardingDashboardProps {
  currentUserRole?: string;
}

export function OnboardingDashboard({ currentUserRole = "HR Admin" }: OnboardingDashboardProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(["timetec-cloud"]);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [assignFormData, setAssignFormData] = useState({
    employeeId: "",
    workflowId: "",
    startDate: ""
  });
  const [isEmployeeTasksDrawerOpen, setIsEmployeeTasksDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof allNewHires[0] | null>(null);
  const [isOverdueTaskDrawerOpen, setIsOverdueTaskDrawerOpen] = useState(false);
  const [selectedOverdueTask, setSelectedOverdueTask] = useState<typeof allTasksData[0] | null>(null);

  const toggleCompany = (companyId: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleStageClick = (stage: string) => {
    // Toggle filter: if clicking the same stage, clear filter; otherwise set new filter
    setSelectedStageFilter(prev => prev === stage ? null : stage);
  };

  // Define team structure based on assignedTo roles
  const getTeamRoles = (userRole: string): string[] => {
    // Map roles to their team members
    const teamMapping: Record<string, string[]> = {
      "HR Admin": ["HR Admin", "HR Coordinator"],
      "HR Coordinator": ["HR Admin", "HR Coordinator"],
      "Manager": ["Manager"],
      "IT/PIC": ["IT/PIC"],
      "Staff": ["Staff"]
    };

    return teamMapping[userRole] || [userRole];
  };

  // Get onboarding workflows
  const onboardingWorkflows = useMemo(() => {
    return getWorkflowsByCategory("onboarding");
  }, []);

  // Get selected workflow details
  const selectedWorkflow = useMemo(() => {
    if (!assignFormData.workflowId) return null;
    return getWorkflowById(assignFormData.workflowId);
  }, [assignFormData.workflowId]);

  // Handle assign workflow drawer
  const handleOpenAssignDrawer = () => {
    setAssignFormData({
      employeeId: "",
      workflowId: "",
      startDate: ""
    });
    setIsAssignDrawerOpen(true);
  };

  const handleCloseAssignDrawer = () => {
    setIsAssignDrawerOpen(false);
    setAssignFormData({
      employeeId: "",
      workflowId: "",
      startDate: ""
    });
  };

  const handleAssignWorkflow = () => {
    // TODO: Implement assign workflow logic
    console.log("Assigning workflow:", assignFormData);
    console.log("Workflow details:", selectedWorkflow);
    handleCloseAssignDrawer();
  };

  // Filter data based on selected companies
  const filteredNewHires = useMemo(() => {
    return allNewHires.filter(hire => selectedCompanies.includes(hire.company));
  }, [selectedCompanies]);

  // Filter new hires by stage (for Progress by New Hire table)
  const displayedNewHires = useMemo(() => {
    if (!selectedStageFilter) {
      return filteredNewHires;
    }
    return filteredNewHires.filter(hire => hire.currentStage === selectedStageFilter);
  }, [filteredNewHires, selectedStageFilter]);

  const filteredTasks = useMemo(() => {
    return allTasksData.filter(task => selectedCompanies.includes(task.company));
  }, [selectedCompanies]);

  const filteredAlerts = useMemo(() => {
    return allAlertsData.filter(alert => selectedCompanies.includes(alert.company));
  }, [selectedCompanies]);

  // Calculate stage-specific progress based on employee completion
  const stageProgress = useMemo(() => {
    // Group tasks by stage and assignee (employee)
    const calculateStageProgress = (stage: string) => {
      // Get all tasks for this stage
      const stageTasks = filteredTasks.filter(task => task.stage === stage);

      // Get unique employees who have tasks in this stage
      const employeesInStage = [...new Set(stageTasks.map(task => task.assignee))];

      if (employeesInStage.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
      }

      // Count how many employees completed ALL their tasks in this stage
      let employeesCompleted = 0;

      employeesInStage.forEach(employee => {
        const employeeTasks = stageTasks.filter(task => task.assignee === employee);
        const allTasksCompleted = employeeTasks.every(task => task.status === "completed");

        if (allTasksCompleted) {
          employeesCompleted++;
        }
      });

      return {
        completed: employeesCompleted,
        total: employeesInStage.length,
        percentage: Math.round((employeesCompleted / employeesInStage.length) * 100)
      };
    };

    return {
      preOnboarding: calculateStageProgress("Pre-Onboarding"),
      firstDay: calculateStageProgress("1st Day-Onboarding"),
      nextDay: calculateStageProgress("Next Day-Onboarding")
    };
  }, [filteredTasks]);

  // Calculate overdue tasks for non-Staff users
  const overdueTasks = useMemo(() => {
    const overdue = filteredTasks.filter(task => task.status === "overdue");
    return {
      total: overdue.length,
      tasks: overdue
    };
  }, [filteredTasks]);

  // Calculate my tasks (assigned to current user role) for non-Staff users
  const myTasks = useMemo(() => {
    const myTasksList = filteredTasks.filter(task => task.assignedTo === currentUserRole);
    const completed = myTasksList.filter(task => task.status === "completed");
    const pending = myTasksList.filter(task => task.status === "pending");
    const notStarted = myTasksList.filter(task => task.status === "not-started");

    return {
      total: myTasksList.length,
      completed: completed.length,
      pending: pending.length,
      notStarted: notStarted.length,
      completionPercentage: myTasksList.length > 0
        ? Math.round((completed.length / myTasksList.length) * 100)
        : 0
    };
  }, [filteredTasks, currentUserRole]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Onboarding Dashboard</h1>
          <p className="text-muted-foreground">Track new hire progress and manage onboarding tasks</p>
        </div>
        <div className="flex items-center gap-2">
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
          <Button onClick={handleOpenAssignDrawer}>
            <Users className="w-4 h-4 mr-2" />
            Assign Onboarding Template
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUserRole === "Staff" ? (
          (() => {
            const staffTasks = filteredTasks.filter(task => task.assignedTo === "Staff");
            const completedTasks = staffTasks.filter(task => task.status === "completed");
            const pendingTasks = staffTasks.filter(task => task.status === "pending");
            const notStartedTasks = staffTasks.filter(task => task.status === "not-started");
            const totalTasks = staffTasks.length;
            const completionPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

            return (
              <>
                <StatCard
                  title="Onboarding Progress"
                  value={`${completionPercentage}%`}
                  icon={TrendingUp}
                  variant="primary"
                  subtitle={`${completedTasks.length}/${totalTasks} tasks completed`}
                  progress={{
                    value: completionPercentage,
                    message: completionPercentage >= 75
                      ? "You're doing great! Keep up the excellent progress."
                      : completionPercentage >= 50
                      ? "Great progress! You're more than halfway there."
                      : completionPercentage >= 25
                      ? "Good start! Keep going to complete your onboarding."
                      : "Welcome! Let's get started with your onboarding tasks."
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
          {/* Overall Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pre-Onboarding Progress */}
              <div
                className={`space-y-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStageFilter === "Pre-Onboarding"
                    ? "bg-purple-50 border-2 border-purple-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleStageClick("Pre-Onboarding")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Pre-Onboarding</span>
                    {selectedStageFilter === "Pre-Onboarding" && (
                      <Badge variant="outline" className="text-xs">Filtered</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {stageProgress.preOnboarding.completed} of {stageProgress.preOnboarding.total} employees
                    </span>
                    <span className="text-sm font-semibold">{stageProgress.preOnboarding.percentage}%</span>
                  </div>
                </div>
                <Progress value={stageProgress.preOnboarding.percentage} className="h-2" />
              </div>

              {/* 1st Day-Onboarding Progress */}
              <div
                className={`space-y-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStageFilter === "1st Day-Onboarding"
                    ? "bg-blue-50 border-2 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleStageClick("1st Day-Onboarding")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">1st Day-Onboarding</span>
                    {selectedStageFilter === "1st Day-Onboarding" && (
                      <Badge variant="outline" className="text-xs">Filtered</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {stageProgress.firstDay.completed} of {stageProgress.firstDay.total} employees
                    </span>
                    <span className="text-sm font-semibold">{stageProgress.firstDay.percentage}%</span>
                  </div>
                </div>
                <Progress value={stageProgress.firstDay.percentage} className="h-2" />
              </div>

              {/* Next Day-Onboarding Progress */}
              <div
                className={`space-y-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStageFilter === "Next Day-Onboarding"
                    ? "bg-green-50 border-2 border-green-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleStageClick("Next Day-Onboarding")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Next Day-Onboarding</span>
                    {selectedStageFilter === "Next Day-Onboarding" && (
                      <Badge variant="outline" className="text-xs">Filtered</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {stageProgress.nextDay.completed} of {stageProgress.nextDay.total} employees
                    </span>
                    <span className="text-sm font-semibold">{stageProgress.nextDay.percentage}%</span>
                  </div>
                </div>
                <Progress value={stageProgress.nextDay.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Overdue Tasks Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Overdue Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-red-600">{overdueTasks.total}</span>
                <span className="text-sm text-muted-foreground">Tasks overdue</span>
              </div>
              {overdueTasks.total > 0 ? (
                <div className="space-y-2">
                  {overdueTasks.tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="p-2 rounded-lg bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => {
                        setSelectedOverdueTask(task);
                        setIsOverdueTaskDrawerOpen(true);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">{task.task}</p>
                          <p className="text-xs text-red-700 mt-1">
                            Assignee: {task.assignee} • Due: {task.due}
                          </p>
                        </div>
                        <Eye className="w-4 h-4 text-red-600 flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  ))}
                  {overdueTasks.total > 3 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{overdueTasks.total - 3} more overdue tasks
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-muted-foreground">No overdue tasks!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="p-2 rounded-lg border border-border bg-muted/50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        alert.type === "error" ? "text-red-500" : alert.type === "warning" ? "text-amber-500" : "text-blue-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-muted-foreground">No alerts for selected companies</p>
                </div>
              )}
              {filteredAlerts.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{filteredAlerts.length - 3} more alerts
                </p>
              )}
            </CardContent>
          </Card>
</>
        )}
      </div>

      {/* Progress by New Hire - Hidden for Staff */}
      {currentUserRole !== "Staff" && (
        <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Progress by New Hire</CardTitle>
                  {selectedStageFilter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStageFilter(null)}
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
                {selectedStageFilter && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing employees in{" "}
                    <Badge
                      className={
                        selectedStageFilter === "Pre-Onboarding"
                          ? "bg-purple-100 text-purple-800"
                          : selectedStageFilter === "1st Day-Onboarding"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {selectedStageFilter}
                    </Badge>
                  </p>
                )}
              </CardHeader>
              <CardContent>
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
                    {displayedNewHires.length > 0 ? (
                      displayedNewHires.map((hire) => {
                        // Get tasks for this employee
                        const employeeTasks = filteredTasks.filter(task => task.assignee === hire.name);

                        return (
                      <TableRow
                        key={hire.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedEmployee(hire);
                          setIsEmployeeTasksDrawerOpen(true);
                        }}
                      >
                        <TableCell className="font-medium">{hire.name}</TableCell>
                        <TableCell>{hire.manager}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              hire.currentStage === "Pre-Onboarding"
                                ? "bg-purple-100 text-purple-800"
                                : hire.currentStage === "1st Day-Onboarding"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {hire.currentStage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                  <Progress value={hire.progress} className="w-20" />
                                  <span className="text-sm text-muted-foreground">{hire.progress}%</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">Task Completed:</p>
                                <p className="text-sm">{hire.completedTasks} of {hire.totalTasks} tasks</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={hire.status} />
                        </TableCell>
                      </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No employees found in {selectedStageFilter}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        )}

      {/* Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tasks</CardTitle>
              {currentUserRole === "Staff" && (
                <p className="text-sm text-muted-foreground mt-1">Tasks assigned specifically to you</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assigned" className="space-y-4">
            {currentUserRole !== "Staff" ? (
              <TabsList>
                <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            ) : (
              <TabsList>
                <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              </TabsList>
            )}
            
            <TabsContent value="assigned">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks
                    .filter(task => task.assignedTo === currentUserRole)
                    .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.task}</TableCell>
                      <TableCell>{currentUserRole === "Staff" ? "New Hire" : task.assignee}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {task.due}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            task.stage === "Pre-Onboarding"
                              ? "bg-purple-100 text-purple-800"
                              : task.stage === "1st Day-Onboarding"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {task.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={task.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {currentUserRole !== "Staff" && (
              <>
                <TabsContent value="team">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks
                        .filter(task => getTeamRoles(currentUserRole).includes(task.assignedTo))
                        .map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.task}</TableCell>
                          <TableCell>{task.assignee}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              {task.due}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{task.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                task.stage === "Pre-Onboarding"
                                  ? "bg-purple-100 text-purple-800"
                                  : task.stage === "1st Day-Onboarding"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {task.stage}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusChip status={task.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="all">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.task}</TableCell>
                          <TableCell>{task.assignee}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              {task.due}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{task.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                task.stage === "Pre-Onboarding"
                                  ? "bg-purple-100 text-purple-800"
                                  : task.stage === "1st Day-Onboarding"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {task.stage}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusChip status={task.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Assign Onboarding Workflow Drawer */}
      <Sheet open={isAssignDrawerOpen} onOpenChange={setIsAssignDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Assign Onboarding Workflow</SheetTitle>
            <SheetDescription>
              Select an employee and onboarding workflow to begin the onboarding process.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8 mt-8">
            {/* Employee Selection */}
            <div className="space-y-3">
              <Label htmlFor="employee" className="text-sm font-semibold">
                Select Employee *
              </Label>
              <Select
                value={assignFormData.employeeId}
                onValueChange={(value) => setAssignFormData(prev => ({ ...prev, employeeId: value }))}
              >
                <SelectTrigger id="employee" className="h-11">
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-3rem)] sm:max-w-[26rem]">
                  {filteredNewHires.map((hire) => (
                    <SelectItem key={hire.id} value={hire.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{hire.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {companies.find(c => c.id === hire.company)?.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Select the employee to assign the onboarding workflow to
              </p>
            </div>

            {/* Workflow Selection */}
            <div className="space-y-3">
              <Label htmlFor="workflow" className="text-sm font-semibold">
                Onboarding Workflow *
              </Label>
              <Select
                value={assignFormData.workflowId}
                onValueChange={(value) => setAssignFormData(prev => ({ ...prev, workflowId: value }))}
              >
                <SelectTrigger id="workflow" className="h-11">
                  <SelectValue placeholder="Choose a workflow" />
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-3rem)] sm:max-w-[26rem]">
                  {onboardingWorkflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Select the onboarding workflow with configured tasks
              </p>
            </div>

            {/* Task List - Show when workflow is selected */}
            {selectedWorkflow && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Workflow Tasks ({selectedWorkflow.tasks.length})
                </Label>
                <div className="border border-border rounded-lg max-h-80 overflow-y-auto">
                  {/* Group tasks by stage */}
                  {["Pre-Onboarding", "1st Day-Onboarding", "Next Day-Onboarding"].map((stage) => {
                    const stageTasks = selectedWorkflow.tasks.filter(task => task.stage === stage);
                    if (stageTasks.length === 0) return null;

                    return (
                      <div key={stage} className="border-b last:border-b-0">
                        {/* Stage Header */}
                        <div className={`px-4 py-2.5 font-semibold text-sm sticky top-0 z-10 ${
                          stage === "Pre-Onboarding"
                            ? "bg-purple-50 text-purple-900 border-b border-purple-200"
                            : stage === "1st Day-Onboarding"
                            ? "bg-blue-50 text-blue-900 border-b border-blue-200"
                            : "bg-green-50 text-green-900 border-b border-green-200"
                        }`}>
                          {stage} ({stageTasks.length} {stageTasks.length === 1 ? 'task' : 'tasks'})
                        </div>
                        {/* Stage Tasks */}
                        <Table>
                          <TableHeader className="sr-only">
                            <TableRow>
                              <TableHead className="w-8">#</TableHead>
                              <TableHead>Task Name</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stageTasks.map((task, index) => (
                              <TableRow key={task.id} className="border-b-0">
                                <TableCell className="text-xs text-muted-foreground w-8 py-3 pl-4">{index + 1}</TableCell>
                                <TableCell className="text-sm py-3 pr-4">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-medium">{task.name}</span>
                                    <span className="text-xs text-muted-foreground">{task.type}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  These tasks will be assigned to the employee upon workflow assignment
                </p>
              </div>
            )}

            {/* Preview Section */}
            {assignFormData.employeeId && assignFormData.workflowId && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <h4 className="text-sm font-semibold text-blue-900">Assignment Preview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employee:</span>
                    <span className="font-medium">
                      {filteredNewHires.find(h => h.id.toString() === assignFormData.employeeId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Workflow:</span>
                    <span className="font-medium">
                      {selectedWorkflow?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Tasks:</span>
                    <span className="font-medium">
                      {selectedWorkflow?.tasks.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseAssignDrawer}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAssignWorkflow}
                disabled={!assignFormData.employeeId || !assignFormData.workflowId}
              >
                Assign Workflow
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Overdue Task Details Drawer */}
      <Sheet open={isOverdueTaskDrawerOpen} onOpenChange={setIsOverdueTaskDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Overdue Task Details
            </SheetTitle>
            <SheetDescription>
              Review task information and send reminders to responsible parties
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {selectedOverdueTask && (
              <>
                {/* Task Header Card */}
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-red-900">
                          {selectedOverdueTask.task}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <StatusChip status={selectedOverdueTask.status} />
                          <Badge variant="outline" className="text-xs">
                            {selectedOverdueTask.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Overdue Alert */}
                      <div className="flex items-start gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <Clock className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">Task is Overdue</p>
                          <p className="text-xs text-red-700 mt-1">
                            Due date was {selectedOverdueTask.due}. Immediate action required.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Information Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Task Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Person in Charge */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Assigned Person in Charge (PIC)</p>
                        <p className="text-base font-semibold mt-1">{selectedOverdueTask.assignedTo}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          The person responsible for updating this task as completed
                        </p>
                      </div>
                    </div>

                    {/* Stage */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Layers className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Onboarding Stage</p>
                        <Badge
                          className={`mt-1 ${
                            selectedOverdueTask.stage === "Pre-Onboarding"
                              ? "bg-purple-100 text-purple-800"
                              : selectedOverdueTask.stage === "1st Day-Onboarding"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {selectedOverdueTask.stage}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reminder Actions */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      Send Reminder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Send a reminder notification to nudge the responsible party to complete this overdue task.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Remind New Hire */}
                      <Button
                        variant="outline"
                        className="w-full justify-start border-blue-300 hover:bg-blue-100"
                        onClick={() => {
                          toast.success("Reminder Sent!", {
                            description: `A notification has been sent to ${selectedOverdueTask.assignee} about the overdue task: "${selectedOverdueTask.task}"`,
                            duration: 5000,
                          });
                        }}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">Nudge New Hire</div>
                          <div className="text-xs text-muted-foreground">{selectedOverdueTask.assignee}</div>
                        </div>
                      </Button>

                      {/* Remind PIC */}
                      <Button
                        variant="outline"
                        className="w-full justify-start border-purple-300 hover:bg-purple-100"
                        onClick={() => {
                          toast.success("Reminder Sent!", {
                            description: `A notification has been sent to ${selectedOverdueTask.assignedTo} (PIC) about the overdue task: "${selectedOverdueTask.task}"`,
                            duration: 5000,
                          });
                        }}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">Nudge PIC</div>
                          <div className="text-xs text-muted-foreground">{selectedOverdueTask.assignedTo}</div>
                        </div>
                      </Button>

                      {/* Remind Both */}
                      <Button
                        className="w-full sm:col-span-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          toast.success("Reminders Sent!", {
                            description: `Notifications have been sent to both ${selectedOverdueTask.assignee} and ${selectedOverdueTask.assignedTo} about the overdue task: "${selectedOverdueTask.task}"`,
                            duration: 5000,
                          });
                        }}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Send Reminder to Both Parties
                      </Button>
                    </div>

                    {/* Info Box */}
                    <div className="flex items-start gap-2 p-3 bg-blue-100 border border-blue-200 rounded-lg mt-4">
                      <AlertTriangle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-blue-900">
                          <strong>Reminder Policy:</strong> Reminders will be sent via email and in-app notification.
                          For tasks overdue by more than 3 days, consider escalating to the employee's manager.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsOverdueTaskDrawerOpen(false);
                      setSelectedOverdueTask(null);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implement mark as completed logic
                      toast.success("Task Updated", {
                        description: `Task "${selectedOverdueTask.task}" has been marked for review`,
                        duration: 3000,
                      });
                    }}
                  >
                    Mark for Review
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Employee Tasks Drawer */}
      <Sheet open={isEmployeeTasksDrawerOpen} onOpenChange={setIsEmployeeTasksDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tasks for {selectedEmployee?.name}</SheetTitle>
            <SheetDescription>
              Viewing all tasks for {selectedEmployee?.currentStage}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {selectedEmployee && (() => {
              // Filter tasks by employee name and their current stage
              const employeeTasks = filteredTasks.filter(
                task => task.assignee === selectedEmployee.name && task.stage === selectedEmployee.currentStage
              );

              // Calculate progress based on actual tasks in this stage
              const completedTasksCount = employeeTasks.filter(task => task.status === "completed").length;
              const totalTasksCount = employeeTasks.length;
              const actualProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

              if (employeeTasks.length === 0) {
                return (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No tasks found for {selectedEmployee.currentStage}</p>
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
                          <p className="font-medium">{selectedEmployee.manager}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{selectedEmployee.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Stage</p>
                          <Badge
                            className={
                              selectedEmployee.currentStage === "Pre-Onboarding"
                                ? "bg-purple-100 text-purple-800"
                                : selectedEmployee.currentStage === "1st Day-Onboarding"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {selectedEmployee.currentStage}
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

                  {/* Tasks List */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Tasks ({employeeTasks.length})
                    </h3>
                    {employeeTasks.map((task) => (
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
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>Assigned to:</span>
                                  <span className="font-medium text-foreground">{task.assignedTo}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Due: {task.dueDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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