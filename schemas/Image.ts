import 'dotenv/config'
import { list } from '@keystone-6/core';
// import { cloudinaryImage } from '@keystone-6/cloudinary';

import 'dotenv/config';
import { image, relationship, text, timestamp } from '@keystone-6/core/fields';
import { isSignedIn, rules } from '../access';
import { ListAccessArgs } from '../types';

export const cloudinary = {
  cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  apiKey: `${process.env.CLOUDINARY_KEY}`,
  apiSecret: `${process.env.CLOUDINARY_SECRET}`,
  folder: 'blogApp',
};

const Image = list({
  access: {
    operation : {
      create : isSignedIn,
    },
    filter: {
      delete : rules.canDeleteImages,
      update : rules.canUpdateImages,
      query : ()=>true,
    }
  },
  fields: {
    // image: cloudinaryImage({
    //   cloudinary,
    //   label: "Source",
    // }),
    image: image(),
    altText: text({validation : {isRequired:true}}),
    publishDate: timestamp({
      defaultValue : {
        kind : 'now'
      },
      ui : {
        itemView : {
          fieldMode : 'read'
        }
      }
    }),
    content: relationship({ ref: "Content.photo" }),
  },
  ui : {
    listView : {
      initialColumns : ['id','image','altText','publishDate', 'content']
    },
    itemView: {
      defaultFieldMode : ({session, context, item} : ListAccessArgs)=>{
        const imagesArr = session?.data.content.map((item: any)  => item.photo.id)
        if(session?.data.role === 'SUPER_ADMIN' || session?.data.role === 'ADMIN'){
          return "edit"
        }
        else {
          if(imagesArr?.includes(item.id)){
            return "edit"
          } else {
            return "read"
          }
        }
      },
    },
    hideDelete :  ({session, context} : ListAccessArgs)=>{
      const imagesArr = session?.data.content.map((item: any)  => item.photo.id)
      if(session?.data.role === 'SUPER_ADMIN' || session?.data.role === 'ADMIN'){
        return false
      }
      else {
        if(imagesArr?.includes(context.req.headers.referer.split('/')[4])){
          return false
        } else {
          return true
        }
      }
    }
  }
});

export default Image;
