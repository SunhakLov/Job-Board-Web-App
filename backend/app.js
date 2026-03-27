import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filname = fileURLToPath(import.meta.url)
console.log(__filname);

const __dirname = path.dirname(__filname)
console.log(__dirname);


const app = express();

app.use(express.static(path.join(__dirname, '../public')))


app.listen(3000, () => {
    console.log('Run backend')
})