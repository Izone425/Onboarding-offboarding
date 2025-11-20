import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  Eye
} from "lucide-react";

interface WorkflowData {
  id: string;
  name: string;
  tasks: number;
  status: "active" | "draft";
  updated: string;
  category: "onboarding" | "offboarding";
}

interface WorkflowBuilderProps {
  onNavigate: (view: string) => void;
}

const workflows: WorkflowData[] = [
  {
    id: "onboarding-standard-hq",
    name: "Onboarding — Standard (HQ)",
    tasks: 12,
    status: "active",
    updated: "Sep 01, 2025",
    category: "onboarding"
  },
  {
    id: "onboarding-remote",
    name: "Onboarding — Remote Employee",
    tasks: 8,
    status: "draft",
    updated: "Aug 30, 2025",
    category: "onboarding"
  },
  {
    id: "onboarding-executive",
    name: "Onboarding — Executive Level",
    tasks: 15,
    status: "active",
    updated: "Aug 29, 2025",
    category: "onboarding"
  },
  {
    id: "onboarding-intern",
    name: "Onboarding — Internship Program",
    tasks: 6,
    status: "draft",
    updated: "Aug 27, 2025",
    category: "onboarding"
  },
  {
    id: "offboarding-voluntary",
    name: "Offboarding — Voluntary Exit",
    tasks: 8,
    status: "draft",
    updated: "Aug 28, 2025",
    category: "offboarding"
  },
  {
    id: "offboarding-termination",
    name: "Offboarding — Involuntary Termination",
    tasks: 6,
    status: "active",
    updated: "Aug 25, 2025",
    category: "offboarding"
  },
  {
    id: "offboarding-retirement",
    name: "Offboarding — Retirement",
    tasks: 10,
    status: "active",
    updated: "Aug 24, 2025",
    category: "offboarding"
  },
  {
    id: "offboarding-resignation",
    name: "Offboarding — Resignation",
    tasks: 3,
    status: "active",
    updated: "Sep 29, 2025",
    category: "offboarding"
  }
];



export function WorkflowBuilder({ onNavigate }: WorkflowBuilderProps) {
  const [activeTab, setActiveTab] = useState("onboarding");

  const filteredWorkflows = workflows.filter(workflow => workflow.category === activeTab);

  const handleCreateWorkflow = () => {
    onNavigate(`create-workflow-${activeTab}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Workflow</h1>
          <p className="text-gray-600">
            Create and manage onboarding and offboarding workflows
          </p>
        </div>
        <Button onClick={handleCreateWorkflow}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="offboarding">Offboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding" className="mt-6">
          <WorkflowTable workflows={filteredWorkflows} onNavigate={onNavigate} />
        </TabsContent>

        <TabsContent value="offboarding" className="mt-6">
          <WorkflowTable workflows={filteredWorkflows} onNavigate={onNavigate} />
        </TabsContent>
      </Tabs>


    </div>
  );
}

// Workflow Table Component
function WorkflowTable({ workflows, onNavigate }: { workflows: WorkflowData[]; onNavigate: (view: string) => void }) {
  // Handle view workflow (read-only mode)
  const handleView = (workflow: WorkflowData) => {
    // Navigate to view mode - in a real application, this would open a read-only view
    onNavigate(`view-workflow-${workflow.id}`);
  };

  // Handle delete workflow
  const handleDelete = (workflow: WorkflowData) => {
    if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      // In a real application, this would make an API call to delete the workflow
      alert(`Workflow "${workflow.name}" has been deleted successfully.`);
    }
  };

  if (workflows.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Settings className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first workflow to get started with automation.
          </p>
          <Button onClick={() => onNavigate("create-workflow-onboarding")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow Name</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>
                  <div className="font-medium">{workflow.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600">{workflow.tasks} tasks</div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={workflow.status === "active" ? "default" : "secondary"}
                    className={workflow.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {workflow.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600">{workflow.updated}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(workflow)}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate(`edit-workflow-${workflow.id}`)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(workflow)}
                      title="Delete"
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}