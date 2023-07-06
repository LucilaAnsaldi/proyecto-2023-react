import { useEffect, useState } from "react";

import NewBook from "../NewBook/NewBook";
import BooksFilter from "../bookFilter/BookFilter";
import Books from "../books/Books";
const BOOKS = [];

const Dashboard = () => {
  const [books, setBooks] = useState(BOOKS);
  const [yearFiltered, setYearFiltered] = useState("2023");

  useEffect(() => {
    fetch("http://localhost:8080/book/traertodoslosbook", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((bookData) => {
        const booksMapped = bookData.map((book) => ({
          title: book.bookTitle,
          author: book.author,
          dateRead: new Date(book.date),
          pageCount: book.amountPages,
        }));
        console.log(booksMapped);
        setBooks(booksMapped);
      })
      .catch((error) => console.log(error));
  }, []);

  const addBookHandler = (book) => {
    const dateString = book.dateRead.toISOString().slice(0, 10);

    fetch("http://localhost:8080/book/crear", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        bookTitle: book.title,
        amountPages: book.pageCount,
        date: dateString,
        author: book.author,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else {
          throw new Error("The response had some errors");
        }
      })
      .then(() => {
        const newBooksArray = [book, ...books];
        console.log(newBooksArray);
        setBooks(newBooksArray);
      })
      .catch((error) => console.log(error));

    // const newBooksData = [book, ...books];
    // setBooks(newBooksData);
    // localStorage.setItem("books", JSON.stringify(newBooksData));
  };

  const handleFilterChange = (year) => {
    setYearFiltered(year);
  };

  return (
    <>
      <h1>Books Champion App!</h1>
      <h3>¡Quiero leer libros!</h3>
      <NewBook onBookAdded={addBookHandler} />
      <BooksFilter
        yearFiltered={yearFiltered}
        onYearChange={handleFilterChange}
      />
      <Books yearFiltered={yearFiltered} books={books} />
    </>
  );
};

export default Dashboard;
