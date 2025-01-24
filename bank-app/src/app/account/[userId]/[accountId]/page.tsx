'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Account {
	accountId: string;
	accountType: 'CHECKING' | 'SAVINGS';
	balance: number;
}

export default function UserAccountPage({ params }: { params: { userId: string, accountId: string } }) {
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchAccountBalance = async () => {
			try {
				const response = await axios.get<Account>(`/api/accounts/${params.userId}/${params.accountId}`);
				setSelectedAccount(response.data);
			} catch (error) {
				console.error('Error fetching account balance:', error);
			}
		};

		fetchAccountBalance();
  }, [params.userId, params.accountId]);

	const depositScreen = () => {
		router.push(`/account/${params.userId}/${params.accountId}/deposit`)
	}

	const withdrawScreen = () => {
		router.push(`/account/${params.userId}/${params.accountId}/withdraw`)
	}

	const transferScreen = () => {
		router.push(`/account/${params.userId}/transfer`)
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
			<header className="border-b border-slate-700 p-4">
				<h1 className="text-xl font-semibold">Details for Account ID: {params.accountId}</h1>
			</header>

			<main className="flex-grow p-6">
				<div className="mb-6">
					<h2 className="text-lg font-medium">Account Type:</h2>
					<p className="text-gray-300">{selectedAccount?.accountType}</p>
				</div>
				<div className="mb-6">
					<h2 className="text-lg font-medium">Balance:</h2> 
					<p className="text-gray-300">${selectedAccount?.balance.toFixed(2)}</p>
				</div>
				<div>
					<h1 className="text-xl font-semibold mb-4">What would you like to do?</h1>
					<div className="flex flex-wrap gap-4">
						<button onClick={depositScreen} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Deposit</button>
						<button onClick={withdrawScreen} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Withdraw</button>
						<button onClick={transferScreen} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Transfer</button>
					</div>
				</div>
			</main>

			<footer className="border-t border-slate-700 p-4 flex justify-between">
				<button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Logout</button>
				<button onClick={() => router.back()} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">Back</button>
			</footer>
		</div>
	)
}