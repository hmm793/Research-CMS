import { ListAccessArgs } from './types';

export const isSignedIn = ({ session }: ListAccessArgs) => {
   return !!session;
};
export const rules = {
  canReadContents: ({ session }: ListAccessArgs) => {
    const contentsArr = session?.data.content.map((item: any)  => item.id)
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true      
    } else {
      return {id : { in: contentsArr}}
    }
  },
  canDeleteContents: ({ session }: ListAccessArgs) => {
    const contentsArr = session?.data.content.map((item: any)  => item.id)
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true      
    } else {
      return {id : { in: contentsArr}}
    }
  },
  canUpdateContents: ({ session }: ListAccessArgs) => {
    const contentsArr = session?.data.content.map((item: any)  => item.id)
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true      
    } else {
      return {id : { in: contentsArr}}
    }
  },
  canReadPeople :  ({ session }: ListAccessArgs) => {
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN'){
      return true      
    }else if (session.data.role === 'ADMIN'){
      return  {
        OR: [
          { role: null },
          { role: { equals: "AUTHOR" } },
          { id: { equals: session.itemId } },
        ],
      };
    }
    return {
      OR: [
        { id: { equals: session.itemId } },
      ],
    };
  },
  canCreatePeople :  ({ session }: ListAccessArgs) => {
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true
    }else {
      return false
    }
  },
  canDeletePeople :  ({ session }: ListAccessArgs) => {
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true
    }else {
      return false
    }
  },
  canUpdatePeople :  ({ session }: ListAccessArgs) => {
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN'){
      return true      
    } else if (session.data.role === 'ADMIN'){
      return  {
        OR: [
          { role: null },
          { role: { equals: "AUTHOR" } },
          { id: { equals: session.itemId } },
        ],
      };
    }
    return {
      OR: [
        { id: { equals: session.itemId } },
      ],
    };
  },
  canReadImages: ({ session }: ListAccessArgs) => {
    const contentsArr = session?.data.content.map((item: any)  => item.id)
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true      
    } else {
      return {
        OR: [
          { content : {id : { in: contentsArr}}},
          { content : null},
          { content : undefined}
        ],
      }
    }
  },
  canDeleteImages: ({ session }: ListAccessArgs) => {
    const contentsArr = session?.data.content.map((item: any)  => item.id)
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true      
    } else {
      return {
        OR: [
          { content : {id : { in: contentsArr}}},
          { content : null},
          { content : undefined}
        ],
      }
    }
  },
  canUpdateImages: ({ session }: ListAccessArgs) => {
    const contentsArr = session?.data.content.map((item: any)  => item.id)
    if(!session){
      return false
    } else if(session.data.role === 'SUPER_ADMIN' || session.data.role === 'ADMIN'){
      return true      
    } else {
      return {
        OR: [
          { content : {id : { in: contentsArr}}},
          { content : null},
          { content : undefined}
        ],
      }
    }
  },
};
