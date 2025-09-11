import imagekit from "@/config/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        const formData = await request.formData();
        const name = formData.get("name");
        const username = formData.get("username");
        const description = formData.get("description");
        const email = formData.get("email");
        const contact = formData.get("contact");
        const address = formData.get("address");
        const image = formData.get("image");

        if (!name || !username || !description || !email || !contact || !address || !image) {
            return NextResponse.json({ message: "Missing store infomation" }, { status: 400 });
        }
        
        const store = await prisma.store.findFirst({
            where: { userId: userId },
        });
        if (store) {
            return NextResponse.json({ status: store.status });
        }
        const isUsernameTaken = await prisma.store.findFirst({
            where: { username: username.toLowerCase() },
        })

        if (isUsernameTaken) {
            return NextResponse.json({ message: "Username already taken" }, { status: 409 });
        }
        //image upload to imagekit
        const buffer = Buffer.from(await image.arrayBuffer());
        const res = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos"
        })

        const optimizedImage = imagekit.url({
            path: res.filePath,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "512" }
            ]
        })
        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                logo: optimizedImage,
            }
        })

        //link store to user
        await prisma.user.update({
            where: { id: userId },
            data: { store: { connect: { storeId: newStore.id } } }
        })

        return NextResponse.json({ message: "Applied, waiting for approval" });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//check if user have already registered a store, if yes, then send status of store

export async function GET(request) {
    try{
        const { userId } = getAuth(request);
        const store = await prisma.store.findFirst({
            where: { userId: userId },
        });

        if (store) {
            return NextResponse.json({ status: store.status });
        }
        return NextResponse.json({ status: "not registered" });
    }catch(error){
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });

    }
}
