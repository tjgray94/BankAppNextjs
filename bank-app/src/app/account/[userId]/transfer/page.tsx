'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Account {
  accountId: string;
  accountType: 'CHECKING' | 'SAVINGS';
  balance: number;
}

export default function Transfer({ params }: { params: Promise<{ userId: string, accountId: string }> }) {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [amount, setAmount] = useState('');
  const [resolvedParams, setResolvedParams] = useState<{ userId: string; accountId: string } | null>(null);
	const [transferDirection, setTransferDirection] = useState<'checkingToSavings' | 'savingsToChecking' | null>(null);
	const [showTransactionPrompt, setShowTransactionPrompt] = useState(false);
	const [showLogoutMessage, setShowLogoutMessage] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchAccounts = async () => {
			try {
        const resolved = await params;
				setResolvedParams(resolved);
				const response = await axios.get<Account[]>(`/api/accounts/${resolved.userId}`);
				setAccounts(response.data);
			} catch (error) {
				console.error('Error fetching accounts:', error);
			}
		}
		fetchAccounts();
	}, [params]);

	const handleTransfer = async () => {
    if (!transferDirection) {
      alert("Please select a transfer direction.");
      return;
    }

    const transferAmount = parseFloat(amount);
		if (isNaN(transferAmount) || transferAmount <= 0) {
      alert("Please enter a valid transfer amount.");
    }

    try {
      const sourceAccountType = transferDirection === 'checkingToSavings' ? 'CHECKING' : 'SAVINGS';
      const destinationAccountType = transferDirection === 'checkingToSavings' ? 'SAVINGS' : 'CHECKING';
  
      const sourceAccount = accounts.find(account => account.accountType === sourceAccountType);
      const destinationAccount = accounts.find(account => account.accountType === destinationAccountType);
  
      if (!sourceAccount || !destinationAccount) {
        alert("Required accounts not found.");
        return;
      }
  
      if (transferAmount > sourceAccount.balance) {
        alert("Insufficient funds in the source account.");
        return;
      }

      const response = await axios.put(`/api/accounts/${resolvedParams?.userId}/transfer`, {
        sourceAccountId: sourceAccount.accountId,
        destinationAccountId: destinationAccount.accountId,
        amount: transferAmount
      });
      
      setAccounts(prev =>
        prev.map(acc =>
          acc.accountId === sourceAccount.accountId
            ? { ...acc, balance: acc.balance - transferAmount }
            : acc.accountId === destinationAccount.accountId
            ? { ...acc, balance: acc.balance + transferAmount }
            : acc
        )
      );
      
      const transactionData = {
        type: 'TRANSFER',
        sourceAccount: sourceAccount.accountType,
        destinationAccount: destinationAccount.accountType, 
        amount: transferAmount,
        timestamp: new Date().toISOString()
      };
      
      console.log("Transaction Data Being Sent:", transactionData);
      
      await axios.post(`/api/accounts/${resolvedParams?.userId}/history`, transactionData);
      
      setAmount('');
      alert('Transfer successful!');
      setShowTransactionPrompt(true);
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('Error processing transfer. Please try again.');
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
      	<h1 className="text-xl font-semibold">Transfer</h1>
    	</header>

			<main className="flex-grow p-6">
				<div className="max-w-md mx-auto">
					{/* Transfer Direction */}
					<div className="mb-6">
						<label className="block text-lg font-medium mb-4">Select Transfer Direction:</label>
						<div className="flex flex-col gap-4">
							<label className="flex items-center">
								<input
									type="radio"
									value="checkingToSavings"
									checked={transferDirection === 'checkingToSavings'}
									onChange={() => setTransferDirection('checkingToSavings')}
									className="form-radio text-blue-600 focus:ring-blue-500 mr-2"
								/>
								Checking → Savings
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									value="savingsToChecking"
									checked={transferDirection === 'savingsToChecking'}
									onChange={() => setTransferDirection('savingsToChecking')}
									className="form-radio text-blue-600 focus:ring-blue-500 mr-2"
								/>
								Savings → Checking
							</label>
						</div>
					</div>

					{/* Transfer Amount */}
					<div className="mb-6">
						<label htmlFor="amount" className="block text-lg font-medium mb-2">Transfer Amount: </label>
						<input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount"
							className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Buttons */}
					<div className="mt-6 flex flex-col items-center gap-4">
						<button onClick={handleTransfer} disabled={!amount}
							className={`px-6 py-3 rounded-lg font-medium ${
								amount
									? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
									: "bg-gray-700 text-gray-400 cursor-not-allowed"
							}`}
						>
							Confirm Transfer
						</button>
						<button onClick={() => router.back()} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">Back</button>
					</div>
				</div>
			</main>

			<footer className="border-t border-slate-700 p-4 text-center text-sm text-gray-400">
      	<p>&copy; {new Date().getFullYear()} BankApp</p>
    	</footer>
		</div>
	)
}