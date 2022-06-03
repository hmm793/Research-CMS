function DataLogger(){
          var logger = morgan;
          var today = (new Date()).toISOString().split('T')[0];
          app.use(logger({format:':date[clf] :method :url :status :response-time ms',stream: {
            write: function(str: any)
            {
              
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