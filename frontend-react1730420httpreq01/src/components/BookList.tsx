import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type AppDispatch } from '../store';
import { fetchBooks, deleteBook, selectBooks, selectLoading, selectError, type Book } from '../store/bookSlice';
import BookForm from './BookForm';
/* สำหรับ display, edit, delete */
const BookList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector(selectBooks);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const [editingBook, setEditingBook] = useState<Book | undefined>(undefined); // State ท้องถิ่น
    // ฟังก์ชัน เพื่อเรียกใช้ fetchBooks
    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);
    // ฟังก์ชันเพื่อการแก้ไขข้อมูลหนังสือ
    const handleEdit = (book: Book) => {
        setEditingBook(book);
    };
    // ฟังก์ชันเพื่อการยกเลิกการแก้ไขข้อมูลหนังสือ
    const handleCancelEdit = () => {
        setEditingBook(undefined);
    };

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">Error: {error}</p>;
    // Add a check to ensure 'books' is an array before trying to map over it.
    // This prevents the component from crashing if the API returns unexpected data.
    if (!Array.isArray(books)) {
        return <p className="text-center text-red-600">Error: Received invalid data from the server.</p>;
    }
    // **************** JSX *****************************
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Book List</h2>
            {books.length === 0 ? (
                <p className="text-center text-gray-500">No books found. Add one above!</p>
            ) : (
                <ul className="space-y-3">
                    { 
                        books.map(book => (
                            <li key={book.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                                <div>
                                    <h3 className="font-medium text-gray-700">{book.bookname}</h3>
                                    <p className="text-gray-600">{book.ISBN}</p>
                                    {/* Ensure price is a number before calling toFixed to prevent crashes */}
                                    <p className="text-gray-600">${book.price}</p>
                                    {/* <p className="text-gray-600">${(typeof book.price === 'number' ? book.price : 0).toFixed(2)}</p> */}
                                </div>
                                <div className="flex space-x-2">
                                    {/* ปุ่มแก้ไขรายการหนังสือ */}
                                    <button onClick={() => handleEdit(book)}
                                        className="text-blue-500 hover:text-blue-700" >
                                        Edit
                                    </button>
                                    {/* ปุ่มลบรายการหนังสือ */}
                                    <button onClick={() => dispatch(deleteBook(book.id))}
                                        className="text-red-500 hover:text-red-700" >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            )}
            {/* เรียก component ที่ชื่อ BookForm พร้อมส่ง props (เป็น function) ไปให้ 2 ตัว */}
            {editingBook && (
                <div className="mt-6">
                    <BookForm editingBook={editingBook} onCancelEdit={handleCancelEdit} />
                </div>
            )}
        </div>
    );
};
export default BookList;