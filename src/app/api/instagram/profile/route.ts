

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { instagramUsername } = await request.json();
    console.log("Received request for Instagram profile:", instagramUsername);

    if (!instagramUsername) {
      console.log("Missing Instagram username in request");
      return NextResponse.json(
        { error: "Instagram username is required" },
        { status: 400 },
      );
    }

    if (!process.env.APIFY_KEY) {
      console.error("APIFY_KEY environment variable is not configured");
      return NextResponse.json(
        {
          error:
            "Instagram scraping is not configured. Please set APIFY_KEY in .env.local",
        },
        { status: 500 },
      );
    }

    console.log("Fetching Instagram profile for:", instagramUsername);

    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          usernames: [instagramUsername],
          resultsLimit: 6,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Apify API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      // Handle rate limit specifically
      if (response.status === 402) {
        return NextResponse.json(
          {
            profileImageUrl: null,
            profileDescription: null,
            recentPosts: [],
            limitError: true,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          error: `Instagram API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("Received Instagram data:", {
      dataLength: data.length,
      firstItem: data[0]
        ? {
            username: data[0].username,
            hasImage: !!data[0].profilePicUrl,
            hasDescription: !!data[0].biography,
          }
        : null,
    });

    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty response from Apify:", data);
      return NextResponse.json(
        {
          error: `No Instagram profile found for username: ${instagramUsername}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Instagram profile",
      },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/instagram/profile:
 *   post:
 *     summary: Fetch Instagram profile data
 *     description: |
 *       Retrieves profile information and recent posts for a given Instagram username using the Apify scraper API.
 *       Requires APIFY_KEY environment variable to be configured.
 *     tags:
 *       - Instagram
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instagramUsername
 *             properties:
 *               instagramUsername:
 *                 type: string
 *                 description: Instagram username to fetch profile data for
 *     responses:
 *       200:
 *         description: Successfully retrieved Instagram profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   profilePicUrl:
 *                     type: string
 *                   biography:
 *                     type: string
 *                   recentPosts:
 *                     type: array
 *       400:
 *         description: Missing or invalid Instagram username
 *       402:
 *         description: API rate limit exceeded
 *       404:
 *         description: Instagram profile not found
 *       500:
 *         description: Server error or missing API configuration
 */