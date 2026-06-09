const { Resvg } = require('@resvg/resvg-js')
const fs = require('fs')
const path = require('path')

const fontPaths = [
  'C:\\Windows\\Fonts\\bahnschrift.ttf',
  'C:\\Windows\\Fonts\\ariblk.ttf',
  'C:\\Windows\\Fonts\\arial.ttf',
  'C:\\Windows\\Fonts\\segoeui.ttf',
  'C:\\Windows\\Fonts\\segoeuil.ttf',
]

const fontBuffers = fontPaths
  .filter((p) => fs.existsSync(p))
  .map((p) => fs.readFileSync(p))

console.log(`Loaded ${fontBuffers.length} fonts`)

// ─── Composition (all centered at x=600) ───────────────────────────────────
//
//  Icon (shopping bag, ~100px tall):  top  y=200  bottom y=298
//  Gap 22px
//  B7 (90px font, cap ~66px):         top  y=320  baseline y=386
//  Blue line (4px):                          y=400
//  Gap 14px
//  STORE (18px, cap ~13px):           top  y=414  baseline y=427
//
//  Total block height: 200→427 = 227px
//  Vertical centering: (630-227)/2 ≈ 201  ✓

const CX = 600

const BAG = `
  <rect x="565" y="238" width="70" height="60" rx="5"
    fill="none" stroke="#111111" stroke-width="5.5" stroke-linejoin="round"/>
  <path d="M 578 238 Q 578 200 589 200 Q 600 200 600 238"
    fill="none" stroke="#111111" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M 600 238 Q 600 200 611 200 Q 622 200 622 238"
    fill="none" stroke="#111111" stroke-width="5.5" stroke-linecap="round"/>
`

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">

  <rect width="1200" height="630" fill="#f7f7f5"/>

  <!-- Corner registration marks -->
  <line x1="52"   y1="44"  x2="84"   y2="44"  stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>
  <line x1="52"   y1="44"  x2="52"   y2="76"  stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>
  <line x1="1116" y1="44"  x2="1148" y2="44"  stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>
  <line x1="1148" y1="44"  x2="1148" y2="76"  stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>
  <line x1="52"   y1="586" x2="84"   y2="586" stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>
  <line x1="52"   y1="554" x2="52"   y2="586" stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>
  <line x1="1116" y1="586" x2="1148" y2="586" stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>
  <line x1="1148" y1="554" x2="1148" y2="586" stroke="#111111" stroke-width="1" stroke-opacity="0.1"/>

  ${BAG}

  <text
    x="${CX}" y="386"
    text-anchor="middle"
    font-family="Bahnschrift, Arial Black, Arial, sans-serif"
    font-weight="700"
    font-size="90"
    fill="#111111"
    letter-spacing="-2">B7</text>

  <line
    x1="${CX - 72}" y1="400"
    x2="${CX + 72}" y2="400"
    stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>

  <text
    x="${CX + 7}" y="427"
    text-anchor="middle"
    font-family="Segoe UI, Arial, sans-serif"
    font-weight="300"
    font-size="18"
    fill="#111111"
    fill-opacity="0.38"
    letter-spacing="14">STORE</text>

</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'original' },
  font: { fontBuffers, loadSystemFonts: true },
})

const png = resvg.render().asPng()
const out = path.join(__dirname, '..', 'public', 'assets', 'ui', 'logo.png')
fs.writeFileSync(out, png)
console.log(`✓ ${out}  (${(png.length / 1024).toFixed(1)} KB)`)
