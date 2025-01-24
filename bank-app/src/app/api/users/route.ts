import { NextRequest, NextResponse } from "next/server";
import { User, AccountType, PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const userData = await request.json();
		
		const newUser: User = await prisma.user.create({
			data: {
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
				password: await bcryptjs.hash(userData.password, 10),
				pin: parseInt(userData.pin, 10),
			}
		})
		
		const accountType = userData.accountType;
    const accountsToCreate = [];
		
		if (accountType === 'checking' || accountType === 'both') {
			const checkingBalance = parseFloat(userData.checkingBalance);
			accountsToCreate.push({
				userId: newUser.userId,
				accountType: AccountType.CHECKING,
				balance: checkingBalance
			});
		}
				
		if (accountType === 'savings' || accountType === 'both') {
			const savingsBalance = parseFloat(userData.savingsBalance);
			accountsToCreate.push({
				userId: newUser.userId,
				accountType: AccountType.SAVINGS,
				balance: savingsBalance
			});
		}
					
		// Create accounts
		await prisma.account.createMany({
			data: accountsToCreate,
		});
						
    // Respond with the created user and associated accounts
    return NextResponse.json({ user: newUser }, { status: 201 });
	} catch (error) {
		console.error('Error creating user:', error);
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Internal Server Error', error: error.message },
				{ status: 500 }
			);
		}
		return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    )
	}
}