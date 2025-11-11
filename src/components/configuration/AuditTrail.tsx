import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../ui/utils";
import { format } from "date-fns";
import { 
  History, 
  Filter,
  Search,
  Calendar as CalendarIcon,
  User,
  FileText,
  ArrowRightLeft,
  Download,
  RefreshCw
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  entity: string;
  entityType: "task" | "workflow" | "role" | "settings" | "user";
  action: "create" | "update" | "delete" | "assign" | "complete" | "sign-off";
  beforeValue?: string;
  afterValue?: string;
  sourceIP: string;
  userAgent?: string;
}

const auditEntries: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2025-08-20 10:12:35",
    actor: "Sarah Ahmad",
    actorRole: "HR Admin",
    entity: "Onboarding — Standard (HQ)",
    entityType: "workflow",
    action: "update",
    beforeValue: "v1.1",
    afterValue: "v1.2",
    sourceIP: "203.0.113.10"
  },
  {
    id: "2", 
    timestamp: "2025-08-22 09:03:22",
    actor: "Ahmad IT",
    actorRole: "IT/PIC",
    entity: "Grant Email Access",
    entityType: "task",
    action: "assign",
    afterValue: "azlan@company.com",
    sourceIP: "203.0.113.11"
  },
  {
    id: "3",
    timestamp: "2025-08-21 14:25:18",
    actor: "Farah Kassim",
    actorRole: "Manager",
    entity: "Welcome Pack",
    entityType: "task", 
    action: "complete",
    beforeValue: "In Progress",
    afterValue: "Completed",
    sourceIP: "203.0.113.15"
  },
  {
    id: "4",
    timestamp: "2025-08-20 16:45:03",
    actor: "Sarah Ahmad",
    actorRole: "HR Admin",
    entity: "HR Coordinator",
    entityType: "role",
    action: "update",
    beforeValue: "5 permissions",
    afterValue: "6 permissions",
    sourceIP: "203.0.113.10"
  },
  {
    id: "5",
    timestamp: "2025-08-19 11:30:44",
    actor: "Aina Zulkifli",
    actorRole: "Staff",
    entity: "Employee Handbook",
    entityType: "task",
    action: "sign-off",
    beforeValue: "Pending Signature",
    afterValue: "Signed",
    sourceIP: "203.0.113.25"
  },
  {
    id: "6",
    timestamp: "2025-08-18 13:15:27",
    actor: "Sarah Ahmad", 
    actorRole: "HR Admin",
    entity: "Security Quiz Template",
    entityType: "task",
    action: "create",
    afterValue: "New questionnaire template",
    sourceIP: "203.0.113.10"
  },
  {
    id: "7",
    timestamp: "2025-08-17 08:22:11",
    actor: "Nizam Salleh",
    actorRole: "Manager",
    entity: "Harith Rahman onboarding",
    entityType: "workflow",
    action: "assign",
    afterValue: "Standard Onboarding v1.2",
    sourceIP: "203.0.113.18"
  },
  {
    id: "8",
    timestamp: "2025-08-16 15:40:33",
    actor: "Sarah Ahmad",
    actorRole: "HR Admin", 
    entity: "General Settings",
    entityType: "settings",
    action: "update",
    beforeValue: "Reminder: Weekly",
    afterValue: "Reminder: Every 3 days",
    sourceIP: "203.0.113.10"
  }
];

const entityTypeIcons = {
  task: FileText,
  workflow: ArrowRightLeft,
  role: User,
  settings: Filter,
  user: User
};

const actionColors = {
  create: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800", 
  delete: "bg-red-100 text-red-800",
  assign: "bg-purple-100 text-purple-800",
  complete: "bg-green-100 text-green-800",
  "sign-off": "bg-amber-100 text-amber-800"
};

export function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActor, setFilterActor] = useState("all");
  const [filterEntityType, setFilterEntityType] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = 
      entry.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActor = filterActor === "all" || entry.actor === filterActor;
    const matchesEntityType = filterEntityType === "all" || entry.entityType === filterEntityType;
    const matchesAction = filterAction === "all" || entry.action === filterAction;
    
    return matchesSearch && matchesActor && matchesEntityType && matchesAction;
  });

  const uniqueActors = Array.from(new Set(auditEntries.map(entry => entry.actor)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground">Track all configuration and operational changes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search actor or entity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Actor</Label>
              <Select value={filterActor} onValueChange={setFilterActor}>
                <SelectTrigger>
                  <SelectValue placeholder="All actors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actors</SelectItem>
                  {uniqueActors.map((actor) => (
                    <SelectItem key={actor} value={actor}>
                      {actor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Entity Type</Label>
              <Select value={filterEntityType} onValueChange={setFilterEntityType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div>
              <Label>Action</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="assign">Assign</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="sign-off">Sign-Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Entries ({filteredEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Source IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => {
                const EntityIcon = entityTypeIcons[entry.entityType];
                return (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-mono">{entry.timestamp.split(' ')[1]}</div>
                        <div className="text-muted-foreground">{entry.timestamp.split(' ')[0]}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{entry.actor}</div>
                          <div className="text-xs text-muted-foreground">{entry.actorRole}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EntityIcon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{entry.entity}</div>
                          <Badge variant="outline" className="text-xs">
                            {entry.entityType}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={actionColors[entry.action]}
                      >
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entry.beforeValue && entry.afterValue ? (
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{entry.beforeValue}</span>
                            <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{entry.afterValue}</span>
                          </div>
                        </div>
                      ) : entry.afterValue ? (
                        <div className="text-sm font-medium">{entry.afterValue}</div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {entry.sourceIP}
                      </code>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}