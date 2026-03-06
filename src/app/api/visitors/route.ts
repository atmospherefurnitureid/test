import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Visitor } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
    // Auth required — visitor analytics is private
    const auth = await verifyAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    try {
        await connectDB();

        // Get all time stats
        const totalVisitors = await Visitor.countDocuments();

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayVisitors = await Visitor.countDocuments({ timestamp: { $gte: today } });

        // Get yesterday's stats for comparison
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayVisitors = await Visitor.countDocuments({
            timestamp: { $gte: yesterday, $lt: today }
        });

        // Get this month's stats
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthVisitors = await Visitor.countDocuments({ timestamp: { $gte: firstDayOfMonth } });

        // Get last month's stats
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthVisitors = await Visitor.countDocuments({
            timestamp: { $gte: firstDayOfLastMonth, $lt: firstDayOfMonth }
        });

        // Get this year's stats
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const yearVisitors = await Visitor.countDocuments({ timestamp: { $gte: firstDayOfYear } });

        // Get last 30 days daily data for chart
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyStats = await Visitor.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get last 12 months data for chart
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);

        const monthlyStats = await Visitor.aggregate([
            { $match: { timestamp: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get yearly stats
        const yearlyStats = await Visitor.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get recent visitors
        const recentVisitors = await Visitor.find().sort({ timestamp: -1 }).limit(100);

        return NextResponse.json({
            today: todayVisitors,
            yesterday: yesterdayVisitors,
            month: monthVisitors,
            lastMonth: lastMonthVisitors,
            year: yearVisitors,
            total: totalVisitors,
            dailyStats: dailyStats.map(d => ({ name: d._id, visitors: d.count })),
            monthlyStats: monthlyStats.map(d => ({ name: d._id, visitors: d.count })),
            yearlyStats: yearlyStats.map(d => ({ name: d._id, visitors: d.count })),
            recentVisitors
        });
    } catch (error) {
        console.error("API Visitors Error:", error);
        return NextResponse.json({ error: "Failed to fetch visitor stats" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { page, ip, userAgent } = await req.json();

        const newVisitor = new Visitor({
            page,
            ip: ip || req.headers.get('x-forwarded-for') || '127.0.0.1',
            userAgent: userAgent || req.headers.get('user-agent'),
            timestamp: new Date()
        });

        await newVisitor.save();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Visitor POST Error:", error);
        return NextResponse.json({ error: "Failed to log visitor" }, { status: 500 });
    }
}
