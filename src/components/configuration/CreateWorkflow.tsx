import { useState } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Calendar,
  Clock,
  User,
  Zap,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { getActiveTaskTemplateNames, taskTemplates } from "../../utils/taskTemplatesData";
import { Switch } from "../ui/switch";
import { useIsMobile } from "../ui/use-mobile";

interface TaskRow {
  id: string;
  task: string;
  assignee: string;
  trigger: string;
  triggerDetails?: string;
  phase?: string;
  completionDeadline?: number; // Number of days to complete the task after it's triggered
}

interface CreateWorkflowProps {
  workflowType: "onboarding" | "offboarding";
  onNavigate: (view: string) => void;
  editWorkflowId?: string;
}

const existingWorkflows = [
  { value: "template-1", label: "Standard Onboarding Template" },
  { value: "template-2", label: "Remote Onboarding Template" },
  { value: "template-3", label: "Executive Onboarding Template" },
  { value: "template-4", label: "Voluntary Exit Template" },
  { value: "template-5", label: "Termination Template" }
];

// Realistic workflow data for editing
const workflowDataMap: Record<string, {
  name: string;
  category: "onboarding" | "offboarding";
  tasks: TaskRow[];
}> = {
  "onboarding-standard-hq": {
    name: "Onboarding — Standard (HQ)",
    category: "onboarding",
    tasks: [
      { id: "1", task: "Welcome Pack", assignee: "dept-hr", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "2", task: "Grant Email & HRMS Access", assignee: "dept-it", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "3", task: "Company Overview", assignee: "emp-michael-chen", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "pre-onboarding" },
      { id: "4", task: "Office Tour", assignee: "emp-sarah-ahmad", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "first-day" },
      { id: "5", task: "Day 1 Orientation", assignee: "emp-michael-chen", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "first-day" },
      { id: "6", task: "Meet the Team", assignee: "emp-emily-rodriguez", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "first-day" },
      { id: "7", task: "Department Introduction", assignee: "emp-emily-rodriguez", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "first-day" },
      { id: "8", task: "Read Employee Handbook", assignee: "desig-coordinator", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "9", task: "Setup Workspace", assignee: "dept-it", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "next-days" },
      { id: "10", task: "Training Schedule", assignee: "dept-hr", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "11", task: "Benefits Enrollment", assignee: "emp-james-wilson", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "12", task: "First Week Check-in", assignee: "emp-emily-rodriguez", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" }
    ]
  },
  "onboarding-remote": {
    name: "Onboarding — Remote Employee",
    category: "onboarding",
    tasks: [
      { id: "1", task: "Welcome Pack", assignee: "dept-hr", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "2", task: "Grant Email & HRMS Access", assignee: "dept-it", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "3", task: "Ship Equipment", assignee: "dept-it", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "4", task: "Virtual Office Tour", assignee: "emp-michael-chen", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "first-day" },
      { id: "5", task: "Video Orientation", assignee: "emp-michael-chen", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "first-day" },
      { id: "6", task: "Remote Work Guidelines", assignee: "dept-hr", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "next-days" },
      { id: "7", task: "Virtual Team Introduction", assignee: "emp-emily-rodriguez", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "8", task: "Remote Tools Training", assignee: "dept-it", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" }
    ]
  },
  "onboarding-executive": {
    name: "Onboarding — Executive Level",
    category: "onboarding",
    tasks: [
      { id: "1", task: "Executive Welcome Package", assignee: "dept-hr", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "2", task: "Grant Email & HRMS Access", assignee: "dept-it", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "3", task: "Executive Assistant Assignment", assignee: "emp-sarah-ahmad", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "4", task: "Office Setup", assignee: "dept-operations", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "5", task: "Board Introduction", assignee: "emp-sarah-ahmad", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "first-day" },
      { id: "6", task: "Executive Orientation", assignee: "emp-sarah-ahmad", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "first-day" },
      { id: "7", task: "Strategic Overview", assignee: "desig-manager", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "first-day" },
      { id: "8", task: "Key Stakeholder Meetings", assignee: "emp-sarah-ahmad", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "first-day" },
      { id: "9", task: "Department Reviews", assignee: "desig-manager", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "10", task: "Performance Goals Setting", assignee: "emp-sarah-ahmad", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "11", task: "Executive Benefits Review", assignee: "emp-james-wilson", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "12", task: "30-Day Review", assignee: "emp-sarah-ahmad", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "13", task: "Integration Assessment", assignee: "emp-sarah-ahmad", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "14", task: "Leadership Team Introduction", assignee: "desig-manager", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" },
      { id: "15", task: "Strategic Planning Session", assignee: "desig-manager", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" }
    ]
  },
  "onboarding-intern": {
    name: "Onboarding — Internship Program",
    category: "onboarding",
    tasks: [
      { id: "1", task: "Intern Welcome Package", assignee: "dept-hr", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "2", task: "Grant Email & HRMS Access", assignee: "dept-it", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "pre-onboarding" },
      { id: "3", task: "Intern Orientation", assignee: "emp-michael-chen", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "first-day" },
      { id: "4", task: "Mentor Assignment", assignee: "emp-emily-rodriguez", trigger: "hire_date", triggerDetails: "On Hire Date", phase: "first-day" },
      { id: "5", task: "Program Overview", assignee: "emp-michael-chen", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "next-days" },
      { id: "6", task: "Project Assignment", assignee: "emp-emily-rodriguez", trigger: "date_offset", triggerDetails: "Date Offset", phase: "next-days" }
    ]
  },
  "offboarding-voluntary": {
    name: "Offboarding — Voluntary Exit",
    category: "offboarding",
    tasks: [
      { id: "1", task: "Exit Interview", assignee: "emp-sarah-ahmad", trigger: "resignation_accepted", triggerDetails: "On Resignation Accepted", phase: "pre-offboarding" },
      { id: "2", task: "Knowledge Transfer", assignee: "emp-emily-rodriguez", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "pre-offboarding" },
      { id: "3", task: "Farewell Arrangements", assignee: "emp-emily-rodriguez", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "last-day" },
      { id: "4", task: "Return Company Property", assignee: "dept-operations", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "last-day" },
      { id: "5", task: "Revoke Access & Collect Assets", assignee: "dept-it", trigger: "termination_date", triggerDetails: "On Termination Date", phase: "post-offboarding" },
      { id: "6", task: "Final Pay & Benefits Briefing", assignee: "dept-hr", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" },
      { id: "7", task: "Final Documentation", assignee: "dept-hr", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" },
      { id: "8", task: "Exit Survey", assignee: "emp-michael-chen", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" }
    ]
  },
  "offboarding-termination": {
    name: "Offboarding — Involuntary Termination",
    category: "offboarding",
    tasks: [
      { id: "1", task: "Legal Documentation", assignee: "dept-hr", trigger: "resignation_accepted", triggerDetails: "On Resignation Accepted", phase: "pre-offboarding" },
      { id: "2", task: "Termination Meeting", assignee: "emp-sarah-ahmad", trigger: "termination_date", triggerDetails: "On Termination Date", phase: "last-day" },
      { id: "3", task: "Collect Company Assets", assignee: "dept-operations", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "last-day" },
      { id: "4", task: "Security Clearance", assignee: "dept-operations", trigger: "termination_date", triggerDetails: "On Termination Date", phase: "last-day" },
      { id: "5", task: "Immediate Access Revocation", assignee: "dept-it", trigger: "termination_date", triggerDetails: "On Termination Date", phase: "post-offboarding" },
      { id: "6", task: "Final Pay Processing", assignee: "dept-hr", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" }
    ]
  },
  "offboarding-retirement": {
    name: "Offboarding — Retirement",
    category: "offboarding",
    tasks: [
      { id: "1", task: "Retirement Planning Meeting", assignee: "emp-sarah-ahmad", trigger: "resignation_accepted", triggerDetails: "On Resignation Accepted", phase: "pre-offboarding" },
      { id: "2", task: "Knowledge Documentation", assignee: "emp-emily-rodriguez", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "pre-offboarding" },
      { id: "3", task: "Succession Planning", assignee: "emp-emily-rodriguez", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "pre-offboarding" },
      { id: "4", task: "Pension Processing", assignee: "emp-james-wilson", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "pre-offboarding" },
      { id: "5", task: "Retirement Celebration", assignee: "dept-hr", trigger: "termination_date", triggerDetails: "On Termination Date", phase: "last-day" },
      { id: "6", task: "Return Company Property", assignee: "dept-operations", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "last-day" },
      { id: "7", task: "Access Revocation", assignee: "dept-it", trigger: "termination_date", triggerDetails: "On Termination Date", phase: "post-offboarding" },
      { id: "8", task: "Benefits Transition", assignee: "emp-james-wilson", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" },
      { id: "9", task: "Final Documentation", assignee: "dept-hr", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" },
      { id: "10", task: "Alumni Program Enrollment", assignee: "emp-michael-chen", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" }
    ]
  },
  "offboarding-resignation": {
    name: "Offboarding — Resignation",
    category: "offboarding",
    tasks: [
      { id: "1", task: "Hand over task", assignee: "emp-emily-rodriguez", trigger: "resignation_accepted", triggerDetails: "On Resignation Accepted", phase: "pre-offboarding" },
      { id: "2", task: "Return laptop", assignee: "dept-it", trigger: "termination_date", triggerDetails: "On Termination Date", phase: "last-day" },
      { id: "3", task: "Revoke system access", assignee: "dept-it", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: "post-offboarding" }
    ]
  }
};



const assigneeOptions = {
  departments: [
    { value: "dept-hr", label: "Human Resources" },
    { value: "dept-it", label: "Information Technology" },
    { value: "dept-finance", label: "Finance & Accounting" },
    { value: "dept-operations", label: "Operations" },
    { value: "dept-marketing", label: "Marketing" },
    { value: "dept-sales", label: "Sales" }
  ],
  designations: [
    { value: "desig-manager", label: "Manager" },
    { value: "desig-supervisor", label: "Supervisor" },
    { value: "desig-coordinator", label: "Coordinator" },
    { value: "desig-specialist", label: "Specialist" },
    { value: "desig-admin", label: "Admin" },
    { value: "desig-executive", label: "Executive" }
  ],
  employees: [
    { value: "emp-sarah-ahmad", label: "Sarah Ahmad (HR Admin)" },
    { value: "emp-michael-chen", label: "Michael Chen (HR Coordinator)" },
    { value: "emp-david-kim", label: "David Kim (IT Admin)" },
    { value: "emp-emily-rodriguez", label: "Emily Rodriguez (Manager)" },
    { value: "emp-james-wilson", label: "James Wilson (Finance Admin)" },
    { value: "emp-lisa-patel", label: "Lisa Patel (Operations Coordinator)" },
    { value: "emp-john-smith", label: "John Smith (IT Specialist)" },
    { value: "emp-maria-garcia", label: "Maria Garcia (Marketing Executive)" }
  ]
};

const triggerOptions = [
  { value: "hire_date", label: "On Hire Date", description: "Starts on the employee's hire date" },
  { value: "confirmed_status", label: "On Confirmed Staff Status", description: "Starts when employee status is confirmed" },
  { value: "previous_task", label: "After Previous Task Completed", description: "Starts after the previous task is completed" },
  { value: "date_offset", label: "Date Offset", description: "Starts on a specific date offset" },
  { value: "resignation_accepted", label: "On Resignation Accepted", description: "Starts when resignation is accepted" },
  { value: "resignation_date", label: "On Resignation Date", description: "Starts on the employee's resignation date" },
  { value: "termination_date", label: "On Termination Date", description: "Starts on termination date" }
];

const onboardingPhases = [
  { id: "pre-onboarding", name: "Pre-Onboarding", description: "Tasks completed before the first day" },
  { id: "first-day", name: "1st day-Onboarding", description: "Tasks for the employee's first day" },
  { id: "next-days", name: "Next day-Onboarding", description: "Tasks for ongoing onboarding process" }
];

const offboardingPhases = [
  { id: "pre-offboarding", name: "Pre-Offboarding", description: "Tasks completed before the last day" },
  { id: "last-day", name: "Last day", description: "Tasks for the employee's final day" },
  { id: "post-offboarding", name: "Post-offboarding", description: "Tasks completed after the employee's departure" }
];

// Helper function to get display label for assignee
const getAssigneeLabel = (value: string) => {
  // Check departments
  const dept = assigneeOptions.departments.find(d => d.value === value);
  if (dept) return dept.label;
  
  // Check designations
  const desig = assigneeOptions.designations.find(d => d.value === value);
  if (desig) return desig.label;
  
  // Check employees
  const emp = assigneeOptions.employees.find(e => e.value === value);
  if (emp) return emp.label;
  
  return value;
};

// Helper function to get default PIC from task template
const getDefaultPICFromTemplate = (taskName: string) => {
  const template = taskTemplates.find(t => t.name === taskName);
  return template ? template.ownerRole : null;
};

// Helper functions for generating labels
const generateDateOffsetLabel = (config: {
  days: number;
  timeUnit: string;
  beforeAfter: string;
  referenceDate: string;
}) => {
  const triggerOption = triggerOptions.find(opt => opt.value === config.referenceDate);
  const referenceLabel = triggerOption?.label || config.referenceDate;
  
  return `${config.days} ${config.timeUnit} ${config.beforeAfter} ${referenceLabel}`;
};

const generatePreviousTaskLabel = (taskRows: TaskRow[], dependentTaskId: string) => {
  const dependentTask = taskRows.find(task => task.id === dependentTaskId);
  return dependentTask ? `After '${dependentTask.task}' completed` : "After Previous Task Completed";
};

// Draggable Task Row Component
interface DraggableTaskRowProps {
  task: TaskRow;
  index: number;
  phase?: string;
  taskTemplateNames: string[];
  assigneeOptions: any;
  onTaskChange: (taskId: string, field: keyof TaskRow, value: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenTriggerModal: (taskId: string) => void;
  moveTask: (dragIndex: number, hoverIndex: number, phase?: string) => void;
  totalTasks: number;
}

function DraggableTaskRow({
  task,
  index,
  phase,
  taskTemplateNames,
  assigneeOptions,
  onTaskChange,
  onDeleteTask,
  onOpenTriggerModal,
  moveTask,
  totalTasks
}: DraggableTaskRowProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { index, phase },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'task',
    hover: (item: { index: number; phase?: string }) => {
      if (!drag) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      
      // For onboarding, ensure tasks stay within the same phase
      if (phase && item.phase !== phase) return;
      
      moveTask(dragIndex, hoverIndex, phase);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`border border-gray-200 rounded-md bg-white transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ cursor: 'move' }}
    >
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-2 p-2">
        {/* Drag Handle */}
        <div className="col-span-1 flex items-center">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
        </div>
        
        {/* Task */}
        <div className="col-span-4">
          <Select 
            value={task.task} 
            onValueChange={(value) => onTaskChange(task.id, "task", value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              {taskTemplateNames.map((template) => (
                <SelectItem key={template} value={template}>
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Assignee */}
        <div className="col-span-3">
          <div className="space-y-1">
            <Select 
              value={task.assignee} 
              onValueChange={(value) => onTaskChange(task.id, "assignee", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select person in charge" />
              </SelectTrigger>
              <SelectContent>
                {/* Department Section */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                  Department
                </div>
                {assigneeOptions.departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
                
                {/* Designation Section */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mt-2">
                  Designation
                </div>
                {assigneeOptions.designations.map((desig) => (
                  <SelectItem key={desig.value} value={desig.value}>
                    {desig.label}
                  </SelectItem>
                ))}
                
                {/* Employee Section */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mt-2">
                  Employee
                </div>
                {assigneeOptions.employees.map((emp) => (
                  <SelectItem key={emp.value} value={emp.value}>
                    {emp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Default PIC Subtext */}
            {task.task && (
              <div className="text-xs text-gray-500">
                Default: {getDefaultPICFromTemplate(task.task) || "Employee"} (from template)
              </div>
            )}
          </div>
        </div>
        
        {/* Task Trigger */}
        <div className="col-span-3">
          <Button
            variant="outline"
            className="h-9 w-full justify-start"
            onClick={() => onOpenTriggerModal(task.id)}
          >
            <div className="flex items-center space-x-2">
              {task.trigger && task.trigger.trim() !== "" ? (
                <>
                  <div className="flex-shrink-0">
                    {(task.trigger === 'date_offset' || task.trigger.includes('date')) && <Calendar className="w-4 h-4 text-chart-1" />}
                    {task.trigger === 'previous_task' && <Clock className="w-4 h-4 text-chart-2" />}
                    {task.trigger === 'confirmed_status' && <User className="w-4 h-4 text-chart-5" />}
                    {(task.trigger === 'hire_date' || task.trigger === 'resignation_accepted' || task.trigger === 'resignation_date' || task.trigger === 'termination_date') && <Zap className="w-4 h-4 text-chart-3" />}
                  </div>
                  <span className="truncate">{task.triggerDetails && task.triggerDetails.trim() !== "" ? task.triggerDetails : "Configure trigger"}</span>
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Choose trigger</span>
                </>
              )}
            </div>
          </Button>
          {/* Completion Deadline Indicator */}
          {task.completionDeadline && (
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Complete within {task.completionDeadline} days
            </div>
          )}
        </div>
        
        {/* Delete */}
        <div className="col-span-1 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-gray-400 hover:text-red-600"
            onClick={() => onDeleteTask(task.id)}
            disabled={totalTasks === 1}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-3 space-y-3">
        {/* Mobile Header with Drag Handle and Delete */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            <span className="text-sm font-medium text-gray-700">Task #{index + 1}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
            onClick={() => onDeleteTask(task.id)}
            disabled={totalTasks === 1}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Task Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Task</Label>
          <Select 
            value={task.task} 
            onValueChange={(value) => onTaskChange(task.id, "task", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              {taskTemplateNames.map((template) => (
                <SelectItem key={template} value={template}>
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assignee Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Person in Charge</Label>
          <Select 
            value={task.assignee} 
            onValueChange={(value) => onTaskChange(task.id, "assignee", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select person in charge" />
            </SelectTrigger>
            <SelectContent>
              {/* Department Section */}
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                Department
              </div>
              {assigneeOptions.departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
              
              {/* Designation Section */}
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mt-2">
                Designation
              </div>
              {assigneeOptions.designations.map((desig) => (
                <SelectItem key={desig.value} value={desig.value}>
                  {desig.label}
                </SelectItem>
              ))}
              
              {/* Employee Section */}
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mt-2">
                Employee
              </div>
              {assigneeOptions.employees.map((emp) => (
                <SelectItem key={emp.value} value={emp.value}>
                  {emp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Default PIC Subtext */}
          {task.task && (
            <div className="text-xs text-gray-500">
              Default: {getDefaultPICFromTemplate(task.task) || "Employee"} (from template)
            </div>
          )}
        </div>

        {/* Task Trigger */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Trigger</Label>
          <Button
            variant="outline"
            className="h-10 w-full justify-start"
            onClick={() => onOpenTriggerModal(task.id)}
          >
            <div className="flex items-center space-x-2">
              {task.trigger && task.trigger.trim() !== "" ? (
                <>
                  <div className="flex-shrink-0">
                    {(task.trigger === 'date_offset' || task.trigger.includes('date')) && <Calendar className="w-4 h-4 text-chart-1" />}
                    {task.trigger === 'previous_task' && <Clock className="w-4 h-4 text-chart-2" />}
                    {task.trigger === 'confirmed_status' && <User className="w-4 h-4 text-chart-5" />}
                    {(task.trigger === 'hire_date' || task.trigger === 'resignation_accepted' || task.trigger === 'resignation_date' || task.trigger === 'termination_date') && <Zap className="w-4 h-4 text-chart-3" />}
                  </div>
                  <span className="truncate">{task.triggerDetails && task.triggerDetails.trim() !== "" ? task.triggerDetails : "Configure trigger"}</span>
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Choose trigger</span>
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Completion Deadline Indicator */}
        {task.completionDeadline && (
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3 h-3" />
            Complete within {task.completionDeadline} days
          </div>
        )}
      </div>
    </div>
  );
}

export function CreateWorkflow({ workflowType, onNavigate, editWorkflowId }: CreateWorkflowProps) {
  const isMobile = useIsMobile();
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [selectedTriggerRowId, setSelectedTriggerRowId] = useState<string | null>(null);
  const [selectedTriggerValue, setSelectedTriggerValue] = useState<string>("");
  
  // Date Offset Configuration State
  const [dateOffsetConfig, setDateOffsetConfig] = useState({
    days: 0,
    timeUnit: "days",
    beforeAfter: "after",
    referenceDate: "hire_date"
  });
  
  // Previous Task Configuration State
  const [previousTaskConfig, setPreviousTaskConfig] = useState({
    dependentTaskId: ""
  });

  // Completion Deadline Configuration State
  const [completionDeadlineConfig, setCompletionDeadlineConfig] = useState({
    enabled: false,
    timingMode: "after_trigger", // "after_trigger" or "before_date"
    timeValue: 7,
    timeUnit: "days", // "hours", "days", "weeks"
    specificDate: "hire_date" // for "before_date" mode
  });

  // Get task templates for the current workflow type
  const taskTemplateNames = getActiveTaskTemplateNames(workflowType);

  // Initialize form state based on edit mode
  const isEditMode = !!editWorkflowId;
  const editData = editWorkflowId ? workflowDataMap[editWorkflowId] : null;
  
  // Form state
  const [workflowName, setWorkflowName] = useState(editData?.name || "");
  const [copyFromWorkflow, setCopyFromWorkflow] = useState("");
  const [taskRows, setTaskRows] = useState<TaskRow[]>(
    editData?.tasks || [
      { id: "1", task: "", assignee: "", trigger: "", triggerDetails: "", phase: workflowType === "onboarding" ? "pre-onboarding" : "pre-offboarding" }
    ]
  );

  const handleBack = () => {
    onNavigate("workflow");
  };

  const handleSaveWorkflow = () => {
    console.log(isEditMode ? "Updating workflow:" : "Saving workflow:", {
      id: editWorkflowId,
      name: workflowName,
      category: workflowType,
      copyFrom: copyFromWorkflow,
      tasks: taskRows
    });
    // Navigate back to workflow list after saving
    onNavigate("workflow");
  };

  const handleAddTask = (phase?: string) => {
    const newTask: TaskRow = {
      id: Date.now().toString(),
      task: "",
      assignee: "",
      trigger: "",
      triggerDetails: "",
      phase: workflowType === "onboarding" ? (phase || "pre-onboarding") : (phase || "pre-offboarding"),
      completionDeadline: undefined
    };
    setTaskRows([...taskRows, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    if (taskRows.length > 1) {
      setTaskRows(taskRows.filter(task => task.id !== taskId));
    }
  };

  const handleTaskChange = (taskId: string, field: keyof TaskRow, value: string) => {
    setTaskRows(taskRows.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, [field]: value };
        
        // When task is selected, auto-populate with default PIC from template
        if (field === "task" && value) {
          const defaultPIC = getDefaultPICFromTemplate(value);
          if (!task.assignee) {
            // Map template owner roles to our assignee structure
            const ownerRoleMapping = {
              "HR": "dept-hr",
              "IT": "dept-it", 
              "Staff": "emp-sarah-ahmad", // Default to a specific staff member
              "Finance": "dept-finance"
            };
            // If no default PIC or PIC not in mapping, default to Employee
            updatedTask.assignee = defaultPIC && ownerRoleMapping[defaultPIC as keyof typeof ownerRoleMapping] 
              ? ownerRoleMapping[defaultPIC as keyof typeof ownerRoleMapping] 
              : "emp-sarah-ahmad";
          }
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const handleOpenTriggerModal = (taskId: string) => {
    setSelectedTriggerRowId(taskId);
    
    // Find the current task and pre-populate its trigger value
    const currentTask = taskRows.find(task => task.id === taskId);
    if (currentTask && currentTask.trigger) {
      setSelectedTriggerValue(currentTask.trigger);
      
      // Pre-populate configuration for complex triggers
      if (currentTask.trigger === "date_offset") {
        // Parse existing trigger details or use defaults
        setDateOffsetConfig({
          days: 1, // You might want to parse this from triggerDetails
          timeUnit: "days",
          beforeAfter: "after",
          referenceDate: workflowType === "onboarding" ? "hire_date" : "resignation_accepted"
        });
      } else if (currentTask.trigger === "previous_task") {
        // For previous task, you might want to store the dependent task ID
        setPreviousTaskConfig({
          dependentTaskId: "" // You might want to parse this from triggerDetails
        });
      }
    } else {
      setSelectedTriggerValue(""); // Reset if no trigger
    }

    // Pre-populate completion deadline configuration
    if (currentTask && currentTask.completionDeadline) {
      setCompletionDeadlineConfig({
        enabled: true,
        timingMode: "after_trigger",
        timeValue: currentTask.completionDeadline,
        timeUnit: "days",
        specificDate: "hire_date"
      });
    } else {
      setCompletionDeadlineConfig({
        enabled: false,
        timingMode: "after_trigger",
        timeValue: 7,
        timeUnit: "days",
        specificDate: "hire_date"
      });
    }
    
    setIsTriggerModalOpen(true);
  };

  const handleSetTrigger = (triggerValue: string, triggerLabel: string) => {
    console.log("handleSetTrigger called:", { selectedTriggerRowId, triggerValue, triggerLabel }); // Debug log
    if (selectedTriggerRowId) {
      // Update both trigger and triggerDetails in a single state update
      setTaskRows(prevTaskRows => {
        const updatedRows = prevTaskRows.map(task => {
          if (task.id === selectedTriggerRowId) {
            console.log("Updating task:", task.id, "with trigger:", triggerValue); // Debug log
            return { 
              ...task, 
              trigger: triggerValue, 
              triggerDetails: triggerLabel,
              completionDeadline: completionDeadlineConfig.enabled ? completionDeadlineConfig.timeValue : undefined
            };
          }
          return task;
        });
        console.log("Updated taskRows:", updatedRows); // Debug log
        return updatedRows;
      });
    }
    setIsTriggerModalOpen(false);
    setSelectedTriggerRowId(null);
    setSelectedTriggerValue("");
    // Reset configurations
    setDateOffsetConfig({
      days: 0,
      timeUnit: "days",
      beforeAfter: "after",
      referenceDate: workflowType === "onboarding" ? "hire_date" : "resignation_accepted"
    });
    setPreviousTaskConfig({
      dependentTaskId: ""
    });
    setCompletionDeadlineConfig({
      enabled: false,
      timingMode: "after_trigger",
      timeValue: 7,
      timeUnit: "days",
      specificDate: "hire_date"
    });
  };

  const handleCopyFromChange = (value: string) => {
    setCopyFromWorkflow(value);
    
    // Pre-populate tasks based on template selection
    if (value === "template-1") {
      setTaskRows([
        { id: "1", task: "Welcome Pack", assignee: "dept-hr", trigger: "hire_date", triggerDetails: "On Hire Date", phase: workflowType === "onboarding" ? "pre-onboarding" : undefined },
        { id: "2", task: "Grant Email & HRMS Access", assignee: "dept-it", trigger: "hire_date", triggerDetails: "On Hire Date", phase: workflowType === "onboarding" ? "pre-onboarding" : undefined },
        { id: "3", task: "Company Overview", assignee: "emp-michael-chen", trigger: "previous_task", triggerDetails: "After Previous Task Completed", phase: workflowType === "onboarding" ? "pre-onboarding" : undefined }
      ]);
    }
  };

  // Helper function to move tasks within the same phase
  const moveTask = (dragIndex: number, hoverIndex: number, phase?: string) => {
    if (workflowType === "onboarding" && phase) {
      // For onboarding, handle phase-specific reordering
      const phaseTasksOnly = taskRows.filter(task => task.phase === phase);
      const otherTasks = taskRows.filter(task => task.phase !== phase);
      
      const draggedTask = phaseTasksOnly[dragIndex];
      const newPhaseOrder = [...phaseTasksOnly];
      newPhaseOrder.splice(dragIndex, 1);
      newPhaseOrder.splice(hoverIndex, 0, draggedTask);
      
      // Combine with other phase tasks in original order
      const updatedTasks = taskRows.map(task => {
        if (task.phase === phase) {
          const indexInPhase = phaseTasksOnly.findIndex(t => t.id === task.id);
          return newPhaseOrder[indexInPhase];
        }
        return task;
      });
      
      setTaskRows(updatedTasks);
    } else {
      // For offboarding, handle normal reordering
      const draggedTask = taskRows[dragIndex];
      const newTaskRows = [...taskRows];
      newTaskRows.splice(dragIndex, 1);
      newTaskRows.splice(hoverIndex, 0, draggedTask);
      setTaskRows(newTaskRows);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mt-[0px] mr-[14px] mb-[21px] ml-[14px]">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workflow
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">
                {isEditMode ? "Edit" : "Create"} {workflowType === "onboarding" ? "Onboarding" : "Offboarding"} Workflow
              </h1> 
              <p className="text-gray-600">
                {isEditMode ? "Modify an existing workflow" : "Build a new workflow with tasks and triggers"}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkflow}>
              {isEditMode ? "Update" : "Save"} Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Form */}
        <Card className="px-[14px] py-[0px] mt-[0px] mr-[14px] mb-[21px] ml-[14px]">
          <CardHeader>
            <CardTitle>Workflow Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workflow Name */}
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder={`Enter ${workflowType} workflow name`}
              />
            </div>

            {/* Copy From Template */}
            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="copy-from">Copy Template From (Optional)</Label>
                <Select value={copyFromWorkflow} onValueChange={handleCopyFromChange}>
                  <SelectTrigger id="copy-from">
                    <SelectValue placeholder="Select an existing workflow template" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingWorkflows.map((workflow) => (
                      <SelectItem key={workflow.value} value={workflow.value}>
                        {workflow.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Configuration */}
        <Card className="mx-[14px] my-[0px]">
          <CardHeader>
            <CardTitle>Tasks Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {workflowType === "onboarding" ? (
              // Phase-based layout for onboarding
              <div className="space-y-8">
                {onboardingPhases.map((phase) => {
                  const phaseTasks = taskRows.filter(task => task.phase === phase.id);
                  const phaseIndex = onboardingPhases.findIndex(p => p.id === phase.id);
                  
                  return (
                    <div key={phase.id} className="space-y-4">
                      {/* Phase Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{phase.name}</h3>
                          <p className="text-sm text-gray-600">{phase.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTask(phase.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                      </div>

                      {/* Task Grid Header */}
                      <div className="hidden md:grid md:grid-cols-12 gap-2 px-2 py-2 bg-gray-50 rounded-md text-sm font-medium text-gray-700">
                        <div className="col-span-1"></div>
                        <div className="col-span-4">Task</div>
                        <div className="col-span-3">Person in Charge</div>
                        <div className="col-span-3">Task Trigger</div>
                        <div className="col-span-1"></div>
                      </div>

                      {/* Phase Tasks */}
                      <div className="space-y-2">
                        {phaseTasks.map((task, index) => (
                          <DraggableTaskRow
                            key={task.id}
                            task={task}
                            index={index}
                            phase={phase.id}
                            taskTemplateNames={taskTemplateNames}
                            assigneeOptions={assigneeOptions}
                            onTaskChange={handleTaskChange}
                            onDeleteTask={handleDeleteTask}
                            onOpenTriggerModal={handleOpenTriggerModal}
                            moveTask={moveTask}
                            totalTasks={taskRows.length}
                          />
                        ))}
                        
                        {phaseTasks.length === 0 && (
                          <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500">
                            No tasks in this phase. Click "Add Task" to get started.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Phase-based layout for offboarding
              <div className="space-y-8">
                {offboardingPhases.map((phase) => {
                  const phaseTasks = taskRows.filter(task => task.phase === phase.id);
                  const phaseIndex = offboardingPhases.findIndex(p => p.id === phase.id);
                  
                  return (
                    <div key={phase.id} className="space-y-4">
                      {/* Phase Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{phase.name}</h3>
                          <p className="text-sm text-gray-600">{phase.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTask(phase.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                      </div>

                      {/* Task Grid Header */}
                      <div className="hidden md:grid md:grid-cols-12 gap-2 px-2 py-2 bg-gray-50 rounded-md text-sm font-medium text-gray-700">
                        <div className="col-span-1"></div>
                        <div className="col-span-4">Task</div>
                        <div className="col-span-3">Person in Charge</div>
                        <div className="col-span-3">Task Trigger</div>
                        <div className="col-span-1"></div>
                      </div>

                      {/* Phase Tasks */}
                      <div className="space-y-2">
                        {phaseTasks.map((task, index) => (
                          <DraggableTaskRow
                            key={task.id}
                            task={task}
                            index={index}
                            phase={phase.id}
                            taskTemplateNames={taskTemplateNames}
                            assigneeOptions={assigneeOptions}
                            onTaskChange={handleTaskChange}
                            onDeleteTask={handleDeleteTask}
                            onOpenTriggerModal={handleOpenTriggerModal}
                            moveTask={moveTask}
                            totalTasks={taskRows.length}
                          />
                        ))}
                        
                        {phaseTasks.length === 0 && (
                          <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500">
                            No tasks in this phase. Click "Add Task" to get started.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trigger Configuration Modal */}
        <Sheet open={isTriggerModalOpen} onOpenChange={setIsTriggerModalOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto max-h-screen" className="w-[500px] sm:w-[600px]">
            <ScrollArea className="h-full">
              <SheetHeader>
                <SheetTitle>Configure Task Trigger</SheetTitle>
            <SheetDescription>
              Configure when this task should be triggered and set completion deadlines.
            </SheetDescription>
                <SheetDescription>
                  Set when this task should start and its completion requirements
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-6">
                {/* Trigger Selection */}
                <div className="space-y-4 px-[14px] py-[0px]">
                  <h4 className="font-medium">Trigger Type</h4>
                  <div className="space-y-2">
                    <Select value={selectedTriggerValue} onValueChange={setSelectedTriggerValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select when this task should start" />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerOptions
                          .filter(option => {
                            if (workflowType === "onboarding") {
                              return !["resignation_accepted", "resignation_date", "termination_date"].includes(option.value);
                            } else {
                              return !["hire_date", "confirmed_status"].includes(option.value) || 
                                     (option.value === "resignation_accepted" && workflowType === "offboarding");
                            }
                          })
                          .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-gray-600">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date Offset Configuration */}
                {selectedTriggerValue === "date_offset" && (
                  <div className="space-y-4 border rounded-md bg-white p-4 mx-[14px] my-[0px] mt-[0px] mr-[14px] mb-[14px] ml-[14px]">
                    {/* Main Configuration in a Single Row */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 font-medium">Start this task</span>
                      
                      <Input
                        type="number"
                        value={dateOffsetConfig.days}
                        onChange={(e) => setDateOffsetConfig({
                          ...dateOffsetConfig,
                          days: parseInt(e.target.value) || 0
                        })}
                        min="0"
                        className="w-16 h-9 text-center"
                        placeholder="0"
                      />
                      
                      <Select 
                        value={dateOffsetConfig.timeUnit}
                        onValueChange={(value) => setDateOffsetConfig({
                          ...dateOffsetConfig,
                          timeUnit: value
                        })}
                      >
                        <SelectTrigger className="w-20 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="weeks">weeks</SelectItem>
                          <SelectItem value="months">months</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={dateOffsetConfig.beforeAfter}
                        onValueChange={(value) => setDateOffsetConfig({
                          ...dateOffsetConfig,
                          beforeAfter: value
                        })}
                      >
                        <SelectTrigger className="w-20 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="before">before</SelectItem>
                          <SelectItem value="after">after</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={dateOffsetConfig.referenceDate}
                        onValueChange={(value) => setDateOffsetConfig({
                          ...dateOffsetConfig,
                          referenceDate: value
                        })}
                      >
                        <SelectTrigger className="w-auto min-w-40 h-9">
                          <SelectValue placeholder="select date" />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerOptions
                            .filter(option => {
                              if (workflowType === "onboarding") {
                                return ["hire_date", "confirmed_status"].includes(option.value);
                              } else {
                                return ["resignation_accepted", "termination_date"].includes(option.value);
                              }
                            })
                            .map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Task will start:</p>
                          <p className="text-sm text-blue-700">{generateDateOffsetLabel(dateOffsetConfig)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Previous Task Dependency Configuration */}
                {selectedTriggerValue === "previous_task" && (
                  <div className="space-y-4 p-4 border rounded-md bg-gray-50 mx-[14px] my-[0px] mt-[0px] mr-[14px] mb-[14px] ml-[14px]">
                    <h4 className="font-medium">Previous Task Dependency</h4>
                    
                    <div>
                      <Label htmlFor="dependent-task">Select Previous Task</Label>
                      <Select 
                        value={previousTaskConfig.dependentTaskId}
                        onValueChange={(value) => setPreviousTaskConfig({
                          ...previousTaskConfig,
                          dependentTaskId: value
                        })}
                      >
                        <SelectTrigger id="dependent-task">
                          <SelectValue placeholder="Choose previous task" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskRows
                            .filter(task => task.id !== selectedTriggerRowId && task.task)
                            .map((task) => (
                              <SelectItem key={task.id} value={task.id}>
                                {task.task}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        Preview: <span className="font-medium">{generatePreviousTaskLabel(taskRows, previousTaskConfig.dependentTaskId)}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Completion Needed Configuration */}
                <div className="space-y-4 border rounded-md bg-gray-50 p-4 mt-[0px] mr-[14px] mb-[21px] ml-[14px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Completion Needed</h4>
                      <p className="text-sm text-gray-600">Set deadline for task completion after it's triggered</p>
                    </div>
                    <Switch
                      checked={completionDeadlineConfig.enabled}
                      onCheckedChange={(checked) => setCompletionDeadlineConfig({
                        ...completionDeadlineConfig,
                        enabled: checked
                      })}
                    />
                  </div>

                  {completionDeadlineConfig.enabled && (
                    <div className="bg-white rounded-md p-4 border border-gray-200 space-y-4">
                      {/* Timing Mode Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Start this task</Label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-1 bg-gray-100 rounded-lg gap-1 sm:gap-0">
                          <button
                            type="button"
                            onClick={() => setCompletionDeadlineConfig({
                              ...completionDeadlineConfig,
                              timingMode: "after_trigger"
                            })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
                              completionDeadlineConfig.timingMode === "after_trigger"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-gray-700 hover:text-gray-900"
                            }`}
                          >
                            After Trigger Date
                          </button>
                          <button
                            type="button"
                            onClick={() => setCompletionDeadlineConfig({
                              ...completionDeadlineConfig,
                              timingMode: "before_date"
                            })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
                              completionDeadlineConfig.timingMode === "before_date"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-gray-700 hover:text-gray-900"
                            }`}
                          >
                            Before a Specific Date
                          </button>
                        </div>
                      </div>

                      {/* Configuration Options */}
                      {completionDeadlineConfig.timingMode === "after_trigger" && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                          <span className="text-sm text-gray-700">Complete within</span>
                          <Input
                            type="number"
                            value={completionDeadlineConfig.timeValue}
                            onChange={(e) => setCompletionDeadlineConfig({
                              ...completionDeadlineConfig,
                              timeValue: parseInt(e.target.value) || 1
                            })}
                            min="1"
                            className="w-20 h-8 text-center"
                          />
                          <Select
                            value={completionDeadlineConfig.timeUnit}
                            onValueChange={(value) => setCompletionDeadlineConfig({
                              ...completionDeadlineConfig,
                              timeUnit: value
                            })}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hours">hours</SelectItem>
                              <SelectItem value="days">days</SelectItem>
                              <SelectItem value="weeks">weeks</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-gray-700">after trigger</span>
                        </div>
                      )}

                      {completionDeadlineConfig.timingMode === "before_date" && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
                            <span className="text-sm text-gray-700">Complete</span>
                            <Input
                              type="number"
                              value={completionDeadlineConfig.timeValue}
                              onChange={(e) => setCompletionDeadlineConfig({
                                ...completionDeadlineConfig,
                                timeValue: parseInt(e.target.value) || 1
                              })}
                              min="1"
                              className="w-20 h-8 text-center"
                            />
                            <Select
                              value={completionDeadlineConfig.timeUnit}
                              onValueChange={(value) => setCompletionDeadlineConfig({
                                ...completionDeadlineConfig,
                                timeUnit: value
                              })}
                            >
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hours">hours</SelectItem>
                                <SelectItem value="days">days</SelectItem>
                                <SelectItem value="weeks">weeks</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-700">before</span>
                            <Select
                              value={completionDeadlineConfig.specificDate}
                              onValueChange={(value) => setCompletionDeadlineConfig({
                                ...completionDeadlineConfig,
                                specificDate: value
                              })}
                            >
                              <SelectTrigger className="w-40 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {workflowType === "onboarding" ? (
                                  <>
                                    <SelectItem value="hire_date">Hire Date</SelectItem>
                                    <SelectItem value="confirmed_status">Confirmed Status Date</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="last_work_date">Last Work Date</SelectItem>
                                    <SelectItem value="resignation_date">Resignation Date</SelectItem>
                                    <SelectItem value="termination_date">Termination Date</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      
                      {/* Warning Message */}
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {completionDeadlineConfig.timingMode === "after_trigger" 
                              ? `Task will be marked overdue if not completed within ${completionDeadlineConfig.timeValue} ${completionDeadlineConfig.timeUnit} after trigger`
                              : `Task must be completed ${completionDeadlineConfig.timeValue} ${completionDeadlineConfig.timeUnit} before the selected date`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Now after Completion Needed */}
                {selectedTriggerValue && (
                  <div className="flex justify-end gap-2 pt-[14px] border-t border-gray-200 pr-[0px] pb-[0px] pl-[14px] mx-[14px] my-[0px]">
                    <Button variant="outline" onClick={() => setIsTriggerModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSetTrigger(
                      selectedTriggerValue, 
                      selectedTriggerValue === "date_offset" 
                        ? generateDateOffsetLabel(dateOffsetConfig)
                        : selectedTriggerValue === "previous_task"
                        ? generatePreviousTaskLabel(taskRows, previousTaskConfig.dependentTaskId)
                        : triggerOptions.find(opt => opt.value === selectedTriggerValue)?.label || selectedTriggerValue
                    )}>
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </DndProvider>
  );
}