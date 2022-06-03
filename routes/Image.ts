import type { Request, Response } from 'express';
import type { KeystoneContext } from '@keystone-6/core/types';


export async function getImages(req: Request, res: Response) {
    const context = (req as any).context as KeystoneContext;
    const images = await context.query.Image.findMany({
        query: `
          id
          image {
            id
            filesize
            width
            height
            extension
            ref
            url
            __typename
          }
          altText
          publishDate
          __typename
        `,
      })
    res.json(images);
}


export async function getImagesRelatedToTheContent(req: Request, res: Response) {
  const idContent = req.params.id
  console.log("idContent : ", idContent);
  
  const context = (req as any).context as KeystoneContext;
  const contents = await context.query.Content.findOne({
      where : {
          id : idContent
      },
      query: `
        id
        photo { 
          id
          image {
            id
            filesize
            width
            height
            extension
            ref
            url
            __typename
          }
          altText
          publishDate
          __typename
      }
      `,
    })
  res.json(contents);
}