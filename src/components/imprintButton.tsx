import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "./UI/alert";

export function ImprintButton() {
  return (
    <div className="absolute bottom-5 left-5 z-10 max-w-sm">
      <Link href="/legal/imprint">
        <Alert variant="default" className="bg-white/80 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs"> Imprint</AlertDescription>
        </Alert>
      </Link>
    </div>
  );
}
