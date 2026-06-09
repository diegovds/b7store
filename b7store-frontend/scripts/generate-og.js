const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

// Auto-detect the latest Playwright Chromium in the system cache
const msPlaywrightDir = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright')
const executablePath = (() => {
  if (!fs.existsSync(msPlaywrightDir)) return undefined
  const exePath = fs.readdirSync(msPlaywrightDir)
    .filter((d) => d.startsWith('chromium-'))
    .sort()
    .reverse()
    .map((d) => path.join(msPlaywrightDir, d, 'chrome-win', 'chrome.exe'))
    .find((p) => fs.existsSync(p))
  return exePath
})()

const html = /* html */ `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@200;300&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
    }

    body {
      /* Deep charcoal — layered dark background */
      position: relative;
      background-color: #0c0c0d;
      background-image:
        /* Subtle dot grid */
        radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px),
        /* Blue halo behind the logo */
        radial-gradient(ellipse 44% 56% at 50% 52%, rgba(37,99,235,0.13) 0%, transparent 70%),
        /* Cool light from top */
        radial-gradient(ellipse 70% 55% at 50% -5%, rgba(255,255,255,0.07) 0%, transparent 70%),
        /* Deeper vignette at edges */
        radial-gradient(ellipse 110% 110% at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%);
      background-size: 28px 28px, 100% 100%, 100% 100%, 100% 100%;
    }

    /* ── Background layers ─────────────────────────────────────────── */

    /* Ghost "B7" — giant outlined letterforms bleeding off both sides */
    .ghost {
      position: absolute;
      font-family: 'Bebas Neue', 'Arial Black', sans-serif;
      line-height: 0.8;
      color: transparent;
      -webkit-text-stroke: 1.5px rgba(255,255,255,0.07);
      user-select: none;
      z-index: 0;
    }
    .ghost.left {
      font-size: 560px;
      left: -100px;
      top: 50%;
      transform: translateY(-50%);
    }
    .ghost.right {
      font-size: 560px;
      right: -86px;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Diagonal pinstripes — opposite corners, like wrapping-paper detail */
    .stripes {
      position: absolute;
      width: 340px;
      height: 340px;
      background: repeating-linear-gradient(
        -45deg,
        rgba(255,255,255,0.05) 0px,
        rgba(255,255,255,0.05) 1px,
        transparent 1px,
        transparent 12px
      );
      z-index: 0;
    }
    .stripes.tr {
      top: 0;
      right: 0;
      -webkit-mask-image: radial-gradient(circle at 100% 0%, black 0%, transparent 72%);
              mask-image: radial-gradient(circle at 100% 0%, black 0%, transparent 72%);
    }
    .stripes.bl {
      bottom: 0;
      left: 0;
      -webkit-mask-image: radial-gradient(circle at 0% 100%, black 0%, transparent 72%);
              mask-image: radial-gradient(circle at 0% 100%, black 0%, transparent 72%);
    }

    /* Tiny blue squares — echo of the cart item, scattered like confetti */
    .chip {
      position: absolute;
      background: #2563eb;
      border-radius: 1.5px;
      z-index: 0;
    }
    .chip.c1 { width: 7px;  height: 7px;  top: 158px;    left: 268px;  opacity: 0.55; transform: rotate(14deg); }
    .chip.c2 { width: 5px;  height: 5px;  top: 438px;    left: 332px;  opacity: 0.35; transform: rotate(-20deg); }
    .chip.c3 { width: 8px;  height: 8px;  top: 196px;    right: 286px; opacity: 0.45; transform: rotate(28deg); }
    .chip.c4 { width: 5px;  height: 5px;  bottom: 168px; right: 342px; opacity: 0.35; transform: rotate(-12deg); }

    /* Inset frame — like a high-end print border */
    .frame {
      position: absolute;
      inset: 36px;
      border: 0.75px solid rgba(255,255,255,0.1);
      pointer-events: none;
    }

    /* Registration corner marks */
    .corner {
      position: absolute;
      width: 22px;
      height: 22px;
    }
    .corner::before,
    .corner::after {
      content: '';
      position: absolute;
      background: rgba(255,255,255,0.25);
    }
    .corner::before { width: 1px; height: 100%; }
    .corner::after  { height: 1px; width: 100%; }
    .corner.tl { top: 52px;    left: 52px;  }
    .corner.tr { top: 52px;    right: 52px; transform: scaleX(-1); }
    .corner.bl { bottom: 52px; left: 52px;  transform: scaleY(-1); }
    .corner.br { bottom: 52px; right: 52px; transform: scale(-1,-1); }

    /* Center content */
    .container {
      position: relative;
      z-index: 1;
      width: 1200px;
      height: 630px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Shopping cart SVG */
    .bag {
      display: block;
      margin-bottom: 26px;
      filter: drop-shadow(0 0 14px rgba(255,255,255,0.06));
    }

    /* B7 — the hero element */
    .b7 {
      font-family: 'Bebas Neue', 'Arial Black', sans-serif;
      font-size: 250px;
      line-height: 0.84;
      color: #fafafa;
      letter-spacing: -4px;
      text-shadow: 0 0 60px rgba(255,255,255,0.12);
    }

    /* Blue brand accent */
    .rule {
      width: 178px;
      height: 4px;
      background: linear-gradient(90deg, #2563eb, #60a5fa);
      border-radius: 100px;
      margin: 18px 0 22px;
      box-shadow: 0 0 18px rgba(59,130,246,0.55);
    }

    /* STORE label */
    .store {
      font-family: 'Outfit', 'Segoe UI', sans-serif;
      font-weight: 300;
      font-size: 16px;
      color: rgba(255,255,255,0.45);
      letter-spacing: 22px;
      padding-left: 22px; /* compensate trailing letter-spacing */
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="ghost left">B</div>
  <div class="ghost right">7</div>
  <div class="stripes tr"></div>
  <div class="stripes bl"></div>
  <div class="chip c1"></div>
  <div class="chip c2"></div>
  <div class="chip c3"></div>
  <div class="chip c4"></div>

  <div class="frame"></div>
  <div class="corner tl"></div>
  <div class="corner tr"></div>
  <div class="corner bl"></div>
  <div class="corner br"></div>

  <div class="container">
    <div class="logo">

      <!--
        Shopping bag: two separate handle arcs (tote style)
        meeting at center-top of the body.
        ViewBox 0 0 80 72 — bag body: x=8,y=30,w=64,h=40
        Left handle:  M 20 30 Q 20 8 30 8 Q 40 8 40 30
        Right handle: M 40 30 Q 40 8 50 8 Q 60 8 60 30
      -->
      <!--
        Shopping cart — angled basket with handle and two wheels.
        ViewBox 0 0 92 76. Drawn with round joins for a friendly, premium feel.
        Handle: starts at (4,8), goes to (16,8), then down-right into the basket rim.
        Basket: trapezoid from rim (22,22)-(86,22) narrowing to (76,52)-(30,52).
        Wheels: circles at (36,66) and (70,66), r=6.
      -->
      <svg class="bag" width="92" height="76" viewBox="0 0 92 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Handle + left edge of basket -->
        <path d="M 4 8 L 16 8 L 26 52 L 78 52"
              stroke="#fafafa" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Basket top rim and right edge -->
        <path d="M 21 22 L 88 22 L 78 52"
              stroke="#fafafa" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Blue item inside the cart — the brand accent, integrated -->
        <rect x="38" y="30" width="26" height="14" rx="3" fill="#3b82f6"/>
        <!-- Wheels -->
        <circle cx="36" cy="66" r="5.5" stroke="#fafafa" stroke-width="4" fill="none"/>
        <circle cx="70" cy="66" r="5.5" stroke="#fafafa" stroke-width="4" fill="none"/>
      </svg>

      <div class="b7">B7</div>
      <div class="rule"></div>
      <div class="store">Store</div>
    </div>
  </div>
</body>
</html>`

;(async () => {
  console.log(executablePath ? `Using Chromium: ${executablePath}` : 'Using auto-detected Chromium')

  const browser = await chromium.launch({ executablePath })
  const page = await browser.newPage()

  await page.setViewportSize({ width: 1200, height: 630 })
  await page.setContent(html, { waitUntil: 'networkidle' })
  // Extra wait to guarantee web fonts are painted
  await page.waitForTimeout(600)

  const out = path.join(__dirname, '..', 'public', 'assets', 'ui', 'logo.png')
  await page.screenshot({ path: out })

  await browser.close()
  console.log(`✓ ${out}`)
})()
