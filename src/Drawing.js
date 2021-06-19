const theme = {
  face: '#5892df',
  leftTop: '#7ca5db',
  rightBottom: '#1f5eb1',
  flat: '#9ec0ec',
}

const bs = 101
const ns = bs - 1

const cv = document.createElement('canvas')
// cv.style.transform = 'scale(.25, .25)'

const ctx = cv.getContext('2d')

cv.height = bs * 2
cv.width = bs * 10

const fontSize = bs * .8
ctx.font = `${fontSize}px sans-serif`

ctx.fillStyle = '#333333'
ctx.fillRect(0, 0, cv.width, cv.height)

function drawTile(ctx, r, c) {
  const dx = c * bs
  const dy = r * bs

  // left top
  ctx.fillStyle = theme.leftTop
  ctx.beginPath()
  ctx.moveTo(dx, dy)
  ctx.lineTo(dx + ns, dy)
  ctx.lineTo(dx, dy + ns)
  ctx.fill()

  // right bottom
  ctx.fillStyle = theme.rightBottom
  ctx.beginPath()
  ctx.moveTo(dx + ns, dy + ns)
  ctx.lineTo(dx + ns, dy)
  ctx.lineTo(dx, dy + ns)
  ctx.fill()

  // center
  ctx.fillStyle = theme.face
  ctx.fillRect(dx + ns * 0.125, dy + ns * .125, ns * .75, ns * .75)
}

function drawFlag(ctx, r, c) {
  drawTile(ctx, r, c)

  const dx = c * bs
  const dy = r * bs
  ctx.fillStyle = '#333333'
  ctx.fillRect(dx + ns * .25, dy + ns * .2, ns * .1, ns * .6)

  ctx.fillStyle = '#cc0000'
  // ctx.fillRect(dx + ns * .35, dy + ns * .25, ns * .4, ns * .25)
  ctx.beginPath()
  ctx.moveTo(dx + ns * .35, dy + ns * .25)
  ctx.lineTo(dx + ns * .48, dy + ns * .25)
  ctx.lineTo(dx + ns * .62, dy + ns * .3)
  ctx.lineTo(dx + ns * .75, dy + ns * .3)
  ctx.lineTo(dx + ns * .75, dy + ns * .55)
  ctx.lineTo(dx + ns * .62, dy + ns * .55)
  ctx.lineTo(dx + ns * .48, dy + ns * .5)
  ctx.lineTo(dx + ns * .35, dy + ns * .5)
  ctx.fill()
}

function drawCross(ctx, r, c) {
  drawTile(ctx, r, c)
  // drawFlag(ctx, r, c)

  const dx = c * bs
  const dy = r * bs

  const s = .3
  const t = 1 - s

  ctx.strokeStyle = '#cc0000'
  ctx.lineCap = 'round'
  ctx.lineWidth = ns * .1
  ctx.beginPath()
  ctx.moveTo(dx + ns * s, dy + ns * s)
  ctx.lineTo(dx + ns * t, dy + ns * t)
  ctx.moveTo(dx + ns * t, dy + ns * s)
  ctx.lineTo(dx + ns * s, dy + ns * t)
  ctx.stroke()
}

function drawNumber(ctx, r, c, n) {
  const dx = c * bs
  const dy = r * bs

  ctx.fillStyle = theme.flat
  ctx.fillRect(dx, dy, ns, ns)

  if (n === 0) return
  ctx.fillStyle = '#333333'
  ctx.fillText(n, dx + ns * .28, dy + ns * .8)
}

function drawMine(ctx, r, c) {
  const dx = c * bs
  const dy = r * bs

  // ctx.fillStyle = theme.flat
  ctx.fillStyle = '#f31616'
  ctx.fillRect(dx, dy, ns, ns)

  ctx.fillStyle = '#333333'
  ctx.beginPath()
  ctx.arc(dx + ns * .48, dy + ns * .55, ns * .28, - Math.PI * .1, Math.PI * 1.6)
  ctx.lineTo(dx + ns * .66, dy + ns * .2)
  ctx.lineTo(dx + ns * .83, dy + ns * .37)
  // ctx.lineTo(dx + ns * .9, dy + ns * .2)
  // ctx.moveTo(dx + ns * .3, dx + ns * .4)
  // ctx.arcTo(dx + ns * .4, )
  ctx.fill()
}

function drawHiddenMine(ctx, r, c) {
  drawTile(ctx, r, c)

  const dx = c * bs
  const dy = r * bs

  ctx.fillStyle = 'rgba(51, 51, 51, .4)'
  ctx.beginPath()
  ctx.arc(dx + ns * .48, dy + ns * .55, ns * .28, - Math.PI * .1, Math.PI * 1.6)
  ctx.lineTo(dx + ns * .66, dy + ns * .2)
  ctx.lineTo(dx + ns * .83, dy + ns * .37)
  // ctx.lineTo(dx + ns * .9, dy + ns * .2)
  // ctx.moveTo(dx + ns * .3, dx + ns * .4)
  // ctx.arcTo(dx + ns * .4, )
  ctx.fill()
}

drawTile(ctx, 0, 0)
drawFlag(ctx, 0, 1)
drawCross(ctx, 0, 2)
drawNumber(ctx, 0, 3, 0)
drawNumber(ctx, 0, 4, 6)
drawMine(ctx, 0, 5)
drawHiddenMine(ctx, 0, 6)

drawNumber(ctx, 1, 0, 1)
drawNumber(ctx, 1, 1, 2)


const container = document.querySelector('#container')
container.appendChild(cv)
 
