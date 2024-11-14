import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema/runs";

import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET({ request }: { request: Request }) {
  const { userId, runId } = await request.json();

  try {
    const res = await db
      .select()
      .from(registrations)
      .where(
        and(eq(registrations.userId, userId), eq(registrations.runId, runId)),
      )
      .execute();

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId, runId, status } = await request.json();
  console.log("api run", userId, runId);

  try {
    const existingRegistration = await db
      .select()
      .from(registrations)
      .where(
        and(eq(registrations.userId, userId), eq(registrations.runId, runId)),
      )
      .execute();

    if (existingRegistration.length > 0) {
      console.log("Registration already exists");
      return NextResponse.json(
        { message: "Registration already exists" },
        { status: 409 },
      );
    }

    const res = await db
      .insert(registrations)
      .values({
        id: uuidv4(),
        runId: runId,
        userId: userId,
        status: status,
      })
      .execute();
    console.log("registration", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { userId, runId, status } = await request.json();

  try {
    const res = await db
      .delete(registrations)
      .where(
        and(eq(registrations.userId, userId), eq(registrations.runId, runId)),
      )
      .execute();

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: Retrieve registrations.
 *     tags:
 *       - registrations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               runId:
 *                 type: string
 *     responses:
 *       200:
 *         description: A list of registrations matching the provided userId and runId.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   runId:
 *                     type: string
 *                   status:
 *                     type: string
 *       500:
 *         description: Internal Server Error.
 *
 *   post:
 *     summary: Create a new registration.
 *     tags:
 *       - registrations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               runId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 runId:
 *                   type: string
 *                 status:
 *                   type: string
 *       409:
 *         description: Registration already exists.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     summary: Delete a registration.
 *     tags:
 *       - registrations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               runId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration deleted successfully.
 *       500:
 *         description: Internal Server Error.
 */
