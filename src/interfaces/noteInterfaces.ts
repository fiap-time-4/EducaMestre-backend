interface Note {
  id: string;
  content: string;
  date: Date;
  createdById: string;
}

interface ReturnNote {
  note: Note | Note[] | null;
  count: number;
}

interface CreateNoteInput {
  content: string;
  date: Date;
  createdById: string;
}

export { Note,ReturnNote, CreateNoteInput };