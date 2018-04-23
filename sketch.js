var point1input;
var point2input;	
var point1text = "";
var point2text = "";
var range_input;
var range_inputtext = "";
var func_input;
var func_inputtext = "";
var param_input;
var param_inputtext = "";
var numLines_input;
var numLines_inputtext = "";
var adjust = 0

function setup() {
  var canvas = createCanvas(500,600);
  canvas.style('display','block');
  canvas.parent("sketchHolder");
  background(200,200,200);
  
  point2input = createInput();
  point2input.size(100);
  point2input.position(300, 530);
  
  point1input = createInput();
  point1input.size(100);
  point1input.position(100, 530);
    
  range_input = createInput();
  range_input.size(100);
  range_input.position(100, 500);
  
  func_input = createInput();
  func_input.size(100);
  func_input.position(300, 500);
  
  param_input = createInput();
  param_input.size(100);
  param_input.position(300, 470);
  
  numLines_input = createInput();
  numLines_input.size(100);
  numLines_input.position(100, 470);
  
  textAlign(RIGHT, TOP);
  textDisplay();
}

function draw() {
  //check if text is new and valid
  if(isValidPoint(point1input.value()) && isValidPoint(point2input.value()) && (point1input.value() != point1text || point2input.value() != point2text || range_input.value() != range_inputtext || func_input.value() != func_inputtext || param_input.value() != param_inputtext || numLines_input.value() != numLines_inputtext)) {
	  update();
  }
}

function textDisplay()
{
    text('x1,y1:',point1input.x - 10,point1input.y - adjust);
    text('x2,y2:',point2input.x - 10,point2input.y - adjust);
    text('tmin,tmax:',range_input.x - 10,range_input.y - adjust);
	text('Test Function:',func_input.x - 10, func_input.y - adjust);
	text('# of Lines:',numLines_input.x - 10,numLines_input.y - adjust)
	text('L:',param_input.x - 10, param_input.y - adjust)
}

