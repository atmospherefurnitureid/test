import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Founder } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';

export async function GET() {
    try {
        await dbConnect();
        // There should be only one founder profile, but we'll fetch the first one
        let founder = await Founder.findOne({});

        // If no founder profile exists, create a default one
        if (!founder) {
            founder = await Founder.create({
                name: "Will Jones",
                image: "/images/team-1.png",
                role: "CEO & Founder",
                bio: "Experienced craftsman dedicated to quality wood and iron furniture.",
                quote: "Quality is not an act, it is a habit.",
                facebook: "",
                instagram: "",
                whatsapp: ""
            });
        }

        return NextResponse.json(founder);
    } catch (error) {
        console.error("API GET Founder Error:", error);
        return NextResponse.json({ error: "Failed to fetch founder profile." }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();

        // Update the existing record or create if not exists
        const founder = await Founder.findOneAndUpdate({}, body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });

        return NextResponse.json(founder);
    } catch (error) {
        console.error("API PUT Founder Error:", error);
        return NextResponse.json({ error: "Failed to update founder profile." }, { status: 400 });
    }
}
