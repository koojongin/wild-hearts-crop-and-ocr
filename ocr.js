import {createWorker, createScheduler} from 'tesseract.js';

import {promises as fs} from 'fs';
import path from 'path';

// const destinationPath = "C:\\Users\\jiku9\\Videos\\Captures";
const destinationPath = path.resolve();
const files = await fs.readdir(destinationPath);
const filterSegmentString = "C_";
const filesWithoutHidden = files.filter(item => item.indexOf('desktop.ini') < 0 && item.indexOf(filterSegmentString) >= 0);
const scheduler = createScheduler();

// with multiple workers to speed up
async function createWorkerInstance() {
  const worker = await createWorker({
    logger: () => {
      //Progress보려면 여기에 코드 추가
    }
  });
  await worker.load();
  await worker.loadLanguage('kor');
  await worker.initialize('kor');
  return worker;
}

const workers = await Promise.all(Array(10).fill(1).map(() => createWorkerInstance()));
workers.forEach((worker) => {
  scheduler.addWorker(worker);
})
const ocrPromises = filesWithoutHidden.map((fileName, index) => {
  const filePath = path.resolve(destinationPath, fileName);
  const options = {
    rectangle: {
      left: 812,
      top: 83,
      width: 388,
      height: 745,
    }
  };
  return scheduler.addJob('recognize', filePath, options);
})

const result = (await Promise.all(ocrPromises))
.map(r => r.data.text)
.map(text => text.split('\n').filter(d => !!d)
.map(d => d.trim().replaceAll(" ", "")));
console.log(result);
await scheduler.terminate();
