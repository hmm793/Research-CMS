import { list } from '@keystone-6/core';
import { checkbox, json, relationship, text, timestamp } from '@keystone-6/core/fields';
import { rules } from '../access';
import { ListAccessArgs } from '../types';
import * as path from 'path';
import { stars } from '../stars-field';
import {document} from "@keystone-6/fields-document";
import renderDocument from '../ConvertJSON/MyReactApp';
const Content = list({
  access: {
    operation : {
      create :()=> true,
    },
    filter :{
      query : ()=> true,
      delete : rules.canDeleteContents,
      update : rules.canUpdateContents,
    }
  },
  ui: {
    
    listView: {
      initialColumns: [
        "title",
        "sectionName",
        "description",
        "isComplete",
        "publishDate",
        "photo",
        "author",
      ],
    },
    itemView: {
      defaultFieldMode : ({session, context, item} : ListAccessArgs)=>{
        const contentsArr = session?.data.content.map((item: any)  => item.id)
        if(session?.data.role === 'SUPER_ADMIN' || session?.data.role === 'ADMIN'){
          return "edit"
        }
        else {
          if(contentsArr?.includes(item.id)){
            return "edit"
          } else {
            return "read"
          }
        }
      },
    },
    hideDelete : ({session, context} : ListAccessArgs)=>{
      const contentsArr = session?.data.content.map((item: any)  => item.id)
      if(session?.data.role === 'SUPER_ADMIN' || session?.data.role === 'ADMIN'){
        return false
      }
      else {
        if(contentsArr?.includes(context.req.headers.referer.split('/')[4])){
          return false
        } else {
          return true
        }
      }
    },
    
  },
  fields: {
    title : text({validation: {isRequired:true}}),
    sectionName: text({validation: { isRequired: true} }),
    description: text({validation : { isRequired: true }, ui:{
      displayMode : "textarea",
    }}),
    isComplete: checkbox(),
    publishDate: timestamp({
      defaultValue : {
        kind : "now"
      },
      ui : {
        createView : {
          fieldMode : "hidden"
        }
      }
    }),
    photo : relationship({ 
      ref:'Image.content',
      many : true,
      ui :{
        displayMode :"cards",
        cardFields: ['image', 'altText'],
        createView :{
          fieldMode :"edit"
        },
        hideCreate:false,
        inlineConnect:true,
        inlineCreate :{
          fields:["image", "altText","publishDate"]
        },
        inlineEdit:{ fields: ["image", "altText", "publishDate"] },
        itemView:{
          fieldMode:({session, context, item} : ListAccessArgs)=>{
            const contentsArr = session?.data.content.map((item: any)  => item.id)
            if(session?.data.role === 'SUPER_ADMIN' || session?.data.role === 'ADMIN'){
              return "edit"
            }
            else {
              if(contentsArr?.includes(item.id)){
                return "edit"
              } else {
                return "read"
              }
            }
          },
        },
      },
    }),
    rating: stars(),
    author : relationship({
      ref : "User.content",
      ui : {
        hideCreate :true,
        itemView : {
          fieldMode: ({session} : ListAccessArgs)=>{
            if(session?.data.role === 'SUPER_ADMIN'|| session?.data.role === 'ADMIN'){
              return "edit"
            } else {
              return "read"
            }
          }
        },
        createView : {
          fieldMode : ({session} : ListAccessArgs)=>{
            if(session?.data.role === 'SUPER_ADMIN'|| session?.data.role === 'ADMIN'){
              return "edit"
            } else {
              return "hidden"
            }
          }
        }
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          if (operation === 'create' && !resolvedData.author) {
            return { connect: { id: context.session.itemId } };
          }
          return resolvedData.author;
        },
      },
    }),
    relatedLinks: json({
      ui: {
        // views: require.resolve('../fields/related-links/components.tsx'),
        views: path.join(__dirname, '../fields/related-links/components.tsx'),
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    content: document({
      formatting: true,
      links: true,
      dividers: true,
      layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
      ],
  }),
    content2: document({
      formatting: true,
      links: true,
      dividers: true,
      layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
      ],
      ui : {
        createView : {
          fieldMode : "hidden",
        },
        itemView : {
          fieldMode : 'hidden'
        },
      },
      hooks: {
        resolveInput: ({operation, resolvedData, inputData}) => {
          if (operation == 'create' || operation == 'update') {
            return renderDocument(inputData.content)
          }
        }
    }
  }),
  },
});
export default Content;
