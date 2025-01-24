import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
	const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

	try {
		const accounts = await prisma.account.findMany({
      where: { userId },
      include: { user: true },
    });

    if (!accounts.length) {
      return NextResponse.json({ error: 'Account not found or user ID mismatch.' }, { status: 404 });
    }

    return NextResponse.json(accounts, { status: 200 });
	} catch (error) {
		console.error('Error fetching account details:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
	}
}