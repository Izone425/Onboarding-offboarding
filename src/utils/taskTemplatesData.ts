export interface RequiredDocument {
  id: string;
  name: string;
  description?: string;
  mandatory: boolean;
  category: "personal" | "financial" | "medical" | "legal" | "other";
}

export interface TaskTemplate {
  id: string;
  name: string;
  type: "general" | "document" | "information" | "questionnaire" | "meeting" | "system" | "asset" | "checklist";
  indicator: "onboarding" | "offboarding";
  ownerRole: string;
  sla: number;
  mandatory: boolean;
  dependencies: string[];
  lastUpdated: string;
  description?: string;
  url?: string;
  isActive?: boolean;
  requiredDocuments?: RequiredDocument[];
}

export const taskTemplates: TaskTemplate[] = [
  {
    id: "welcome-pack",
    name: "Welcome Pack",
    type: "general",
    indicator: "onboarding",
    ownerRole: "HR",
    sla: 1,
    mandatory: true,
    dependencies: [],
    lastUpdated: "2025-08-20",
    description: "Prepare and deliver a comprehensive welcome package to new employees including company policies, organizational structure, team directory, office map, and essential documents. Ensure all materials are current and personalized for the employee's role and department.",
    url: "https://intranet.company.com/onboarding/welcome-package",
    isActive: true
  },
  {
    id: "employee-handbook", 
    name: "Read Employee Handbook",
    type: "document",
    indicator: "onboarding",
    ownerRole: "Staff",
    sla: 3,
    mandatory: true,
    dependencies: ["welcome-pack"],
    lastUpdated: "2025-08-18",
    description: "Review the complete employee handbook covering company culture, policies, procedures, benefits, code of conduct, and workplace guidelines. Complete the acknowledgment form to confirm understanding of all policies and procedures.",
    url: "https://handbook.company.com/employee-guide",
    isActive: true
  },
  {
    id: "day-1-orientation",
    name: "Day 1 Orientation",
    type: "meeting",
    indicator: "onboarding", 
    ownerRole: "HR",
    sla: 0,
    mandatory: true,
    dependencies: [],
    lastUpdated: "2025-08-15",
    description: "Conduct a comprehensive first-day orientation session including company overview, mission and values presentation, workplace tour, introduction to key personnel, safety briefing, and initial paperwork completion. Schedule follow-up meetings with direct supervisor and team members.",
    url: "https://calendar.company.com/orientation-schedule",
    isActive: true
  },
  {
    id: "grant-access",
    name: "Grant Email & HRMS Access",
    type: "system",
    indicator: "onboarding",
    ownerRole: "IT",
    sla: 2,
    mandatory: true,
    dependencies: ["welcome-pack"],
    lastUpdated: "2025-08-22",
    description: "Create user accounts and grant appropriate system access including corporate email, HRMS portal, file sharing systems, and department-specific applications. Configure security settings, multi-factor authentication, and provide login credentials with initial password reset requirements.",
    url: "https://it.company.com/access-management",
    isActive: true
  },
  {
    id: "issue-assets",
    name: "Issue Laptop & ID Card",
    type: "asset",
    indicator: "onboarding",
    ownerRole: "IT", 
    sla: 1,
    mandatory: true,
    dependencies: ["grant-access"],
    lastUpdated: "2025-08-19",
    description: "Provision and configure necessary equipment including laptop with required software, employee ID card with access permissions, phone if applicable, and any role-specific tools or equipment. Complete asset tracking documentation and provide equipment usage guidelines.",
    url: "https://assets.company.com/equipment-request",
    isActive: true
  },
  {
    id: "security-quiz",
    name: "Security & Compliance Quiz",
    type: "questionnaire",
    indicator: "onboarding",
    ownerRole: "Staff",
    sla: 5,
    mandatory: true,
    dependencies: ["employee-handbook"],
    lastUpdated: "2025-08-17",
    description: "Complete mandatory security awareness and compliance training modules covering data protection, cybersecurity best practices, privacy policies, and regulatory requirements. Pass the assessment with minimum 80% score and receive certificate of completion.",
    url: "https://training.company.com/security-compliance",
    isActive: true
  },
  {
    id: "exit-interview",
    name: "Exit Interview", 
    type: "meeting",
    indicator: "offboarding",
    ownerRole: "HR",
    sla: 2,
    mandatory: true,
    dependencies: [],
    lastUpdated: "2025-08-16",
    description: "Conduct structured exit interview to gather feedback on employee experience, reasons for departure, suggestions for improvement, and knowledge transfer requirements. Document insights for organizational improvement and complete departure formalities.",
    url: "https://hr.company.com/exit-interview-form",
    isActive: true
  },
  {
    id: "revoke-collect",
    name: "Revoke Access & Collect Assets",
    type: "checklist",
    indicator: "offboarding",
    ownerRole: "IT",
    sla: 3,
    mandatory: true,
    dependencies: ["exit-interview"],
    lastUpdated: "2025-08-14",
    description: "Systematically revoke all system access including email, applications, and network permissions. Collect all company assets including laptop, ID card, access cards, mobile devices, and any other equipment. Update asset inventory and security systems accordingly.",
    url: "https://it.company.com/offboarding-checklist",
    isActive: true
  },
  {
    id: "final-pay",
    name: "Final Pay & Benefits Briefing",
    type: "general", 
    indicator: "offboarding",
    ownerRole: "HR",
    sla: 2,
    mandatory: true,
    dependencies: ["exit-interview"],
    lastUpdated: "2025-08-13",
    description: "Process final payroll including outstanding salary, unused vacation days, bonus payments, and expense reimbursements. Provide comprehensive briefing on continuing benefits, COBRA options, retirement account transfers, and reference procedures.",
    url: "https://payroll.company.com/final-settlement",
    isActive: true
  },
  {
    id: "employee-information-form",
    name: "Employee Information & Document Collection",
    type: "document",
    indicator: "onboarding",
    ownerRole: "HR",
    sla: 3,
    mandatory: true,
    dependencies: ["welcome-pack"],
    lastUpdated: "2025-08-25",
    description: "Comprehensive employee information collection form requiring personal details, emergency contacts, banking information, and essential document uploads. This form collects all necessary information for payroll setup, emergency procedures, and regulatory compliance including IC/Passport, medical certificates, and financial documents.",
    url: "https://forms.company.com/employee-information",
    isActive: true,
    requiredDocuments: [
      {
        id: "ic",
        name: "IC",
        mandatory: true,
        category: "personal"
      },
      {
        id: "passport",
        name: "Passport",
        mandatory: true,
        category: "personal"
      },
      {
        id: "medical-checkup",
        name: "Medical Checkup Report",
        mandatory: true,
        category: "medical"
      },
      {
        id: "driving-license",
        name: "Driving License",
        mandatory: false,
        category: "personal"
      },
      {
        id: "educational-certs",
        name: "Educational Certificates",
        mandatory: true,
        category: "personal"
      }
    ]
  },
  {
    id: "payroll-setup-form",
    name: "Payroll & Banking Information Setup",
    type: "information",
    indicator: "onboarding",
    ownerRole: "Staff",
    sla: 2,
    mandatory: true,
    dependencies: ["grant-access"],
    lastUpdated: "2025-08-26",
    description: "Complete your payroll setup by providing essential banking and tax information. This form collects your financial details, emergency contacts, and Malaysian compliance information including EPF and Socso numbers. All information is securely processed and used exclusively for payroll and benefits administration.",
    url: "https://payroll.company.com/employee-setup",
    isActive: true
  },
  {
    id: "employee-feedback-survey",
    name: "Employee Feedback & Satisfaction Survey",
    type: "questionnaire",
    indicator: "onboarding",
    ownerRole: "HR",
    sla: 7,
    mandatory: false,
    dependencies: ["day-1-orientation"],
    lastUpdated: "2025-08-28",
    description: "Comprehensive feedback survey to gather new employee insights about their onboarding experience, workplace satisfaction, and suggestions for improvement. This survey helps HR teams enhance the onboarding process and identify areas for organizational development.",
    url: "https://surveys.company.com/employee-feedback",
    isActive: true
  },
  {
    id: "first-week-checklist",
    name: "First Week Onboarding Checklist",
    type: "checklist",
    indicator: "onboarding",
    ownerRole: "HR",
    sla: 5,
    mandatory: true,
    dependencies: ["day-1-orientation"],
    lastUpdated: "2025-08-30",
    description: "Comprehensive checklist to ensure all essential onboarding activities are completed during the new employee's first week. Includes workstation setup verification, team introductions, initial training sessions, policy acknowledgments, and first-week feedback collection. This checklist ensures a smooth onboarding experience and helps track progress.",
    url: "https://onboarding.company.com/first-week-checklist",
    isActive: true
  }
];

// Helper function to get task templates by indicator (onboarding/offboarding)
export const getTaskTemplatesByIndicator = (indicator: "onboarding" | "offboarding") => {
  return taskTemplates.filter(template => template.indicator === indicator && template.isActive !== false);
};

// Helper function to get active task template names
export const getActiveTaskTemplateNames = (indicator?: "onboarding" | "offboarding") => {
  let templates = taskTemplates.filter(template => template.isActive !== false);
  
  if (indicator) {
    templates = templates.filter(template => template.indicator === indicator);
  }
  
  return templates.map(template => template.name);
};