import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const { userId } = await params;
		console.log("user id:", userId);
		const body = await request.json();
		const { sourceAccountId, destinationAccountId, amount } = body;
		console.log("Request body:", body);

		if(!amount || isNaN(amount) || parseFloat(amount) <= 0) {
			return NextResponse.json({ error: "Invalid transfer amount" }, { status: 400 });
		} 

		if(!destinationAccountId) {
			console.log("Destination account ID missing");
			return NextResponse.json({ error: "Destination account ID is required" }, { status: 400 });
		}

		const sourceAccount =  await prisma.account.findFirst({
			where: {
				accountId: parseInt(sourceAccountId, 10),
				userId: parseInt(userId, 10)
			}
		})
		console.log("Source account fetched:", sourceAccount);

		const destinationAccount = await prisma.account.findFirst({
			where: { accountId: parseInt(destinationAccountId, 10) }
		});
		console.log("Destination account fetched:", destinationAccount);
		
		if (!sourceAccount) {
			return NextResponse.json({ error: "Source account not found." }, { status: 404 });
		}

		if (!destinationAccount) {
			return NextResponse.json({ error: "Destination account not found." }, { status: 404 });
		}

		if (sourceAccount.balance < parseFloat(amount)) {
			return NextResponse.json({ error: "Insufficient balance in source account" }, { status: 400 });
		}

		const [updatedSourceAccount, updatedDestinationAccount] = await prisma.$transaction([
			prisma.account.update({
				where: { accountId: sourceAccount.accountId },
				data: { balance: { decrement: parseFloat(amount) } }
			}),
			prisma.account.update({
				where: { accountId: destinationAccount.accountId },
				data: { balance: { increment: parseFloat(amount) } }
			})
		]);

		return NextResponse.json({ message: "Transfer successful", updatedSourceAccount, updatedDestinationAccount });
	} catch (error) {
		console.error("Error processing transfer:", error);
    return NextResponse.json({ error: "An error occurred while processing the transfer." }, { status: 500 });
	}
}