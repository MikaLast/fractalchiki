function mandelbrotIteration (cx, cy, maxIter) {
  var x = 0.0;
  var y = 0.0;
  var xx = 0;
  var yy = 0;
  var xy = 0;
  var i = maxIter;

  while (i-- && xx + yy <= 4) {
    xy = x * y;
    xx = x * x;
    yy = y * y;
    x = xx - yy + cx;
    y = xy + xy + cy;
  }

  return maxIter - i;
}

function mandelbrot (canvas, xmin, xmax, ymin, ymax, iterations) {
  var width = canvas.width;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  var image = context.getImageData(0, 0, width, height);
  var pixels = image.data;

  for (var ix = 0; ix < width; ++ix) {
    for (var iy = 0; iy < height; ++iy) {
      var x = xmin + (xmax - xmin) * ix / (width - 1);
      var y = ymin + (ymax - ymin) * iy / (height - 1);
      var i = mandelbrotIteration(x, y, iterations);
      var pixels_position = 4 * (width * iy + ix);

      if (i > iterations) {
        pixels[pixels_position] = 0;
        pixels[pixels_position + 1] = 0;
        pixels[pixels_position + 2] = 0;
      } else {
        var color = 3 * Math.log(i) / Math.log(iterations - 1.0);

        if (color < 1) {
          pixels[pixels_position] = 255 * color;
          pixels[pixels_position + 1] = 0;
          pixels[pixels_position + 2] = 0;
        } else if ( color < 2 ) {
          pixels[pixels_position] = 255;
          pixels[pixels_position + 1] = 255 * (color - 1);
          pixels[pixels_position + 2] = 0;
        } else {
          pixels[pixels_position] = 255;
          pixels[pixels_position + 1] = 255;
          pixels[pixels_position + 2] = 255 * (color - 2);
        }
      }

      pixels[pixels_position + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
}

var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var node=document.getElementById('mandelbrotDiv');
node.appendChild(canvas);

var scale = 50
var centerXPercent = 17
var centerYPercent = 52

var magicKoefBrot = 2.1
var windowKoef = 1
if (window.innerWidth > window.innerHeight) {
  windowKoef *= magicKoefBrot / window.innerHeight
} else {
  windowKoef *= magicKoefBrot / window.innerWidth 
}

var moveX = window.innerWidth * windowKoef / scale
var moveY = window.innerHeight * windowKoef / scale

var centerX = (centerXPercent - 50) / 50 * magicKoefBrot
var centerY = (centerYPercent - 50) / 50 * magicKoefBrot

var left = centerX - moveX
var up = centerY + moveY
var right = centerX + moveX
var down = centerY - moveY

mandelbrot(canvas, left, right, down, up, 2000);
window.open(document.getElementById("canvas").toDataURL("image/png"),"tfract_save");
// mandelbrot(canvas, -2.1, 2.1, -2.1, 2.1, 2000);
