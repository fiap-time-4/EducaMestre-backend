import prisma from '../util/prisma';
import { ReturnNote, Note, CreateNoteInput } from "../interfaces/noteInterfaces";

interface GetOptions {
  skip?: number;
  take?: number;
  id?: string;
  date?: Date;
  createdById?: string;
  type?: 'REMINDER' | 'NOTE';
}

export class NoteRepository {

  async create({ content, date, createdById, type }: CreateNoteInput): Promise<Note> {
    const newNote = await prisma.note.create({
      data: {
        content,
        date,
        createdById,
        type
      }
    });

    let note: Note = {
      id: newNote.id,
      content: newNote.content,
      date: newNote.date,
      createdById: newNote.createdById,
      type: newNote.type
    };

    return note;
  }

  async get({ skip, take, id, date, createdById, type }: GetOptions): Promise<ReturnNote | ReturnNote[]> {

    const fetchedNotes = await prisma.note.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      },
      where: {
        id ,
        date,
        createdById,
        type
      }
    });

    const count = await prisma.note.count({
      where: {
        id ,
        date,
        createdById,
        type
      }
    });

    let notes: Note[] | Note | null = fetchedNotes.map(note => ({
      id: note.id,
      content: note.content,
      date: note.date,
      createdById: note.createdById,
      type: note.type
    }));

    notes = Array.isArray(notes) && notes.length === 1 ? notes[0] : notes;
    notes = Array.isArray(notes) && notes.length === 0 ? null : notes;

    return { note: notes,
      count
    };

  }

  async count({ createdById, type }: GetOptions): Promise<number> {
    const count = await prisma.note.count({
      where: {
        createdById,
        type
      }
    });

    return count;

  }
}