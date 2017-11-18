
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





//--------------------------------------------------------
// A Simple 2D Grid Class
var UGrid2D = function(min_corner,max_corner,resolution){
  this.min_corner=min_corner;
  this.max_corner=max_corner;
  this.resolution=resolution;
  console.log('UGrid2D instance created');
}


// Method: draw_grid
// Draw the grid lines

UGrid2D.prototype.draw_grid = function(canvas){
	  var ctx = canvas.getContext('2d');
	  loc=[0,0];
	  delta = canvas.width/this.resolution;
    console.log(this.resolution, delta)
	  for (var i=0;i<=this.resolution;i++)
	  {
      ctx.beginPath();
	  	ctx.moveTo(i*delta, 0);
      	ctx.lineTo(i*delta, canvas.height-1);
      	ctx.lineWidth = 1;
      	// set line color
      	ctx.strokeStyle = '#000000';
      	ctx.stroke();
	   }
	   loc=[0,0];

	  	delta = canvas.height/this.resolution;

	  for (var i=0;i<=this.resolution;i++)
	  {
      ctx.beginPath();
	  	ctx.moveTo(0,i*delta);
      	ctx.lineTo(canvas.width-1,i*delta);
      	ctx.lineWidth = 1;
      	// set line color
      	ctx.strokeStyle = '#000000';
      	ctx.stroke();
	   }
}

UGrid2D.prototype.draw_coutour = function(canvas, fval, mn, mx, iso_value){

  console.log(iso_value);

	  var ctx = canvas.getContext('2d');
    var bin = [];
    var delta = [];
	  loc = [0,0];
    var th = [];

    delta = (mx - mn) / (this.resolution + 1);

    for (var i = 0; i < this.resolution; i++){
      if (iso_value == null){
        th[i] = (i + 1) * delta;
      } else {
        th[i] = (mx - mn) * iso_value[i] + mn;
      }
      for(var x = 0; x < fval.length ; x ++){
        bin[x] = [];
        for (var y = 0; y < fval[0].length; y ++){
            bin[x][y] = fval[x][y] > th[i] ? 1 : 0;
        }
      }

      ctx.beginPath();

      var draw_line = function(a, b){
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
      }

      for (var m = 0; m < bin.length - 1; m++){
        for (var n = 0; n < bin[0].length - 1; n++){

          var left = [m, n + 0.5],
              top = [m + 0.5, n],
              right = [m + 1, n + 0.5],
              bottom = [m + 0.5, n + 1];

          var cod = 1000 * bin[m][n] + 100 * bin[m][n + 1] + 10 * bin[m + 1][n] + bin[m + 1][n + 1];
          switch (cod) {
            case 0 || 1111: break;
            case 1 || 1110: draw_line(right, bottom);
            case 1000 || 111: draw_line(left, top);
            case 100 || 1011: draw_line(top, right);
            case 10 || 1101: draw_line(left, bottom);
            case 1100: draw_line(left, right);
            case 11: draw_line(left, right);
            case 1010: draw_line(top, bottom);
            case 101: draw_line(top, bottom);
            case 110: {
              var f_middle = (fval[m][n]+ fval[m + 1][n] + fval[m][n + 1] + fval[m + 1][n + 1]) * 0.5 * 0.5;
              if (f_middle >= th){
                  draw_line(left, top);
                  draw_line(right, bottom);
              } else {
                  draw_line(top, right);
                  draw_line(left, bottom);
              }
            };
            case 1001: {
              if (f_middle < th){
                  draw_line(left, top);
                  draw_line(right, bottom);
              } else {
                  draw_line(top, right);
                  draw_line(left, bottom);
              }
            };
            break;
          }
        }
      }

      ctx.lineWidth = 0.3;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

    }
}


//End UGrid2D--------------------------------------------
