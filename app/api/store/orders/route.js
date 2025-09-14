//update seller order status

import prisma from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const isSeller = await authSeller(userId);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { orderId, status } = await req.json();

        await prisma.order.update({
            where: { id: orderId, storeId },
            data: {
                status,
            },
        });

        return NextResponse.json({ message: "Order status updated successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//get all orders for seller 

export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { storeId },
            include: {
                user: true, address: true, orderItems: { include: { product: true } },
            },
            orderBy: { createdAt: "desc" },

        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
