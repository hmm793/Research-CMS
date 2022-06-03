export type Session = {
  itemId: string;
  listKey: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    content : string[]
  };
};

export type ListAccessArgs = {
  itemId?: string;
  session?: Session;
  context?: any;
  item?: any;
};
