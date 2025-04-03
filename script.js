/**
 * Book Recommendation Application
 * Provides personalized book recommendations and wishlist management.
 * @author [Your Name]
 * @date March 10, 2025
 */

/* eslint-disable no-unused-vars */ // For development; remove in production

// Book database (could be moved to a separate JSON file for scalability)
const BOOK_CATALOG = Object.freeze([
    {
        id: 1,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "fantasy",
        price: 15.99,
        language: "english",
        format: "hardcover",
        rating: 4.8,
        description: "A magical adventure begins at Hogwarts."
    },
    {
        id: 2,
        title: "The Da Vinci Code",
        author: "Dan Brown",
        genre: "mystery",
        price: 12.50,
        language: "english",
        format: "paperback",
        rating: 4.5,
        description: "A thrilling mystery uncovering hidden secrets."
    },
    {
        id: 3,
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        genre: "non-fiction",
        price: 18.00,
        language: "english",
        format: "paperback",
        rating: 4.7,
        description: "An exploration of human history."
    },
    {
        id: 4,
        title: "Don Quijote de la Mancha",
        author: "Miguel de Cervantes",
        genre: "fiction",
        price: 20.00,
        language: "spanish",
        format: "hardcover",
        rating: 4.9,
        description: "A timeless Spanish classic."
    }
]);

// Wishlist management using local storage
const WishlistManager = {
    key: "bookWishlist",
    getWishlist: () => JSON.parse(localStorage.getItem(WishlistManager.key)) || [],
    saveWishlist: (wishlist) => localStorage.setItem(WishlistManager.key, JSON.stringify(wishlist)),
    addBook: (book) => {
        const wishlist = WishlistManager.getWishlist();
        if (!wishlist.some(item => item.id === book.id)) {
            wishlist.push(book);
            WishlistManager.saveWishlist(wishlist);
        }
        return wishlist;
    }
};

// DOM utility functions
const DOMUtils = {
    getElement: (selector) => document.querySelector(selector),
    createElement: (tag, attributes = {}, content = "") => {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        element.innerHTML = content;
        return element;
    }
};

// Main application logic
class BookRecommender {
    constructor() {
        this.form = DOMUtils.getElement("#book-form");
        this.bookList = DOMUtils.getElement("#book-list");
        this.wishlistList = DOMUtils.getElement("#wishlist-list");
        this.initEventListeners();
        this.renderWishlist();
    }

    initEventListeners() {
        this.form.addEventListener("submit", (event) => this.handleFormSubmit(event));
    }

    /**
     * Extracts and normalizes user preferences from the form
     * @returns {Object} User preferences
     */
    getUserPreferences() {
        return {
            genre: this.form.querySelector("#genre").value.toLowerCase() || "",
            author: this.form.querySelector("#author").value.toLowerCase().trim() || "",
            price: parseFloat(this.form.querySelector("#price").value) || Infinity,
            language: this.form.querySelector("#language").value.toLowerCase() || "",
            format: this.form.querySelector("#format").value.toLowerCase() || ""
        };
    }

    /**
     * Filters books based on user preferences
     * @param {Object} preferences - User preferences
     * @returns {Array} Filtered books
     */
    filterBooks(preferences) {
        return BOOK_CATALOG.filter(book => (
            (!preferences.genre || book.genre === preferences.genre) &&
            (!preferences.author || book.author.toLowerCase().includes(preferences.author)) &&
            (book.price <= preferences.price) &&
            (!preferences.language || book.language === preferences.language) &&
            (!preferences.format || book.format === preferences.format)
        )).sort((a, b) => b.rating - a.rating); // Sort by rating descending
    }

    /**
     * Renders the filtered book list with a highlighted best match
     * @param {Array} books - Filtered books
     */
    renderBookRecommendations(books) {
        this.bookList.innerHTML = "";
        if (!books.length) {
            this.bookList.appendChild(DOMUtils.createElement("p", {}, "No books match your criteria."));
            return;
        }

        books.forEach((book, index) => {
            const bookElement = DOMUtils.createElement("div", { className: `book-item ${index === 0 ? "best-match" : ""}` });
            bookElement.innerHTML = `
                <h3>${book.title} ${index === 0 ? "<span>(Best Match)</span>" : ""}</h3>
                <p>Author: ${book.author}</p>
                <p>Price: £${book.price.toFixed(2)}</p>
                <p>${book.description}</p>
                <button type="button" aria-label="Add ${book.title} to wishlist" onclick="app.addToWishlist(${book.id})">
                    Add to Wishlist
                </button>
            `;
            this.bookList.appendChild(bookElement);
        });
    }

    /**
     * Renders the wishlist from local storage
     */
    renderWishlist() {
        const wishlist = WishlistManager.getWishlist();
        this.wishlistList.innerHTML = "";
        wishlist.forEach(book => {
            this.wishlistList.appendChild(
                DOMUtils.createElement("div", { className: "wishlist-item" }, `<p>${book.title} by ${book.author}</p>`)
            );
        });
    }

    /**
     * Handles form submission and triggers recommendation logic
     * @param {Event} event - Form submission event
     */
    handleFormSubmit(event) {
        event.preventDefault();
        const preferences = this.getUserPreferences();
        const filteredBooks = this.filterBooks(preferences);
        this.renderBookRecommendations(filteredBooks);
    }

    /**
     * Adds a book to the wishlist and updates the UI
     * @param {number} bookId - ID of the book to add
     */
    addToWishlist(bookId) {
        const book = BOOK_CATALOG.find(b => b.id === bookId);
        if (book) {
            WishlistManager.addBook(book);
            this.renderWishlist();
        }
    }
}

// Initialize the application
const app = new BookRecommender();

// Expose addToWishlist globally for button onclick handlers
window.app = app;