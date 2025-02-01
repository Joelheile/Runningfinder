import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { instagramUsername } = await request.json();

    if (!instagramUsername) {
      return NextResponse.json({ error: "Instagram username is required" }, { status: 400 });
    }

    if (!process.env.APIFY_KEY) {
      return NextResponse.json({ error: "APIFY_KEY is not configured" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernames: [instagramUsername],
          resultsLimit: 6,
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return NextResponse.json({ error: "Failed to fetch Instagram profile" }, { status: 500 });
  }
}
