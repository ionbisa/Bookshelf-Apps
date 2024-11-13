document.addEventListener("DOMContentLoaded", () => {
  const bookListKey = "bookList"; // Key untuk menyimpan data di Local Storage
  const bookList = JSON.parse(localStorage.getItem(bookListKey)) || []; // Mendapatkan data buku dari Local Storage

  // Fungsi untuk menyimpan data buku ke Local Storage
  function saveBooks() {
    localStorage.setItem(bookListKey, JSON.stringify(bookList));
  }

  // Fungsi untuk menambahkan buku baru ke daftar buku
  function addBook(book) {
    bookList.push(book);
    saveBooks();
    renderBooks();
  }

  // Fungsi untuk menghapus buku berdasarkan ID buku
  function removeBook(bookId) {
    const index = bookList.findIndex((b) => b.id === bookId);
    if (index !== -1) {
      bookList.splice(index, 1); // Menghapus buku dari array
      saveBooks();
      renderBooks();
    }
  }

  // Fungsi untuk mengubah status selesai/belum selesai dibaca
  function toggleComplete(bookId) {
    const book = bookList.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete; // Mengubah status isComplete
      saveBooks();
      renderBooks();
    }
  }

  // Fungsi untuk merender daftar buku
  function renderBooks() {
    const incompleteList = document.getElementById("incompleteBookList");
    const completeList = document.getElementById("completeBookList");

    // Membersihkan daftar buku sebelum merender ulang
    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    // Melakukan perulangan untuk setiap buku
    bookList.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.dataset.bookid = book.id;
      bookItem.dataset.testid = "bookItem";
      bookItem.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div>
            <button data-testid="bookItemIsCompleteButton">${
              book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
            }</button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          </div>
        `;
      // Menambahkan event listener untuk tombol "Selesai dibaca"/"Belum selesai dibaca"
      bookItem
        .querySelector('[data-testid="bookItemIsCompleteButton"]')
        .addEventListener("click", () => toggleComplete(book.id));

      // Menambahkan event listener untuk tombol "Hapus Buku"
      bookItem
        .querySelector('[data-testid="bookItemDeleteButton"]')
        .addEventListener("click", () => removeBook(book.id));

      if (book.isComplete) {
        completeList.appendChild(bookItem);
      } else {
        incompleteList.appendChild(bookItem);
      }
    });
  }

  // Event listener untuk menangani submit pada form tambah buku baru
  document.getElementById("bookForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Mencegah halaman direload saat submit

    // Mendapatkan nilai input dari form
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value, 10);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    // Membuat objek buku baru
    const newBook = {
      id: Date.now(), // Menggunakan waktu saat ini sebagai ID unik
      title,
      author,
      year,
      isComplete,
    };

    addBook(newBook); // Menambahkan buku ke bookList
    e.target.reset(); // Mengosongkan form setelah submit
  });

  // Memanggil renderBooks untuk menampilkan daftar buku saat pertama kali halaman dimuat
  renderBooks();
});
