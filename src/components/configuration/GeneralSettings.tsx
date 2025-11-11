import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { 
  Settings, 
  Save, 
  RefreshCw,
  Mail,
  MessageSquare,
  Globe,
  Clock
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    onboardingDuration: 45,
    offboardingDuration: 14,
    reminderCadence: "every-3-days",
    businessDaysOnly: true,
    defaultAppraisalTemplate: "probation-appraisal-v2",
    timezone: "asia-kuala-lumpur",
    locale: "en-my"
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings({
      onboardingDuration: 30,
      offboardingDuration: 14,
      reminderCadence: "weekly",
      businessDaysOnly: false,
      defaultAppraisalTemplate: "standard-performance-review",
      timezone: "asia-kuala-lumpur",
      locale: "en-my"
    });
    toast.info("Settings reset to defaults");
  };

  const emailTemplates = [
    { name: "Welcome Email", status: "active", lastUpdated: "2025-08-15" },
    { name: "Task Reminder", status: "active", lastUpdated: "2025-08-10" },
    { name: "Escalation Notice", status: "draft", lastUpdated: "2025-08-20" },
    { name: "Exit Interview Invite", status: "active", lastUpdated: "2025-07-25" }
  ];

  const smsTemplates = [
    { name: "Task Due Reminder", status: "active", lastUpdated: "2025-08-12" },
    { name: "Urgent Action Required", status: "active", lastUpdated: "2025-08-18" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">General Settings</h1>
          <p className="text-muted-foreground">Configure global onboarding and offboarding behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Duration Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="onboarding-duration">Onboarding Duration (days)</Label>
              <Input
                id="onboarding-duration"
                type="number"
                value={settings.onboardingDuration}
                onChange={(e) => setSettings({...settings, onboardingDuration: parseInt(e.target.value)})}
                min="1"
                max="365"
              />
              <p className="text-sm text-muted-foreground">
                Default time period for completing onboarding tasks
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offboarding-duration">Offboarding Duration (days)</Label>
              <Input
                id="offboarding-duration"
                type="number"
                value={settings.offboardingDuration}
                onChange={(e) => setSettings({...settings, offboardingDuration: parseInt(e.target.value)})}
                min="1"
                max="90"
              />
              <p className="text-sm text-muted-foreground">
                Default time period for completing offboarding tasks
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Reminder Cadence</Label>
              <Select
                value={settings.reminderCadence}
                onValueChange={(value) => setSettings({...settings, reminderCadence: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="every-3-days">Every 3 days</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How often to send reminder notifications for pending tasks
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Business Days Only</Label>
                <p className="text-sm text-muted-foreground">
                  Count only business days for deadlines and reminders
                </p>
              </div>
              <Switch
                checked={settings.businessDaysOnly}
                onCheckedChange={(checked) => setSettings({...settings, businessDaysOnly: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates and Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Templates & Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Appraisal Template</Label>
              <Select
                value={settings.defaultAppraisalTemplate}
                onValueChange={(value) => setSettings({...settings, defaultAppraisalTemplate: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="probation-appraisal-v2">Probation Appraisal v2</SelectItem>
                  <SelectItem value="standard-performance-review">Standard Performance Review</SelectItem>
                  <SelectItem value="leadership-assessment">Leadership Assessment</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Default template for new employee appraisals
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({...settings, timezone: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-kuala-lumpur">Asia/Kuala Lumpur (GMT+8)</SelectItem>
                  <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                  <SelectItem value="asia-bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                  <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Locale</Label>
              <Select
                value={settings.locale}
                onValueChange={(value) => setSettings({...settings, locale: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-my">English (Malaysia)</SelectItem>
                  <SelectItem value="ms-my">Bahasa Malaysia</SelectItem>
                  <SelectItem value="en-us">English (US)</SelectItem>
                  <SelectItem value="en-gb">English (UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailTemplates.map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant={template.status === "active" ? "default" : "secondary"} 
                             className={template.status === "active" ? "bg-green-100 text-green-800" : undefined}>
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Last updated: {template.lastUpdated}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              SMS Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smsTemplates.map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Last updated: {template.lastUpdated}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}