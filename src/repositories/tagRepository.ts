import prisma from '../util/prisma';
import { CreateTagInput,ReturnTag,Tag } from "../interfaces/tagInterfaces";

interface GetOptions {
  skip?: number;
  take?: number;
  id?: string;
  createdById?: string;
}

export class TagRepository {

  async create({ name, createdById }: CreateTagInput): Promise<Tag> {
    const newTag = await prisma.tag.create({
      data: {
        name,
        createdById
      }
    });

    let tag: Tag = {
      id: newTag.id,
      name: newTag.name,
      createdById: newTag.createdById
    };

    return tag;
  }

  async get({ skip, take, id, createdById }: GetOptions): Promise<ReturnTag | ReturnTag[]> {

    const fetchedTags = await prisma.tag.findMany({
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

    const count = await prisma.tag.count({
      where: {
        id ,
        createdById
      }
    });

    let tags: Tag[] | Tag | null = fetchedTags.map(tag => ({
      id: tag.id,
      name: tag.name,
      createdById: tag.createdById
    }));

    tags = Array.isArray(tags) && tags.length === 1 ? tags[0] : tags;
    tags = Array.isArray(tags) && tags.length === 0 ? null : tags;

    return { tag: tags,
      count
    };

  }

  async delete(id: string, createdById: string): Promise<void> {
    const tag = await prisma.tag.findFirst({
      where: {
        id,
        createdById
      }
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    await prisma.tag.delete({
      where: {
        id: tag.id
      }
    });
  }
}