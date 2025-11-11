import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { 
  Shield, 
  Edit, 
  Plus,
  Users,
  Settings,
  FileText,
  Workflow,
  History,
  UserPlus,
  BarChart3
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  lastUpdated: string;
  permissions: {
    generalSettings: { read: boolean; write: boolean };
    roles: { read: boolean; write: boolean };
    taskTemplates: { read: boolean; write: boolean };
    workflow: { read: boolean; write: boolean };
    auditTrail: { read: boolean; write: boolean };
    preHireEntry: { read: boolean; write: boolean };
    dashboards: { read: boolean; write: boolean };
    assignTasks: { read: boolean; write: boolean };
  };
}

const roles: Role[] = [
  {
    id: "hr-admin",
    name: "HR Admin",
    description: "Full access to Configuration & Operation",
    userCount: 3,
    lastUpdated: "2025-08-20",
    permissions: {
      generalSettings: { read: true, write: true },
      roles: { read: true, write: true },
      taskTemplates: { read: true, write: true },
      workflow: { read: true, write: true },
      auditTrail: { read: true, write: true },
      preHireEntry: { read: true, write: true },
      dashboards: { read: true, write: true },
      assignTasks: { read: true, write: true }
    }
  },
  {
    id: "hr-coordinator",
    name: "HR Coordinator", 
    description: "Operation + read of Configuration",
    userCount: 5,
    lastUpdated: "2025-08-15",
    permissions: {
      generalSettings: { read: true, write: false },
      roles: { read: true, write: false },
      taskTemplates: { read: true, write: false },
      workflow: { read: true, write: false },
      auditTrail: { read: true, write: false },
      preHireEntry: { read: true, write: true },
      dashboards: { read: true, write: true },
      assignTasks: { read: true, write: true }
    }
  },
  {
    id: "manager",
    name: "Manager",
    description: "Operation (view/approve tasks assigned to team)",
    userCount: 12,
    lastUpdated: "2025-08-10",
    permissions: {
      generalSettings: { read: false, write: false },
      roles: { read: false, write: false },
      taskTemplates: { read: false, write: false },
      workflow: { read: false, write: false },
      auditTrail: { read: false, write: false },
      preHireEntry: { read: false, write: false },
      dashboards: { read: true, write: false },
      assignTasks: { read: true, write: true }
    }
  },
  {
    id: "it-pic",
    name: "IT/PIC",
    description: "Operation (System/Access & Asset tasks)",
    userCount: 4,
    lastUpdated: "2025-08-18",
    permissions: {
      generalSettings: { read: true, write: true },
      roles: { read: true, write: false },
      taskTemplates: { read: true, write: true },
      workflow: { read: true, write: true },
      auditTrail: { read: true, write: false },
      preHireEntry: { read: false, write: false },
      dashboards: { read: true, write: true },
      assignTasks: { read: true, write: true }
    }
  },
  {
    id: "staff",
    name: "Staff (End User)",
    description: "Operation (assigned tasks only)",
    userCount: 86,
    lastUpdated: "2025-08-12",
    permissions: {
      generalSettings: { read: false, write: false },
      roles: { read: false, write: false },
      taskTemplates: { read: false, write: false },
      workflow: { read: false, write: false },
      auditTrail: { read: false, write: false },
      preHireEntry: { read: false, write: false },
      dashboards: { read: true, write: false },
      assignTasks: { read: false, write: false }
    }
  }
];

const permissionModules = [
  { key: "generalSettings", label: "General Settings", icon: Settings },
  { key: "roles", label: "Roles", icon: Shield },
  { key: "taskTemplates", label: "Task Templates", icon: FileText },
  { key: "workflow", label: "Workflow", icon: Workflow },
  { key: "auditTrail", label: "Audit Trail", icon: History },
  { key: "preHireEntry", label: "Pre-Hire Entry", icon: UserPlus },
  { key: "dashboards", label: "Dashboards", icon: BarChart3 },
  { key: "assignTasks", label: "Assign Tasks", icon: Users }
];

export function UserRoles() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  const handlePermissionChange = (module: string, type: "read" | "write", value: boolean) => {
    if (selectedRole) {
      setSelectedRole({
        ...selectedRole,
        permissions: {
          ...selectedRole.permissions,
          [module]: {
            ...selectedRole.permissions[module as keyof typeof selectedRole.permissions],
            [type]: value
          }
        }
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">User Roles</h1>
          <p className="text-muted-foreground">Configure role-based access and permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {role.id}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {role.userCount}
                    </div>
                  </TableCell>
                  <TableCell>{role.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRole(role)}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Permissions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>
                              Permissions for {selectedRole?.name}
                            </DialogTitle>
                            <DialogDescription>
                              Configure read and write permissions for each module. Write permissions require read permissions to be enabled.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                              {permissionModules.map((module) => {
                                const Icon = module.icon;
                                const modulePermissions = selectedRole?.permissions[module.key as keyof typeof selectedRole.permissions];
                                
                                return (
                                  <div key={module.key} className="p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Icon className="w-4 h-4 text-muted-foreground" />
                                      <h4 className="font-medium">{module.label}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="flex items-center justify-between">
                                        <Label htmlFor={`${module.key}-read`}>Read</Label>
                                        <Switch
                                          id={`${module.key}-read`}
                                          checked={modulePermissions?.read || false}
                                          onCheckedChange={(checked) => 
                                            handlePermissionChange(module.key, "read", checked)
                                          }
                                        />
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <Label htmlFor={`${module.key}-write`}>Write</Label>
                                        <Switch
                                          id={`${module.key}-write`}
                                          checked={modulePermissions?.write || false}
                                          onCheckedChange={(checked) => 
                                            handlePermissionChange(module.key, "write", checked)
                                          }
                                          disabled={!modulePermissions?.read}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <Separator />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setPermissionsOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={() => setPermissionsOpen(false)}>
                                Save Permissions
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}