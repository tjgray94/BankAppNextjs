'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Account {
  accountId: string;
  accountType: 'CHECKING' | 'SAVINGS';
  balance: number;
}

export default function UserHomePage({ params }: { params: Promise<{ userId: string }> }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const resolvedParams = await params;
        const userId = resolvedParams.userId;
        setUserId(userId);
        const response = await axios.get<Account[]>(`/api/accounts/${userId}`);
        setAccounts(response.data);
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError('Failed to fetch account details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [params]);

  const handleAccountSelection = (account: Account) => {
    if (userId) {
      router.push(`/account/${userId}/${account?.accountId}`)
    }
  };

  const handleTransactionHistory = () => {
    if (userId) {
      router.push(`/account/${userId}/history`)
    }
  };

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
		<div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <span className="text-sm font-medium">Account Details for User ID: {userId}</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-8"> 
        <h1 className="mb-4 text-2xl font-semibold">Select the account to access</h1>
        
        {accounts.length > 0 ? (
          <div className="space-y-4">
            {/* Account Buttons */}
            <div className="flex gap-4">
              {accounts.map((account, index) => (
                <button type="button" key={account.accountId || index} onClick={() => handleAccountSelection(account)}
                  className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  {account.accountType === 'CHECKING' ? 'Checking' : 'Savings'}
                </button>
              ))}
              <button onClick={handleTransactionHistory} className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                History
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-gray-400">No accounts found for this user.</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t border-slate-700 p-4">
        <span>
          <button onClick={logout} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Logout</button>
          <button onClick={() => router.back()} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">Back</button>
        </span>
      </div>
    </div>
	)
}