"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDate, formatDateForInput } from '../utils/dateFormatter';
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp
} from 'firebase/firestore';

export default function useExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!user) {
                setExpenses([]);
                setLoading(false);
                return;
            }

            const expenseRef = collection(db, 'expenses');
           const q = query(
  expenseRef,
  where('userId', "==", user.uid),
  orderBy('date', 'desc')
);

            const querySnapshot = await getDocs(q);
            const expensesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
                formattedDate: formatDate(doc.data().date.toDate()),
                formattedAmount: formatCurrency(doc.data().amount)
            }));
            setExpenses(expensesData);
        } catch (err) {
            console.error('Error fetching expenses', err);
            setError("Failed to load expenses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (expenseData) => {
        try {
            if (!user) throw new Error("User not authenticated");
            
            // Validate amount
            const amount = parseFloat(expenseData.amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error("Invalid amount");
            }

            // Validate date
            const date = new Date(expenseData.date);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }

            const newExpense = {
                ...expenseData,
                userId: user.uid,
                date: Timestamp.fromDate(date),
                amount: amount,
                createdAt: Timestamp.now()
            };
            
            const docRef = await addDoc(collection(db, 'expenses'), newExpense);
            await fetchExpenses(); // Refresh the list
            
            return {
                id: docRef.id,
                ...newExpense,
                date: date,
                formattedDate: formatDate(date),
                formattedAmount: formatCurrency(amount)
            };
        } catch (err) {
            console.error("Error adding expense:", err);
            setError(err.message || "Failed to add expense");
            throw err;
        }
    };

    const updateExpense = async (id, expenseData) => {
        try {
            if (!user) throw new Error('User not authenticated');

            // Validate amount
            const amount = parseFloat(expenseData.amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error("Invalid amount");
            }

            // Validate date
            const date = expenseData.date instanceof Date ? 
                expenseData.date : 
                new Date(expenseData.date);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }

            const expenseRef = doc(db, 'expenses', id);

            await updateDoc(expenseRef, {
                ...expenseData,
                amount: amount,
                date: Timestamp.fromDate(date),
                updatedAt: Timestamp.now()
            });
            
            await fetchExpenses(); // Refresh the list
            
            return {
                id,
                ...expenseData,
                date,
                formattedDate: formatDate(date),
                formattedAmount: formatCurrency(amount)
            };
        } catch (err) {
            console.error('Error updating expense:', err);
            setError(err.message || "Failed to update expense");
            throw err;
        }
    };

    const deleteExpense = async (id) => {
        try {
            if (!user) throw new Error('User not authenticated');
            await deleteDoc(doc(db, 'expenses', id));
            await fetchExpenses(); // Refresh the list
        } catch (err) {
            console.error('Error deleting expense:', err);
            setError(err.message || "Failed to delete expense");
            throw err;
        }
    };

    const getExpenseTotalsByCategory = () => {
        const categoryTotals = {};
        expenses.forEach(expense => {
            const { category, amount } = expense;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += amount;
        });
        
        // Convert to array with formatted amounts
        return Object.entries(categoryTotals).map(([category, total]) => ({
            category,
            total,
            formattedTotal: formatCurrency(total)
        }));
    };

    const getMonthlyExpenses = () => {
        const today = new Date();
        const months = [];
        const monthlyData = [];
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push(month);
        }
        
        // Initialize monthly data with formatted month names
        months.forEach(month => {
            monthlyData.push({
                month: formatDate(month, { month: 'short', year: 'numeric' }),
                date: month,
                total: 0,
                formattedTotal: formatCurrency(0)
            });
        });

        // Calculate totals
        expenses.forEach(expense => {
            const expenseDate = expense.date;
            const expenseMonth = expenseDate.getMonth();
            const expenseYear = expenseDate.getFullYear();

            months.forEach((month, index) => {
                if (month.getMonth() === expenseMonth && month.getFullYear() === expenseYear) {
                    monthlyData[index].total += expense.amount;
                    monthlyData[index].formattedTotal = formatCurrency(monthlyData[index].total);
                }
            });
        });
        
        return monthlyData;
    };

    useEffect(() => {
        fetchExpenses();
    }, [user]);

    return {
        expenses,
        loading,
        error,
        clearError: () => setError(null),
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseTotalsByCategory,
        getMonthlyExpenses,
        formatCurrency,
        formatDate
    };
}