import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import axe from 'axe-core'

const html = readFileSync('dist/index.html', 'utf8')
const dom = new JSDOM(html, { url: 'http://localhost/' })
global.window = dom.window
global.document = dom.window.document
global.Node = dom.window.Node

const run = async () => {
  const results = await axe.run(document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    }
  })
  const critical = results.violations.filter(v => ['serious', 'critical'].includes(v.impact || 'minor'))
  if (critical.length) {
    console.error('A11y violations:')
    critical.forEach(v => console.error(`- ${v.id}: ${v.help} (${v.impact})`))
    process.exit(1)
  } else {
    console.log('A11y smoke passed (no serious/critical issues).')
  }
}

run().catch(err => { console.error(err); process.exit(1) })

