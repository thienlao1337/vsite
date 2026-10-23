// Run the dev server first, then npm run cover. Uses our own SVG artwork.
import { chromium } from '@playwright/test'
import { resolve } from 'node:path'
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(process.env.DEV_URL || 'http://127.0.0.1:5173')
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => {
    const art = document.querySelector('.world-art').outerHTML
    const style = document.createElement('style')
    style.textContent = `body{margin:0;background:#fffaf5}.cover{width:1200px;height:630px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 85% 20%,#f7e4e7,transparent 65%),#fffaf5;display:flex;align-items:center;padding:55px}.cover-copy{position:relative;z-index:2;width:49%}.cover-copy small{font-family:Nunito,sans-serif;letter-spacing:3px;font-size:12px;color:#b28698}.cover-copy h1{font-family:Lora,serif;font-size:82px;font-weight:400;line-height:1.2;letter-spacing:-3px;margin:28px 0;color:#8a6677}.cover-copy h1 em{color:#b8788e}.cover-copy p{font-family:Nunito,sans-serif;font-size:20px;color:#a18591}.cover-art{position:absolute;width:720px;right:-35px;top:28px}.cover-copy span{display:block;margin-top:52px;font-family:Nunito,sans-serif;color:#b4949f;font-size:12px;letter-spacing:2px}.cover svg{width:100%;height:auto}.cover .tiny-sparkles,.cover .floating-cloud,.cover .blink,.cover .bunny-ears,.cover .waving-paw,.cover .sway-flower{animation:none}`
    document.head.appendChild(style)
    document.body.innerHTML = `<div class="cover"><div class="cover-copy"><small>НАШ МАЛЕНЬКИЙ МИР</small><h1>для тебя <em>♡</em></h1><p>пссс… хитруня,<br>тебе тут кое-что пришло</p><span>ОДИН МЕСЯЦ. МНОГО МАЛЕНЬКИХ ЧУДЕС.</span></div><div class="cover-art">${art}</div></div>`
  })
  await page.locator('.cover').screenshot({ path: resolve('public/social-cover.png') })
  console.log('Saved public/social-cover.png (1200 × 630)')
} finally {
  await browser.close()
}
