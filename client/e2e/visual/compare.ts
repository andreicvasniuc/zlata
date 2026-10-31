// Compares the new site's screenshots with the baseline of the old one, file by file:
//
//   node e2e/visual/compare.ts [name-filter]
//
// Prints the size of both images and the share of differing pixels (over the area both images cover) and writes a
// side-by-side image (old | new | diff) to e2e/visual-screenshots/diff/. Needs no build step: Node strips the types.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const OLD = 'e2e/baseline-screenshots/public'
const NEW = 'e2e/visual-screenshots/public'
const OUT = 'e2e/visual-screenshots/diff'
const filter = process.argv[2] ?? ''

const read = (path: string): PNG => PNG.sync.read(readFileSync(path))

mkdirSync(OUT, { recursive: true })
const rows: string[] = []

for (const file of readdirSync(OLD).filter((name) => name.endsWith('.png') && name.includes(filter))) {
  if (!existsSync(`${NEW}/${file}`)) {
    rows.push(`${file.padEnd(46)} (not captured yet)`)
    continue
  }
  const before = read(`${OLD}/${file}`)
  const after = read(`${NEW}/${file}`)
  const width = Math.min(before.width, after.width)
  const height = Math.min(before.height, after.height)

  const crop = (image: PNG): PNG => {
    const out = new PNG({ width, height })
    PNG.bitblt(image, out, 0, 0, width, height, 0, 0)
    return out
  }
  const a = crop(before)
  const b = crop(after)
  const diff = new PNG({ width, height })
  const changed = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.15 })

  // old | new | diff
  const sheet = new PNG({ width: width * 3 + 20, height })
  for (const [index, image] of [a, b, diff].entries())
    PNG.bitblt(image, sheet, 0, 0, width, height, index * (width + 10), 0)
  writeFileSync(`${OUT}/${file}`, PNG.sync.write(sheet))

  const share = ((changed / (width * height)) * 100).toFixed(1)
  rows.push(
    `${file.padEnd(46)} old ${before.width}x${before.height}  new ${after.width}x${after.height}  ` +
      `height ${after.height - before.height >= 0 ? '+' : ''}${after.height - before.height}  differing ${share}%`,
  )
}

console.log(rows.join('\n'))
