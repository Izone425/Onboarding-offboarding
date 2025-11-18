import { Card, CardContent } from "./card";
import { Progress } from "./progress";
import { cn } from "./utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  subtitle?: string;
  delta?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  progress?: {
    value: number;
    message?: string;
  };
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const variantClasses = {
  default: "bg-card",
  primary: "bg-blue-600 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-orange-500 text-white",
  danger: "bg-red-500 text-white"
};

const iconVariantClasses = {
  default: "bg-primary/10 text-primary",
  primary: "bg-white/20 text-white",
  success: "bg-white/20 text-white",
  warning: "bg-white/20 text-white",
  danger: "bg-white/20 text-white"
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  subtitle, 
  delta,
  progress, 
  className,
  variant = "default" 
}: StatCardProps) {
  if (progress && variant === "primary") {
    // Custom progress card layout matching the design
    return (
      <Card className={cn("bg-primary text-white border-none", className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-white text-sm font-medium opacity-90 mb-2">
                {title}
              </p>
              <p className="text-white text-3xl font-semibold">
                {value}
              </p>
              {subtitle && (
                <p className="text-white text-sm opacity-75 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <Progress 
              value={progress.value} 
              className="h-2 bg-white/20 [&>div]:bg-yellow-400"
            />
            {progress.message && (
              <p className="text-white text-sm">
                {progress.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-none shadow-sm rounded-xl overflow-hidden", variantClasses[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn(
              "text-sm font-medium mb-2",
              variant === "default" ? "text-muted-foreground" : "text-white opacity-90"
            )}>
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className={cn("text-4xl font-bold", variant !== "default" && "text-white")}>{value}</p>
              {delta && (
                <span className={cn(
                  "text-sm",
                  variant === "default"
                    ? delta.trend === "up"
                      ? "text-green-600"
                      : delta.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    : "text-current opacity-75"
                )}>
                  {delta.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className={cn(
                "text-xs mt-1",
                variant === "default" ? "text-muted-foreground" : "text-current opacity-75"
              )}>
                {subtitle}
              </p>
            )}
            {description && (
              <p className={cn(
                "text-sm mt-1",
                variant === "default" ? "text-muted-foreground" : "text-current opacity-75"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
            iconVariantClasses[variant]
          )}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
        {progress && (
          <div className="mt-4">
            <Progress 
              value={progress.value} 
              className={cn(
                "h-2",
                variant === "primary" && "[&>div]:bg-yellow-400"
              )}
            />
            {progress.message && (
              <p className={cn(
                "text-sm mt-3",
                variant === "default" ? "text-muted-foreground" : "text-white"
              )}>
                {progress.message}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}