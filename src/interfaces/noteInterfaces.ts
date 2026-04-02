interface Note {
  id: string;
  content: string;
  date: Date;
  createdById: string;
  type: 'REMINDER' | 'NOTE';
}

interface ReturnNote {
  note: Note | Note[] | null;
  count: number;
}

interface CreateNoteInput {
  content: string;
  date: Date;
  createdById: string;
  type: 'REMINDER' | 'NOTE';
}

export { Note,ReturnNote, CreateNoteInput };