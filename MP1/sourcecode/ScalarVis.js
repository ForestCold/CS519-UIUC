
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

var x_extent=[-1.0,1.0];
var y_extent=[-1.0,1.0];
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

//------------------------------------------------------
//DRAW ORIGINAL VIEW
function drawOriginalView() {
	layout();
	render();
	drawLine();
}

//------------------------------------------------------
//SWITCH VIEW TYPE
function switchView () {
	if (currentView == "origin"){
    layout();
		sampleByStep();
		renderInterpolate();
		currentView = "interpolate";
		drawLine();
	} else {
		drawOriginalView();
		currentView = "origin";
	}
}

//--Function: render-------------------------------------
//Main drawing function

function sampleByStep(){

	var step = document.getElementById("sample").value;

	for (var i = 0; i <= fval_matrix.length / step; i++){
		sample[i] = [];
		for (var j = 0; j <= fval_matrix[i].length / step; j++){
			var x = i * step >= fval_matrix.length ? fval_matrix.length - 1 : i * step;
			var y = j * step >= fval_matrix[i].length ? fval_matrix[i].length - 1 : j * step;
			sample[i][j] = fval_matrix[x][y];
		}
	}
}

function renderInterpolate(){

	var step = document.getElementById("sample").value;

	for (var i = 0; i < (sample.length - 1) * step; i++){
		interpolate_matrix[i] = [];
		for (var j = 0; j < (sample[0].length - 1) * step; j++){

			var indexX = parseInt(i / step),
					indexY = parseInt(j / step),
					x = i % step,
					y = j % step;

			var fval = sample[indexX][indexY] * (1 - x / step) * (1 - y / step) + sample[indexX + 1][indexY] * (x / step) * (1 - y / step) + sample[indexX][indexY + 1] * (1 - x / step) * (y / step) + sample[indexX + 1][indexY + 1] * (x / step) * (y / step);
			interpolate_matrix[i][j] = fval;

			if (fval < mn){
				mn = fval;
			}
			if (fval > mx){
				mx = fval;
			}

			var color = color_func(fval,mn,mx);

			var c = (i * canvas.width + j) * 4

			imgData.data[c] = color[0];
			imgData.data[c + 1] = color[1];
			imgData.data[c + 2] = color[2];
			imgData.data[c + 3] = color[3];

		}

		ctx.putImageData(imgData,0,0);

	}
}

function layout(){

	res = parseFloat(document.getElementById("grid_res").value);
  myGrid = new UGrid2D([x_extent[0],y_extent[0]], [x_extent[1],y_extent[1]],res);
  canvas = document.getElementById('example');

  if (! canvas) {
    console.log(' Failed to retrieve the < canvas > element');
    return false;
  }
  else {
		console.log(' Got < canvas > element ');
		currentView = "origin";
  }

	// Get the rendering context for 2DCG <- (2)
	ctx = canvas.getContext('2d');

	// Draw the scalar data using an image rpresentation
	imgData=ctx.getImageData(0,0,canvas.width,canvas.height);

	// Choose the scalar function
	scalar_func = gaussian;
	if (document.getElementById("Sine").checked){
		scalar_func = SinFunc;
	} else if (document.getElementById("gaussian").checked){
		scalar_func = gaussian;
	} else {
		scalar_func = design_fun;
	}


	// Set the colormap based in the radio button
	color_func = rainbow_colormap;
	if (document.getElementById("greyscale").checked){
			color_func = greyscale_map;
	} else if (document.getElementById("rainbow").checked){
			color_func = rainbow_colormap;
	} else {
		color_func = design_map;
	}


}

function render(){

	//Determine the data range...useful for the color mapping
	mn = scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,0,0));
	mx = mn;

	for (var y=0;y<canvas.height;y++){
		for (var x=0;x<canvas.width;x++){
				var fval = scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,x,y));
				if (fval < mn)
					mn=fval;
				if (fval>mx)
					mx=fval;
		}
	}

	//Color the domain according to the scalar value
	for (var y=0;y<canvas.height;y++){
		fval_matrix[y] = [];
		for (var x=0;x<canvas.width;x++)
			{
				var pt = pixel2pt(canvas.width,canvas.height,x_extent,y_extent,x,y);
				var fval = scalar_func(pt);

				fval_matrix[y][x] = fval;

				var color = color_func(fval,mn,mx);

				i = (y*canvas.width + x)*4


				imgData.data[i]=color[0];
				imgData.data[i+1]= color[1];
				imgData.data[i+2]= color[2];
				imgData.data[i+3]= color[3];
			 }
		ctx.putImageData(imgData,0,0);
	}
}

function drawLine(){

  // Draw the grid if necessary
  if (document.getElementById("show_grid").checked){
		myGrid.draw_grid(canvas);
	}

	// Draw the contour if necessary
	if (document.getElementById("show_contour").checked){

		var iso_value = document.getElementById("iso_value").value.split(',');
		var num = document.getElementById("grid_res").value;
		console.log(iso_value);

		if (iso_value.length != num){
			alert("Please enter " + num + " numbers!");
		}

		for (var i = 0; i < iso_value.length; i++){
			iso_value[i] = parseFloat(iso_value[i]);
			if (iso_value[i] < 0 || iso_value[i] > 1){
				alert("Please enter iso values between 0 and 1!");
			}
		}

	  if (currentView == "origin"){
			myGrid.draw_coutour(canvas, fval_matrix, mn, mx, iso_value);
		} else {
			myGrid.draw_coutour(canvas, interpolate_matrix, mn, mx, iso_value);
	  }
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
