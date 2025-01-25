'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Account {
  accountId: string;
  accountType: 'CHECKING' | 'SAVINGS';
  balance: number;
}

export default function Deposit({ params }: { params: Promise<{ userId: string, accountId: string }> }) {
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
	const [amount, setAmount] = useState('');
	const [resolvedParams, setResolvedParams] = useState<{ userId: string; accountId: string } | null>(null);
	const [showTransactionPrompt, setShowTransactionPrompt] = useState(false);
	const [showLogoutMessage, setShowLogoutMessage] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchAccount = async () => {
			try {
				const resolved = await params;
				setResolvedParams(resolved);

				const response = await axios.get<Account>(`/api/accounts/${resolved.userId}/${resolved.accountId}`);
				setSelectedAccount(response.data);
			} catch (error) {
				console.error('Error fetching account:', error);
			}
		}
		fetchAccount();
	}, [params]);

	const handleDeposit = async () => {
		const depositAmount = parseFloat(amount);

		if (resolvedParams && !isNaN(depositAmount) && depositAmount > 0 && selectedAccount) {
			try {
				const response = await axios.put(`/api/accounts/${resolvedParams.userId}/${resolvedParams.accountId}/deposit`, { amount: depositAmount });
				setSelectedAccount((prev) => prev && { ...prev, balance: prev.balance + depositAmount });
				setAmount('');
				
				const transactionData = {
					type: 'DEPOSIT',
					sourceAccount: selectedAccount.accountType, 
					destinationAccount: selectedAccount.accountType,
					amount: depositAmount,
					timestamp: new Date().toISOString()
				};

				console.log("Transaction Data Being Sent:", transactionData);

				const createTransaction = await axios.post(`/api/accounts/${resolvedParams.userId}/history`, transactionData);

				alert('Deposit successful!');
				setShowTransactionPrompt(true);
			} catch (error) {
				console.error('Error updating account:', error);
				alert('Error updating account. Please try again.');
			}
		} else {
			alert('Please enter a valid amount.');
		}
	};

	const logout = async () => {
		try {
			setShowLogoutMessage(true);
			await axios.get('/api/logout');
			setTimeout(() => {      
				router.push('/login');
			}, 5000);
		} catch (error) {
			console.error('Error during logout:', error);
		}
	}
	
	const handleContinue = () => {
		setShowTransactionPrompt(false);
  };
	
	const handleNo = () => {
		setShowTransactionPrompt(false);
		console.log({ showLogoutMessage, showTransactionPrompt });
    logout();
  };

  if (showLogoutMessage) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px', color: 'white' }}>
        Thank you for banking with BankApp
      </div>
    );
  }

	if (showTransactionPrompt) {
    return (
      <div className="text-center mt-12">
        <p className="text-white text-lg mb-4">Would you like to make another transaction?</p>
        <div className="flex justify-center space-x-4">
					<button onClick={handleContinue} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
						Yes
					</button>
					<button onClick={handleNo} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
						No
					</button>
				</div>
      </div>
    );
  }
		
	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
			<header className="border-b border-slate-700 p-4">
      	<h1 className="text-xl font-semibold">Deposit</h1>
    	</header>

			<main className="flex-grow p-6">
				<div className="max-w-md mx-auto">
					<label htmlFor="amount" className="block text-lg font-medium mb-2">Deposit Amount: </label>
					<input type="number" value={amount} placeholder="Enter amount" onChange={(e) => setAmount(e.target.value)} 
						className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div className="mt-6 flex flex-col items-center gap-4">
						<button onClick={handleDeposit} disabled={!amount}
							className={`px-6 py-3 rounded-lg font-medium ${
								amount
									? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
									: "bg-gray-700 text-gray-400 cursor-not-allowed"
							}`}
						>
							Confirm Deposit
						</button>
						<button onClick={() => router.back()} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">Back</button>
					</div>
				</div>
			</main>

			<footer className="border-t border-slate-700 p-4 text-center text-sm text-gray-400">
      	<p>&copy; {new Date().getFullYear()} BankApp</p>
    	</footer>
		</div>
	)
}