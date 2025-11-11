import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
  SheetTrigger,
} from "../ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { 
  ClipboardList, 
  Plus,
  Edit,
  Copy,
  Archive,
  Filter,
  Search,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Package,
  CheckSquare,
  X,
  Save,
  Upload,
  HelpCircle,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Sparkles
} from "lucide-react";
import { taskTemplates, TaskTemplate } from "../../utils/taskTemplatesData";



interface PicklistOption {
  id: string;
  text: string;
  isCorrectAnswer?: boolean;
}

interface Question {
  id: string;
  question: string;
  responseType: "text" | "text-multiline" | "picklist-single" | "picklist-multiple";
  required: boolean;
  picklistOptions?: PicklistOption[];
}

interface SystemAccess {
  id: string;
  name: string;
  description: string;
  pic: string;
}

interface AssetItem {
  id: string;
  name: string;
  description: string;
  pic: string;
  handoverLetter: boolean;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  pic: string;
}



const typeIcons = {
  general: FileText,
  document: FileText,
  information: FileText,
  questionnaire: MessageSquare,
  meeting: Calendar,
  system: Settings,
  asset: Package,
  checklist: CheckSquare
};

const typeLabels = {
  general: "General Task",
  document: "Document Form",
  information: "Information Form",
  questionnaire: "Questionnaire", 
  meeting: "Meeting/Event",
  system: "System/Access",
  asset: "Asset",
  checklist: "Checklist"
};

const documentTypes = [
  { id: "ic", label: "IC (Identity Card)" },
  { id: "passport", label: "Passport" },
  { id: "work-permit", label: "Work Permit" },
  { id: "medical-checkup", label: "Medical Checkup Report" },
  { id: "driving-license", label: "Driving License" },
  { id: "ea-form", label: "EA Form" },
  { id: "tp3", label: "TP3" }
];

const informationFieldCategories = {
  personal: {
    title: "Personal Information",
    fields: [
      { id: "full-name", label: "Full Name" },
      { id: "email", label: "Email Address" },
      { id: "phone", label: "Phone Number" },
      { id: "date-of-birth", label: "Date of Birth" },
      { id: "nationality", label: "Nationality" },
      { id: "marital-status", label: "Marital Status" }
    ]
  },
  contact: {
    title: "Contact Information",
    fields: [
      { id: "address", label: "Home Address" },
      { id: "emergency-contact", label: "Emergency Contact" },
      { id: "emergency-phone", label: "Emergency Contact Phone" }
    ]
  },
  financial: {
    title: "Financial Information",
    fields: [
      { id: "bank-account", label: "Bank Account Number" },
      { id: "bank-name", label: "Bank Name" },
      { id: "tax-id", label: "Tax ID Number" }
    ]
  },
  payroll: {
    title: "Payroll Information",
    fields: [
      { id: "tax-identification", label: "Tax Identification Number" },
      { id: "epf-number", label: "EPF Number" },
      { id: "socso-number", label: "Socso Number" }
    ]
  }
};

// Helper function to get all predefined fields
const getAllPredefinedFields = () => {
  return Object.values(informationFieldCategories).flatMap(category => category.fields);
};

// Questionnaire configuration options
const responseTypeOptions = [
  { value: "text", label: "Text" },
  { value: "text-multiline", label: "Text (Multiple Lines)" },
  { value: "picklist-single", label: "Picklist (Single)" },
  { value: "picklist-multiple", label: "Picklist (Multiple)" }
];

// PIC (Person in Charge) options for system access
const picOptions = [
  { value: "IT Admin", label: "IT Admin" },
  { value: "System Admin", label: "System Admin" }, 
  { value: "HR Admin", label: "HR Admin" },
  { value: "Finance Admin", label: "Finance Admin" },
  { value: "Department Manager", label: "Department Manager" },
  { value: "Technical Lead", label: "Technical Lead" },
  { value: "Security Officer", label: "Security Officer" }
];

