import imagekit from "@/config/imageKit";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//Add new product
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        //Get the data from the form
        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const mrp = Number(formData.get("mrp"));
        const price = Number(formData.get("price"));
        const category = formData.get("category");
        const images = formData.getAll("images");
        if (!name || !description || !mrp || !price || !category || images.length < 1) {
            return NextResponse.json({ message: "Missing product details" }, { status: 400 });
        }

        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const res = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products"
            })
            const url = imagekit.url({
                path: res.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "1024" }
                ]
            })
            return url

        }));

        await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
                storeId
            }
        })

        return NextResponse.json({ message: "product added successfully" })
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error.code || error.message }, { status: 400 });
    }
}


//Get all products for seller

export async function GET(request) {
  try{
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: { storeId },
        })

        return NextResponse.json({ products })

  }catch(error){
    console.log(error)
    return NextResponse.json({error: error.code || error.message }, { status: 400 }); 
  }
}
