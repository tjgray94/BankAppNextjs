import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
	const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

	try {
		const userAccounts = await prisma.account.findMany({
      where: { userId },
      select: { accountId: true }, // Only fetch account IDs
    });

		const accountIds = userAccounts.map(account => account.accountId);

		const transactions = await prisma.transaction.findMany({
      where: { accountId: { in: accountIds} },
      include: { 
				account: {
					select: { accountType: true }
				},
			},
			orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json(transactions, { status: 200 });
	} catch (error) {
		console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
	const userId = parseInt(params.userId, 10);

	if (isNaN(userId)) {
		return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
	}

	try {
		const { type, sourceAccount, destinationAccount, amount, timestamp } = await request.json();

		// Validate the incoming data
		if (!type || !["DEPOSIT", "WITHDRAW", "TRANSFER"].includes(type)) {
			return NextResponse.json({ error: "Invalid transaction data" }, { status: 400 });
		}

		// Create the transaction in the database
		const transaction = await prisma.transaction.create({
			data: {
				accountId: userId,
				type,
				sourceAccount,
				destinationAccount,
				amount,
				timestamp,
			},
		});

		console.log("Transaction Created:", transaction);
		return NextResponse.json(transaction, { status: 201 });
	} catch (error) {
		console.error("Error creating transaction:", error);
		return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
	}
}