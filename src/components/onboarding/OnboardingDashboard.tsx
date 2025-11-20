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
  Layers,
  ArrowLeft,
  ExternalLink,
  Trash2,
  RotateCcw,
  Plus,
  FileCheck,
  Info,
  Upload,
  Check,
  Settings
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { getWorkflowsByCategory, getWorkflowById } from "../../utils/workflowData";
import { getTaskTemplatesByIndicator, taskTemplates } from "../../utils/taskTemplatesData";
import { toast } from "sonner";

const companies = [
  { id: "timetec-cloud", name: "TimeTec Cloud" },
  { id: "timetec-computing", name: "TimeTec Computing" },
  { id: "fingertech", name: "FingerTec" },
];

// Trigger options for task assignment
const triggerOptions = [
  { value: "hire_date", label: "On Hire Date", description: "Starts on the employee's hire date" },
  { value: "confirmed_status", label: "On Confirmed Staff Status", description: "Starts when employee status is confirmed" },
  { value: "previous_task", label: "After Previous Task Completed", description: "Starts after the previous task is completed" },
  { value: "date_offset", label: "Date Offset", description: "Starts on a specific date offset" },
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
    company: "timetec-cloud",
    templateId: "welcome-pack"
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
    task: "Employee Information & Document Collection",
    assignee: "Aina Zulkifli",
    due: "2025-09-17",
    type: "Document",
    indicator: "Onboarding",
    status: "completed" as const,
    assignedTo: "Staff",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud",
    templateId: "employee-information-form"
  },
  {
    id: 6,
    task: "Payroll & Banking Information Setup",
    assignee: "Aina Zulkifli",
    due: "2025-09-18",
    type: "Information",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "Staff",
    stage: "Pre-Onboarding" as const,
    company: "timetec-cloud",
    templateId: "payroll-setup-form"
  },
  {
    id: 7,
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
    id: 8,
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
    id: 9,
    task: "Employee Feedback & Satisfaction Survey",
    assignee: "Aina Zulkifli",
    due: "2025-09-23",
    type: "Questionnaire",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "HR",
    stage: "Next Day-Onboarding" as const,
    company: "timetec-cloud",
    templateId: "employee-feedback-survey"
  },
  {
    id: 10,
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
  {
    id: 11,
    task: "Day 1 Orientation",
    assignee: "Aina Zulkifli",
    due: "2025-09-16",
    type: "Meeting/Event",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "HR",
    stage: "1st Day-Onboarding" as const,
    company: "timetec-cloud",
    templateId: "day-1-orientation"
  },
  {
    id: 12,
    task: "Grant Email & HRMS Access",
    assignee: "Aina Zulkifli",
    due: "2025-09-16",
    type: "System",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "IT",
    stage: "1st Day-Onboarding" as const,
    company: "timetec-cloud",
    templateId: "grant-access"
  },
  {
    id: 13,
    task: "Issue Laptop & ID Card",
    assignee: "Aina Zulkifli",
    due: "2025-09-16",
    type: "Asset",
    indicator: "Onboarding",
    status: "pending" as const,
    assignedTo: "IT",
    stage: "1st Day-Onboarding" as const,
    company: "timetec-cloud",
    templateId: "issue-assets"
  },
  // TimeTec Computing tasks
  {
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
    id: 21,
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
    id: 22,
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
    id: 23,
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
    id: 24,
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
    id: 25,
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
    id: 26,
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
    id: 27,
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
  const [showProgressByNewHire, setShowProgressByNewHire] = useState(false);
  const [showEmployeeTasksPage, setShowEmployeeTasksPage] = useState(false);
  const [progressViewTab, setProgressViewTab] = useState("by-employee");
  const [taskStageTab, setTaskStageTab] = useState("pre-onboarding");
  const [isAddTaskDrawerOpen, setIsAddTaskDrawerOpen] = useState(false);
  const [selectedTaskTemplate, setSelectedTaskTemplate] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedTrigger, setSelectedTrigger] = useState<string>("");
  const [isTaskDetailsDrawerOpen, setIsTaskDetailsDrawerOpen] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<typeof allTasksData[0] | null>(null);
  const [isTaskEmployeesDrawerOpen, setIsTaskEmployeesDrawerOpen] = useState(false);
  const [selectedTaskForEmployees, setSelectedTaskForEmployees] = useState<typeof allTasksData[0] | null>(null);

  // Progress by New Hire page filters
  const [progressSearchQuery, setProgressSearchQuery] = useState("");
  const [progressStageFilter, setProgressStageFilter] = useState("all");
  const [progressStatusFilter, setProgressStatusFilter] = useState("all");

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

  // Apply all filters for Progress by New Hire page
  const progressFilteredNewHires = useMemo(() => {
    let result = filteredNewHires;

    // Apply search query
    if (progressSearchQuery.trim()) {
      const query = progressSearchQuery.toLowerCase();
      result = result.filter(hire =>
        hire.name.toLowerCase().includes(query) ||
        hire.manager.toLowerCase().includes(query)
      );
    }

    // Apply stage filter
    if (progressStageFilter !== "all") {
      const stageMap: Record<string, string> = {
        "pre-onboarding": "Pre-Onboarding",
        "first-day": "1st Day-Onboarding",
        "next-day": "Next Day-Onboarding"
      };
      const mappedStage = stageMap[progressStageFilter];
      if (mappedStage) {
        result = result.filter(hire => hire.currentStage === mappedStage);
      }
    }

    // Apply status filter
    if (progressStatusFilter !== "all") {
      result = result.filter(hire => hire.status === progressStatusFilter);
    }

    return result;
  }, [filteredNewHires, progressSearchQuery, progressStageFilter, progressStatusFilter]);

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

  // Get onboarding task templates
  const onboardingTaskTemplates = getTaskTemplatesByIndicator("onboarding");

  // Handle add task
  const handleAddTask = () => {
    if (!selectedTaskTemplate || !selectedStage || !selectedTrigger) {
      toast.error("Please select task template, stage, and trigger");
      return;
    }

    const template = onboardingTaskTemplates.find(t => t.id === selectedTaskTemplate);
    const trigger = triggerOptions.find(t => t.value === selectedTrigger);

    if (template && trigger) {
      toast.success("Task Added!", {
        description: `"${template.name}" has been added to ${selectedStage} with trigger "${trigger.label}"`,
        duration: 3000,
      });

      // Reset form and close drawer
      setSelectedTaskTemplate("");
      setSelectedStage("");
      setSelectedTrigger("");
      setIsAddTaskDrawerOpen(false);
    }
  };

  // Render Employee Tasks page if showEmployeeTasksPage is true
  if (showEmployeeTasksPage && selectedEmployee) {
    return (
      <div className="p-4 space-y-4">
        {/* Header with Back Button and Add Task */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowEmployeeTasksPage(false);
                setSelectedEmployee(null);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Progress
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Tasks for {selectedEmployee.name}</h1>
              <p className="text-sm text-muted-foreground">View and manage all onboarding tasks assigned to this employee</p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddTaskDrawerOpen(true)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Employee Summary Card */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">Reporting Manager</p>
                <p className="text-sm font-medium">{selectedEmployee.manager}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">Current Stage</p>
                <Badge variant="outline" className="text-xs">{selectedEmployee.currentStage}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">Overall Progress</p>
                <div className="flex items-center gap-2">
                  <Progress value={selectedEmployee.progress} className="w-24" />
                  <span className="text-xs font-medium">{selectedEmployee.progress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks grouped by stage */}
        <div className="grid gap-3 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {["Pre-Onboarding", "1st Day-Onboarding", "Next Day-Onboarding"].map(stage => {
            const stageTasks = allTasksData.filter(
              task => task.assignee === selectedEmployee.name && task.stage === stage
            );

            return (
              <Card key={stage} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {stage}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {stageTasks.length}
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {stageTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-3">No tasks</p>
                    ) : (
                      stageTasks.map(task => (
                      <Card
                        key={task.id}
                        className="border cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => {
                          setSelectedTaskForDetails(task);
                          setIsTaskDetailsDrawerOpen(true);
                        }}
                      >
                        <CardContent className="p-2">
                          {/* Task Header with Title and Status */}
                          <div className="flex items-start gap-2 mb-2">
                            {task.status === "completed" ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : task.status === "overdue" ? (
                              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">{task.task}</h4>
                            </div>
                          </div>

                          {/* Task Details */}
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {task.type}
                              </Badge>
                              <StatusChip status={task.status} />
                            </div>

                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{task.assignedTo}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{task.due}</span>
                            </div>
                          </div>

                          {/* Task Action Buttons */}
                          {task.status !== "completed" ? (
                            <div className="flex items-center justify-end gap-1 mt-2">
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Reminder Sent!", {
                                    description: `A notification has been sent to ${task.assignedTo} about the task: "${task.task}"`,
                                    duration: 5000,
                                  });
                                }}
                              >
                                <Bell className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full border border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Task Completed!", {
                                    description: `Task "${task.task}" has been marked as completed`,
                                    duration: 3000,
                                  });
                                }}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full border border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Task Deleted!", {
                                    description: `Task "${task.task}" has been deleted`,
                                    duration: 3000,
                                  });
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end mt-2">
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full border border-orange-300 text-orange-600 hover:bg-orange-50 flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Task Status Reset!", {
                                    description: `Task "${task.task}" has been reset to pending status`,
                                    duration: 3000,
                                  });
                                }}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Task Drawer */}
        <Sheet open={isAddTaskDrawerOpen} onOpenChange={setIsAddTaskDrawerOpen}>
          <SheetContent className="sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle>Add Task to {selectedEmployee.name}</SheetTitle>
              <SheetDescription>
                Select a task template from the configuration and assign it to a specific stage.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="task-template">Task Template</Label>
                <Select value={selectedTaskTemplate} onValueChange={setSelectedTaskTemplate}>
                  <SelectTrigger id="task-template">
                    <SelectValue placeholder="Select a task template" />
                  </SelectTrigger>
                  <SelectContent>
                    {onboardingTaskTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.type}
                          </Badge>
                          <span>{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Onboarding Stage</Label>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-Onboarding">Pre-Onboarding</SelectItem>
                    <SelectItem value="1st Day-Onboarding">1st Day-Onboarding</SelectItem>
                    <SelectItem value="Next Day-Onboarding">Next Day-Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger</Label>
                <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  <SelectTrigger id="trigger">
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerOptions.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{trigger.label}</span>
                          <span className="text-xs text-muted-foreground">{trigger.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsAddTaskDrawerOpen(false);
                  setSelectedTaskTemplate("");
                  setSelectedStage("");
                  setSelectedTrigger("");
                }}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleAddTask}>
                Add Task
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Task Details Drawer */}
        <Sheet open={isTaskDetailsDrawerOpen} onOpenChange={setIsTaskDetailsDrawerOpen}>
          <SheetContent className="sm:max-w-[600px] overflow-y-auto">
            {selectedTaskForDetails && (() => {
              const taskTemplate = selectedTaskForDetails.templateId
                ? taskTemplates.find(t => t.id === selectedTaskForDetails.templateId)
                : null;

              return (
                <>
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      {selectedTaskForDetails.task}
                    </SheetTitle>
                    <SheetDescription>
                      Task details and required documents
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 py-6">
                    {/* Task Information */}
                    <Card className="border-2">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                            <p className="font-medium">{selectedTaskForDetails.assignedTo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                            <p className="font-medium">{selectedTaskForDetails.due}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <StatusChip status={selectedTaskForDetails.status} />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Stage</p>
                            <Badge variant="outline">{selectedTaskForDetails.stage}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Description */}
                    {taskTemplate?.description && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Description
                        </h3>
                        <Card className="border">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {taskTemplate.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Information Requirements - for Information type tasks */}
                    {taskTemplate?.type === "information" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" />
                            Information Requirements
                          </h3>
                          <span className="text-sm text-gray-500">11 fields selected</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { id: 1, label: "Full Name", value: selectedTaskForDetails.assignee, mandatory: true },
                            { id: 2, label: "Email Address", value: "aina.zulkifli@timeteccloud.com", mandatory: true },
                            { id: 3, label: "Phone Number", value: "+60 12-345 6789", mandatory: true },
                            { id: 4, label: "Home Address", value: "123, Jalan Tun Razak, Kuala Lumpur", mandatory: true },
                            { id: 5, label: "Emergency Contact", value: "Ahmad Zulkifli", mandatory: true },
                            { id: 6, label: "Emergency Contact Phone", value: "+60 19-876 5432", mandatory: true },
                            { id: 7, label: "Bank Account Number", value: "1234567890", mandatory: true },
                            { id: 8, label: "Bank Name", value: "Maybank", mandatory: true },
                            { id: 9, label: "EPF Number", value: "12345678", mandatory: true },
                            { id: 10, label: "SOCSO Number", value: "87654321", mandatory: true },
                            { id: 11, label: "Tax Number", value: "SG1234567890", mandatory: false }
                          ].map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                <p className="font-medium text-sm">{field.label}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <p className="text-sm text-gray-600">{field.value || "Not provided"}</p>
                                <span className={`text-xs px-2 py-1 rounded ${field.mandatory ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'}`}>
                                  {field.mandatory ? "Compulsory" : "Optional"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Questionnaire Questions - for Questionnaire type tasks */}
                    {taskTemplate?.type === "questionnaire" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" />
                          Questionnaire
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              id: 1,
                              question: "How would you rate your overall onboarding experience?",
                              type: "Picklist (Single)",
                              required: true,
                              answer: "Excellent"
                            },
                            {
                              id: 2,
                              question: "Which aspects of onboarding were most helpful?",
                              type: "Picklist (Multiple)",
                              required: true,
                              answer: "Welcome orientation, Team introduction, Equipment setup"
                            },
                            {
                              id: 3,
                              question: "What suggestions do you have for improving the onboarding process?",
                              type: "Text (Multiple Lines)",
                              required: false,
                              answer: "The onboarding process was smooth overall. It would be helpful to have a checklist of all required tasks upfront and more time dedicated to understanding the company culture and values."
                            }
                          ].map((q, index) => (
                            <div
                              key={q.id}
                              className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span className="text-sm font-semibold text-gray-500 flex-shrink-0">Q{index + 1}</span>
                                  <p className="font-medium text-sm">{q.question}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    title="Expand/Collapse"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-3 text-xs">
                                <span className="text-gray-600">{q.type}</span>
                                <span className={`px-2 py-0.5 rounded ${q.required ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {q.required ? "Required" : "Optional"}
                                </span>
                              </div>
                              {q.answer && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="text-xs font-semibold text-green-800 mb-1">Answer:</p>
                                  <p className="text-sm text-green-900">{q.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* System Access Details - for System type tasks */}
                    {taskTemplate?.type === "system" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          System Access Details
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              id: 1,
                              title: "Corporate Email (Outlook)",
                              description: "Set up company email account with proper security settings and distribution lists",
                              assignedTo: "IT Admin",
                              credentials: {
                                username: "aina@timeteccloud.com",
                                password: "Abc12345"
                              }
                            },
                            {
                              id: 2,
                              title: "HRMS Portal Access",
                              description: "Configure access to HR management system for timesheet, leave requests, and personal information updates",
                              assignedTo: "HR Admin",
                              credentials: {
                                username: "aina.zulkifli",
                                password: "Welcome2025!"
                              }
                            }
                          ].map((system, index) => (
                            <div
                              key={system.id}
                              className="border rounded-lg p-4 bg-card"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-500 flex-shrink-0">#{index + 1}</span>
                                  <p className="font-medium text-sm">{system.title}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                                {system.description}
                              </p>
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">Assigned to:</span>
                                  <span className="text-xs font-medium text-blue-600">{system.assignedTo}</span>
                                </div>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-blue-900 w-20">Username:</span>
                                  <span className="text-xs text-blue-800 font-mono flex-1">{system.credentials.username}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-blue-900 w-20">Password:</span>
                                  <span className="text-xs text-blue-800 font-mono flex-1">{system.credentials.password}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Asset Details - for Asset type tasks */}
                    {taskTemplate?.type === "asset" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" />
                          Asset Details
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              id: 1,
                              title: "Laptop Computer",
                              description: "Business laptop with Windows 11, Microsoft Office suite, and essential software pre-installed",
                              serialNumber: "Dell-123123",
                              assignedTo: "IT Admin",
                              handoverLetter: {
                                uploaded: true,
                                signed: true
                              }
                            },
                            {
                              id: 2,
                              title: "Employee ID Card",
                              description: "Photo ID card with building access permissions and employee identification number",
                              serialNumber: "EMP-2025-001234",
                              assignedTo: "HR Admin",
                              handoverLetter: {
                                uploaded: true,
                                signed: true
                              }
                            }
                          ].map((asset, index) => (
                            <div
                              key={asset.id}
                              className="border rounded-lg p-4 bg-card"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-semibold text-gray-500 flex-shrink-0">#{index + 1}</span>
                                <p className="font-medium text-sm">{asset.title}</p>
                              </div>
                              <p className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                                {asset.description}
                              </p>
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <Tag className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">Serial Number:</span>
                                  <span className="text-xs font-medium font-mono text-gray-900">{asset.serialNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">Assigned to:</span>
                                  <span className="text-xs font-medium text-blue-600">{asset.assignedTo}</span>
                                </div>
                              </div>
                              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-xs font-medium text-green-900">Upload Hand-over Letter</span>
                                  </div>
                                  {asset.handoverLetter.uploaded && asset.handoverLetter.signed && (
                                    <div className="ml-auto flex items-center gap-1">
                                      <span className="text-xs text-green-700">Uploaded & signed</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
                                        title="View document"
                                      >
                                        <Eye className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-green-700 mt-1 pl-5">Hand-over letter required</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Required Documents */}
                    {taskTemplate?.requiredDocuments && taskTemplate.requiredDocuments.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Required Items
                        </h3>
                        <div className="space-y-2">
                          {taskTemplate.requiredDocuments.map((doc) => {
                            // Simulate upload status - in real app, this would come from backend
                            const isUploaded = Math.random() > 0.5;

                            return (
                              <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex-shrink-0">
                                  {doc.mandatory ? (
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                      <span className="text-red-600 text-sm font-bold">*</span>
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                      <span className="text-gray-400 text-sm">○</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{doc.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isUploaded ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => {
                                        // In real app, this would open/download the uploaded document
                                        alert(`Viewing uploaded document: ${doc.name}`);
                                      }}
                                      title="View uploaded document"
                                    >
                                      <Check className="w-4 h-4" />
                                      <Eye className="w-4 h-4 ml-1" />
                                    </Button>
                                  ) : (
                                    <div className="h-8 px-2 flex items-center">
                                      <Upload className="w-4 h-4 text-gray-400" />
                                    </div>
                                  )}
                                  {doc.mandatory && (
                                    <Badge variant="destructive" className="text-xs">
                                      Compulsory
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <p className="text-xs text-blue-900">
                            <span className="font-semibold">Note:</span> Items marked with <span className="text-red-600 font-bold">*</span> are mandatory.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t">
                      {selectedTaskForDetails.status === "completed" ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Handle revert mark as completed
                            alert('Task has been reverted to pending status');
                            setSelectedTaskForDetails(null);
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Revert Mark as Completed
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="w-full"
                            onClick={() => {
                              // Handle mark as complete
                              alert('Task marked as complete');
                              setSelectedTaskForDetails(null);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Complete
                          </Button>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                // Handle nudge/reminder
                                alert('Reminder sent to assignee');
                              }}
                            >
                              <Bell className="w-4 h-4 mr-2" />
                              Nudge
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${selectedTaskForDetails.task}"?`)) {
                                  alert('Task has been deleted');
                                  setSelectedTaskForDetails(null);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Render Progress by New Hire page if showProgressByNewHire is true
  if (showProgressByNewHire) {
    return (
      <div className="p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowProgressByNewHire(false);
                // Reset filters when going back
                setProgressSearchQuery("");
                setProgressStageFilter("all");
                setProgressStatusFilter("all");
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Onboarding Progress</h1>
              <p className="text-muted-foreground">Comprehensive view of all new hires and their onboarding progress</p>
            </div>
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
          </div>
        </div>

        {/* Comprehensive New Hires List with Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-end">
              <Tabs value={progressViewTab} onValueChange={setProgressViewTab}>
                <TabsList>
                  <TabsTrigger value="by-employee">By Employee</TabsTrigger>
                  <TabsTrigger value="by-task">By Task</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={progressViewTab} onValueChange={setProgressViewTab}>
              <TabsContent value="by-employee" className="space-y-4">
                {/* Filter & Search for By Employee */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Filter & Search</h3>
                    {(progressSearchQuery || progressStageFilter !== "all" || progressStatusFilter !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProgressSearchQuery("");
                          setProgressStageFilter("all");
                          setProgressStatusFilter("all");
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by employee name or manager..."
                        value={progressSearchQuery}
                        onChange={(e) => setProgressSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={progressStageFilter} onValueChange={setProgressStageFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Stages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="pre-onboarding">Pre-Onboarding</SelectItem>
                        <SelectItem value="first-day">1st Day-Onboarding</SelectItem>
                        <SelectItem value="next-day">Next Day-Onboarding</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={progressStatusFilter} onValueChange={setProgressStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="not-started">Not Started</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Reporting Manager</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Tasks Completed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressFilteredNewHires.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No new hires match the selected filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      progressFilteredNewHires.map((hire) => (
                      <TableRow key={hire.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{hire.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {companies.find(c => c.id === hire.company)?.name}
                          </Badge>
                        </TableCell>
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
                          <div className="flex items-center gap-2">
                            <Progress value={hire.progress} className="w-24" />
                            <span className="text-sm font-medium">{hire.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {hire.completedTasks} / {hire.totalTasks}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={hire.status} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee(hire);
                              setShowEmployeeTasksPage(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Tasks
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="by-task" className="space-y-4">
                {/* Filter & Search for By Task */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Filter & Search</h3>
                    {(progressSearchQuery || progressStatusFilter !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProgressSearchQuery("");
                          setProgressStatusFilter("all");
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by task name..."
                        value={progressSearchQuery}
                        onChange={(e) => setProgressSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={progressStatusFilter} onValueChange={setProgressStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Stage Tabs */}
                <Tabs value={taskStageTab} onValueChange={setTaskStageTab}>
                  <TabsList>
                    <TabsTrigger value="pre-onboarding">Pre-Onboarding</TabsTrigger>
                    <TabsTrigger value="first-day">1st Day-Onboarding</TabsTrigger>
                    <TabsTrigger value="next-day">Next Day-Onboarding</TabsTrigger>
                  </TabsList>

                  {/* Pre-Onboarding Tasks */}
                  <TabsContent value="pre-onboarding">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.filter(t => t.stage === "Pre-Onboarding").length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No Pre-Onboarding tasks found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTasks.filter(t => t.stage === "Pre-Onboarding").map((task) => (
                          <TableRow key={task.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{task.task}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {task.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {companies.find(c => c.id === task.company)?.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTaskForEmployees(task);
                                  setIsTaskEmployeesDrawerOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* 1st Day-Onboarding Tasks */}
                  <TabsContent value="first-day">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.filter(t => t.stage === "1st Day-Onboarding").length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No 1st Day-Onboarding tasks found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTasks.filter(t => t.stage === "1st Day-Onboarding").map((task) => (
                          <TableRow key={task.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{task.task}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {task.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {companies.find(c => c.id === task.company)?.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTaskForEmployees(task);
                                  setIsTaskEmployeesDrawerOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Next Day-Onboarding Tasks */}
                  <TabsContent value="next-day">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.filter(t => t.stage === "Next Day-Onboarding").length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No Next Day-Onboarding tasks found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTasks.filter(t => t.stage === "Next Day-Onboarding").map((task) => (
                          <TableRow key={task.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{task.task}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {task.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {companies.find(c => c.id === task.company)?.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTaskForEmployees(task);
                                  setIsTaskEmployeesDrawerOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Employee Tasks Drawer */}
        <Sheet open={isEmployeeTasksDrawerOpen} onOpenChange={setIsEmployeeTasksDrawerOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Tasks for {selectedEmployee?.name}</SheetTitle>
              <SheetDescription>
                Viewing all assigned tasks across all onboarding stages
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {selectedEmployee && (() => {
                // Filter tasks by employee name (all stages)
                const employeeTasks = filteredTasks.filter(
                  task => task.assignee === selectedEmployee.name
                );

                // Group tasks by stage
                const tasksByStage = {
                  "Pre-Onboarding": employeeTasks.filter(t => t.stage === "Pre-Onboarding"),
                  "1st Day-Onboarding": employeeTasks.filter(t => t.stage === "1st Day-Onboarding"),
                  "Next Day-Onboarding": employeeTasks.filter(t => t.stage === "Next Day-Onboarding")
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

                    {/* Tasks List - Grouped by Stage */}
                    <div className="space-y-6">
                      {Object.entries(tasksByStage).map(([stage, tasks]) => {
                        if (tasks.length === 0) return null;

                        const stageColors = {
                          "Pre-Onboarding": "bg-purple-100 text-purple-800 border-purple-200",
                          "1st Day-Onboarding": "bg-blue-100 text-blue-800 border-blue-200",
                          "Next Day-Onboarding": "bg-green-100 text-green-800 border-green-200"
                        };

                        return (
                          <div key={stage} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge className={stageColors[stage as keyof typeof stageColors]}>
                                {stage}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
                              </span>
                            </div>

                            {tasks.map((task) => (
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
                                      {/* Task Action Buttons */}
                                      {task.status !== "completed" ? (
                                        <div className="flex items-center justify-end gap-1.5 mt-2">
                                          <button
                                            type="button"
                                            className="w-8 h-8 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                                            onClick={() => {
                                              toast.success("Reminder Sent!", {
                                                description: `A notification has been sent to ${task.assignedTo} about the task: "${task.task}"`,
                                                duration: 5000,
                                              });
                                            }}
                                          >
                                            <Bell className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            className="w-8 h-8 rounded-full border border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center"
                                            onClick={() => {
                                              toast.success("Task Completed!", {
                                                description: `Task "${task.task}" has been marked as completed`,
                                                duration: 3000,
                                              });
                                            }}
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            className="w-8 h-8 rounded-full border border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center"
                                            onClick={() => {
                                              toast.success("Task Deleted!", {
                                                description: `Task "${task.task}" has been deleted`,
                                                duration: 3000,
                                              });
                                            }}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-end mt-2">
                                          <button
                                            type="button"
                                            className="w-8 h-8 rounded-full border border-orange-300 text-orange-600 hover:bg-orange-50 flex items-center justify-center"
                                            onClick={() => {
                                              toast.success("Task Status Reset!", {
                                                description: `Task "${task.task}" has been reset to pending status`,
                                                duration: 3000,
                                              });
                                            }}
                                          >
                                            <RotateCcw className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
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

        {/* Task Employees Drawer - Shows employees assigned to a specific task */}
        <Sheet open={isTaskEmployeesDrawerOpen} onOpenChange={setIsTaskEmployeesDrawerOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                {selectedTaskForEmployees?.task}
              </SheetTitle>
              <SheetDescription>
                Employees assigned to this task
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {/* Task Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Task Type:</span>
                    <Badge variant="outline">{selectedTaskForEmployees?.type}</Badge>
                  </div>
                  <StatusChip status={selectedTaskForEmployees?.status || "pending"} />
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Company:</span>
                  <Badge variant="outline">
                    {companies.find(c => c.id === selectedTaskForEmployees?.company)?.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Stage:</span>
                  <Badge variant="outline">{selectedTaskForEmployees?.stage}</Badge>
                </div>
              </div>

              {/* Assigned Employees List */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Assigned Employees</h3>
                <div className="space-y-3">
                  {(() => {
                    // Find all employees assigned to this task
                    const assignedEmployees = allTasksData
                      .filter(t => t.task === selectedTaskForEmployees?.task && t.company === selectedTaskForEmployees?.company)
                      .map(t => {
                        const employee = allNewHires.find(h => h.name === t.assignee);
                        return employee ? { ...employee, taskStatus: t.status, taskDue: t.due } : null;
                      })
                      .filter(e => e !== null);

                    if (assignedEmployees.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          No employees assigned to this task
                        </div>
                      );
                    }

                    return assignedEmployees.map((employee, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">Manager: {employee.manager}</span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">Start: {employee.startDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <StatusChip status={employee.taskStatus} />
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                Due: {employee.taskDue}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Overall Progress</span>
                              <span>{employee.completedTasks}/{employee.totalTasks} tasks</span>
                            </div>
                            <Progress
                              value={(employee.completedTasks / employee.totalTasks) * 100}
                              className="h-2"
                            />
                          </div>

                          {/* View Employee Details Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsTaskEmployeesDrawerOpen(false);
                              setShowProgressByNewHire(false);
                              setShowEmployeeTasksPage(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Employee Details
                          </Button>
                        </CardContent>
                      </Card>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

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
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setShowProgressByNewHire(true)}
                  >
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      Onboarding Progress
                    </CardTitle>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                  </div>
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
                          {task.status !== "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => {
                                toast.success("Task Completed!", {
                                  description: `Task "${task.task}" has been marked as completed`,
                                  duration: 3000,
                                });
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
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
                              {task.status !== "completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => {
                                    toast.success("Task Completed!", {
                                      description: `Task "${task.task}" has been marked as completed`,
                                      duration: 3000,
                                    });
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
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
                              {task.status !== "completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => {
                                    toast.success("Task Completed!", {
                                      description: `Task "${task.task}" has been marked as completed`,
                                      duration: 3000,
                                    });
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
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
              Viewing all assigned tasks across all onboarding stages
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {selectedEmployee && (() => {
              // Filter tasks by employee name (all stages)
              const employeeTasks = filteredTasks.filter(
                task => task.assignee === selectedEmployee.name
              );

              // Group tasks by stage
              const tasksByStage = {
                "Pre-Onboarding": employeeTasks.filter(t => t.stage === "Pre-Onboarding"),
                "1st Day-Onboarding": employeeTasks.filter(t => t.stage === "1st Day-Onboarding"),
                "Next Day-Onboarding": employeeTasks.filter(t => t.stage === "Next Day-Onboarding")
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

                  {/* Tasks List - Grouped by Stage */}
                  <div className="space-y-6">
                    {Object.entries(tasksByStage).map(([stage, tasks]) => {
                      if (tasks.length === 0) return null;

                      const stageColors = {
                        "Pre-Onboarding": "bg-purple-100 text-purple-800 border-purple-200",
                        "1st Day-Onboarding": "bg-blue-100 text-blue-800 border-blue-200",
                        "Next Day-Onboarding": "bg-green-100 text-green-800 border-green-200"
                      };

                      return (
                        <div key={stage} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className={stageColors[stage as keyof typeof stageColors]}>
                              {stage}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
                            </span>
                          </div>

                          {tasks.map((task) => (
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
                                    {/* Task Action Buttons */}
                                    {task.status !== "completed" ? (
                                      <div className="flex items-center justify-end gap-1.5 mt-2">
                                        <button
                                          type="button"
                                          className="w-8 h-8 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                                          onClick={() => {
                                            toast.success("Reminder Sent!", {
                                              description: `A notification has been sent to ${task.assignedTo} about the task: "${task.task}"`,
                                              duration: 5000,
                                            });
                                          }}
                                        >
                                          <Bell className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          className="w-8 h-8 rounded-full border border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center"
                                          onClick={() => {
                                            toast.success("Task Completed!", {
                                              description: `Task "${task.task}" has been marked as completed`,
                                              duration: 3000,
                                            });
                                          }}
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          className="w-8 h-8 rounded-full border border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center"
                                          onClick={() => {
                                            toast.success("Task Deleted!", {
                                              description: `Task "${task.task}" has been deleted`,
                                              duration: 3000,
                                            });
                                          }}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-end mt-2">
                                        <button
                                          type="button"
                                          className="w-8 h-8 rounded-full border border-orange-300 text-orange-600 hover:bg-orange-50 flex items-center justify-center"
                                          onClick={() => {
                                            toast.success("Task Status Reset!", {
                                              description: `Task "${task.task}" has been reset to pending status`,
                                              duration: 3000,
                                            });
                                          }}
                                        >
                                          <RotateCcw className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
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