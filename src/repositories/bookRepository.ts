import prisma from '../util/prisma';
import { CreateBookInput,ReturnBook,Book, UpdateBookInput} from "../interfaces/bookInterfaces";

interface GetOptions {
  skip?: number;
  take?: number;
  id?: string;
  createdById?: string;
}

export class BookRepository {

  async getRemainingQuantity(id: string): Promise<number> {
    const book = await prisma.book.findUnique({
      where: {
        id
      }
    });

    if (!book) {
      throw new Error("Book not found");
    }

    const activeLoansCount = await prisma.loan.count({
      where: {
        itemId: id,
        itemType: "BOOK",
        status: "ACTIVE"
      }
    });

    const remainingBooks = book.quantity - activeLoansCount;
    return remainingBooks;
  }

  async verifyBookExists(id: string): Promise<boolean> {

    const existingBook = await prisma.book.findUnique({
        where: {
          id
        }
    });

    return !!existingBook; 

  }
    

  async create({ title, author, quantity, createdById }: CreateBookInput): Promise<Book> {

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        quantity,
        createdById
      }
    });

    let book: Book = {
      id: newBook.id,
      title: newBook.title,
      author: newBook.author,
      quantity: newBook.quantity,
      createdById: newBook.createdById
    };

    return book;
  }

  async get({ skip, take, id, createdById }: GetOptions): Promise<ReturnBook | ReturnBook[]> {

    const fetchedBooks = await prisma.book.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      },
      where: {
        id ,
        createdById
      }
    });

    const count = await prisma.book.count({
      where: {
        id ,
        createdById
      }
    });

    let books: Book[] | Book | null = await Promise.all(fetchedBooks.map(async book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      quantity: book.quantity,
      createdById: book.createdById,
      remainingQuantity: await this.getRemainingQuantity(book.id)
    })));

    books = Array.isArray(books) && books.length === 1 ? books[0] : books;
    books = Array.isArray(books) && books.length === 0 ? null : books;

    return { book: books,
      count
    };

  }

  async delete(id: string): Promise<void> {
    const bookExists = await this.verifyBookExists(id);

    if (!bookExists) {
      throw new Error("Book not found");
    }

    await prisma.book.delete({
      where: {
        id
      }
    });
  }

  async update(id: string, data: UpdateBookInput): Promise<Book> {
    const bookExists = await this.verifyBookExists(id);

    if (!bookExists) {
      throw new Error("Book not found");
    }

    const updatedBook = await prisma.book.update({
      where: {
        id
      },
      data: {
        title: data.title,
        author: data.author,
        quantity: data.quantity,
      }
    });

    let bookResult: Book = {
      id: updatedBook.id,
      title: updatedBook.title,
      author: updatedBook.author,
      quantity: updatedBook.quantity,
      createdById: updatedBook.createdById
    };

    return bookResult;
  }

  async countRemainingBooksById(id: string): Promise<number> {
    const book = await prisma.book.findUnique({
      where: {
        id
      }
     });

    if (!book) {
      throw new Error("Book not found");
    }

    const activeLoansCount = await prisma.loan.count({
      where: {
        itemId: id,
        itemType: "BOOK",
        status: "ACTIVE"
      }
    });

    const remainingBooks = book.quantity - activeLoansCount;
    return remainingBooks;
  }
}
