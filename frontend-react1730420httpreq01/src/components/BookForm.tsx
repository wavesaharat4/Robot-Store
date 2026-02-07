import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../store';
import { addBook, updateBook, type Book } from '../store/bookSlice';
interface BookFormProps {
    editingBook?: Book; // สำหรับ edit mode
    onCancelEdit?: () => void; // สำหรับยกเลิก edit
}
/* นิยามคอมโพเนนต์ สำหรับ add book ใหม่ */
const BookForm: React.FC<BookFormProps> = ({ editingBook, onCancelEdit }) => {
    const dispatch = useDispatch<AppDispatch>();
    // Use local state to manage form inputs
    const [bookname, setBookname] = useState(editingBook?.bookname || '');
    const [ISBN, setISBN] = useState(editingBook?.ISBN || '');
    const [price, setPrice] = useState(editingBook?.price || 0);
    // ฟังก์ชันรองรับปุ่ม SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBook) {
                // Dispatch update and wait for it to complete
                await dispatch(updateBook({ id: editingBook.id, bookname, ISBN, price })).unwrap();
                if (onCancelEdit) onCancelEdit(); // Cancel edit mode on success
            } else {
                // Dispatch add and wait for it to complete
                await dispatch(addBook({ bookname, ISBN, price })).unwrap();
                // Reset form only on successful addition
                setBookname('');
                setISBN('');
                setPrice(0);
            }
        } catch (error) {
            console.error('Failed to save the book:', error);
            // Optional: Display an error message to the user
        }
    };
    // ************* JSX ************************
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ช่องกรอกชื่อหนังสือ */}
                <div>
                    <label className="block text-gray-700">Title:</label>
                    <input
                        type="text" value={bookname} onChange={(e) => setBookname(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>
                {/* ช่องกรอ ISBN */}
                <div>
                    <label className="block text-gray-700">ISBN:</label>
                    <input type="text" value={ISBN} onChange={(e) => setISBN(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>
                {/* ช่องกรอกราคา Price */}
                <div>
                    <label className="block text-gray-700">Price:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required min="0" step="0.01" />
                </div>
                {/* ปุ่ม Submit Buttons */}
                <div className="flex space-x-2">
                    <button type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex-grow" >
                        {editingBook ? 'Update' : 'Add'}
                    </button>
                    {/* กรณีมีการแก้ไขรายการหนังสือ */}
                    {editingBook && onCancelEdit && (
                        <button type="button"
                            onClick={onCancelEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors" >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
export default BookForm;
