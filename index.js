import sharp from 'sharp';
import {promises as fs} from 'fs';
import path from 'path';

// const directory = "C:\\Users\\jiku9\\Videos\\Captures";
const directory = path.resolve();
const files = await fs.readdir(directory);
const filesWithoutHidden = files.filter(fileName => {
  const filterConditions = [!(/(^|\/)\.[^\/\.]/g).test(fileName), fileName.indexOf('desktop.ini') < 0, fileName.indexOf('example.png') >= 0, fileName.indexOf("C_") < 0];
  return filterConditions.filter(o => !o).length === 0;
});

const pathOfFiles = filesWithoutHidden.map((fileName) => path.resolve(directory, fileName));
pathOfFiles
// .filter((image, index) => index === 0)
.map((imagePath) => {
  const fileName = path.basename(imagePath);
  const fileDirectory = imagePath.replace(fileName, "");
  const outputPath = path.resolve(fileDirectory, `C_${fileName.replace('.png', '')}-${new Date().getTime()}.png`);
  sharp(imagePath)
  .extract({left: 592, top: 156, width: 1214, height: 850})
  .toFile(outputPath, function (err) {
    if (err) {
      console.log(err)
    }
    console.log('crop done. into', outputPath);
  });
})


