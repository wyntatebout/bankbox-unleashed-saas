
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function PortfolioDisclaimer() {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Check if we've shown the disclaimer before
    const hasSeenDisclaimer = localStorage.getItem("aurora_disclaimer_seen");
    
    if (!hasSeenDisclaimer) {
      // Show after a short delay to allow the page to load
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    localStorage.setItem("aurora_disclaimer_seen", "true");
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Portfolio Project Notice
          </DialogTitle>
          <DialogDescription>
            Aurora Bank is a portfolio demonstration project and not an actual financial institution.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This application showcases UI/UX design and development skills. No real financial 
            transactions can be processed, and no actual customer data is stored or managed.
            All data displayed is simulated for demonstration purposes.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose} className="w-full sm:w-auto">
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
