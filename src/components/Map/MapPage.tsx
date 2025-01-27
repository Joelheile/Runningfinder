"use client";
import Map from "@/components/Map/MapLogic";
import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { useFetchRuns } from "@/lib/hooks/runs/useFetchRuns";
import { useCallback, useState } from "react";

import { AlertCircle } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import FilterBar from "../Runs/FilterBarLogic";
import { Alert, AlertDescription } from "../UI/alert";
import { Button } from "../UI/button";

const MapPage = ({ session }: { session: Session | null }) => {
  const [filters, setFilters] = useState<{
    minDistance?: number;
    maxDistance?: number;
    days?: number[];
    difficulty?: string;
  }>({}); // No filters at initial render

  const { data: runs, isLoading, error } = useFetchRuns(filters);

  const handleFilterChange = useCallback(
    (newFilters: {
      minDistance?: number;
      maxDistance?: number;
      days?: number[];
      difficulty?: string;
    }) => {
      setFilters(newFilters);
    },
    []
  ); // Empty dependency array since we only need setFilters which is stable

  const { data: clubs } = useFetchClubs();

  return (
    <div className="fixed inset-0 overflow-hidden">
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="absolute z-10 bottom-5 right-1/2 left-1/2 grid-flow-row text-center">
        <div className="flex flex-row gap-2 justify-center">
          <Link href="/clubs">
            <Button variant={"default"}>Search Clubs 🏃</Button>
          </Link>

          {/* <Link href="/myruns">
            <Button variant={"outline"}>My runs 🥳</Button>
          </Link> */}
        </div>
      </div>
      <div className="absolute bottom-5 right-5 z-10 max-w-sm">
        <Alert variant="default" className="bg-white/80 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Please verify each run before attending, as we cannot ensure the
            event will occur at the specified date, time, or location. If you
            find any mistakes, please report them to us :)
          </AlertDescription>
        </Alert>
      </div>
      <Map runs={runs || []} clubs={clubs || []} />
      <script id="session-info" type="application/json">
        {JSON.stringify(session)}
      </script>
    </div>
  );
};

export default MapPage;
