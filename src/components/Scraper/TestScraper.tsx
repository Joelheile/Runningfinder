import { useScrapeRuns } from "@/lib/hooks/scraping/useScrapeRuns";
import { Button } from "../UI/button";

export function TestScraper() {
  const { scrapeRuns } = useScrapeRuns();

  return (
    <div className="p-4">
      <Button onClick={() => scrapeRuns()}>Start Scraping</Button>
    </div>
  );
}
