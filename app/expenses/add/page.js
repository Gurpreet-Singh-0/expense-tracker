'use client'
import ExpenseForm from '../../../components/Expenses/ExpenseForm'
import useExpenses from '../../../hooks/useExpenses'
import React from 'react'

function page() {
  const { addExpense } = useExpenses(); // Get the addExpense function

  const handleSubmit = async (expenseData) => {
    try {
      await addExpense(expenseData);
   
      console.log('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
   
    }
  };

  return (
    <div>
      <ExpenseForm onSubmit={handleSubmit} />
    </div>
  )
}

export default page