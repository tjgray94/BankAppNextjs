import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const loginRequest = await request.json();
		const { email, pin } = loginRequest;

		const user = await prisma.user.findUnique({
			where: { email }
		})

		if (!user) {
			return NextResponse.json({ authenticated: false }, { status: 401 })
		}

		// if loginRequest contained 'password' field
		// const validPassword = await bcryptjs.compare(pin, loginRequest.pin);
		// if (!validPassword) {
		// 	return NextResponse.json({error: "Invalid password"}, {status: 400})
		// }

		// Create token
		const tokenData = {
			id: user?.userId,
			email: user?.email
		}
		const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

		const response = NextResponse.json({
			authenticated: true,
      message: "Login Successful",
      userId: user.userId
		})

		response.cookies.set("token", token, {httpOnly: true});
		
		return response;
	} catch (error) {
		console.error("Error during authentication:", error);
		return NextResponse.json({message: "Internal Server Error"}, {status: 500})
	}
}