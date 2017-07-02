import * as express from 'express';
import { registerLog } from '../../utils/logger';
import { testQueueMany, runUpdater } from "../../_workers/updater/updater";
import { fetchChapterData, test_convertToChapterData } from "../../bibles/bibles-org-api";

export const app = express();
app.use((req, res, next) => { registerLog(req as any); next(); });

app.get('/api/test-updater', async (req, res) => {
  res.json({
    a: await testQueueMany(),
    b: await runUpdater(),
  });
});

app.get('/api/test', async (req, res) => {
  res.json({
    c: test_convertToChapterData(),
  });
});


app.get('/api', (req, res) => {
  res.json({
    pattern: '/api',
  });
});


app.get('/api/bible/:version/:book/:chapter', async (req, res) => {
  const version = req.params.version;
  const book = req.params.book;
  const chapter = req.params.chapter;

  res.json({
    result: await fetchChapterData(version, book, chapter),
  });
});
