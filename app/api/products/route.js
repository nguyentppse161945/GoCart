import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get products
export async function GET(req) {
    try {
        let products = await prisma.product.findMany({
            where: { inStock: true },
            include: {
                rating: {
                    select: {
                        createdAt: true,
                        rating: true,
                        review: true,
                        user:{select:{name:true,image:true}}
                    }
                },store: true
            },
            orderBy: {createdAt :"desc"}
        });

        //remove product if out of stock
        products = products.filter(product => product.inStock)
        return NextResponse.json({ products });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}