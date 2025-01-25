import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { userId: string; accountId: string } }) {
  try {
    const resolvedParams = await context.params;
    const userId = parseInt(resolvedParams.userId, 10);
    const accountId = parseInt(resolvedParams.accountId, 10);
  
    if (isNaN(userId) || isNaN(accountId)) {
      return NextResponse.json({ error: 'Invalid userId or accountId' }, { status: 400 });
    }
		const account = await prisma.account.findFirst({
      where: { accountId: accountId, userId },
      include: { user: true },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found or user ID mismatch.' }, { status: 404 });
    }

    return NextResponse.json(account, { status: 200 });
	} catch (error) {
		console.error('Error fetching account details:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
	}
}