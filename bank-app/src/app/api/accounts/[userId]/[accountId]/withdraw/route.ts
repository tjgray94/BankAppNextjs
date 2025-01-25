import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: {userId: string, accountId: string} }) {
	try {
		const { userId, accountId } = params;
		const body = await request.json();
		const { amount } = body;

		if(!amount || isNaN(amount) || amount <= 0) {
			return NextResponse.json({ error: "Invalid withdraw amount" }, { status: 400 });
		} 

		const account =  await prisma.account.findFirst({
			where: {
				accountId: parseInt(accountId),
				userId: parseInt(userId)
			}
		})

		if (!account) {
			return NextResponse.json({ error: "Account not found." }, { status: 404 });
		}

		if (account.balance < parseFloat(amount)) {
				return NextResponse.json({ error: "Insufficient balance." }, { status: 400 });
		}

		const updatedAccount = await prisma.account.update({
			where: { accountId: account.accountId },
			data: { balance: { decrement: parseFloat(amount) } }
		});

		return NextResponse.json({ message: "Withdraw successful", updatedAccount });
	} catch (error) {
		console.error("Error processing withdraw:", error);
    return NextResponse.json({ error: "An error occurred while processing the withdraw." }, { status: 500 });
	}
}