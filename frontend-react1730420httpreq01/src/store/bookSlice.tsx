import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type RootState } from './index';
// กำหนด Type สำหรับ Book
export interface Book {
    id: number;
    bookname: string;
    ISBN: string;
    price: number;
}
// State ของหนังสือ
interface BookState {
    books: Book[];
    loading: boolean;
    error: string | null;
    
}
// State เริ่มต้น
const initialState: BookState = {
    books: [],
    loading: false,
    error: null,
};
// Base URL สำหรับ API
const API_URL = '/api/books';
// Async Thunks สำหรับ API calls (ใช้ Axios GET POST PUT DELETE)
export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    const response = await axios.get<Book[]>(API_URL);
    return response.data;
});
export const addBook = createAsyncThunk('books/addBook', async (newBook: { bookname: string; ISBN: string; price: number }) => {
    const response = await axios.post<Book>(API_URL, newBook);
    return response.data;
});
export const updateBook = createAsyncThunk('books/updateBook', async (updatedBook: Book) => {
    const response = await axios.put<Book>(`${API_URL}/${updatedBook.id}`, updatedBook);
    return response.data;
});
export const deleteBook = createAsyncThunk('books/deleteBook', async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});
// Redux Slice
const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Books
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
                state.loading = false;
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch books';
            })
            // Add Book
            .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
                state.books.push(action.payload);
            })
            // Update Book
            .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
                const index = state.books.findIndex(book => book.id === action.payload.id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
            })
            // Delete Book
            .addCase(deleteBook.fulfilled, (state, action: PayloadAction<number>) => {
                state.books = state.books.filter(book => book.id !== action.payload);
            });
    },
});
export default bookSlice.reducer;
// Selectors
export const selectBooks = (state: RootState) => state.books.books;
export const selectLoading = (state: RootState) => state.books.loading;
export const selectError = (state: RootState) => state.books.error;