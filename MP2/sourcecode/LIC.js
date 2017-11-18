
//University of Illinois/NCSA Open Source License
//Copyright (c) 2015 University of Illinois
//All rights reserved.
//
//Developed by: 		Eric Shaffer
//                  Department of Computer Science
//                  University of Illinois at Urbana Champaign
//
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//documentation files (the "Software"), to deal with the Software without restriction, including without limitation
//the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//disclaimers.Redistributions in binary form must reproduce the above copyright notice, this list
//of conditions and the following disclaimers in the documentation and/or other materials provided with the distribution.
//Neither the names of <Name of Development Group, Name of Institution>, nor the names of its contributors may be
//used to endorse or promote products derived from this Software without specific prior written permission.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//DEALINGS WITH THE SOFTWARE.




//-------------------------------------------------------
// Global variables

var xExtent=[-1.0,1.0];
var yExtent=[-1.0,1.0];
var currentView = "origin";
var fval_matrix = [],
		sample = [],
		interpolate_matrix = [];
var myGrid,
	  res,
		canvas,
		ctx,
		scalar_func,
		imgData,
		mn,
		mx,
		color_func;

function render(canvas){

		  var canvas = document.getElementById('example');
		  if (! canvas) {
		    console.log(' Failed to retrieve the < canvas > element');
		    return false;
		  }
		  else {
			  // console.log(' Got < canvas > element ');
		  }

		  // Get the rendering context for 2DCG <- (2)
		  var ctx = canvas.getContext('2d');
			// Draw something
			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

		  var k = parseFloat(document.getElementById("k_value").value);
			var L = parseInt(document.getElementById("l_value").value);
			var Noise = [];
			var Dist = [];

			//generate the Noice matrix and the Distance matrix
			for (var x = 0; x < canvas.width; x++){
				Noise[x] = [];
				Dist[x] = [];
				for (var y = 0; y < canvas.height; y++){
					Dist[x][y] = Math.sqrt((canvas.width / 2 - x) * (canvas.width / 2 - x) + (canvas.height / 2 - y) * (canvas.height / 2 - y));
					Noise[x][y] = Math.random();
				}
			}

			//LIC

			for (var x = 0; x < canvas.width; x++){
				for (var y = 0; y < canvas.height; y++){

					var denominator = 0,
						  	molecular = 0;

				  var pt = pixel2pt(canvas.width, canvas.height, xExtent, yExtent, x, y)

					for (var i = -L; i <= L; i++){
						var nextX = Math.round((canvas.width / 2 - x) * i / Dist[x][y]) + x;
						var nextY = Math.round((canvas.width / 2 - y) * i / Dist[x][y]) + y;
						if (isNaN(nextX) || isNaN(nextY) || nextX < 0 || nextX >= canvas.width || nextY < 0 || nextY >= canvas.height){
							continue;
						}
						var ks = gaussian(pt);
						molecular += Noise[nextX][nextY] * ks;
						denominator += ks;
					}

					var lic =  molecular / denominator;

					if (document.getElementById("color").checked) {
						var color = rainbowMap(magnitude(pt));
					} else {
						var color = greyscaleMap(lic, 0, 1);
					}

					var i = (y * canvas.width + x) * 4;

					imgData.data[i] = color[0]
					imgData.data[i + 1] = color[1]
					imgData.data[i + 2] = color[2]
					if (document.getElementById("color").checked) {
						imgData.data[i] = color[0] * lic;
						imgData.data[i + 1] = color[1] * lic;
						imgData.data[i + 2] = color[2] * lic;
					} else {
						imgData.data[i] = color[0]
						imgData.data[i + 1] = color[1]
						imgData.data[i + 2] = color[2]
					}
					imgData.data[i + 3] = color[3]

				}
				ctx.putImageData(imgData, 0, 0)

			}

			//draw hedgeHog
			if (document.getElementById("hed").checked) {
				if (document.getElementById("uni").checked) {
					var size = parseFloat(document.getElementById("grid_res").value);
					for (var x = 0; x < canvas.width; x += size){
						for (var y = 0; y < canvas.width; y += size){
							var pt = pixel2pt(canvas.width, canvas.height, xExtent, yExtent, x, y)
							startX = x - k * gradient(pt)[0] / 2;
							endX = x + k * gradient(pt)[0] / 2;
							startY = y - k * gradient(pt)[1] / 2;
							endY = y + k * gradient(pt)[1] / 2;
							ctx.beginPath();
							ctx.moveTo(startX, startY);
							ctx.lineTo(endX, endY);
							ctx.lineWidth = 2;
							ctx.strokeStyle = "red";
							ctx.stroke();
						}
					}
				} else {
	        var size = parseFloat(document.getElementById("grid_res").value);
					for (var i = 0; i < size * size; i++){
						var x = Math.random() * canvas.width;
						var y = Math.random() * canvas.height;
						var pt = pixel2pt(canvas.width, canvas.height, xExtent, yExtent, x, y)
						endX = x + k * gradient(pt)[0] / 2;
						endY = y + k * gradient(pt)[1] / 2;
						ctx.beginPath();
						ctx.moveTo(x, y);
						ctx.lineTo(endX, endY);
						ctx.lineWidth = 2;
						ctx.strokeStyle = "red";
						ctx.stroke();
					}
				}
		  }

			if (document.getElementById("color").checked) {

			}
		}

//private functions

//--------------------------------------------------------
// Map a point in pixel coordinates to the 2D function domain
function pixel2pt(width,height,x_extent,y_extent, p_x,p_y){

	var pt = [0,0];

	xlen=x_extent[1]-x_extent[0];
	ylen=y_extent[1]-y_extent[0];

	pt[0]=(p_x/width)*xlen + x_extent[0];
	pt[1]=(p_y/height)*ylen + y_extent[0];

	return pt;
}

//--------------------------------------------------------
// Map a point in domain coordinates to pixel coordinates
function pt2pixel(width,height,x_extent,y_extent, p_x,p_y){

	var pt = [0,0];

	var xlen = (p_x-x_extent[0])/(x_extent[1]-x_extent[0]);
  var ylen = (p_y-y_extent[0])/(y_extent[1]-y_extent[0]);

	pt[0]=Math.round(xlen*width);
	pt[1]=Math.round(ylen*height);

	return pt;
}

function gaussian (pt) {
	return Math.exp(-(pt[0] * pt[0] + pt[1] * pt[1]))
}

function greyscaleMap (fval, fmin, fmax) {
	var c = 255 * ((fval - fmin) / (fmax - fmin))
	var color = [Math.round(c), Math.round(c), Math.round(c), 255]
	return color
}

function rainbowMap (fval) {
	var dx = 0.8
	var f = (fval < 0) ? 0 : (fval > 1) ? 1 : fval
	var g = (6 - 2 * dx) * f + dx
	var R = Math.max(0, (3 - Math.abs(g - 4) - Math.abs(g - 5)) / 2)
	var G = Math.max(0, (4 - Math.abs(g - 2) - Math.abs(g - 4)) / 2)
	var B = Math.max(0, (3 - Math.abs(g - 1) - Math.abs(g - 2)) / 2)
	var color = [255 * R, 255 * G, 255 * B, 255]
	return color
}

function gradient (pt){
	return [-2 * pt[0] * gaussian(pt), -2 * pt[1] * gaussian(pt)];
}

function magnitude (pt){
	return Math.sqrt(gradient(pt)[0] * gradient(pt)[0] + gradient(pt)[1] * gradient(pt)[1]);
}
