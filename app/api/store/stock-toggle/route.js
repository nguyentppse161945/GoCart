import prisma from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
 try {
    const {userId} = getAuth(request);
    const {productId} = await request.json();
    if(!productId) {
        return NextResponse.json({error: "missing details: Product ID"}, {status: 400});
    }

    const storeId = await authSeller(userId);
    if(!storeId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    //check if product existed?
    const product = await prisma.product.findFirst({
        where:{id: productId, storeId}
    })

    if(!product) {
        return NextResponse.json({error: "Product not found"}, {status: 404});
    }

    await prisma.product.update({
        where: {id: productId},
        data:{
            inStock: !product.inStock
        }
    })

    return NextResponse.json({message: "Product stock status updated"}, {status: 200});
 } catch (error) {
    return NextResponse.json({error: "Internal Server Error"}, {status: 400});
 }
}
