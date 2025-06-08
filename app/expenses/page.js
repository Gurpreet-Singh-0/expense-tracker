"use client";

import React from 'react';
import ExpenseList from '../../components/Expenses/ExpenseList';
import useExpenses from '../../hooks/useExpenses'; 
import { useRouter } from 'next/navigation';

function Page() {
  const {
    expenses,
    loading,
    error,
    updateExpense,
    deleteExpense
  } = useExpenses();
const router= useRouter();
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
        <p className="text-gray-600 mt-2">Track and manage your expenses</p>
      </div>
      <button onClick={()=>router.push('/expenses/add')}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add Expenses</button>
      <ExpenseList 
        expenses={expenses}
        onUpdate={updateExpense}
        onDelete={deleteExpense}
      />
    </div>
  );
}

export default Page;