function update()
{
	background(200,200,200);
	textDisplay();
	push();
	point1text = point1input.value();
	point2text = point2input.value();
	range_inputtext = range_input.value();
	param_inputtext = param_input.value();
	numLines_inputtext = numLines_input.value()
	var point1 = point1text.split(',');
	var point2 = point2text.split(',');
	var prevx1, prevy1, prevx2, prevy2;
	var prevxi, prevyi;
	var minx, maxx, miny, maxy;
	var L = 1
	if(isValidExpression(param_inputtext))
	{
		try{
			L = eval(param_inputtext)
		} catch(error){}
	}
	translate(250,250);
	if(isValidPoint(range_inputtext))
	{		
		var tmin = eval(range_inputtext.split(',')[0]);
		var tmax = eval(range_inputtext.split(',')[1]);
	}
	else
	{
		var tmin = 0;
		var tmax = 1;
	}
	var numLines = 50;
	if(isValidExpression(numLines_inputtext))
	{
		try	{
			numLines = eval(numLines_inputtext)
		}
		catch(error){}
	}
	var dt = (tmax - tmin)/numLines;
	var t = tmin;
	prevx1 = null
	prevxi = null
	
	//autoscale
	var minx = null
	var maxx = null
	var miny = null
	var maxy = null
	while (t < tmax + dt/2)
	{
		try {
			var currx1 = eval(point1[0]);
			var curry1 = eval(point1[1]);
			var currx2 = eval(point2[0]);
			var curry2 = eval(point2[1]);
			if (minx === null || currx1 < minx)
				minx = currx1
			if (maxx === null || currx1 > maxx)
				maxx = currx1
			if (miny === null || curry1 < miny)
				miny = curry1
			if (maxy === null || curry1 > maxy)
				maxy = curry1
			if (minx === null || currx2 < minx)
				minx = currx2
			if (maxx === null || currx2 > maxx)
				maxx = currx2
			if (miny === null || curry2 < miny)
				miny = curry2
			if (maxy === null || curry2 > maxy)
				maxy = curry2
		}
		catch(error){}
		t += dt
	}
	//Optimal scale: minx to -200,maxx to 200, miny to -200, maxy to 200
	stroke('black')
	var xsize = maxx - minx
	var ysize = maxy - miny
	var scal = 0
	if(xsize > ysize)
	{
		scale(400/xsize)
		scal = 400/xsize
	}
	else
	{
		scale(400/ysize)
		scal = 400/ysize
	}
	translate(-(maxx+minx)/2,(maxy+miny)/2)
	if(xsize > ysize)
	{
		scale(xsize/400)
	}
	else
	{
		scale(ysize/400)
	}
	t = tmin
	//black line
	
	while (t < tmax + dt/2)
	{
		try {
			strokeWeight(1)
			stroke('black')
			line(eval(point1[0])*scal,eval("-1 * (" + point1[1] + ")")*scal,eval(point2[0])*scal,eval("-1 * (" + point2[1] + ")")*scal);
		} catch(error) {
		}
		t += dt;
	}
	
	//red line
	t = tmin
	strokeWeight(2)
	stroke('red')
	while (t < tmax + dt/2)
	{
		try {
			var currx1 = eval(point1[0])*scal;
			var curry1 = eval(point1[1])*scal;
			var currx2 = eval(point2[0])*scal;
			var curry2 = eval(point2[1])*scal;
			if (!(prevx1 === null))
			{
				var intersect = intersection(currx1,curry1,currx2,curry2,prevx1,prevy1,prevx2,prevy2)
				if(intersect === null)
				{
					prevx1 = currx1;
					prevy1 = curry1;
					prevx2 = currx2;
					prevy2 = curry2;
					continue;
				}
				//otherwise
				var xi = intersect[0]
				var yi = intersect[1]
				if (!(prevxi === null))
				{
					//console.log(prevxi + " " + prevyi + " " + xi + " " + yi)
					line(prevxi,-1*prevyi,xi,-1*yi)
				}
			}
			prevx1 = currx1;
			prevy1 = curry1;
			prevx2 = currx2;
			prevy2 = curry2;
			prevxi = xi
			prevyi = yi
		} catch(error) {}
		t += dt;
	}
	
	func_inputtext = func_input.value()
	if(isValidExpression(func_inputtext))
	{
		t = tmin
		strokeWeight(2)
		stroke('green')
		prevx1 = null
		while(t < tmax + dt/2)
		{
			try {
				curry1 = eval(func_inputtext)*scal;
				currx1 = t*scal;
				if (!(prevx1 === null))
				{
					line(prevx1,-prevy1,currx1,-curry1)
				}
				prevx1 = currx1;
				prevy1 = curry1
			} catch(error) {}
			t += dt
			
		}
	}
	
	pop();
	
}

function intersection(x1, y1, x2, y2, x3, y3, x4, y4)
{
	var xi = 0;
	var yi = 0;
	try
	{
		if (x2 != x1)
			var slope1 = (y2-y1)/(x2-x1);
		else
			return [x1,y3 + (y4-y3)/(x4-x3) * (x1 - x3)]
		if (x3 != x4)
			var slope2 = (y4-y3)/(x4-x3);
		else
			return [x3,y1 + (y2-y1)/(x2-x1) * (x3 - x1)]
		xi = (y3 - x3 * slope2 - (y1 - x1 * slope1))/(slope1-slope2)
		yi = y1 + slope1*(xi-x1)
		return [xi, yi];
	}
	catch(error)
	{
		return null
	}
}

function isValidPoint(point) {
	exprArr = point.split(',');
	if(exprArr.length != 2)
	{
		return false;
	}
	else
	{
		return (isValidExpression(exprArr[0]) && isValidExpression(exprArr[1]));
	}
}

function isValidExpression(expr) {
	return (!(/[a-z]/i.test(expr.replace('sqrt','1').replace('t','1').replace('L','1').replace(',','a'))) && expr.length > 0);
}