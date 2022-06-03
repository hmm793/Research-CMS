import React from 'react'
import  ReactDOMServer from 'react-dom/server';
import {DocumentRenderer} from '@keystone-6/document-renderer';

export default function renderDocument(dataTemp:any):string {
  return ReactDOMServer.renderToStaticMarkup(<DocumentRenderer document={dataTemp}/>)
}  
