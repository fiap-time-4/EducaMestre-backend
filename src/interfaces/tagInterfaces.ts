interface Tag {
  id: string;
  name: string;
  createdById: string;
}

interface ReturnTag {
  tag: Tag | Tag[] | null;
  count: number;
}

interface CreateTagInput {
  name: string;
  createdById: string;
}

export { Tag, ReturnTag, CreateTagInput };