import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
			{/* Header */}
			<h1 className="text-4xl font-bold mb-4 text-blue-500">Welcome to BankApp!</h1>
			<p className="text-lg text-gray-300 mb-6">Your trusted partner in banking.</p>
			
			{/* Buttons */}
			<div className="flex space-x-4">
				<Link href="/signup">
					<button type="button" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 text-white font-semibold rounded-lg text-sm shadow-lg transition-all focus:outline-none dark:focus:ring-blue-800">Signup</button>
				</Link>
				<Link href="/login">
					<button type="button" className="px-6 py-3 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500 text-white font-semibold rounded-lg text-sm shadow-lg transition-all focus:outline-none dark:focus:ring-green-800">Login</button>
				</Link>
			</div>
		</div>
  );
}
