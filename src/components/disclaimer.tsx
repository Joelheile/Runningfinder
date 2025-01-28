import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "./UI/alert";

export function RunDisclaimer() {
  return (
    <div className="absolute bottom-5 right-5 z-10 max-w-sm">
      <Alert variant="default" className="bg-white/80 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4" />
        <div className="flex-1">
          <AlertDescription className="text-xs">
            Verify each run before attending, as we can't ensure the event will
            occur as specified. Please report any mistakes
          </AlertDescription>
          <div className="mt-1 flex justify-end">
            <Link
              href="/imprint"
              className="text-[10px] text-gray-400 hover:text-gray-600"
            >
              Imprint
            </Link>
          </div>
        </div>
      </Alert>
    </div>
  );
}
