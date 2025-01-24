'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Account {
  accountId: string;
  accountType: 'CHECKING' | 'SAVINGS';
  balance: number;
}

interface Transaction {
  transactionId: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  sourceAccount: Account["accountType"];
  destinationAccount: Account["accountType"];
  amount: number;
  timestamp: string;
}

export default function UserHistoryPage({ params }: { params: { userId: string } }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get<Transaction[]>(`/api/accounts/${params.userId}/history`);
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('Failed to fetch transaction history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [params.userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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

  if (showLogoutMessage) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px', color: 'white' }}>
        Thank you for banking with BankApp
      </div>
    );
  }

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="border-b border-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Transaction History for User ID: {params.userId}</h1>
        <div className="flex gap-4">
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500">Logout</button>
          <button onClick={() => router.back()} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500">Back</button>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left bg-gray-800 text-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 border-b border-gray-600">Type</th>
                <th className="px-4 py-3 border-b border-gray-600">Source</th>
                <th className="px-4 py-3 border-b border-gray-600">Destination</th>
                <th className="px-4 py-3 border-b border-gray-600">Amount ($)</th>
                <th className="px-4 py-3 border-b border-gray-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={transaction.transactionId} className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}>
                  <td className="px-4 py-3 border-b border-gray-600">{transaction.type}</td>
                  <td className="px-4 py-3 border-b border-gray-600">{transaction.sourceAccount}</td>
                  <td className="px-4 py-3 border-b border-gray-600">{transaction.destinationAccount}</td>
                  <td className="px-4 py-3 border-b border-gray-600">{transaction.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 border-b border-gray-600">{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="border-t border-slate-700 p-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} BankApp</p>
      </footer>
    </div>
	)
}