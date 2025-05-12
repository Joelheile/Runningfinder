import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const approvedRun = await db
      .update(runs)
      .set({
        isApproved: true,
      })
      .where(eq(runs.id, id))
      .returning({
        id: runs.id,
        name: runs.name,
        clubId: runs.clubId,
        datetime: runs.datetime,
        weekday: runs.weekday,
        startDescription: runs.startDescription,
        locationLng: runs.locationLng,
        locationLat: runs.locationLat,
        distance: runs.distance,
        difficulty: runs.difficulty,
        isApproved: runs.isApproved,
        isRecurrent: runs.isRecurrent,
      });

    if (approvedRun.length === 0) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(approvedRun[0], {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error approving run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/runs/{id}/approve:
 *   post:
 *     tags:
 *       - runs
 *       - admin
 *     summary: Approve a run.
 *     description: Admin-only endpoint to approve a run for public visibility.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the run to approve
 *     responses:
 *       200:
 *         description: Run approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 clubId:
 *                   type: string
 *                 datetime:
 *                   type: string
 *                   format: date-time
 *                 weekday:
 *                   type: integer
 *                 startDescription:
 *                   type: string
 *                 locationLng:
 *                   type: number
 *                 locationLat:
 *                   type: number
 *                 distance:
 *                   type: number
 *                 difficulty:
 *                   type: string
 *                 isApproved:
 *                   type: boolean
 *                 isRecurrent:
 *                   type: boolean
 *       400:
 *         description: Invalid input or missing ID.
 *       401:
 *         description: Unauthorized - Admin access required.
 *       404:
 *         description: Run not found.
 *       500:
 *         description: Internal Server Error.
 */
