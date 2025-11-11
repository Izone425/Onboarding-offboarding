import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Check, 
  X, 
  Users, 
  Trash2,
  Plus,
  Eye,
  Edit,
  UserPlus
} from "lucide-react";
import { cn } from "../ui/utils";

interface Permission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

interface RoleData {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  isPartial: boolean;
  permissions: {
    dashboard: Permission;
    profile: Permission;
    attendance: Permission;
    leave: Permission;
    claim: Permission;
    payroll: Permission;
    onboard_offboard: Permission;
    analytics: Permission;
    devices: Permission;
    report: Permission;
  };
}

const modules = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'profile', label: 'Profile' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave' },
  { key: 'claim', label: 'Claim' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'onboard_offboard', label: 'Onboard & Offboard' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'devices', label: 'Devices' },
  { key: 'report', label: 'Report' }
];

const permissionTypes = [
  { key: 'view', label: 'View' },
  { key: 'add', label: 'Add' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' }
];

export function RolePermissions() {
  const [roles, setRoles] = useState<RoleData[]>([
    {
      id: "1",
      name: "HR Admin",
      description: "This permission is for the default admin to access all system modules, features, companies, divisions, departments, and locations. Customize module permissions to meet your organizational needs.",
      employeeCount: 5,
      isPartial: false,
      permissions: {
        dashboard: { view: true, add: true, edit: true, delete: true },
        profile: { view: true, add: true, edit: true, delete: true },
        attendance: { view: true, add: true, edit: true, delete: true },
        leave: { view: true, add: true, edit: true, delete: true },
        claim: { view: true, add: true, edit: true, delete: true },
        payroll: { view: true, add: true, edit: true, delete: true },
        onboard_offboard: { view: true, add: true, edit: true, delete: true },
        analytics: { view: true, add: true, edit: true, delete: true },
        devices: { view: true, add: true, edit: true, delete: true },
        report: { view: true, add: true, edit: true, delete: true }
      }
    },
    {
      id: "2",
      name: "HR Coordinator",
      description: "This permission is for the default admin to access all system modules, features, companies, divisions, departments, and locations. Customize module permissions to meet your organizational needs.",
      employeeCount: 3,
      isPartial: true,
      permissions: {
        dashboard: { view: true, add: false, edit: false, delete: false },
        profile: { view: true, add: true, edit: true, delete: false },
        attendance: { view: true, add: true, edit: true, delete: false },
        leave: { view: true, add: true, edit: true, delete: false },
        claim: { view: true, add: false, edit: false, delete: false },
        payroll: { view: true, add: false, edit: false, delete: false },
        onboard_offboard: { view: true, add: true, edit: true, delete: false },
        analytics: { view: true, add: false, edit: false, delete: false },
        devices: { view: true, add: false, edit: false, delete: false },
        report: { view: true, add: false, edit: false, delete: false }
      }
    },
    {
      id: "3",
      name: "Manager",
      description: "Manager permissions for accessing relevant system modules, features, companies, divisions, departments, and locations. Customize module permissions to meet your organizational needs.",
      employeeCount: 0,
      isPartial: true,
      permissions: {
        dashboard: { view: true, add: false, edit: false, delete: false },
        profile: { view: true, add: false, edit: false, delete: false },
        attendance: { view: true, add: true, edit: true, delete: false },
        leave: { view: true, add: false, edit: false, delete: false },
        claim: { view: true, add: false, edit: false, delete: false },
        payroll: { view: true, add: false, edit: false, delete: false },
        onboard_offboard: { view: true, add: false, edit: false, delete: false },
        analytics: { view: true, add: false, edit: false, delete: false },
        devices: { view: true, add: false, edit: false, delete: false },
        report: { view: true, add: false, edit: false, delete: false }
      }
    },
    {
      id: "4",
      name: "Staff",
      description: "This permission is for the default admin to access all system modules, features, companies, divisions, departments, and locations. Customize module permissions to meet your organizational needs.",
      employeeCount: 1,
      isPartial: true,
      permissions: {
        dashboard: { view: true, add: false, edit: false, delete: false },
        profile: { view: true, add: true, edit: true, delete: false },
        attendance: { view: true, add: false, edit: false, delete: false },
        leave: { view: true, add: false, edit: false, delete: false },
        claim: { view: true, add: false, edit: false, delete: false },
        payroll: { view: true, add: false, edit: false, delete: false },
        onboard_offboard: { view: true, add: false, edit: false, delete: false },
        analytics: { view: false, add: false, edit: false, delete: false },
        devices: { view: false, add: false, edit: false, delete: false },
        report: { view: false, add: false, edit: false, delete: false }
      }
    }
  ]);

  const togglePermission = (roleId: string, module: string, permissionType: string) => {
    setRoles(prevRoles => 
      prevRoles.map(role => {
        if (role.id === roleId) {
          const updatedPermissions = {
            ...role.permissions,
            [module]: {
              ...role.permissions[module],
              [permissionType]: !role.permissions[module][permissionType]
            }
          };
          return { ...role, permissions: updatedPermissions };
        }
        return role;
      })
    );
  };

  const PermissionIcon = ({ enabled, onClick }: { enabled: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105",
        enabled 
          ? "bg-primary border-primary text-white shadow-sm" 
          : "bg-white border-gray-300 text-gray-300 hover:border-gray-400"
      )}
    >
      {enabled && <Check className="w-3 h-3" />}
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Role Permissions</h1>
          <p className="text-gray-600 mt-1">Manage user roles and their permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4 bg-blue-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-primary">
                  {role.name}
                </CardTitle>
                {role.isPartial && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                    Partial
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {role.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4 p-4">
              <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-sm mb-3 text-gray-700">Company/Division/Department</h4>
                <Button variant="outline" size="sm" className="w-full bg-white border-blue-300 text-blue-700 hover:bg-blue-50">
                  Partial
                </Button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 py-2 border-b">
                  <div></div>
                  {permissionTypes.map(type => (
                    <div key={type.key} className="text-center">{type.label}</div>
                  ))}
                </div>

                {modules.map((module) => (
                  <div key={module.key} className="grid grid-cols-5 gap-2 items-center py-2 hover:bg-gray-50 rounded">
                    <div className="text-sm font-medium text-gray-700 px-1">
                      {module.label}
                    </div>
                    {permissionTypes.map((permType) => (
                      <div key={permType.key} className="flex justify-center">
                        <PermissionIcon
                          enabled={role.permissions[module.key][permType.key]}
                          onClick={() => togglePermission(role.id, module.key, permType.key)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 bg-gray-50 -mx-4 px-4 -mb-4 pb-4 rounded-b-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-700">Employees with this role</span>
                  </div>
                  <Badge className="bg-primary text-white border-primary px-2 py-1">
                    {role.employeeCount}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-500 mb-3">
                  Last updated: 24/04/2024 06:45 AM by Anne Mark
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Assign
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="px-2">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}