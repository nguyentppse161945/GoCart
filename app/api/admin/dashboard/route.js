import prisma from "@/lib/prisma";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//get dashboard data for admin (total oerdes, stores, products, revenue)

export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const orders = await prisma.order.count();
        const stores = await prisma.store.count();
        const allOrders = await prisma.order.findMany({
            select: {
                createdAt: true,
                total: true
            }
        });

        let totalRevenue = 0;
        allOrders.forEach((order) => {
            totalRevenue += order.total;
        })

        const revenue = totalRevenue.toFixed(2);

        const products = await prisma.product.count();

        const dashboardData = {
            orders,
            stores,
            products,
            revenue,
            allOrders
        }
        return NextResponse.json({ dashboardData })

    } catch (error) {
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}