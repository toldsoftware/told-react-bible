import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { registerLog, logger } from '../../utils/logger';

export const app = express();
app.use((req, res, next) => { registerLog(req as any); next(); });

// Doesn't work because dot extension problem in azure functions
// app.use('/graphiql', express.static('files'));

// Alternative (use query string ?file=FILE)
// This will work with Azure Functions Proxies to map
// /static/FILE
// to
// /fun-static/?file=
app.use((req, res, next) => {
  const filename = req.query.file
    || 'index.html';

  const dir = __dirname.match('src-server')
    ? path.join(__dirname, '../../../static')
    : path.join(__dirname, '../static');

  let p = path.join(dir, filename);

  if (fs.statSync(p).isDirectory()) {
    p = path.join(p, 'index.html');
  }

  logger.log('graphiql file handler', 'path', req.path, 'query', req.query, 'filename', filename, 'path', p);

  let type = 'text/plain';
  let encoding = 'utf8';

  if (p.match('\.html$')) { type = 'text/html'; }
  if (p.match('\.css$')) { type = 'text/css'; }
  if (p.match('\.js$')) { type = 'application/x-javascript'; }
  if (p.match('\.json$')) { type = 'application/json'; }
  if (p.match('\.jpg$')) { type = 'image/jpeg'; encoding = 'binary'; }
  if (p.match('\.png$')) { type = 'image/png'; encoding = 'binary'; }
  if (p.match('\.gif$')) { type = 'image/gif'; encoding = 'binary'; }
  if (p.match('\.ico$')) { type = 'image/x-icon'; encoding = 'binary'; }

  fs.readFile(p, (err, data) => {
    logger.log('readFile path=', p);

    if (err != null) {
      logger.log('ERROR: ', err, p);
      res.statusCode = 404;
      res.end('File Not Found: ' + p);
      return;
    }

    let body = data; 
    
    res.setHeader('Cache-Control', 'max-age=300, public');
    res.setHeader('Content-Type', type);
    res.end(body, encoding);
  });
});