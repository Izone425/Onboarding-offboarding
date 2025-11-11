import { cn } from "./utils";
import { Badge } from "./badge";

export interface StatusChipProps {
  status: "pending" | "in-progress" | "completed" | "overdue" | "blocked" | "not-started";
  className?: string;
}

const statusConfig = {
  "pending": {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100"
  },
  "in-progress": {
    label: "In Progress", 
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100"
  },
  "completed": {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-100"
  },
  "overdue": {
    label: "Overdue",
    className: "bg-red-100 text-red-800 hover:bg-red-100"
  },
  "blocked": {
    label: "Blocked",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100"
  },
  "not-started": {
    label: "Not Started",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-100"
  }
};

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];
  
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}