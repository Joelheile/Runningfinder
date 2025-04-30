import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    const [result] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!result) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching run by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();

    const [existingRun] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!existingRun) {
      return NextResponse.json(
        { success: false, message: "Run not found" },
        { status: 200 },
      );
    }

    const updateData: Partial<typeof runs.$inferSelect> = {};

    if (body.isApproved === true) updateData.isApproved = true;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingRun);
    }

    const [updatedRun] = await db
      .update(runs)
      .set(updateData)
      .where(eq(runs.id, id))
      .returning();

    return NextResponse.json(updatedRun);
  } catch (error) {
    console.error("Error updating run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const [existingRun] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!existingRun) {
      return NextResponse.json({
        success: true,
        message: "Run already deleted",
      });
    }

    const [deletedRun] = await db
      .delete(runs)
      .where(eq(runs.id, id))
      .returning();

    return NextResponse.json(deletedRun);
  } catch (error) {
    console.error("Error deleting run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/runs/{id}:
 *   get:
 *     tags:
 *       - runs
 *     summary: Retrieve a run by ID.
 *     description: Returns detailed information about a specific run.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the run
 *     responses:
 *       200:
 *         description: Returns the run data.
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
 *                   description: Day of the week (1-7, where 1 is Monday)
 *                 distance:
 *                   type: number
 *                 difficulty:
 *                   type: string
 *                   enum: [easy, intermediate, advanced]
 *                 startDescription:
 *                   type: string
 *                 locationLat:
 *                   type: number
 *                 locationLng:
 *                   type: number
 *                 mapsLink:
 *                   type: string
 *                 isRecurrent:
 *                   type: boolean
 *                 isApproved:
 *                   type: boolean
 *       404:
 *         description: Run not found.
 *       500:
 *         description: Internal Server Error.
 *
 *   patch:
 *     tags:
 *       - runs
 *     summary: Update a run by ID.
 *     description: Updates specific fields of an existing run.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the run
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               datetime:
 *                 type: string
 *                 format: date-time
 *               difficulty:
 *                 type: string
 *                 enum: [easy, intermediate, advanced]
 *               distance:
 *                 type: number
 *               startDescription:
 *                 type: string
 *               isRecurrent:
 *                 type: boolean
 *               locationLat:
 *                 type: number
 *               locationLng:
 *                 type: number
 *               mapsLink:
 *                 type: string
 *               isApproved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Returns the updated run.
 *       404:
 *         description: Run not found.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     tags:
 *       - runs
 *     summary: Delete a run by ID.
 *     description: Permanently removes a run from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the run
 *     responses:
 *       200:
 *         description: Run successfully deleted.
 *       404:
 *         description: Run not found or already deleted.
 *       500:
 *         description: Internal Server Error.
 */
