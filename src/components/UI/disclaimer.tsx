import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./alert";

export function RunDisclaimer() {
  return (
    <div className="absolute bottom-5 right-5 z-10 max-w-sm">
      <Alert variant="default" className="bg-white/80 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Verify each run before attending, as we can't ensure the event will
          occur as specified. Please report any mistakes
        </AlertDescription>
      </Alert>
    </div>
  );
}
