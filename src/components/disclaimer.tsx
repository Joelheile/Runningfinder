import { AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "./UI/alert";

export function RunDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-10">
      <div className="sm:hidden">
        {isOpen ? (
          <Alert
            variant="default"
            className="bg-white/90 backdrop-blur-sm animate-in slide-in-from-left-5 duration-200 relative pr-10"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
            <AlertCircle className="h-4 w-4 shrink-0 ml-6" />
            <div className="flex-1">
              <AlertDescription className="text-xs">
                Verify each run before attending, as we can&apos;t ensure the
                event will occur as specified. Please report any mistakes
              </AlertDescription>
              <div className="mt-1 flex justify-end">
                <Link
                  href="/imprint"
                  className="text-[10px] text-gray-400 hover:text-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  Imprint
                </Link>
              </div>
            </div>
          </Alert>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white/95 transition-colors"
          >
            <AlertCircle className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="hidden sm:block max-w-sm">
        <Alert variant="default" className="bg-white/90 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div className="flex-1">
            <AlertDescription className="text-xs">
              Verify each run before attending, as we can&apos;t ensure the
              event will occur as specified. Please report any mistakes
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
    </div>
  );
}
