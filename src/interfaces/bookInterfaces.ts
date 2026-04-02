interface Book {
  id: string;
  title: string;
  author: string;
  quantity: number;
  createdById: string;
}

interface ReturnBook {
  book: Book | Book[] | null;
  count: number;
}

interface CreateBookInput {
  title: string;
  author: string;
  quantity: number;
  createdById: string;
}

interface UpdateBookInput {
  title?: string;
  author?: string;
  quantity?: number;
}

export { Book, ReturnBook, CreateBookInput, UpdateBookInput };