
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldOff } from "lucide-react";

interface SecurityNoticeProps {
  open: boolean;
  onClose: () => void;
}

export default function SecurityNotice({ open, onClose }: SecurityNoticeProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-amber-500" />
            Two-Factor Authentication Notice
          </AlertDialogTitle>
          <AlertDialogDescription>
            For portfolio demonstration purposes only
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-2">
          <p className="text-sm text-muted-foreground mb-2">
            Two-Factor Authentication (2FA) would normally be implemented in a production banking application
            to provide an additional layer of security for user accounts.
          </p>
          <p className="text-sm text-muted-foreground">
            This feature has been intentionally excluded from this portfolio demonstration
            for simplicity. In a real-world implementation, industry-standard security practices
            including 2FA would be mandatory for financial applications.
          </p>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            Understood
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
