import { list } from '@keystone-6/core';
import { password, relationship, select, text } from '@keystone-6/core/fields';
import { rules } from '../access';
import { ListAccessArgs } from '../types';

const User = list({
  access: {
    operation : {
      create : rules.canCreatePeople,
    },
    filter:  {
      query : ({session} : ListAccessArgs)=>{
        if(session?.data.role === 'SUPER_ADMIN'){
          return true
        } 
        else if (session?.data.role === 'ADMIN'){
          return  {
            OR: [
              { role: null },
              { role: { equals: "AUTHOR" } },
              { id: { equals: session.itemId } },
            ],
          };
        }
        else if (session?.data.role === 'AUTHOR') {
          return {
            OR: [
              { role: null },
              { role: { equals: "AUTHOR" } },
              { id: { equals: session.itemId } },
            ],
          }
        }
        return true
      },
      delete : rules.canDeletePeople,
      update :rules.canUpdatePeople,
    }
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ isIndexed: "unique", validation: { isRequired: true } }),
    password: password({
      validation: { isRequired: true },
    }),
    content : relationship({
      ref: "Content.author", many:true,
    }),
    role : select({
      type : "enum",
      options: [
        {
          value: "SUPER_ADMIN",
          label : "Super Admin"
        },
        {
          value: "ADMIN",
          label: "Admin"
        },
        {
          value: "AUTHOR",
          label: "Author"
        },
      ],
      defaultValue : "AUTHOR",
      ui : {
        displayMode : "segmented-control",
        itemView : {
          fieldMode : ({session} : ListAccessArgs)=>{
            if(session?.data.role === 'AUTHOR'|| session?.data.role === 'ADMIN'){
              return "read"
            }else {
              return "edit"
            }
          }
        },
        createView : {
          fieldMode : ({session} : ListAccessArgs)=>{
            if(session?.data.role === 'AUTHOR'|| session?.data.role === 'ADMIN'){
              return "hidden"
            } else {
              return "edit"
            }
          }
        },
        listView : {
          fieldMode : "read"
        },
      }
    }),
  },
  ui :{
    listView :{
      initialColumns:['id','name','email','role'],
      pageSize : 10
    },
    hideCreate : (({ session }: ListAccessArgs)=>{
      if(session?.data.role === 'AUTHOR'){
        return true
      }else {
        return false
      }
    }),
    hideDelete:(({ session }: ListAccessArgs)=>{
      if(session?.data.role === 'AUTHOR'){
        return true
      }else {
        return false
      }
    }),
    itemView: {
      defaultFieldMode : ({session} : ListAccessArgs)=>{
        if(session?.data.role === 'SUPER_ADMIN'|| session?.data.role === 'ADMIN'){
          return "edit"
        } else {
          return "read"
        }
      },
    }
  }
});

export default User;
