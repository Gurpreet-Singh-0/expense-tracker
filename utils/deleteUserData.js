import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

export async function deleteUserData(userId) {
  try {
    // Delete all expenses
    const expensesRef = collection(db, 'expenses');
    const expensesQuery = query(expensesRef, where('userId', '==', userId));
    const expensesSnapshot = await getDocs(expensesQuery);
    
    const deletePromises = expensesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Add other user data deletions here if you have more collections
    
    return true;
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
}