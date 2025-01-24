import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = NextResponse.json({ message: "Logout successful"} )
		response.cookies.set("token", "", { httpOnly: true })
		return response;
	} catch (error) {
		return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
	}
}