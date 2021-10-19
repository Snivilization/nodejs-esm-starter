import fs from 'fs'
import url from 'url'
import { join } from 'path'
import { add } from './add.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const text = fs.readFileSync(join(__dirname, 'text.txt'), 'utf8')

export function bannerInColor(colour) {
  const answer = add(40, 2);
  return `${colour}: ${text}: ${answer}`;
}
