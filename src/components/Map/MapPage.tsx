"use client";
import Map from "@/components/Map/MapLogic";
import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { useFetchRuns } from "@/lib/hooks/runs/useFetchRuns";
import { useCallback, useState } from "react";

import { Session } from "next-auth";
import Link from "next/link";
import FilterBar from "../Runs/FilterBarLogic";
import { Button } from "../UI/button";
import { RunDisclaimer } from "../UI/disclaimer";
import { OnboardingGuide } from "../Onboarding/OnboardingGuide";

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
    [],
  ); // Empty dependency array since we only need setFilters which is stable

  const { data: clubs } = useFetchClubs();

  return (
    <div className="fixed inset-0 overflow-hidden">
      <OnboardingGuide />
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

      <RunDisclaimer />

      <Map runs={runs || []} clubs={clubs || []} />
      <script id="session-info" type="application/json">
        {JSON.stringify(session)}
      </script>
    </div>
  );
};

export default MapPage;
