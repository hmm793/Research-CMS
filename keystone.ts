import { config } from '@keystone-6/core';
import { isSignedIn } from './access';
import { withAuth, session } from './auth';
import Content from './schemas/Content';
import Image from './schemas/Image';
import User from './schemas/User';
import express from 'express'
import fs from 'fs'
import morgan from 'morgan';
import { getContent, getContents, testAja } from './routes/Content';
import { getImages, getImagesRelatedToTheContent } from './routes/Image';
import path from 'path';
var rfs = require('rotating-file-stream') // version 2.x

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: 'postgres://postgres:root@localhost:5432/keystonedb',
      onConnect: async context => { /* ... */ },
      // Optional advanced configuration
      enableLogging: true,
      useMigrations: true,
      idField: { kind: 'uuid' },
    },
    ui: {
        isAccessAllowed: isSignedIn,
    },
    lists: {
      Content,
      Image,
      User
    },
    session,
    server: {
      cors: { origin: ['http://localhost:7777'], credentials: true },
      port: 5000,
      maxFileSize: 200 * 1024 * 1024,
      healthCheck: true,
      extendExpressApp: (app, createContext) => {
        function DataLogger(){
          var logger = morgan;
          var today = (new Date()).toISOString().split('T')[0];
          app.use(logger('combined',{stream: {
            write: function(str: any)
            {
              const date = str.split(' ')[3].substr(1,20);
              const method = str.split(' ')[5].substr(1);
              const url = str.split(' ')[6];
              const status = str.split(' ')[8];
              const isFileExist = fs.existsSync(`./datalogger/log-${today}.log`)
              if(isFileExist){
                const data = JSON.parse((fs.readFileSync(`./datalogger/log-${today}.log`, {encoding: 'utf-8'})))            
                if(data.length !== 0){
                  let currentData = data[data.length-1];
                  if(currentData.method !== method ||  currentData.url !== url){
                    data.push({
                      date: date,
                      method: method,
                      url: url,
                      status: status,
                    })
                    fs.writeFileSync(`./datalogger/log-${today}.log`, JSON.stringify(data))
                  }
                  
                } else {
                  data.push({
                    date: date,
                    method: method,
                    url: url,
                    status: status,
                  })
                  fs.writeFileSync(`./datalogger/log-${today}.log`, JSON.stringify(data))
                }
              } else {
                fs.writeFileSync(`./datalogger/log-${today}.log`,'[]')
                const data = JSON.parse((fs.readFileSync(`./datalogger/log-${today}.log`, {encoding: 'utf-8'})))            
                let temp_str_1 = JSON.stringify(str);
                let temp_str_2 = temp_str_1.split(" ");
                if(data.length !== 0){
                  let currentData = data[data.length-1];
                  if(currentData.method !== temp_str_2[2] ||  currentData.url !== temp_str_2[3]){
                    data.push({
                      date: date,
                      method: method,
                      url: url,
                      status: status,
                    })
                    fs.writeFileSync(`./datalogger/log-${today}.log`, JSON.stringify(data))
                  }
                  
                } else {
                  data.push({
                    date: date,
                    method: method,
                    url: url,
                    status: status,
                  })
                  fs.writeFileSync(`./datalogger/log-${today}.log`, JSON.stringify(data))
                }
              }
            }
          }
        }));
        }
        const dir = './datalogger';
        if(fs.existsSync(dir)){
          DataLogger()
        }else {
          fs.mkdirSync(dir)
          DataLogger()
        }
        
        app.use(express.json());
        app.use(express.urlencoded({extended : true}))
        app.use('/rest', async (req, res, next) => {
          (req as any).context = await createContext(req, res);
          next();
        });
        app.get('/rest/contents',getContents)
        app.get('/rest/convert',testAja)
        app.get('/rest/content/:id',getContent)
        app.get('/rest/images',getImages)
        app.get('/rest/imagesRelatedToTheContent/:id',getImagesRelatedToTheContent)
      },
    },
    images : {
      upload : "local",
      local: {
        baseUrl : "/images",
        storagePath :"public/images"
      }
    }
  })
);

