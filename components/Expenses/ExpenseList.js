"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../UI/Modal"; // Make sure this path is correct
import ExpenseForm from "./ExpenseForm"; // Make sure this exists

export default function ExpenseList({ expenses, onUpdate, onDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleDelete = (expense) => {
    setCurrentExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(currentExpense.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getCategoryColor = (category) => {
    const colors = {
      Food: "bg-red-100 text-red-800",
      Transportation: "bg-blue-100 text-blue-800",
      Housing: "bg-green-100 text-green-800",
      Utilities: "bg-purple-100 text-purple-800",
      Entertainment: "bg-pink-100 text-pink-800",
      Healthcare: "bg-indigo-100 text-indigo-800",
      Education: "bg-yellow-100 text-yellow-800",
      Shopping: "bg-orange-100 text-orange-800",
      Travel: "bg-teal-100 text-teal-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mt-4">
      {expenses.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No expenses found. Add one to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Amount", "Date", "Category", "Description", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className={`px-6 py-3 ${
                        heading === "Actions" ? "text-right" : "text-left"
                      } text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatAmount(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {expense.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-primary hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-5 w-5 text-green-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Expense"
      >
        <ExpenseForm
          expense={currentExpense}
          onSubmit={async (data) => {
            await onUpdate(currentExpense.id, data);
            setIsEditModalOpen(false);
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Expense"
      >
        <div>
          <p className="mb-4">
            Are you sure you want to delete the expense "
            <strong>{currentExpense?.title}</strong>"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
