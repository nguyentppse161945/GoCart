import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("Username");
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        //Get store info and inStock products
        const store = await prisma.store.findUnique({
            where: { username, isActive: true },
            include: {
                Product: { include: { rating: true } }
            }
        })

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        return NextResponse.json(store, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.code || error.message }, { status: 500 });
    }
}
