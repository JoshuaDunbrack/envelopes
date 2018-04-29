//Global variable declarations
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
var adjust = 3
var expressions = [];

//Predefined variables
var pi = Math.PI;
var e = Math.E

//Functions that are implemented in the code, exempt from being overwritten by variable names
var funcs = ["sin", "sqrt", "cos", "ln"]

//Functions from the math library defined in more convenient terms for a better user experience
function sin(x)
{
	return Math.sin(x);
}

function cos(x)
{
	return Math.cos(x);
}

function ln(x)
{
	return Math.log(x);
}


function setup()
{
  /*
	This function is called at initialization by the p5 library.
	Creates canvas for display, text boxes, and text box labels.
  */
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

function draw()
{
  /*
	This function is called automatically regularly by the p5 library.
	Processes the current variable input and checks if there is a valid reason and way to update the display.
  */
  if(param_inputtext != param_input.value())
  {
	  expressions = param_input.value().split(',');
	  for(i = 0; i < expressions.length; i++)
	  {
		  expressions[i] = expressions[i].split('=');
	  }
  }
  if(isValidPoint(point1input.value()) && isValidPoint(point2input.value()) && (point1input.value() != point1text || point2input.value() != point2text || range_input.value() != range_inputtext || func_input.value() != func_inputtext || param_input.value() != param_inputtext || numLines_input.value() != numLines_inputtext)) {
	  update();
  }
}

function textDisplay()
{
	/*
	  Displays the labels for all of the text boxes.
	*/
    text('x1,y1:',point1input.x - 10,point1input.y - adjust);
    text('x2,y2:',point2input.x - 10,point2input.y - adjust);
    text('tmin,tmax:',range_input.x - 10,range_input.y - adjust);
	text('Test Function:',func_input.x - 10, func_input.y - adjust);
	text('# of Lines:',numLines_input.x - 10,numLines_input.y - adjust)
	text('Vars:',param_input.x - 10, param_input.y - adjust)
}

function update()
{	
	/*
	  Tries to create a new drawing with the given inputs, reverting to default values in the absence of meaningful input.
	*/
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
	translate(250,250);
	
	//Processing t-min, t-max input
	if(isValidPoint(range_inputtext))
	{
		try {	
			var tmin = eval(evaluate(range_inputtext.split(',')[0]));
			var tmax = eval(evaluate(range_inputtext.split(',')[1]));
		}
		catch(error){
			var tmin = 0;
			var tmax = 1;
		}
	}
	else
	{
		var tmin = 0;
		var tmax = 1;
	}
	
	//Processing number of lines input
	var numLines = 50;
	if(isValidExpression(numLines_inputtext))
	{
		try	{
			numLines = eval(evaluate(numLines_inputtext))
		}
		catch(error){}
	}
	if(Number.isInteger(numLines) && numLines > 1)
	{
		var dt = (tmax - tmin)/(numLines-1);
	}
	else
	{
		var dt = (tmax - tmin) * 2
	}
	
	//Setting up for line-drawing iteration
	var t = tmin;
	prevx1 = null
	prevxi = null
	
	//Autoscale setup
	var minx = null
	var maxx = null
	var miny = null
	var maxy = null
	while (t < tmax + dt/2)
	{
		try {
			var currx1 = eval(evaluate(point1[0]));
			var curry1 = eval(evaluate(point1[1]));
			var currx2 = eval(evaluate(point2[0]));
			var curry2 = eval(evaluate(point2[1]));
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
	
	//Drawing black lines iteratively
	while (t < tmax + dt/2)
	{
		try {
			strokeWeight(1)
			stroke('black')
			line(eval(evaluate(point1[0]))*scal,eval(evaluate("-1 * (" + point1[1] + ")"))*scal,eval(evaluate(point2[0]))*scal,eval(evaluate("-1 * (" + point2[1] + ")"))*scal);
		} catch(error) {
		}
		t += dt;
	}
	
	//Approximating envelope via red line iteratively
	t = tmin
	strokeWeight(2)
	stroke('red')
	while (t < tmax + dt/2)
	{
		try {
			var currx1 = eval(evaluate(point1[0]))*scal;
			var curry1 = eval(evaluate(point1[1]))*scal;
			var currx2 = eval(evaluate(point2[0]))*scal;
			var curry2 = eval(evaluate(point2[1]))*scal;
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
	
	//Processing defined function (green line)
	dt = (tmax - tmin)/100
	func_inputtext = func_input.value().replace(/x/g,'t')
	if(isValidExpression(func_inputtext))
	{
		t = tmin
		strokeWeight(2)
		stroke('green')
		prevx1 = null
		while(t < tmax + dt/2)
		{
			try {
				curry1 = eval(evaluate(func_inputtext))*scal;
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
	/*
	  Returns the intersection point of two lines as defined by their endpoints.
	*/
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

function isValidPoint(point)
{
	/*
	  Checks if a given input is a two-piece input with valid expressions on either side
	*/
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

function isValidExpression(expr)
{
	/*
	  Checks if a given expression is valid in the given context.
	  This function is intended to protect against code injection due to the inherent open-endedness of using JavaScript's eval() function.
	*/
	//Ensures that functions are read as valid
	for(i = 0; i < funcs.length; i++)
	{
		regex = new RegExp(funcs[i], "g");
		expr = expr.replace(regex, "1");
	}
	//Ensures that user-defined variables are read as valid (assuming their values are valid)
	for(i = 0; i < expressions.length; i++)
	{
		regex = new RegExp(expressions[i][0],"g");
		expr = expr.replace(regex, expressions[i][1]);
	}
	//Ensures that functions can be used within variable declarations and still be read as valid
	for(i = 0; i < funcs.length; i++)
	{
		regex = new RegExp(funcs[i], "g");
		expr = expr.replace(regex, "1");
	}
	//Ensures that the expression being evaluated has no remaining letters and no commas
	return (!(/[a-z]/i.test(expr.replace(/e/g, '1').replace(/pi/g, '1').replace(/t/g,'1').replace(/L/g,'1').replace(/x/g,'1').replace(',','a'))) && expr.length > 0);
}

function evaluate(expr)
{
	/*
	  Uses the current list of variables to convert a given string into something that can be evaluated by the program.
	*/
	
	//Converts exempt functions to ASCII characters to prevent from being overwritten by variables
	for(i=0;i<funcs.length;i++)
	{
		regex = new RegExp(funcs[i], "g");
		expr = expr.replace(regex, String.fromCharCode(200+i));
	}
	//Replaces user-defined variables with their given values
	for(i = 0; i < expressions.length; i++)
	{
		regex = new RegExp(expressions[i][0],"g");
		expr = expr.replace(regex, expressions[i][1]);
	}
	//Decodes the ASCII characters back to their function definitions
	for(i=0;i<funcs.length;i++)
	{
		regex = new RegExp(String.fromCharCode(200+i), "g");
		expr = expr.replace(regex, funcs[i]);
	}
	return expr;
}