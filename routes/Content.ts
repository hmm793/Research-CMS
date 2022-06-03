import type { Request, Response } from 'express';
import type { KeystoneContext } from '@keystone-6/core/types';
import renderDocument from '../ConvertJSON/MyReactApp';

export async function getContents(req: Request, res: Response) {
    const context = (req as any).context as KeystoneContext;
    const contents = await context.query.Content.findMany({
        query: `
          id
          title
          sectionName
          description
          isComplete
          publishDate
          content {
            document
          }
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
          author {
            id
            name
            email
            role
          }
        `,
      })
      const result = renderDocument(contents[0].content.document)
      contents[0].content.document = result
      // console.log(contents)
      // console.log(result)
    res.json(contents);
}

export async function getContent(req: Request, res: Response) {
    const idContent = req.params.id
    const context = (req as any).context as KeystoneContext;
    const contents = await context.query.Content.findOne({
        where : {
            id : idContent
        },
        query: `
          id
          title
          sectionName
          description
          isComplete
          publishDate
          photo {
              id
          }
        `,
      })
    res.json(contents);
}

export async function testAja(req: Request, res: Response) {
    const document = req.body.document
    const resultRender = renderDocument(document)
    res.json(resultRender);
}