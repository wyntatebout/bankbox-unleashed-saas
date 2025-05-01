
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, FileCsv, FileJson, FileSpreadsheet, FilePdf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  entityType?: "transactions" | "statements" | "accounts";
  onExport?: (format: string, period: string) => void;
}

const ExportOptions = ({ 
  entityType = "transactions",
  onExport
}: ExportOptionsProps) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState("pdf");
  const [timePeriod, setTimePeriod] = useState("last-month");
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    // This would typically call an API to generate the export
    toast({
      title: "Export Started",
      description: `Your ${entityType} will be exported as ${exportFormat.toUpperCase()} for the selected time period.`
    });
    
    if (onExport) {
      onExport(exportFormat, timePeriod);
    }
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your file is ready for download."
      });
    }, 1500);
    
    setOpen(false);
  };

  const getExportTypeIcon = () => {
    switch(exportFormat) {
      case "pdf": return <FilePdf className="h-4 w-4" />;
      case "csv": return <FileCsv className="h-4 w-4" />;
      case "json": return <FileJson className="h-4 w-4" />;
      case "excel": return <FileSpreadsheet className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const entityTitle = entityType.charAt(0).toUpperCase() + entityType.slice(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export {entityTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export {entityTitle}</DialogTitle>
          <DialogDescription>
            Choose your preferred format and time period for the export.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Export Format</Label>
            <RadioGroup
              id="format"
              value={exportFormat}
              onValueChange={setExportFormat}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="format-pdf"
                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${
                  exportFormat === "pdf" ? "border-primary bg-accent" : "border-muted"
                }`}
              >
                <RadioGroupItem value="pdf" id="format-pdf" className="sr-only" />
                <FilePdf className="mb-2 h-6 w-6" />
                <span>PDF Document</span>
              </Label>
              <Label
                htmlFor="format-csv"
                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${
                  exportFormat === "csv" ? "border-primary bg-accent" : "border-muted"
                }`}
              >
                <RadioGroupItem value="csv" id="format-csv" className="sr-only" />
                <FileCsv className="mb-2 h-6 w-6" />
                <span>CSV File</span>
              </Label>
              <Label
                htmlFor="format-excel"
                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${
                  exportFormat === "excel" ? "border-primary bg-accent" : "border-muted"
                }`}
              >
                <RadioGroupItem value="excel" id="format-excel" className="sr-only" />
                <FileSpreadsheet className="mb-2 h-6 w-6" />
                <span>Excel Spreadsheet</span>
              </Label>
              <Label
                htmlFor="format-json"
                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent ${
                  exportFormat === "json" ? "border-primary bg-accent" : "border-muted"
                }`}
              >
                <RadioGroupItem value="json" id="format-json" className="sr-only" />
                <FileJson className="mb-2 h-6 w-6" />
                <span>JSON Data</span>
              </Label>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time-period">Time Period</Label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger id="time-period">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last 7 days</SelectItem>
                <SelectItem value="last-month">Last 30 days</SelectItem>
                <SelectItem value="last-quarter">Last 90 days</SelectItem>
                <SelectItem value="year-to-date">Year to date</SelectItem>
                <SelectItem value="last-year">Last 12 months</SelectItem>
                <SelectItem value="all-time">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport} className="gap-2">
            {getExportTypeIcon()}
            Export Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportOptions;
