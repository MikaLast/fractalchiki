// ============= Create Mandelbrot Fraqtal ============= //

const mandelbrotIteration = (cx, cy, maxIter) => {
  let x = 0.0
  let y = 0.0
  let xx = 0
  let yy = 0
  let xy = 0
  let i = maxIter

  while (i-- && xx + yy <= 4) {
    xy = x * y
    xx = x * x
    yy = y * y
    x = xx - yy + cx
    y = xy + xy + cy
  }

  return maxIter - i
}

const mandelbrot = (canvas, xmin, xmax, ymin, ymax, iterations) => {
  let width = canvas.width
  let height = canvas.height
  let context = canvas.getContext('2d')
  let image = context.getImageData(0, 0, width, height)
  let pixels = image.data

  for (let ix = 0; ix < width; ++ix) {
    for (let iy = 0; iy < height; ++iy) {
      let x = xmin + (xmax - xmin) * ix / (width - 1)
      let y = ymin + (ymax - ymin) * iy / (height - 1)
      let i = mandelbrotIteration(x, y, iterations)
      let pixels_position = 4 * (width * iy + ix)

      if (i > iterations) {
        pixels[pixels_position] = 0
        pixels[pixels_position + 1] = 0
        pixels[pixels_position + 2] = 0
      } else {
        let color = 3 * Math.log(i) / Math.log(iterations - 1.0)
 
        if (color < 1) {
          pixels[pixels_position] = 255 * color
          pixels[pixels_position + 1] = 0
          pixels[pixels_position + 2] = 0
        } else if ( color < 2 ) {
          pixels[pixels_position] = 255
          pixels[pixels_position + 1] = 255 * (color - 1)
          pixels[pixels_position + 2] = 0
        } else {
          pixels[pixels_position] = 255
          pixels[pixels_position + 1] = 255
          pixels[pixels_position + 2] = 255 * (color - 2)
        }
      }

      pixels[pixels_position + 3] = 255
    }
  }

  context.putImageData(image, 0, 0)
}

// ============= Helpers ============= //

const getGlobal = () => {
  const spaceWidth = window.innerWidth-50
  const spaceHeight = window.innerHeight-50
  const magicKoefBrot = 2.1
  const windowKoef = spaceWidth > spaceHeight ? magicKoefBrot / spaceHeight : magicKoefBrot / spaceWidth

  return {
    spaceWidth,
    spaceHeight,
    magicKoefBrot,
    windowKoef,
  }
}

const fillInputs = (input_x, input_y, input_i, input_s) => {
  document.getElementById('input_x').value = input_x
  document.getElementById('input_y').value = input_y
  document.getElementById('input_i').value = input_i
  document.getElementById('input_s').value = input_s
}

const fillOlds = (old_x, old_y, old_i, old_s) => {
  document.getElementById('old_x').innerHTML = old_x
  document.getElementById('old_y').innerHTML = old_y
  document.getElementById('old_i').innerHTML = old_i
  document.getElementById('old_s').innerHTML = old_s
}

const getCanvas = () => {
  const canvas = document.getElementById('drawing_space').firstChild
  return canvas
}

const createCanvas = () => {
  const global = getGlobal()

  let canvas = document.createElement('canvas')
  canvas.width = global.spaceWidth
  canvas.height = global.spaceHeight
  let node = document.getElementById('drawing_space')
  node.appendChild(canvas)
  return canvas
}

const getControlPanel = () => {
  const newScale = document.getElementById('input_s').value
  const newCenterXPercent = document.getElementById('input_x').value
  const newCenterYPercent = document.getElementById('input_y').value
  const newIterations = document.getElementById('input_i').value

  const oldScale = document.getElementById('old_s').innerHTML
  const oldCenterXPercent = document.getElementById('old_x').innerHTML
  const oldCenterYPercent = document.getElementById('old_y').innerHTML
  const oldIterations = document.getElementById('old_i').innerHTML

  return {
    new: {
      scale: newScale,
      centerXPercent: newCenterXPercent,
      centerYPercent: newCenterYPercent,
      iterations: newIterations,
    },
    old: {
      scale: oldScale,
      centerXPercent: oldCenterXPercent,
      centerYPercent: oldCenterYPercent,
      iterations: oldIterations,
    },
    standart: {
      scale: 1,
      centerXPercent: 50,
      centerYPercent: 50,
      iterations: 100,
    }
  }
}

const calculateSquare = (centerXPercent, centerYPercent, scale) => {
  const global = getGlobal()
  const moveX = global.spaceWidth * global.windowKoef / scale
  const moveY = global.spaceHeight * global.windowKoef / scale

  const centerX = (centerXPercent - 50) / 50 * global.magicKoefBrot
  const centerY = (centerYPercent - 50) / 50 * global.magicKoefBrot

  const left = centerX - moveX
  const up = centerY + moveY
  const right = centerX + moveX
  const down = centerY - moveY

  return {
    left,
    right,
    up,
    down,
  }
}

// ============= User Functions ============= //

const downloadCanvas = () => {
  const canvas = getCanvas()
  const panel = getControlPanel()

  let link = document.createElement('a')

  let name = [`mandelbrot`]
  name.push(`${Math.round(panel.old.centerXPercent*100)/100}`)
  name.push(`${Math.round(panel.old.centerYPercent*100)/100}`)
  name.push(`${Math.round(panel.old.iterations)}`)
  name.push(`${Math.round(panel.old.scale)}`)
  
  link.download = name.join('_') + `.png`

  link.href = canvas.toDataURL()
  link.click()
}

const start = () => {
  canvas = createCanvas()

  const panel = getControlPanel()
  
  fillInputs(panel.standart.centerXPercent, panel.standart.centerYPercent, panel.standart.iterations, panel.standart.scale)
  fillOlds(panel.standart.centerXPercent, panel.standart.centerYPercent, panel.standart.iterations, panel.standart.scale)

  const square = calculateSquare(panel.standart.centerXPercent, panel.standart.centerYPercent, panel.standart.scale)

  mandelbrot(canvas, square.left, square.right, square.down, square.up, panel.standart.iterations)
}

const updateCanvas = () => {
  let canvas = getCanvas()

  const global = getGlobal()

  canvas.width = global.spaceWidth
  canvas.height = global.spaceHeight

  const panel = getControlPanel()
  
  fillOlds(panel.new.centerXPercent, panel.new.centerYPercent, panel.new.iterations, panel.new.scale)

  const square = calculateSquare(panel.new.centerXPercent, panel.new.centerYPercent, panel.new.scale)

  mandelbrot(canvas, square.left, square.right, square.down, square.up, panel.new.iterations)
}

// ============= Listener ============= //

document.addEventListener('DOMContentLoaded', start)
