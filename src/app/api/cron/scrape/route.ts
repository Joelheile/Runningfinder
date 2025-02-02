import { scrapeRuns } from "@/lib/scraping/scrapeRuns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Verify the request is coming from GitHub Actions or local development
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized request:", authHeader);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Starting scraping process...");
    console.log("Environment check:");
    console.log("- CRON_SECRET:", process.env.CRON_SECRET ? "✓" : "✗");
    console.log("- APIFY_KEY:", process.env.APIFY_KEY ? "✓" : "✗");

    // Run the scraper
    await scrapeRuns();

    console.log("Scraping completed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Scraping failed with error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to scrape runs",
      },
      { status: 500 },
    );
  }
}
