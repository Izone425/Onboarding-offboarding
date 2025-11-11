import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { OnboardingDashboard } from "./components/onboarding/OnboardingDashboard";
import { PreHireEntry } from "./components/onboarding/PreHireEntry";
import { OffboardingDashboard } from "./components/offboarding/OffboardingDashboard";
import { GeneralSettings } from "./components/configuration/GeneralSettings";
import { UserRoles } from "./components/configuration/UserRoles";
import { RolePermissions } from "./components/configuration/RolePermissions";
import { TaskTemplates } from "./components/configuration/TaskTemplates";
import { WorkflowBuilder } from "./components/configuration/WorkflowBuilder";
import { CreateWorkflow } from "./components/configuration/CreateWorkflow";
import { AuditTrail } from "./components/configuration/AuditTrail";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentView, setCurrentView] = useState("onboarding-dashboard");
  const [currentUserRole, setCurrentUserRole] = useState("HR Admin");

  const userProfiles = {
    "HR Admin": {
      name: "Sarah Ahmad",
      email: "sarah.ahmad@company.com",
      role: "HR Admin",
      avatar: ""
    },
    "HR Coordinator": {
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "HR Coordinator",
      avatar: ""
    },
    "Manager": {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Manager",
      avatar: ""
    },
    "IT/PIC": {
      name: "David Kim",
      email: "david.kim@company.com",
      role: "IT/PIC",
      avatar: ""
    },
    "Staff": {
      name: "Jessica Wong",
      email: "jessica.wong@company.com",
      role: "Staff",
      avatar: ""
    }
  };

  const handleRoleSwitch = (role: string) => {
    setCurrentUserRole(role);
    // Reset to a default view when switching roles
    setCurrentView("onboarding-dashboard");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "profile":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Profile</h1>
              <p className="text-gray-600">Employee profile management module.</p>
            </div>
          </div>
        );
      case "attendance":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Attendance</h1>
              <p className="text-gray-600">Attendance tracking and management module.</p>
            </div>
          </div>
        );
      case "leave":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Leave</h1>
              <p className="text-gray-600">Leave application and management module.</p>
            </div>
          </div>
        );
      case "reimbursement":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Reimbursement</h1>
              <p className="text-gray-600">Expense reimbursement tracking and approval module.</p>
            </div>
          </div>
        );
      case "payroll":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Payroll</h1>
              <p className="text-gray-600">Payroll processing and management module.</p>
            </div>
          </div>
        );
      case "appraisal":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Appraisal</h1>
              <p className="text-gray-600">Performance appraisal and review module.</p>
            </div>
          </div>
        );
      case "pre-hire-entry":
        return <PreHireEntry />;
      case "onboarding-dashboard":
        return <OnboardingDashboard currentUserRole={currentUserRole} />;
      case "offboarding-dashboard":
        return <OffboardingDashboard currentUserRole={currentUserRole} />;
      case "general-settings":
        return <GeneralSettings />;
      case "user-roles":
        return <UserRoles />;
      case "role-permissions":
        return <RolePermissions />;
      case "task-templates":
        return <TaskTemplates />;
      case "workflow":
        return <WorkflowBuilder onNavigate={setCurrentView} />;
      case "create-workflow-onboarding":
        return <CreateWorkflow workflowType="onboarding" onNavigate={setCurrentView} />;
      case "create-workflow-offboarding":
        return <CreateWorkflow workflowType="offboarding" onNavigate={setCurrentView} />;
      // Edit workflow cases
      case "edit-workflow-onboarding-standard-hq":
        return <CreateWorkflow workflowType="onboarding" onNavigate={setCurrentView} editWorkflowId="onboarding-standard-hq" />;
      case "edit-workflow-onboarding-remote":
        return <CreateWorkflow workflowType="onboarding" onNavigate={setCurrentView} editWorkflowId="onboarding-remote" />;
      case "edit-workflow-onboarding-executive":
        return <CreateWorkflow workflowType="onboarding" onNavigate={setCurrentView} editWorkflowId="onboarding-executive" />;
      case "edit-workflow-onboarding-intern":
        return <CreateWorkflow workflowType="onboarding" onNavigate={setCurrentView} editWorkflowId="onboarding-intern" />;
      case "edit-workflow-offboarding-voluntary":
        return <CreateWorkflow workflowType="offboarding" onNavigate={setCurrentView} editWorkflowId="offboarding-voluntary" />;
      case "edit-workflow-offboarding-termination":
        return <CreateWorkflow workflowType="offboarding" onNavigate={setCurrentView} editWorkflowId="offboarding-termination" />;
      case "edit-workflow-offboarding-retirement":
        return <CreateWorkflow workflowType="offboarding" onNavigate={setCurrentView} editWorkflowId="offboarding-retirement" />;
      case "edit-workflow-offboarding-resignation":
        return <CreateWorkflow workflowType="offboarding" onNavigate={setCurrentView} editWorkflowId="offboarding-resignation" />;
      case "audit-trail":
        return <AuditTrail />;
      default:
        return <OnboardingDashboard currentUserRole={currentUserRole} />;
    }
  };

  const currentUser = userProfiles[currentUserRole];

  return (
    <div className="min-h-screen bg-background">
      <AppLayout 
        currentUser={currentUser}
        onNavigate={setCurrentView}
        currentView={currentView}
        onRoleSwitch={handleRoleSwitch}
        availableRoles={Object.keys(userProfiles)}
      >
        {renderCurrentView()}
      </AppLayout>
      <Toaster position="top-right" />
    </div>
  );
}