import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/Schemas';
import bcrypt from 'bcryptjs';

export async function GET() {
    // Disable in production for security
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { error: "Forbidden: setup endpoint is disabled in production." },
            { status: 403 }
        );
    }

    try {
        await dbConnect();

        const adminUser = process.env.ADMIN_USERNAME || "tester";
        const adminPass = process.env.ADMIN_PASSWORD || "password";

        const allUsersCount = await User.countDocuments();
        const existingTester = await User.findOne({ username: adminUser });

        const hashedPassword = await bcrypt.hash(adminPass, 12);

        if (existingTester) {
            existingTester.password = hashedPassword;
            await existingTester.save();
            return NextResponse.json({
                message: "User 'tester' password has been updated to 'password'.",
                totalUsersInDB: allUsersCount
            });
        }

        await User.create({
            username: "tester",
            password: hashedPassword,
            role: "admin"
        });

        const newCount = await User.countDocuments();

        return NextResponse.json({
            message: "User 'tester' created successfully with password 'password'.",
            totalUsersInDB: newCount
        });
    } catch (err: any) {
        return NextResponse.json({ error: "Setup failed: " + err.message }, { status: 500 });
    }
}
