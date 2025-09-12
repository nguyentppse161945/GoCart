import prisma from "@/lib/prisma";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Get all Approved  Stores
export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const stores = await prisma.store.findMany({
            where: {
                status: { in: ['Approved'] }
            }, include: { user: true }
        })
        return NextResponse.json({ stores })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}