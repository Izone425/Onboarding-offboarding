export interface WorkflowTask {
  id: string;
  name: string;
  type: string;
  ownerRole: string;
  sla: number;
  mandatory: boolean;
  stage: "Pre-Onboarding" | "1st Day-Onboarding" | "Next Day-Onboarding";
  trigger: "Auto" | "Manual" | "On Approval" | "Dependency";
}

export interface Workflow {
  id: string;
  name: string;
  category: "onboarding" | "offboarding";
  status: "active" | "draft";
  tasks: WorkflowTask[];
  updated: string;
}

export const workflows: Workflow[] = [
  {
    id: "onboarding-standard-hq",
    name: "Onboarding — Standard (HQ)",
    category: "onboarding",
    status: "active",
    updated: "Sep 01, 2025",
    tasks: [
      {
        id: "welcome-pack",
        name: "Welcome Pack",
        type: "General Task",
        ownerRole: "HR",
        sla: 1,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Auto"
      },
      {
        id: "employee-handbook",
        name: "Read Employee Handbook",
        type: "Document Form",
        ownerRole: "Staff",
        sla: 3,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "day-1-orientation",
        name: "Day 1 Orientation",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 0,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "grant-access",
        name: "Grant Email & HRMS Access",
        type: "System/Access",
        ownerRole: "IT",
        sla: 2,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "issue-assets",
        name: "Issue Laptop & ID Card",
        type: "Asset",
        ownerRole: "IT",
        sla: 1,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "security-quiz",
        name: "Security & Compliance Quiz",
        type: "Questionnaire",
        ownerRole: "Staff",
        sla: 5,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "employee-information-form",
        name: "Employee Information & Document Collection",
        type: "Document Form",
        ownerRole: "HR",
        sla: 3,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "payroll-setup-form",
        name: "Payroll & Banking Information Setup",
        type: "Information Form",
        ownerRole: "Staff",
        sla: 2,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "team-introduction",
        name: "Team Introduction Meeting",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 1,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "workspace-setup",
        name: "Workspace Setup & Tour",
        type: "General Task",
        ownerRole: "Manager",
        sla: 0,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "benefits-enrollment",
        name: "Benefits Enrollment",
        type: "Information Form",
        ownerRole: "HR",
        sla: 7,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Manual"
      },
      {
        id: "employee-feedback-survey",
        name: "Employee Feedback & Satisfaction Survey",
        type: "Questionnaire",
        ownerRole: "HR",
        sla: 7,
        mandatory: false,
        stage: "Next Day-Onboarding",
        trigger: "Manual"
      }
    ]
  },
  {
    id: "onboarding-remote",
    name: "Onboarding — Remote Employee",
    category: "onboarding",
    status: "draft",
    updated: "Aug 30, 2025",
    tasks: [
      {
        id: "welcome-pack",
        name: "Welcome Pack (Digital)",
        type: "General Task",
        ownerRole: "HR",
        sla: 1,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Auto"
      },
      {
        id: "employee-handbook",
        name: "Read Employee Handbook",
        type: "Document Form",
        ownerRole: "Staff",
        sla: 3,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "virtual-orientation",
        name: "Virtual Day 1 Orientation",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 0,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "grant-access",
        name: "Grant Email & HRMS Access",
        type: "System/Access",
        ownerRole: "IT",
        sla: 2,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "ship-equipment",
        name: "Ship Laptop & Equipment",
        type: "Asset",
        ownerRole: "IT",
        sla: 3,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "On Approval"
      },
      {
        id: "remote-tools-training",
        name: "Remote Tools & Communication Training",
        type: "Questionnaire",
        ownerRole: "IT",
        sla: 2,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "virtual-team-meet",
        name: "Virtual Team Introduction",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 1,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "remote-work-policy",
        name: "Remote Work Policy Acknowledgment",
        type: "Document Form",
        ownerRole: "Staff",
        sla: 3,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Manual"
      }
    ]
  },
  {
    id: "onboarding-executive",
    name: "Onboarding — Executive Level",
    category: "onboarding",
    status: "active",
    updated: "Aug 29, 2025",
    tasks: [
      {
        id: "executive-welcome",
        name: "Executive Welcome Package",
        type: "General Task",
        ownerRole: "HR",
        sla: 1,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Auto"
      },
      {
        id: "c-suite-orientation",
        name: "C-Suite Orientation",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 0,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "strategic-briefing",
        name: "Strategic Business Briefing",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 1,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "executive-access",
        name: "Executive System Access Setup",
        type: "System/Access",
        ownerRole: "IT",
        sla: 1,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "executive-equipment",
        name: "Executive Equipment & Office Setup",
        type: "Asset",
        ownerRole: "IT",
        sla: 0,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "On Approval"
      },
      {
        id: "board-introduction",
        name: "Board of Directors Introduction",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 3,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "key-stakeholders",
        name: "Key Stakeholders Meeting",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 2,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "company-financials",
        name: "Company Financials & Performance Review",
        type: "Document Form",
        ownerRole: "Manager",
        sla: 3,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "executive-compensation",
        name: "Executive Compensation & Benefits",
        type: "Information Form",
        ownerRole: "HR",
        sla: 1,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Auto"
      },
      {
        id: "department-overview",
        name: "Department Overview & Team Structure",
        type: "General Task",
        ownerRole: "Manager",
        sla: 2,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "governance-training",
        name: "Governance & Compliance Training",
        type: "Questionnaire",
        ownerRole: "HR",
        sla: 5,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "executive-assistant",
        name: "Executive Assistant Assignment",
        type: "General Task",
        ownerRole: "HR",
        sla: 0,
        mandatory: false,
        stage: "1st Day-Onboarding",
        trigger: "Manual"
      },
      {
        id: "strategic-planning",
        name: "90-Day Strategic Planning Session",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 7,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "media-training",
        name: "Media & Public Relations Training",
        type: "Questionnaire",
        ownerRole: "HR",
        sla: 14,
        mandatory: false,
        stage: "Next Day-Onboarding",
        trigger: "Manual"
      },
      {
        id: "industry-briefing",
        name: "Industry & Market Briefing",
        type: "Document Form",
        ownerRole: "Manager",
        sla: 5,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Dependency"
      }
    ]
  },
  {
    id: "onboarding-intern",
    name: "Onboarding — Internship Program",
    category: "onboarding",
    status: "draft",
    updated: "Aug 27, 2025",
    tasks: [
      {
        id: "intern-welcome",
        name: "Intern Welcome Package",
        type: "General Task",
        ownerRole: "HR",
        sla: 1,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Auto"
      },
      {
        id: "intern-orientation",
        name: "Internship Program Orientation",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 0,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "intern-access",
        name: "Limited System Access Setup",
        type: "System/Access",
        ownerRole: "IT",
        sla: 1,
        mandatory: true,
        stage: "Pre-Onboarding",
        trigger: "Dependency"
      },
      {
        id: "mentor-assignment",
        name: "Mentor Assignment & Introduction",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 0,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "intern-project",
        name: "Internship Project Briefing",
        type: "General Task",
        ownerRole: "Manager",
        sla: 1,
        mandatory: true,
        stage: "1st Day-Onboarding",
        trigger: "Auto"
      },
      {
        id: "intern-policy",
        name: "Intern Policy & Guidelines",
        type: "Document Form",
        ownerRole: "Staff",
        sla: 2,
        mandatory: true,
        stage: "Next Day-Onboarding",
        trigger: "Dependency"
      }
    ]
  },
  {
    id: "offboarding-voluntary",
    name: "Offboarding — Voluntary Exit",
    category: "offboarding",
    status: "draft",
    updated: "Aug 28, 2025",
    tasks: [
      {
        id: "exit-interview",
        name: "Exit Interview",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 2,
        mandatory: true,
        trigger: "Auto"
      },
      {
        id: "knowledge-transfer",
        name: "Knowledge Transfer Session",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 5,
        mandatory: true,
        trigger: "Auto"
      },
      {
        id: "revoke-access",
        name: "Revoke System Access",
        type: "Checklist",
        ownerRole: "IT",
        sla: 0,
        mandatory: true,
        trigger: "Dependency"
      },
      {
        id: "collect-assets",
        name: "Collect Company Assets",
        type: "Checklist",
        ownerRole: "IT",
        sla: 0,
        mandatory: true,
        trigger: "Dependency"
      },
      {
        id: "final-pay",
        name: "Final Pay & Benefits Briefing",
        type: "General Task",
        ownerRole: "HR",
        sla: 2,
        mandatory: true,
        trigger: "Dependency"
      },
      {
        id: "clearance-form",
        name: "Clearance Form Completion",
        type: "Document Form",
        ownerRole: "HR",
        sla: 1,
        mandatory: true,
        trigger: "Dependency"
      },
      {
        id: "reference-policy",
        name: "Reference Policy Briefing",
        type: "General Task",
        ownerRole: "HR",
        sla: 1,
        mandatory: false,
        trigger: "Manual"
      },
      {
        id: "alumni-network",
        name: "Alumni Network Invitation",
        type: "General Task",
        ownerRole: "HR",
        sla: 3,
        mandatory: false,
        trigger: "Manual"
      }
    ]
  },
  {
    id: "offboarding-termination",
    name: "Offboarding — Involuntary Termination",
    category: "offboarding",
    status: "active",
    updated: "Aug 25, 2025",
    tasks: [
      {
        id: "termination-meeting",
        name: "Termination Meeting",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 0,
        mandatory: true
      },
      {
        id: "immediate-access-revoke",
        name: "Immediate System Access Revocation",
        type: "Checklist",
        ownerRole: "IT",
        sla: 0,
        mandatory: true
      },
      {
        id: "immediate-asset-collection",
        name: "Immediate Asset Collection",
        type: "Checklist",
        ownerRole: "IT",
        sla: 0,
        mandatory: true
      },
      {
        id: "final-pay-termination",
        name: "Final Pay Processing",
        type: "General Task",
        ownerRole: "HR",
        sla: 1,
        mandatory: true
      },
      {
        id: "legal-documentation",
        name: "Legal Documentation Completion",
        type: "Document Form",
        ownerRole: "HR",
        sla: 1,
        mandatory: true
      },
      {
        id: "security-escort",
        name: "Security Escort (if required)",
        type: "General Task",
        ownerRole: "Manager",
        sla: 0,
        mandatory: false
      }
    ]
  },
  {
    id: "offboarding-retirement",
    name: "Offboarding — Retirement",
    category: "offboarding",
    status: "active",
    updated: "Aug 24, 2025",
    tasks: [
      {
        id: "retirement-planning",
        name: "Retirement Planning Meeting",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 30,
        mandatory: true
      },
      {
        id: "pension-briefing",
        name: "Pension & Benefits Briefing",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 14,
        mandatory: true
      },
      {
        id: "knowledge-transfer-retirement",
        name: "Knowledge Transfer & Documentation",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 14,
        mandatory: true
      },
      {
        id: "retirement-celebration",
        name: "Retirement Celebration Event",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 7,
        mandatory: false
      },
      {
        id: "exit-interview-retirement",
        name: "Exit Interview",
        type: "Meeting/Event",
        ownerRole: "HR",
        sla: 2,
        mandatory: true
      },
      {
        id: "revoke-access-retirement",
        name: "Revoke System Access",
        type: "Checklist",
        ownerRole: "IT",
        sla: 0,
        mandatory: true
      },
      {
        id: "collect-assets-retirement",
        name: "Collect Company Assets",
        type: "Checklist",
        ownerRole: "IT",
        sla: 0,
        mandatory: true
      },
      {
        id: "final-pay-retirement",
        name: "Final Pay & Retirement Benefits",
        type: "General Task",
        ownerRole: "HR",
        sla: 1,
        mandatory: true
      },
      {
        id: "retiree-benefits",
        name: "Retiree Benefits Enrollment",
        type: "Information Form",
        ownerRole: "HR",
        sla: 3,
        mandatory: true
      },
      {
        id: "alumni-program",
        name: "Retiree Alumni Program",
        type: "General Task",
        ownerRole: "HR",
        sla: 5,
        mandatory: false
      }
    ]
  },
  {
    id: "offboarding-resignation",
    name: "Offboarding — Resignation",
    category: "offboarding",
    status: "active",
    updated: "Sep 29, 2025",
    tasks: [
      {
        id: "resignation-acceptance",
        name: "Resignation Letter Acceptance",
        type: "Document Form",
        ownerRole: "HR",
        sla: 1,
        mandatory: true
      },
      {
        id: "counter-offer",
        name: "Counter Offer Discussion (if applicable)",
        type: "Meeting/Event",
        ownerRole: "Manager",
        sla: 2,
        mandatory: false
      },
      {
        id: "transition-plan",
        name: "Transition Plan Development",
        type: "General Task",
        ownerRole: "Manager",
        sla: 3,
        mandatory: true
      }
    ]
  }
];

// Helper function to get workflows by category
export const getWorkflowsByCategory = (category: "onboarding" | "offboarding") => {
  return workflows.filter(workflow => workflow.category === category && workflow.status === "active");
};

// Helper function to get workflow by id
export const getWorkflowById = (id: string) => {
  return workflows.find(workflow => workflow.id === id);
};
