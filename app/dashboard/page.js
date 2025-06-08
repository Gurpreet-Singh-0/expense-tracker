"use client";
import React from 'react'
import { useState } from 'react';
import useExpenses from '../../hooks/useExpenses';
import ExpenseChart from '../../components/Dashboard/ExpenseChart';
import ExpenseSummary from '../../components/Dashboard/ExpenseSummary';
import RecentExpenses from '../../components/Dashboard/RecentExpenses';
import { motion } from 'framer-motion';

function page() {
  const {
    expenses,
    loading,
    error,
    getExpenseTotalsByCategory,
    getMonthlyExpenses,
    formatCurrency
  } = useExpenses();

  if(loading){
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 font-medium"
          >
            Loading your expenses...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  if(error){
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl shadow-sm border border-red-200 p-6 max-w-md w-full"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
              <div className="mt-2 text-sm text-red-600">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const totalExpenses = expenses.reduce((sum,expense)=> sum+expense.amount,0);
  const categoryTotals = getExpenseTotalsByCategory();
  const monthlyData = getMonthlyExpenses();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Expense Dashboard</h1>
          <p className="text-gray-600 mt-2">Track and analyze your spending patterns</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ExpenseSummary
            totalExpenses={totalExpenses}
            categoryTotals={categoryTotals}
            expenses={expenses}
            formatCurrency={formatCurrency}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <ExpenseChart
              monthlyData={monthlyData}
              categoryTotals={categoryTotals}
            />
          </div>

          <div className="lg:col-span-1">
            <RecentExpenses
              expenses={expenses.slice(0,10)}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default page