export function TaskTemplates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterIndicator, setFilterIndicator] = useState<string>("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
  const [copyFromTemplate, setCopyFromTemplate] = useState<string>("none");
  const [formData, setFormData] = useState({
    taskName: "",
    taskType: "",
    category: "",
    description: "",
    url: "",
    isActive: true
  });
  const [requiresDocumentUpload, setRequiresDocumentUpload] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [documentRequirements, setDocumentRequirements] = useState<Record<string, boolean>>({});
  const [customDocuments, setCustomDocuments] = useState<Array<{id: string, label: string}>>([]);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [selectedInformationFields, setSelectedInformationFields] = useState<string[]>([]);
  const [informationRequirements, setInformationRequirements] = useState<Record<string, boolean>>({});
  const [customInformationFields, setCustomInformationFields] = useState<Array<{id: string, label: string}>>([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);

  // Questionnaire state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // System/Access state
  const [systemAccesses, setSystemAccesses] = useState<SystemAccess[]>([]);
  const [isAddingSystem, setIsAddingSystem] = useState(false);
  const [newSystem, setNewSystem] = useState({
    name: "",
    description: "",
    pic: ""
  });

  // Asset state
  const [assetItems, setAssetItems] = useState<AssetItem[]>([]);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    description: "",
    pic: "",
    handoverLetter: false
  });

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Checklist state
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState({
    title: "",
    description: "",
    pic: ""
  });

  // Sorting handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredTemplates = taskTemplates.filter(template => {
    // Enhanced search functionality - search in name, description, and type
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      template.name.toLowerCase().includes(searchLower) ||
      (template.description && template.description.toLowerCase().includes(searchLower)) ||
      typeLabels[template.type].toLowerCase().includes(searchLower) ||
      template.ownerRole.toLowerCase().includes(searchLower);
    
    const matchesType = filterType === "all" || template.type === filterType;
    const matchesIndicator = filterIndicator === "all" || template.indicator === filterIndicator;
    
    return matchesSearch && matchesType && matchesIndicator;
  });

  // Apply sorting to filtered templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: string | number = "";
    let bValue: string | number = "";
    
    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "type":
        aValue = typeLabels[a.type].toLowerCase();
        bValue = typeLabels[b.type].toLowerCase();
        break;
      case "indicator":
        aValue = a.indicator.toLowerCase();
        bValue = b.indicator.toLowerCase();
        break;
      case "lastUpdated":
        aValue = new Date(a.lastUpdated).getTime();
        bValue = new Date(b.lastUpdated).getTime();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset document upload settings if task type changes away from document
    if (field === "taskType" && value !== "document") {
      setRequiresDocumentUpload(false);
      setSelectedDocuments([]);
      setDocumentRequirements({});
    }
    
    // Reset information fields if task type changes away from information
    if (field === "taskType" && value !== "information") {
      setSelectedInformationFields([]);
      setInformationRequirements({});
      setCustomInformationFields([]);
      setNewFieldName("");
      setIsAddingField(false);
    }
    
    // Reset questionnaire fields if task type changes away from questionnaire
    if (field === "taskType" && value !== "questionnaire") {
      setQuestions([]);
      setExpandedQuestions(new Set());
    }

    // Reset system fields if task type changes away from system
    if (field === "taskType" && value !== "system") {
      setSystemAccesses([]);
      setNewSystem({ name: "", description: "", pic: "" });
      setIsAddingSystem(false);
    }

    // Reset asset fields if task type changes away from asset
    if (field === "taskType" && value !== "asset") {
      setAssetItems([]);
      setNewAsset({ name: "", description: "", pic: "", handoverLetter: false });
      setIsAddingAsset(false);
    }

    // Reset checklist fields if task type changes away from checklist
    if (field === "taskType" && value !== "checklist") {
      setChecklistItems([]);
      setNewChecklistItem({ title: "", description: "", pic: "" });
      setIsAddingChecklistItem(false);
    }
  };

  const handleDocumentUploadToggle = (checked: boolean) => {
    setRequiresDocumentUpload(checked);
    if (!checked) {
      setSelectedDocuments([]);
      setDocumentRequirements({});
      setCustomDocuments([]);
      setNewDocumentName("");
      setIsAddingDocument(false);
      setSelectedInformationFields([]);
      setInformationRequirements({});
      setCustomInformationFields([]);
      setNewFieldName("");
      setIsAddingField(false);
    }
  };

  const handleDocumentSelection = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
      setDocumentRequirements(prev => ({
        ...prev,
        [documentId]: true // Default to compulsory (true)
      }));
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
      setDocumentRequirements(prev => {
        const newReqs = { ...prev };
        delete newReqs[documentId];
        return newReqs;
      });
    }
  };

  const handleDocumentRequirementChange = (documentId: string, isCompulsory: boolean) => {
    setDocumentRequirements(prev => ({
      ...prev,
      [documentId]: isCompulsory
    }));
  };

  const handleAddCustomDocument = () => {
    if (newDocumentName.trim()) {
      const customId = `custom-${Date.now()}`;
      const newCustomDoc = {
        id: customId,
        label: newDocumentName.trim()
      };
      
      setCustomDocuments(prev => [...prev, newCustomDoc]);
      setSelectedDocuments(prev => [...prev, customId]);
      setDocumentRequirements(prev => ({
        ...prev,
        [customId]: true // Default to compulsory
      }));
      
      setNewDocumentName("");
      setIsAddingDocument(false);
    }
  };

  const handleRemoveCustomDocument = (documentId: string) => {
    setCustomDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    setDocumentRequirements(prev => {
      const newReqs = { ...prev };
      delete newReqs[documentId];
      return newReqs;
    });
  };

  const handleInformationFieldSelection = (fieldId: string, checked: boolean) => {
    if (checked) {
      setSelectedInformationFields(prev => [...prev, fieldId]);
      setInformationRequirements(prev => ({
        ...prev,
        [fieldId]: true // Default to compulsory
      }));
    } else {
      setSelectedInformationFields(prev => prev.filter(id => id !== fieldId));
      setInformationRequirements(prev => {
        const newReqs = { ...prev };
        delete newReqs[fieldId];
        return newReqs;
      });
    }
  };

  const handleAddInformationField = () => {
    if (newFieldName.trim()) {
      const fieldId = `custom-field-${Date.now()}`;
      const newField = {
        id: fieldId,
        label: newFieldName.trim()
      };
      
      setCustomInformationFields(prev => [...prev, newField]);
      setSelectedInformationFields(prev => [...prev, fieldId]);
      setInformationRequirements(prev => ({
        ...prev,
        [fieldId]: true // Default to compulsory
      }));
      
      setNewFieldName("");
      setIsAddingField(false);
    }
  };

  const handleRemoveInformationField = (fieldId: string) => {
    setCustomInformationFields(prev => prev.filter(field => field.id !== fieldId));
    setSelectedInformationFields(prev => prev.filter(id => id !== fieldId));
    setInformationRequirements(prev => {
      const newReqs = { ...prev };
      delete newReqs[fieldId];
      return newReqs;
    });
  };

  const handleInformationRequirementChange = (fieldId: string, isCompulsory: boolean) => {
    setInformationRequirements(prev => ({
      ...prev,
      [fieldId]: isCompulsory
    }));
  };

  // System/Access handlers
  const handleAddSystem = () => {
    if (newSystem.name.trim() && newSystem.description.trim() && newSystem.pic) {
      const systemId = `system-${Date.now()}`;
      const system: SystemAccess = {
        id: systemId,
        name: newSystem.name.trim(),
        description: newSystem.description.trim(),
        pic: newSystem.pic
      };
      
      setSystemAccesses(prev => [...prev, system]);
      setNewSystem({ name: "", description: "", pic: "" });
      setIsAddingSystem(false);
    }
  };

  const handleRemoveSystem = (systemId: string) => {
    setSystemAccesses(prev => prev.filter(system => system.id !== systemId));
  };

  const handleSystemChange = (systemId: string, field: string, value: string) => {
    setSystemAccesses(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, [field]: value }
        : system
    ));
  };

  // Asset handlers
  const handleAddAsset = () => {
    if (newAsset.name.trim() && newAsset.description.trim() && newAsset.pic) {
      const assetId = `asset-${Date.now()}`;
      const asset: AssetItem = {
        id: assetId,
        name: newAsset.name.trim(),
        description: newAsset.description.trim(),
        pic: newAsset.pic,
        handoverLetter: newAsset.handoverLetter
      };
      
      setAssetItems(prev => [...prev, asset]);
      setNewAsset({ name: "", description: "", pic: "", handoverLetter: false });
      setIsAddingAsset(false);
    }
  };

  const handleRemoveAsset = (assetId: string) => {
    setAssetItems(prev => prev.filter(asset => asset.id !== assetId));
  };

  const handleAssetChange = (assetId: string, field: string, value: string | boolean) => {
    setAssetItems(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, [field]: value }
        : asset
    ));
  };

  // Checklist handlers
  const handleAddChecklistItem = () => {
    if (newChecklistItem.title.trim() && newChecklistItem.description.trim() && newChecklistItem.pic) {
      const checklistId = `checklist-${Date.now()}`;
      const checklistItem: ChecklistItem = {
        id: checklistId,
        title: newChecklistItem.title.trim(),
        description: newChecklistItem.description.trim(),
        pic: newChecklistItem.pic
      };
      
      setChecklistItems(prev => [...prev, checklistItem]);
      setNewChecklistItem({ title: "", description: "", pic: "" });
      setIsAddingChecklistItem(false);
    }
  };

  const handleRemoveChecklistItem = (checklistId: string) => {
    setChecklistItems(prev => prev.filter(item => item.id !== checklistId));
  };

  const handleChecklistItemChange = (checklistId: string, field: string, value: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === checklistId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  // Questionnaire handlers
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}-${Date.now()}`,
      question: "",
      responseType: "text",
      required: true,
      picklistOptions: []
    };
    setQuestions(prev => [...prev, newQuestion]);
    setExpandedQuestions(prev => new Set([...prev, newQuestion.id]));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  };

  const toggleQuestionExpanded = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleQuestionChange = (questionId: string, field: string, value: any) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const updatedQuestion = { ...q, [field]: value };
        
        // If changing response type to picklist, add default options
        if (field === 'responseType' && (value === 'picklist-single' || value === 'picklist-multiple')) {
          if (!updatedQuestion.picklistOptions || updatedQuestion.picklistOptions.length === 0) {
            updatedQuestion.picklistOptions = [
              { id: `opt1-${Date.now()}`, text: "Option 1", isCorrectAnswer: false },
              { id: `opt2-${Date.now()}`, text: "Option 2", isCorrectAnswer: false }
            ];
          }
        }
        
        return updatedQuestion;
      }
      return q;
    }));
  };

  const addPicklistOption = (questionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newOption = {
          id: `opt${(q.picklistOptions?.length || 0) + 1}-${Date.now()}`,
          text: `Option ${(q.picklistOptions?.length || 0) + 1}`,
          isCorrectAnswer: false
        };
        return {
          ...q,
          picklistOptions: [...(q.picklistOptions || []), newOption]
        };
      }
      return q;
    }));
  };

  const removePicklistOption = (questionId: string, optionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          picklistOptions: q.picklistOptions?.filter(opt => opt.id !== optionId) || []
        };
      }
      return q;
    }));
  };

  const handlePicklistOptionChange = (questionId: string, optionId: string, field: string, value: any) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          picklistOptions: q.picklistOptions?.map(opt => 
            opt.id === optionId ? { ...opt, [field]: value } : opt
          ) || []
        };
      }
      return q;
    }));
  };

  // AI-Assisted Question Generation
  const handleAIAssistedGeneration = () => {
    const taskName = formData.taskName.toLowerCase();
    let generatedQuestions: Question[] = [];

    // Generate questions based on task name keywords
    if (taskName.includes('security') || taskName.includes('compliance') || taskName.includes('training')) {
      generatedQuestions = [
        {
          id: `ai-q1-${Date.now()}`,
          question: "What is your understanding of data protection policies?",
          responseType: "text-multiline",
          required: true,
        },
        {
          id: `ai-q2-${Date.now()}`,
          question: "Which of the following are considered security best practices?",
          responseType: "picklist-multiple",
          required: true,
          picklistOptions: [
            { id: `ai-opt-${Date.now()}-1`, text: "Using strong passwords", isCorrectAnswer: true },
            { id: `ai-opt-${Date.now()}-2`, text: "Sharing login credentials", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-3`, text: "Regular software updates", isCorrectAnswer: true },
            { id: `ai-opt-${Date.now()}-4`, text: "Opening suspicious email attachments", isCorrectAnswer: false }
          ]
        },
        {
          id: `ai-q3-${Date.now()}`,
          question: "How would you rate your current knowledge of cybersecurity?",
          responseType: "picklist-single",
          required: true,
          picklistOptions: [
            { id: `ai-opt-${Date.now()}-5`, text: "Excellent", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-6`, text: "Good", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-7`, text: "Average", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-8`, text: "Needs Improvement", isCorrectAnswer: false }
          ]
        }
      ];
    } else if (taskName.includes('feedback') || taskName.includes('survey') || taskName.includes('satisfaction')) {
      generatedQuestions = [
        {
          id: `ai-q1-${Date.now()}`,
          question: "How would you rate your overall experience?",
          responseType: "picklist-single",
          required: true,
          picklistOptions: [
            { id: `ai-opt-${Date.now()}-1`, text: "Excellent", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-2`, text: "Very Good", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-3`, text: "Good", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-4`, text: "Fair", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-5`, text: "Poor", isCorrectAnswer: false }
          ]
        },
        {
          id: `ai-q2-${Date.now()}`,
          question: "What aspects were most helpful to you?",
          responseType: "picklist-multiple",
          required: false,
          picklistOptions: [
            { id: `ai-opt-${Date.now()}-6`, text: "Clear communication", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-7`, text: "Timely responses", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-8`, text: "Comprehensive information", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-9`, text: "Support availability", isCorrectAnswer: false }
          ]
        },
        {
          id: `ai-q3-${Date.now()}`,
          question: "Please provide any additional comments or suggestions for improvement:",
          responseType: "text-multiline",
          required: false,
        }
      ];
    } else {
      // Default generic questions
      generatedQuestions = [
        {
          id: `ai-q1-${Date.now()}`,
          question: "Please provide your feedback on this task:",
          responseType: "text-multiline",
          required: true,
        },
        {
          id: `ai-q2-${Date.now()}`,
          question: "How would you rate the clarity of instructions?",
          responseType: "picklist-single",
          required: true,
          picklistOptions: [
            { id: `ai-opt-${Date.now()}-1`, text: "Very Clear", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-2`, text: "Clear", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-3`, text: "Somewhat Clear", isCorrectAnswer: false },
            { id: `ai-opt-${Date.now()}-4`, text: "Unclear", isCorrectAnswer: false }
          ]
        }
      ];
    }

    setQuestions(prev => [...prev, ...generatedQuestions]);
    // Expand the first generated question
    if (generatedQuestions.length > 0) {
      setExpandedQuestions(prev => new Set([...prev, generatedQuestions[0].id]));
    }
  };

  // Handle edit template - populate form with realistic data
  const handleEdit = (template: TaskTemplate) => {
    // Set basic form data
    setFormData({
      taskName: template.name,
      taskType: template.type,
      category: template.indicator,
      description: template.description || "",
      url: template.url || "",
      isActive: template.isActive !== false
    });

    setEditingTemplate(template);
    setCopyFromTemplate("none");

    // Clear all states first
    setRequiresDocumentUpload(false);
    setSelectedDocuments([]);
    setDocumentRequirements({});
    setCustomDocuments([]);
    setSelectedInformationFields([]);
    setInformationRequirements({});
    setCustomInformationFields([]);
    setQuestions([]);
    setExpandedQuestions(new Set());
    setSystemAccesses([]);
    setAssetItems([]);
    setChecklistItems([]);

    // Populate realistic data based on task type
    switch (template.type) {
      case "document":
        if (template.id === "employee-handbook") {
          setRequiresDocumentUpload(true);
          setSelectedDocuments(["ic", "passport"]);
          setDocumentRequirements({
            "ic": true,
            "passport": false
          });
        } else if (template.id === "employee-information-form") {
          setRequiresDocumentUpload(true);
          setSelectedDocuments(["ic", "passport", "medical-checkup", "driving-license"]);
          setDocumentRequirements({
            "ic": true,
            "passport": true,
            "medical-checkup": true,
            "driving-license": false
          });
          setCustomDocuments([
            { id: "custom-1", label: "Educational Certificates" }
          ]);
          setSelectedDocuments(prev => [...prev, "custom-1"]);
          setDocumentRequirements(prev => ({ ...prev, "custom-1": false }));
        }
        break;

      case "information":
        if (template.id === "payroll-setup-form") {
          setSelectedInformationFields([
            "full-name", "email", "phone", "address", 
            "emergency-contact", "emergency-phone",
            "bank-account", "bank-name", "tax-identification", 
            "epf-number", "socso-number"
          ]);
          setInformationRequirements({
            "full-name": true,
            "email": true,
            "phone": true,
            "address": true,
            "emergency-contact": true,
            "emergency-phone": true,
            "bank-account": true,
            "bank-name": true,
            "tax-identification": true,
            "epf-number": true,
            "socso-number": true
          });
          setCustomInformationFields([
            { id: "custom-field-1", label: "Preferred Name" },
            { id: "custom-field-2", label: "Department" }
          ]);
          setSelectedInformationFields(prev => [...prev, "custom-field-1", "custom-field-2"]);
          setInformationRequirements(prev => ({ 
            ...prev, 
            "custom-field-1": false,
            "custom-field-2": true
          }));
        }
        break;

      case "questionnaire":
        if (template.id === "security-quiz") {
          setQuestions([
            {
              id: "q1",
              question: "What is the company's policy on password requirements?",
              responseType: "picklist-single",
              required: true,
              picklistOptions: [
                { id: "opt1", text: "At least 8 characters with mixed case", isCorrectAnswer: true },
                { id: "opt2", text: "Any combination is acceptable", isCorrectAnswer: false },
                { id: "opt3", text: "Only numbers are required", isCorrectAnswer: false },
                { id: "opt4", text: "Passwords are optional", isCorrectAnswer: false }
              ]
            },
            {
              id: "q2",
              question: "Which of the following are considered security threats?",
              responseType: "picklist-multiple",
              required: true,
              picklistOptions: [
                { id: "opt5", text: "Phishing emails", isCorrectAnswer: true },
                { id: "opt6", text: "USB drives from unknown sources", isCorrectAnswer: true },
                { id: "opt7", text: "Regular software updates", isCorrectAnswer: false },
                { id: "opt8", text: "Using company wifi", isCorrectAnswer: false }
              ]
            },
            {
              id: "q3",
              question: "Describe a situation where you would report a security incident.",
              responseType: "text-multiline",
              required: true
            }
          ]);
          setExpandedQuestions(new Set(["q1"]));
        } else if (template.id === "employee-feedback-survey") {
          setQuestions([
            {
              id: "q1",
              question: "How would you rate your overall onboarding experience?",
              responseType: "picklist-single",
              required: true,
              picklistOptions: [
                { id: "opt1", text: "Excellent", isCorrectAnswer: false },
                { id: "opt2", text: "Very Good", isCorrectAnswer: false },
                { id: "opt3", text: "Good", isCorrectAnswer: false },
                { id: "opt4", text: "Fair", isCorrectAnswer: false },
                { id: "opt5", text: "Poor", isCorrectAnswer: false }
              ]
            },
            {
              id: "q2",
              question: "Which aspects of onboarding were most helpful?",
              responseType: "picklist-multiple",
              required: true,
              picklistOptions: [
                { id: "opt6", text: "Welcome orientation session", isCorrectAnswer: false },
                { id: "opt7", text: "Team introductions", isCorrectAnswer: false },
                { id: "opt8", text: "Documentation provided", isCorrectAnswer: false },
                { id: "opt9", text: "System access setup", isCorrectAnswer: false }
              ]
            },
            {
              id: "q3",
              question: "What suggestions do you have for improving the onboarding process?",
              responseType: "text-multiline",
              required: false
            }
          ]);
        }
        break;

      case "system":
        if (template.id === "grant-access") {
          setSystemAccesses([
            {
              id: "sys1",
              name: "Corporate Email (Outlook)",
              description: "Set up company email account with proper security settings and distribution lists",
              pic: "IT Admin"
            },
            {
              id: "sys2", 
              name: "HRMS Portal Access",
              description: "Configure access to HR management system for timesheet, leave requests, and personal information updates",
              pic: "HR Admin"
            },
            {
              id: "sys3",
              name: "File Sharing System (SharePoint)",
              description: "Provide access to departmental folders and collaborative workspaces with appropriate permissions",
              pic: "IT Admin"
            }
          ]);
        }
        break;

      case "asset":
        if (template.id === "issue-assets") {
          setAssetItems([
            {
              id: "asset1",
              name: "Laptop Computer",
              description: "Business laptop with Windows 11, Microsoft Office suite, and essential software pre-installed",
              pic: "IT Admin",
              handoverLetter: true
            },
            {
              id: "asset2",
              name: "Employee ID Card",
              description: "Photo ID card with building access permissions and employee identification number",
              pic: "HR Admin",
              handoverLetter: false
            },
            {
              id: "asset3",
              name: "Mobile Phone (if applicable)",
              description: "Company mobile device for employees requiring mobility or client communication",
              pic: "IT Admin",
              handoverLetter: true
            }
          ]);
        }
        break;

      case "checklist":
        if (template.id === "revoke-collect") {
          setChecklistItems([
            {
              id: "check1",
              title: "Revoke Email Access",
              description: "Disable email account and redirect messages to supervisor or team lead",
              pic: "IT Admin"
            },
            {
              id: "check2",
              title: "Collect Company Laptop",
              description: "Retrieve laptop, charger, and any accessories. Ensure data backup if needed",
              pic: "IT Admin"
            },
            {
              id: "check3",
              title: "Collect Employee ID Card",
              description: "Retrieve ID card and disable building access permissions",
              pic: "Security Officer"
            },
            {
              id: "check4",
              title: "Revoke System Access",
              description: "Remove access to all company systems, applications, and shared drives",
              pic: "System Admin"
            },
            {
              id: "check5",
              title: "Update Asset Inventory",
              description: "Update asset tracking system to reflect returned equipment and access revocations",
              pic: "IT Admin"
            }
          ]);
        }
        break;
    }

    setIsDrawerOpen(true);
  };

  // Handle copy template from dropdown
  const handleCopyFromTemplate = (templateId: string) => {
    setCopyFromTemplate(templateId);
    
    if (templateId !== "none") {
      const template = taskTemplates.find(t => t.id === templateId);
      if (template) {
        // Call handleEdit to populate all the form data
        handleEdit(template);
        // Reset editing template since this is for copying, not editing
        setEditingTemplate(null);
        // Clear the form name so user has to enter new name
        setFormData(prev => ({ ...prev, taskName: "" }));
      }
    } else {
      // Reset all form data when selecting "Start from scratch"
      setFormData({
        taskName: "",
        taskType: "",
        category: "",
        description: "",
        url: "",
        isActive: true
      });
      setRequiresDocumentUpload(false);
      setSelectedDocuments([]);
      setDocumentRequirements({});
      setCustomDocuments([]);
      setSelectedInformationFields([]);
      setInformationRequirements({});
      setCustomInformationFields([]);
      setQuestions([]);
      setExpandedQuestions(new Set());
      setSystemAccesses([]);
      setAssetItems([]);
      setChecklistItems([]);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", {
      formData,
      requiresDocumentUpload,
      selectedDocuments,
      documentRequirements,
      customDocuments,
      selectedInformationFields,
      informationRequirements,
      customInformationFields,
      questions,
      systemAccesses,
      assetItems,
      checklistItems
    });
    setIsDrawerOpen(false);
  };

  const handleReset = () => {
    setFormData({
      taskName: "",
      taskType: "",
      category: "",
      description: "",
      url: "",
      isActive: true
    });
    setRequiresDocumentUpload(false);
    setSelectedDocuments([]);
    setDocumentRequirements({});
    setCustomDocuments([]);
    setSelectedInformationFields([]);
    setInformationRequirements({});
    setCustomInformationFields([]);
    setQuestions([]);
    setExpandedQuestions(new Set());
    setSystemAccesses([]);
    setAssetItems([]);
    setChecklistItems([]);
    setEditingTemplate(null);
    setCopyFromTemplate("none");
    setNewDocumentName("");
    setIsAddingDocument(false);
    setNewFieldName("");
    setIsAddingField(false);
    setNewSystem({ name: "", description: "", pic: "" });
    setIsAddingSystem(false);
    setNewAsset({ name: "", description: "", pic: "", handoverLetter: false });
    setIsAddingAsset(false);
    setNewChecklistItem({ title: "", description: "", pic: "" });
    setIsAddingChecklistItem(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900">Task Templates</h1>
        <p className="text-gray-600">
          Configure reusable task templates for onboarding and offboarding workflows. Create templates with specific requirements, documents, and settings.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Filters */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="information">Information</SelectItem>
              <SelectItem value="questionnaire">Questionnaire</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="checklist">Checklist</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterIndicator} onValueChange={setFilterIndicator}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="offboarding">Offboarding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleReset}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-4xl">
            <SheetHeader className="border-b border-gray-200 pb-4">
              <SheetTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                {editingTemplate ? "Edit Task Template" : "Create New Task Template"}
              </SheetTitle>
              <SheetDescription>
                {editingTemplate 
                  ? "Edit the selected task template with its specific settings and requirements."
                  : "Design a new task template with specific requirements, documents, and configuration settings."
                }
              </SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-8 max-h-[calc(100vh-180px)] overflow-y-auto py-[21px] px-[14px]">
              {/* Copy Template From - Only show when creating new template */}
              {!editingTemplate && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="copyFrom">Copy Template From</Label>
                    <Select value={copyFromTemplate} onValueChange={handleCopyFromTemplate}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select template to copy (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Start from scratch</SelectItem>
                        {taskTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={
                                  template.indicator === "onboarding" 
                                    ? "bg-blue-100 text-blue-800 border-blue-200" 
                                    : "bg-red-100 text-red-800 border-red-200"
                                }
                              >
                                {template.indicator}
                              </Badge>
                              <span>{template.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select an existing template to copy its settings and description as a starting point
                    </p>
                  </div>
                </div>
              )}

              {/* Task Basic Information */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskName">Task Name *</Label>
                    <Input
                      id="taskName"
                      placeholder="Enter a descriptive task name"
                      value={formData.taskName}
                      onChange={(e) => handleInputChange("taskName", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="taskType">Task Type *</Label>
                      <Select value={formData.taskType} onValueChange={(value) => handleInputChange("taskType", value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Task</SelectItem>
                          <SelectItem value="document">Document Form</SelectItem>
                          <SelectItem value="information">Information Form</SelectItem>
                          <SelectItem value="questionnaire">Questionnaire</SelectItem>
                          <SelectItem value="meeting">Meeting/Event</SelectItem>
                          <SelectItem value="system">System/Access</SelectItem>
                          <SelectItem value="asset">Asset</SelectItem>
                          <SelectItem value="checklist">Checklist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onboarding">Onboarding</SelectItem>
                          <SelectItem value="offboarding">Offboarding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of what this task involves, including any specific instructions or requirements..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Detailed descriptions help users understand task requirements
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL/Link</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/resources"
                      value={formData.url}
                      onChange={(e) => handleInputChange("url", e.target.value)}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Add a relevant URL or link for this task (documentation, forms, training materials, etc.)
                    </p>
                  </div>

                  {/* Information Fields Settings - Only show for Information Form task type */}
                  {formData.taskType === "information" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <Label>Information Fields</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Define what information users need to provide for this task
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <Label>Required Information</Label>
                        <p className="text-sm text-muted-foreground">
                          Select which information fields users need to complete for this task
                        </p>
                        {/* Information Field Categories */}
                        <div className="space-y-4">
                          {Object.entries(informationFieldCategories).map(([categoryKey, category]) => (
                            <div key={categoryKey} className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                                {category.title}
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {category.fields.map((field) => (
                                  <div key={field.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field.id}
                                      checked={selectedInformationFields.includes(field.id)}
                                      onCheckedChange={(checked) => 
                                        handleInformationFieldSelection(field.id, checked as boolean)
                                      }
                                    />
                                    <Label
                                      htmlFor={field.id}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {field.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {/* Custom Fields Section */}
                          {customInformationFields.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                                Custom Fields
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {customInformationFields.map((field) => (
                                  <div key={field.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field.id}
                                      checked={selectedInformationFields.includes(field.id)}
                                      onCheckedChange={(checked) => 
                                        handleInformationFieldSelection(field.id, checked as boolean)
                                      }
                                    />
                                    <Label
                                      htmlFor={field.id}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                    >
                                      {field.label}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2 h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleRemoveInformationField(field.id);
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Add Information Field */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {!isAddingField ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsAddingField(true)}
                              className="text-sm"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Custom Field
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Enter field name (e.g., Full Name, Phone Number)"
                                value={newFieldName}
                                onChange={(e) => setNewFieldName(e.target.value)}
                                className="h-8 text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddInformationField();
                                  } else if (e.key === 'Escape') {
                                    setIsAddingField(false);
                                    setNewFieldName("");
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={handleAddInformationField}
                                disabled={!newFieldName.trim()}
                                className="h-8 px-2"
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsAddingField(false);
                                  setNewFieldName("");
                                }}
                                className="h-8 px-2"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {selectedInformationFields.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium text-gray-700">Information Requirements</Label>
                              <p className="text-xs text-muted-foreground">
                                {selectedInformationFields.length} field{selectedInformationFields.length !== 1 ? 's' : ''} selected
                              </p>
                            </div>
                            <div className="space-y-2">
                              {selectedInformationFields.map(fieldId => {
                                const field = [...getAllPredefinedFields(), ...customInformationFields].find(f => f.id === fieldId);
                                return (
                                  <div key={fieldId} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${informationRequirements[fieldId] !== false ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                      <span className="text-sm font-medium">{field?.label}</span>
                                      {fieldId.startsWith('custom-field-') && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveInformationField(fieldId);
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className={`text-sm ${informationRequirements[fieldId] !== false ? 'text-muted-foreground' : 'text-green-600 font-medium'}`}>
                                        Optional
                                      </span>
                                      <Switch
                                        checked={informationRequirements[fieldId] !== false} // Default to true (compulsory)
                                        onCheckedChange={(checked) => 
                                          handleInformationRequirementChange(fieldId, checked)
                                        }
                                      />
                                      <span className={`text-sm ${informationRequirements[fieldId] !== false ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                                        Compulsory
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border border-blue-200">
                              <p><span className="font-medium">Toggle switch:</span> ON = Compulsory (users must provide), OFF = Optional (users can choose)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Document Upload Settings - Only show for Document Form task type */}
                  {formData.taskType === "document" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4 text-blue-600" />
                            <Label htmlFor="documentUpload">Document to be Uploaded</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Enable if this task requires users to upload documents
                          </p>
                        </div>
                        <Switch
                          id="documentUpload"
                          checked={requiresDocumentUpload}
                          onCheckedChange={handleDocumentUploadToggle}
                        />
                      </div>

                      {/* Document Type Selection */}
                      {requiresDocumentUpload && (
                        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <Label>Required Documents</Label>
                          <p className="text-sm text-muted-foreground">
                            Select which documents users need to upload for this task
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {[...documentTypes, ...customDocuments].map((doc) => (
                              <div key={doc.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={doc.id}
                                  checked={selectedDocuments.includes(doc.id)}
                                  onCheckedChange={(checked) => 
                                    handleDocumentSelection(doc.id, checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={doc.id}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                >
                                  {doc.label}
                                  {doc.id.startsWith('custom-') && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-2 h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveCustomDocument(doc.id);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                          
                          {/* Add Custom Document */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            {!isAddingDocument ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddingDocument(true)}
                                className="text-sm"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Custom Document
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Enter document name"
                                  value={newDocumentName}
                                  onChange={(e) => setNewDocumentName(e.target.value)}
                                  className="h-8 text-sm"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddCustomDocument();
                                    } else if (e.key === 'Escape') {
                                      setIsAddingDocument(false);
                                      setNewDocumentName("");
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={handleAddCustomDocument}
                                  disabled={!newDocumentName.trim()}
                                  className="h-8 px-2"
                                >
                                  <Save className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setIsAddingDocument(false);
                                    setNewDocumentName("");
                                  }}
                                  className="h-8 px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {selectedDocuments.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="font-medium text-gray-700">Document Requirements</Label>
                                <p className="text-xs text-muted-foreground">
                                  {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                                </p>
                              </div>
                              <div className="space-y-2">
                                {selectedDocuments.map(documentId => {
                                  const document = [...documentTypes, ...customDocuments].find(doc => doc.id === documentId);
                                  return (
                                    <div key={documentId} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${documentRequirements[documentId] !== false ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <span className="text-sm font-medium">{document?.label}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className={`text-sm ${documentRequirements[documentId] !== false ? 'text-muted-foreground' : 'text-green-600 font-medium'}`}>
                                          Optional
                                        </span>
                                        <Switch
                                          checked={documentRequirements[documentId] !== false} // Default to true (compulsory)
                                          onCheckedChange={(checked) => 
                                            handleDocumentRequirementChange(documentId, checked)
                                          }
                                        />
                                        <span className={`text-sm ${documentRequirements[documentId] !== false ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                                          Compulsory
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border border-blue-200">
                                <p><span className="font-medium">Toggle switch:</span> ON = Compulsory (users must upload), OFF = Optional (users can choose)</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* System/Access Configuration - Only show for System/Access task type */}
                  {formData.taskType === "system" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-purple-600" />
                            <Label>System & Application Access</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Configure which systems and applications need to be set up for this task
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label>Systems to Configure</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingSystem(true)}
                            className="text-sm"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add System/Application
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Add systems and applications that need to be configured or accessed for this task
                        </p>

                        {/* Add New System Form */}
                        {isAddingSystem && (
                          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Add New System/Application</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsAddingSystem(false);
                                  setNewSystem({ name: "", description: "", pic: "" });
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label htmlFor="systemName" className="text-sm font-medium">System/Application Name *</Label>
                                <Input
                                  id="systemName"
                                  placeholder="e.g., Company Email, HRMS, Zoho CRM"
                                  value={newSystem.name}
                                  onChange={(e) => setNewSystem(prev => ({ ...prev, name: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="systemDescription" className="text-sm font-medium">Description *</Label>
                                <Textarea
                                  id="systemDescription"
                                  placeholder="Brief description of what access/setup is required..."
                                  value={newSystem.description}
                                  onChange={(e) => setNewSystem(prev => ({ ...prev, description: e.target.value }))}
                                  rows={3}
                                  className="mt-1 resize-none"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="systemPIC" className="text-sm font-medium">Person In Charge (PIC) *</Label>
                                <Select
                                  value={newSystem.pic}
                                  onValueChange={(value) => setNewSystem(prev => ({ ...prev, pic: value }))}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select PIC responsible for this system" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {picOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsAddingSystem(false);
                                  setNewSystem({ name: "", description: "", pic: "" });
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleAddSystem}
                                disabled={!newSystem.name.trim() || !newSystem.description.trim() || !newSystem.pic}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Add System
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Systems List */}
                        {systemAccesses.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium text-gray-700">Configured Systems</Label>
                              <p className="text-xs text-muted-foreground">
                                {systemAccesses.length} system{systemAccesses.length !== 1 ? 's' : ''} configured
                              </p>
                            </div>
                            
                            <div className="space-y-3">
                              {systemAccesses.map((system, index) => (
                                <div key={system.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          #{index + 1}
                                        </Badge>
                                        <div className="flex-1">
                                          <Input
                                            value={system.name}
                                            onChange={(e) => handleSystemChange(system.id, 'name', e.target.value)}
                                            className="font-medium"
                                            placeholder="System/Application name"
                                          />
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Textarea
                                          value={system.description}
                                          onChange={(e) => handleSystemChange(system.id, 'description', e.target.value)}
                                          placeholder="Description of access/setup required..."
                                          rows={2}
                                          className="resize-none"
                                        />
                                      </div>
                                      
                                      <div>
                                        <Select
                                          value={system.pic}
                                          onValueChange={(value) => handleSystemChange(system.id, 'pic', value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select PIC" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {picOptions.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Settings className="w-3 h-3" />
                                        <span>Assigned to: <strong>{system.pic}</strong></span>
                                      </div>
                                    </div>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveSystem(system.id)}
                                      className="ml-3 h-8 w-8 p-0 text-destructive hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border border-blue-200">
                              <p><span className="font-medium">Example:</span> For "Onboarding for HR implementer" task, you might add: Company Email → HRMS → Zoho CRM, each with specific setup requirements and assigned PICs.</p>
                            </div>
                          </div>
                        )}

                        {systemAccesses.length === 0 && !isAddingSystem && (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Settings className="w-6 h-6" />
                            </div>
                            <p className="font-medium">No systems configured yet</p>
                            <p className="text-sm mt-1">Click "Add System/Application" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Asset Configuration - Only show for Asset task type */}
                  {formData.taskType === "asset" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-orange-600" />
                            <Label>Asset Management</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Configure which assets need to be issued or collected for this task
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label>Assets to Manage</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingAsset(true)}
                            className="text-sm"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Asset
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Add assets that need to be issued to employees or collected during this task
                        </p>

                        {/* Add New Asset Form */}
                        {isAddingAsset && (
                          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Add New Asset</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsAddingAsset(false);
                                  setNewAsset({ name: "", description: "", pic: "", handoverLetter: false });
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label htmlFor="assetName" className="text-sm font-medium">Asset Name *</Label>
                                <Input
                                  id="assetName"
                                  placeholder="e.g., Laptop Computer, Employee ID Card, Mobile Phone"
                                  value={newAsset.name}
                                  onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="assetDescription" className="text-sm font-medium">Description *</Label>
                                <Textarea
                                  id="assetDescription"
                                  placeholder="Brief description of the asset and any special instructions..."
                                  value={newAsset.description}
                                  onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
                                  rows={3}
                                  className="mt-1 resize-none"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="assetPIC" className="text-sm font-medium">Person In Charge (PIC) *</Label>
                                <Select
                                  value={newAsset.pic}
                                  onValueChange={(value) => setNewAsset(prev => ({ ...prev, pic: value }))}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select PIC responsible for this asset" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {/* Department Section */}
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                                      Department
                                    </div>
                                    <SelectItem value="dept-hr">Human Resources</SelectItem>
                                    <SelectItem value="dept-it">Information Technology</SelectItem>
                                    <SelectItem value="dept-finance">Finance & Accounting</SelectItem>
                                    <SelectItem value="dept-operations">Operations</SelectItem>
                                    <SelectItem value="dept-marketing">Marketing</SelectItem>
                                    <SelectItem value="dept-sales">Sales</SelectItem>
                                    
                                    {/* Designation Section */}
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mt-2">
                                      Designation
                                    </div>
                                    <SelectItem value="desig-manager">Manager</SelectItem>
                                    <SelectItem value="desig-supervisor">Supervisor</SelectItem>
                                    <SelectItem value="desig-coordinator">Coordinator</SelectItem>
                                    <SelectItem value="desig-specialist">Specialist</SelectItem>
                                    <SelectItem value="desig-admin">Admin</SelectItem>
                                    <SelectItem value="desig-executive">Executive</SelectItem>
                                    
                                    {/* Employee Section */}
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mt-2">
                                      Employee
                                    </div>
                                    <SelectItem value="emp-sarah-ahmad">Sarah Ahmad (HR Admin)</SelectItem>
                                    <SelectItem value="emp-michael-chen">Michael Chen (HR Coordinator)</SelectItem>
                                    <SelectItem value="emp-david-kim">David Kim (IT Admin)</SelectItem>
                                    <SelectItem value="emp-emily-rodriguez">Emily Rodriguez (Manager)</SelectItem>
                                    <SelectItem value="emp-james-wilson">James Wilson (Finance Admin)</SelectItem>
                                    <SelectItem value="emp-lisa-patel">Lisa Patel (Operations Coordinator)</SelectItem>
                                    <SelectItem value="emp-john-smith">John Smith (IT Specialist)</SelectItem>
                                    <SelectItem value="emp-maria-garcia">Maria Garcia (Marketing Executive)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="space-y-0.5">
                                  <Label htmlFor="handoverLetter" className="text-sm font-medium">Upload Hand-over Letter</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Enable if this asset requires a hand-over letter to be uploaded
                                  </p>
                                </div>
                                <Switch
                                  id="handoverLetter"
                                  checked={newAsset.handoverLetter}
                                  onCheckedChange={(checked) => setNewAsset(prev => ({ ...prev, handoverLetter: checked }))}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsAddingAsset(false);
                                  setNewAsset({ name: "", description: "", pic: "", handoverLetter: false });
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleAddAsset}
                                disabled={!newAsset.name.trim() || !newAsset.description.trim() || !newAsset.pic}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Add Asset
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Assets List */}
                        {assetItems.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium text-gray-700">Configured Assets</Label>
                              <p className="text-xs text-muted-foreground">
                                {assetItems.length} asset{assetItems.length !== 1 ? 's' : ''} configured
                              </p>
                            </div>
                            
                            <div className="space-y-3">
                              {assetItems.map((asset, index) => (
                                <div key={asset.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          #{index + 1}
                                        </Badge>
                                        <div className="flex-1">
                                          <Input
                                            value={asset.name}
                                            onChange={(e) => handleAssetChange(asset.id, 'name', e.target.value)}
                                            className="font-medium"
                                            placeholder="Asset name"
                                          />
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Textarea
                                          value={asset.description}
                                          onChange={(e) => handleAssetChange(asset.id, 'description', e.target.value)}
                                          placeholder="Description of the asset and instructions..."
                                          rows={2}
                                          className="resize-none"
                                        />
                                      </div>
                                      
                                      <div>
                                        <Select
                                          value={asset.pic}
                                          onValueChange={(value) => handleAssetChange(asset.id, 'pic', value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select PIC" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {picOptions.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="space-y-0.5">
                                          <Label className="text-sm font-medium">Upload Hand-over Letter</Label>
                                          <p className="text-xs text-muted-foreground">
                                            {asset.handoverLetter ? "Hand-over letter required" : "No hand-over letter needed"}
                                          </p>
                                        </div>
                                        <Switch
                                          checked={asset.handoverLetter}
                                          onCheckedChange={(checked) => handleAssetChange(asset.id, 'handoverLetter', checked)}
                                        />
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Package className="w-3 h-3" />
                                        <span>Assigned to: <strong>{asset.pic}</strong></span>
                                        {asset.handoverLetter && (
                                          <>
                                            <span className="mx-1">•</span>
                                            <Upload className="w-3 h-3" />
                                            <span>Hand-over letter required</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveAsset(asset.id)}
                                      className="ml-3 h-8 w-8 p-0 text-destructive hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border border-blue-200">
                              <p><span className="font-medium">Example:</span> For onboarding, you might add: Laptop Computer → Employee ID Card → Mobile Phone, each with specific setup requirements, assigned PICs, and hand-over letter requirements.</p>
                            </div>
                          </div>
                        )}

                        {assetItems.length === 0 && !isAddingAsset && (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Package className="w-6 h-6" />
                            </div>
                            <p className="font-medium">No assets configured yet</p>
                            <p className="text-sm mt-1">Click "Add Asset" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Checklist Configuration - Only show for Checklist task type */}
                  {formData.taskType === "checklist" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-teal-600" />
                            <Label>Checklist Management</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Configure checklist items that need to be completed for this task
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label>Checklist Items</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingChecklistItem(true)}
                            className="text-sm"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Checklist Item
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Add checklist items that need to be completed and assign a Person in Charge (PIC) for each item
                        </p>

                        {/* Add New Checklist Item Form */}
                        {isAddingChecklistItem && (
                          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Add New Checklist Item</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsAddingChecklistItem(false);
                                  setNewChecklistItem({ title: "", description: "", pic: "" });
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label htmlFor="checklistTitle" className="text-sm font-medium">Checklist Item Title *</Label>
                                <Input
                                  id="checklistTitle"
                                  placeholder="e.g., Complete security clearance, Submit required documents"
                                  value={newChecklistItem.title}
                                  onChange={(e) => setNewChecklistItem(prev => ({ ...prev, title: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="checklistDescription" className="text-sm font-medium">Description *</Label>
                                <Textarea
                                  id="checklistDescription"
                                  placeholder="Detailed description of what needs to be completed for this checklist item..."
                                  value={newChecklistItem.description}
                                  onChange={(e) => setNewChecklistItem(prev => ({ ...prev, description: e.target.value }))}
                                  rows={3}
                                  className="mt-1 resize-none"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="checklistPIC" className="text-sm font-medium">Person In Charge (PIC) *</Label>
                                <Select
                                  value={newChecklistItem.pic}
                                  onValueChange={(value) => setNewChecklistItem(prev => ({ ...prev, pic: value }))}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select PIC responsible for this checklist item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {picOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsAddingChecklistItem(false);
                                  setNewChecklistItem({ title: "", description: "", pic: "" });
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleAddChecklistItem}
                                disabled={!newChecklistItem.title.trim() || !newChecklistItem.description.trim() || !newChecklistItem.pic}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Add Item
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Checklist Items List */}
                        {checklistItems.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium text-gray-700">Configured Checklist Items</Label>
                              <p className="text-xs text-muted-foreground">
                                {checklistItems.length} item{checklistItems.length !== 1 ? 's' : ''} configured
                              </p>
                            </div>
                            
                            <div className="space-y-3">
                              {checklistItems.map((item, index) => (
                                <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          #{index + 1}
                                        </Badge>
                                        <div className="flex-1">
                                          <Input
                                            value={item.title}
                                            onChange={(e) => handleChecklistItemChange(item.id, 'title', e.target.value)}
                                            className="font-medium"
                                            placeholder="Checklist item title"
                                          />
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Textarea
                                          value={item.description}
                                          onChange={(e) => handleChecklistItemChange(item.id, 'description', e.target.value)}
                                          placeholder="Description of what needs to be completed..."
                                          rows={2}
                                          className="resize-none"
                                        />
                                      </div>
                                      
                                      <div>
                                        <Select
                                          value={item.pic}
                                          onValueChange={(value) => handleChecklistItemChange(item.id, 'pic', value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select PIC" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {picOptions.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckSquare className="w-3 h-3" />
                                        <span>Assigned to: <strong>{item.pic}</strong></span>
                                      </div>
                                    </div>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveChecklistItem(item.id)}
                                      className="ml-3 h-8 w-8 p-0 text-destructive hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border border-blue-200">
                              <p><span className="font-medium">Example:</span> For "Employee Exit Process" checklist, you might add: "Complete security clearance" → "Return company property" → "Submit final documentation", each with specific requirements and assigned PICs.</p>
                            </div>
                          </div>
                        )}

                        {checklistItems.length === 0 && !isAddingChecklistItem && (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckSquare className="w-6 h-6" />
                            </div>
                            <p className="font-medium">No checklist items configured yet</p>
                            <p className="text-sm mt-1">Click "Add Checklist Item" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Questionnaire section */}
                  {formData.taskType === "questionnaire" && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                              <HelpCircle className="w-4 h-4 text-slate-700" />
                            </div>
                            <div>
                              <CardTitle>Questions</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Add and configure questions for your questionnaire
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                            {questions.length} questions
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Add Question Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                            onClick={handleAddQuestion}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                          </Button>
                          <Button
                            variant="outline"
                            className="border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-primary hover:text-primary"
                            onClick={handleAIAssistedGeneration}
                            disabled={!formData.taskName.trim()}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Assisted
                          </Button>
                        </div>
                        
                        {!formData.taskName.trim() && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                              <strong>Note:</strong> Enter a task name first to enable AI-assisted question generation. The AI will analyze your task name and create relevant questions automatically.
                            </p>
                          </div>
                        )}

                        {/* Questions List */}
                        <div className="space-y-3">
                          {questions.map((question, index) => (
                            <Card key={question.id} className="border border-slate-200">
                              <Collapsible
                                open={expandedQuestions.has(question.id)}
                                onOpenChange={() => toggleQuestionExpanded(question.id)}
                              >
                                <CollapsibleTrigger asChild>
                                  <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                        <Badge variant="outline" className="text-xs">
                                          Q{index + 1}
                                        </Badge>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">
                                          {question.question || `Question ${index + 1}`}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="secondary" className="text-xs">
                                            {responseTypeOptions.find(opt => opt.value === question.responseType)?.label}
                                          </Badge>
                                          <Badge variant={question.required ? "default" : "secondary"} className="text-xs">
                                            {question.required ? "Required" : "Optional"}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteQuestion(question.id);
                                        }}
                                        className="h-8 w-8 p-0 text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                      {expandedQuestions.has(question.id) ? (
                                        <ChevronUp className="w-4 h-4" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4" />
                                      )}
                                    </div>
                                  </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                      <div>
                                        <Label className="text-sm font-medium mb-2 block">Response Type</Label>
                                        <Select
                                          value={question.responseType}
                                          onValueChange={(value) => handleQuestionChange(question.id, 'responseType', value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {responseTypeOptions.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label className="text-sm font-medium mb-2 block">Required</Label>
                                        <div className="flex items-center gap-2 mt-2">
                                          <Switch
                                            checked={question.required}
                                            onCheckedChange={(checked) => handleQuestionChange(question.id, 'required', checked)}
                                          />
                                          <Label className="text-sm text-muted-foreground">
                                            {question.required ? "Required" : "Optional"}
                                          </Label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <Label className="text-sm font-medium mb-2 block">Question</Label>
                                      {question.responseType === 'text-multiline' ? (
                                        <Textarea
                                          value={question.question}
                                          onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                                          placeholder="Enter your question here..."
                                          className="resize-none"
                                          rows={3}
                                        />
                                      ) : (
                                        <Input
                                          value={question.question}
                                          onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                                          placeholder="Enter your question here..."
                                        />
                                      )}
                                    </div>

                                    {/* Picklist Options Section */}
                                    {(question.responseType === 'picklist-single' || question.responseType === 'picklist-multiple') && (
                                      <div className="mt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <Label className="text-sm font-medium">Answer Options</Label>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addPicklistOption(question.id)}
                                            className="h-8"
                                          >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add Option
                                          </Button>
                                        </div>
                                        
                                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                          <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                                            <strong>Note:</strong> For questionnaires with scoring, check the correct answer option(s).
                                            {question.responseType === 'picklist-single' && (
                                              <span className="block mt-1">
                                                <strong>Single Selection:</strong> Users can only select one option.
                                              </span>
                                            )}
                                            {question.responseType === 'picklist-multiple' && (
                                              <span className="block mt-1">
                                                <strong>Multiple Selection:</strong> Users can select multiple options.
                                              </span>
                                            )}
                                          </p>
                                        </div>

                                        <div className="space-y-3">
                                          {question.picklistOptions?.map((option, optionIndex) => (
                                            <div key={option.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                              <div className="flex items-start gap-3">
                                                <div className="flex items-center gap-2 mt-1">
                                                  <Checkbox
                                                    checked={option.isCorrectAnswer || false}
                                                    onCheckedChange={(checked) => 
                                                      handlePicklistOptionChange(question.id, option.id, 'isCorrectAnswer', !!checked)
                                                    }
                                                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                  />
                                                  <span className="text-xs text-green-600 dark:text-green-400">
                                                    {option.isCorrectAnswer ? '✓ Correct' : 'Correct'}
                                                  </span>
                                                </div>
                                                <div className="flex-1">
                                                  <Input
                                                    value={option.text}
                                                    onChange={(e) => handlePicklistOptionChange(question.id, option.id, 'text', e.target.value)}
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                  />
                                                </div>
                                                {question.picklistOptions && question.picklistOptions.length > 2 && (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePicklistOption(question.id, option.id)}
                                                    className="h-8 w-8 p-0 text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
                                                  >
                                                    <X className="w-4 h-4" />
                                                  </Button>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </Card>
                          ))}
                        </div>

                        {questions.length === 0 && (
                          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                              <HelpCircle className="w-8 h-8" />
                            </div>
                            <p className="font-medium">No questions added yet</p>
                            <p className="text-sm mt-1">Click "Add Question" to get started</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Task Settings */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive">Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable this template for use in onboarding/offboarding workflows
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-4 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingTemplate ? "Update Template" : "Create Template"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Templates Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Template Name
                  {sortField === "name" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-2">
                  Type
                  {sortField === "type" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("indicator")}
              >
                <div className="flex items-center gap-2">
                  Category
                  {sortField === "indicator" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>

              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("lastUpdated")}
              >
                <div className="flex items-center gap-2">
                  Last Updated
                  {sortField === "lastUpdated" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTemplates.map((template) => {
              const Icon = typeIcons[template.type];
              return (
                <TableRow key={template.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-80">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {typeLabels[template.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        template.indicator === "onboarding" 
                          ? "bg-blue-100 text-blue-800 border-blue-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {template.indicator}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-gray-600">
                    {new Date(template.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={template.isActive !== false ? "default" : "secondary"}
                      className={template.isActive !== false ? "bg-green-100 text-green-800" : ""}
                    >
                      {template.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
        Showing {sortedTemplates.length} of {taskTemplates.length} templates
      </div>
    </div>
  );
}