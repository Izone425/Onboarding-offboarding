import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { StatusChip } from "../ui/status-chip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../ui/utils";
import { format } from "date-fns";
import {
  UserPlus,
  Upload,
  Calendar as CalendarIcon,
  Settings,
  Plus
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PreHire {
  id: number;
  name: string;
  position: string;
  department: string;
  startDate: string;
  emailStatus: "not-issued" | "pending-activation" | "activated";
  workflow?: string;
  appraisalTemplate?: string;
}

const preHires: PreHire[] = [
  {
    id: 1,
    name: "Aina Zulkifli",
    position: "Product Designer",
    department: "UX",
    startDate: "2025-09-15",
    emailStatus: "not-issued"
  },
  {
    id: 2,
    name: "Harith Rahman",
    position: "Backend Engineer",
    department: "Engineering",
    startDate: "2025-09-22",
    emailStatus: "pending-activation"
  },
  {
    id: 3,
    name: "Nur Iman",
    position: "HR Executive",
    department: "HR",
    startDate: "2025-10-01",
    emailStatus: "activated"
  }
];

const workflows = [
  "Onboarding — Standard (HQ) v1.2",
  "Onboarding — Remote Employee v1.0",
  "Onboarding — Senior Position v1.1"
];

const appraisalTemplates = [
  "Probation Appraisal v2",
  "Standard Performance Review",
  "Leadership Assessment"
];

const managers = [
  "Farah Kassim",
  "Nizam Salleh",
  "Ahmed Fauzi",
  "Siti Aminah"
];

const locations = [
  "HQ - Kuala Lumpur",
  "Branch - Penang",
  "Branch - Johor Bahru",
  "Remote"
];

export function PreHireEntry() {
  const [selectedPreHire, setSelectedPreHire] = useState<PreHire | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [hireDate, setHireDate] = useState<Date>();

  const getEmailStatusConfig = (status: PreHire["emailStatus"]) => {
    switch (status) {
      case "not-issued":
        return { label: "Not Issued", variant: "secondary" as const };
      case "pending-activation":
        return { label: "Pending Activation", variant: "default" as const };
      case "activated":
        return { label: "Activated", variant: "default" as const, className: "bg-green-100 text-green-800" };
    }
  };

  const handleCreateUser = () => {
    toast.success("User account created and onboarding started successfully!");
    setCreateUserOpen(false);
  };

  const handleAssignWorkflow = (preHireId: number, workflow: string) => {
    toast.success(`Workflow "${workflow}" assigned successfully!`);
  };

  const handleAssignAppraisal = (preHireId: number, template: string) => {
    toast.success(`Appraisal template "${template}" assigned successfully!`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pre-Hire Entry</h1>
          <p className="text-muted-foreground">Manage pre-hire candidates and set up their onboarding</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import from ATS
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Pre-Hires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Candidate Name</TableHead>
                    <TableHead className="w-[130px]">Position</TableHead>
                    <TableHead className="w-[100px]">Department</TableHead>
                    <TableHead className="w-[110px]">Start Date</TableHead>
                    <TableHead className="w-[120px]">Email Status</TableHead>
                    <TableHead className="w-[180px]">Workflow</TableHead>
                    <TableHead className="w-[180px]">Appraisal Template</TableHead>
                    <TableHead className="w-[160px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {preHires.map((preHire) => {
                  const emailConfig = getEmailStatusConfig(preHire.emailStatus);
                  return (
                    <TableRow key={preHire.id}>
                      <TableCell className="font-medium">{preHire.name}</TableCell>
                      <TableCell>{preHire.position}</TableCell>
                      <TableCell>{preHire.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          {preHire.startDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={emailConfig.variant}
                          className={emailConfig.className}
                        >
                          {emailConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {preHire.workflow ? (
                          <Badge variant="outline">{preHire.workflow}</Badge>
                        ) : (
                          <Select onValueChange={(value) => handleAssignWorkflow(preHire.id, value)}>
                            <SelectTrigger className="w-full max-w-[180px]">
                              <SelectValue placeholder="Select workflow" />
                            </SelectTrigger>
                            <SelectContent>
                              {workflows.map((workflow) => (
                                <SelectItem key={workflow} value={workflow}>
                                  {workflow}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {preHire.appraisalTemplate ? (
                          <Badge variant="outline">{preHire.appraisalTemplate}</Badge>
                        ) : (
                          <Select onValueChange={(value) => handleAssignAppraisal(preHire.id, value)}>
                            <SelectTrigger className="w-full max-w-[180px]">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              {appraisalTemplates.map((template) => (
                                <SelectItem key={template} value={template}>
                                  {template}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Sheet open={createUserOpen} onOpenChange={setCreateUserOpen}>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPreHire(preHire);
                                setHireDate(new Date(preHire.startDate));
                              }}
                              disabled={preHire.emailStatus === "activated"}
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Create User
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Create User Account</SheetTitle>
                            </SheetHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                      id="fullName"
                                      defaultValue={selectedPreHire?.name}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="personalEmail">Personal Email</Label>
                                    <Input
                                      id="personalEmail"
                                      type="email"
                                      placeholder="personal@email.com"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="tempId">Temporary ID</Label>
                                    <Input
                                      id="tempId"
                                      placeholder="TMP001"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Hire Date</Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !hireDate && "text-muted-foreground"
                                          )}
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {hireDate ? format(hireDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={hireDate}
                                          onSelect={setHireDate}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Manager</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select manager" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {managers.map((manager) => (
                                          <SelectItem key={manager} value={manager}>
                                            {manager}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select location" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {locations.map((location) => (
                                          <SelectItem key={location} value={location}>
                                            {location}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Work Type</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select work type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="onsite">Onsite</SelectItem>
                                      <SelectItem value="hybrid">Hybrid</SelectItem>
                                      <SelectItem value="remote">Remote</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setCreateUserOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleCreateUser}>
                                  Create & Start Onboarding
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
