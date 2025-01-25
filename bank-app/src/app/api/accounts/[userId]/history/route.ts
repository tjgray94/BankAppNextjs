import { NextRequest, NextResponse } from "next/server";
import { AccountType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
	try {
		const resolvedParams = await context.params;
		const userId = parseInt(resolvedParams.userId, 10);
		
		if (isNaN(userId)) {
			return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
		}

		// Fetch accounts associated with the user
		const userAccounts = await prisma.account.findMany({
			where: { userId },
      select: { accountId: true }, // Only fetch account IDs
    });
		
		const accountIds = userAccounts.map(account => account.accountId);
		
		const transactions = await prisma.transaction.findMany({
			where: { accountId: { in: accountIds} },
      include: { 
				account: {
					select: { accountType: true, balance: true },
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

export async function POST(request: NextRequest, context: { params: { userId: string } }) {
	try {
		const resolvedParams = await context.params;
		const userId = parseInt(resolvedParams.userId, 10);
		
		if (isNaN(userId)) {
			return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
		}
		const { type, sourceAccount, destinationAccount, amount, timestamp } = await request.json();
		
		// Validate the incoming data
		if (!type || !["DEPOSIT", "WITHDRAW", "TRANSFER"].includes(type)) {
			return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
		}
		
		if (!amount || amount <= 0) {
			return NextResponse.json({ error: "Invalid transaction amount" }, { status: 400 });
		}
		
		// Fetch the user's accounts to verify and retrieve accountId
		const accounts = await prisma.account.findMany({ where: { userId } });
		
		if (!accounts || accounts.length === 0) {
			return NextResponse.json({ error: "No accounts found for this user" }, { status: 404 });
		}
		
		// Delegate the processing to the appropriate handler based on transaction type
		let transaction;
		
		switch (type) {
			case "DEPOSIT":
				transaction = await handleDeposit(accounts, sourceAccount, amount, timestamp);
				break;
			case "WITHDRAW":
				transaction = await handleWithdraw(accounts, sourceAccount, amount, timestamp);
				break;
			case "TRANSFER":
				transaction = await handleTransfer(accounts, sourceAccount, destinationAccount, amount, timestamp);
				break;
			default:
				return NextResponse.json({ error: "Unsupported transaction type" }, { status: 400 });
		}
						
		console.log("Transaction Created:", transaction);
		return NextResponse.json(transaction, { status: 201 });
	} catch (error) {
		console.error("Error creating transaction:", error);
		return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
	}
}

async function handleDeposit(accounts: any[], sourceAccount: AccountType, amount: number, timestamp: string) {
	const account = accounts.find(acc => acc.accountType === sourceAccount);

	if (!account) {
		throw new Error(`Account of type ${sourceAccount} not found for this user`);
	}
	
	// Create the transaction in the database
	return await prisma.transaction.create({
		data: {
			accountId: account.accountId,
			type: "DEPOSIT",
			sourceAccount: sourceAccount,
			destinationAccount: sourceAccount,
			amount,
			timestamp,
		},
	});
}

async function handleWithdraw(accounts: any[], sourceAccount: AccountType, amount: number, timestamp: string) {
	const account = accounts.find(acc => acc.accountType === sourceAccount);

	if (!account) {
		throw new Error(`Account of type ${sourceAccount} not found for this user`);
	}

	// Check for sufficient balance
	if (account.balance < amount) {
		throw new Error(`Insufficient balance in account of type ${sourceAccount}`);
	}

	// Create the transaction
	return await prisma.transaction.create({
		data: {
			accountId: account.accountId,
			type: "WITHDRAW",
			sourceAccount: sourceAccount,
			destinationAccount: sourceAccount,
			amount,
			timestamp,
		},
	});
}

async function handleTransfer(accounts: any[], sourceAccount: AccountType, destinationAccount: AccountType, amount: number, timestamp: string) {
	const sourceAcc = accounts.find(acc => acc.accountType === sourceAccount);
	const destinationAcc = accounts.find(acc => acc.accountType === destinationAccount);

	if (!sourceAcc || !destinationAcc) {
		throw new Error("Both source and destination accounts must exist for a transfer");
	}

	// Check for sufficient balance in the source account
	if (sourceAcc.balance < amount) {
		throw new Error(`Insufficient balance in account of type ${sourceAccount}`);
	}

	// Create the transaction
	return await prisma.transaction.create({
		data: {
			accountId: sourceAcc.accountId,
			type: "TRANSFER",
			sourceAccount: sourceAccount,
			destinationAccount: destinationAccount,
			amount,
			timestamp,
		},
	});
}