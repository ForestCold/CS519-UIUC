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
//A simple Gaussian function
function gaussian(pt){
	return Math.exp(-(pt[0]*pt[0]+pt[1]*pt[1]));
}

//--------------------------------------------------------
//The infamous rainbow color map, normalized to the data range
function rainbow_colormap(fval,fmin,fmax){
	var dx=0.8;
	var fval_nrm = (fval-fmin)/(fmax-fmin);
	var g = (6.0-2.0*dx)*fval_nrm +dx;
	var R = Math.max(0.0,(3.0-Math.abs(g-4.0)-Math.abs(g-5.0))/2.0 )*255;
	var G = Math.max(0.0,(4.0-Math.abs(g-2.0)-Math.abs(g-4.0))/2.0 )*255;
	var B = Math.max(0.0,(3.0-Math.abs(g-1.0)-Math.abs(g-2.0))/2.0 )*255;
	color = [Math.round(R),Math.round(G),Math.round(B),255];
	return color;
}

//--------------------------------------------------------
//

function design_fun(pt){
	return - pt[0]*pt[0]+pt[1]*pt[1];
}

function design_map(fval,fmin,fmax){

	var c = (fval - fmin) / (fmax - fmin);

	if (c < 0.5){
		var R = c * (177 - 221) + 221;
		var G = c * (1 - 221) + 221;
		var B = c * (39 - 221) + 221;
	} else {
		var R = c * (221 - 85) + 85;
		var G = c * (221 - 72) + 72;
		var B = c * (221 - 193) + 193;
	}

	return [Math.round(R),Math.round(G),Math.round(B),255];
}

//--------------------------------------------------------
//

function greyscale_map(fval,fmin,fmax){
  var c=255*((fval-fmin)/(fmax-fmin));
  var color = [Math.round(c),Math.round(c),Math.round(c),255];
	return color;
}

//--------------------------------------------------------
//

function gaussian_gradient(pt){
  var dx = -2*pt[0]*gaussian(pt);
  var dy = -2*pt[1]*gaussian(pt);
	return [dx,dy];
}

//--------------------------------------------------------
//

function gaussian_divergence(pt){
  var gradient =  gaussian_gradient(pt);
	return gradient[0]+gradient[1];
}

//--------------------------------------------------------
//

function gaussian_vorticity_mag(pt){
	return 0;
}

//--------------------------------------------------------
//

function normalize2D(v){
  var len = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
  if (len == 0.0)
    {
       console.log("Zero length gradient");
       return ([0.0,0.0]);
    }
  return [v[0]/len,v[1]/len];
}

//--------------------------------------------------------
//

function euler_integration(pt,h,steps,get_vector)
{
    var ln=[[pt[0],pt[1]]];
    for(i=0;i<steps;i++)
      {
        v = get_vector(ln[i]);
        ln.push( [ln[i][0]+h*v[0],ln[i][1]+h*v[1]]);
      }
    return ln;
}

function SinFunc(pt)
{
    return Math.sin(1/(pt[0]*pt[0]+pt[1]*pt[1]));
}
