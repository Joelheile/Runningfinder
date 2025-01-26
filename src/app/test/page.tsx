"use client";
import MapTest from "@/components/Map/MapTest";
import { TestScraper } from "@/components/Scraper/TestScraper";

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Scraper Test</h2>
          <TestScraper />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Google Maps API Test</h2>
          <MapTest />
        </section>
      </div>
    </div>
  );
}
