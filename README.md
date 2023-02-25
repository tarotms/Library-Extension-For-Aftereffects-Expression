# Library-Extension-For-Aftereffects-Expression
***
##### Information
+ Here's some extensions to after effects expressions (more for learning) to work with complex numbers, matrices (still pretty basic for now)
And some path tools like executing a custom function for each point on the path.
+ For me this provides an intuitive way to observe interesting things like how vectors are affected by matrices.
+ Animations are always more impressive than formulas, aren't they?
***
##### How to use
1. Download the tlibrary.jsx
2. Drag it into the footage area of after effects
3. Use it in expression
```javascript
/* Used in expression, just like #include */
const tlib = footage("tlibrary.jsx").sourceData
```
***
##### Prompt
+ The JavaScript engine is available in After Effects CC2019 and later
+ You can make sure that your project is using the JavaScript engine by going to File > Project Settings > Expressions and setting the Expressions Engine to JavaScript
***
##### Simple Example
###### Mandelbrot Set
Here is how to use tlibrary.jsx with write-on effect in solid layer to create a mandelbrot set:

![image](https://github.com/tarotms/Library-Extension-For-Aftereffects-Expression/blob/main/images/mandelbrotset.png?raw=true)

1. Download the tlibrary.jsx
2. Drag it into the footage area of after effects
3. Create soild layer and add write-on effect
4. Type in expression in "Brush Position" and "Color"
5. Play for fun
```javascript
/* Run over in "Brush Position" attribute */
const _timeSpeed = 4
const _skip = 6
const _maxiteration = 80
const wid = thisComp.width
const hei = thisComp.height
const _time = timeToFrames(time * _timeSpeed)
const x = (_time * _skip)%thisComp.width
const y = parseInt((_time * _skip)/thisComp.width) * _skip
p = [x, y]
```

```javascript
/* Run over in "Color" attribute */
const _timeSpeed = 4
const _skip = 6
const _maxiteration = 80
const wid = thisComp.width
const hei = thisComp.height
const _time = timeToFrames(time * _timeSpeed)
const x = (_time * _skip)%thisComp.width
const y = parseInt((_time * _skip)/thisComp.width) * _skip
const CMPLX = footage("tlibrary.jsx").sourceData
function mandelbrotSet(c){
		let z = CMPLX.complex(0, 0)
		for(let n=0; n<=_maxiteration; n++){
			z = CMPLX.cadd(CMPLX.cmult(z, z), c)
			let absz = CMPLX.cabs(z)
			if(absz >= 2){return n}}return 0}
domain = (_x, _y)=>{return [(_x/wid)*3-2, (_y/hei)*2-1]}
_Cd = mandelbrotSet(CMPLX.complex(domain(x, y)))/_maxiteration
_return = hslToRgb([Math.pow(_Cd, 0.6), 1, 0.5, 1])
```
###### Apply Xform Matrix To Path
```javascript
// Run over in path attribute
// It's just the basics, it can't handle homogeneous coordinates yet
/* Method 1 */
const tlib = footage("tlibrary.jsx").sourceData
let mat = [
[1, 0, 0, 0],
[0, 1, 0, 0],
[0, 0, 1, 0],
[0, 0, 0, 1]
]
tlib.forEach((_it)=>{
		return tlib.matXform(mat, _it)
	})

/* Method 2 */
const tlib = footage("tlibrary.jsx").sourceData
let mat = [
[1, 0, 0, 0],
[0, 1, 0, 0],
[0, 0, 1, 0],
[0, 0, 0, 1],
]
tlib.pathMatrixXform(mat)
```
###### 2D Path Rotates Along The Y Axis
```javascript
// Run over in path attribute
const tlib = footage("tlibrary.jsx").sourceData
let theta = time
let mat = [
[Math.cos(theta), 0, -Math.sin(theta), 0],
[0, 1, 0, 0],
[Math.sin(theta), 0, Math.cos(theta), 0],
[0, 0, 0, 1]
]
tlib.pathMatrixXform(mat)
```
###### Apply Complex Plane Xform To Path
$\displaystyle\Large T(p)=(a+bi)(p_x+p_yi)$
```javascript
// Run over in path attribute
const tlib = footage("tlibrary.jsx").sourceData
let complex = tlib.toPolar(a, bi)
tlib.pathComplexXform(complex[0], complex[1])
```
$\displaystyle\Large T(p)=re^{i\theta}(p_x+p_yi)$
```javascript
// Run over in path attribute
const tlib = footage("tlibrary.jsx").sourceData
let _r = 1
let _theta = 1
tlib.pathComplexXform(_r, _theta)
```
###### Complex Plane Rotation
$\displaystyle\Large R_{a}^{\theta}p=(T_a\odot R_0^{\theta}\odot T_a^{-1})p\Rightarrow e^{i\theta}(p-a)+a$
+ $\displaystyle\Large XY$ rotate around Anch point
```javascript
// Run over in path attribute
// Set path layer position and anchorPoint = [0, 0]
const tlib = footage("tlibrary.jsx").sourceData
const theta = 90
const anch = [960, 540]
const eit = tlib.complex(Math.cos(theta), Math.sin(theta))
const cAnch = tlib.complex(anch)
tlib.forEach((_it)=>{
		const cP = tlib.complex(_it)
		cXform = tlib.cadd(tlib.cmult(eit, tlib.csub(cP, cAnch)), cAnch);
		return tlib.cVisualize(cXform)
	})
```
***
##### Functions List
```javascript
/* Math Tools */
	// Complex number defintion
		tlib.complex([real, imag])
		tlib.complex(real, imag)
		
	// Visualize the complex numbers
		tlib.cVisualize(complex)
		
	// Add two complex numbers
		tlib.cadd(complex, complex)
		
	// Subtract the second complex number from the first
		tlib.csub(complex, complex)
		
	// Multiply two complex numbers
		tlib.cmult(complex, complex)
		tlib.cmult(complex, float)
	// Return the real component of a complex number
		tlib.creal(_complex)
	
	// Return the imaginary component of a complex number
		tlib.cimag(_complex)
	 
	// Compute the complex conjugate of a complex number
		tlib.conj(_complex)
	 
	// Compute the absolute value of a complex number
		tlib.cabs(_complex)
	 
	// Compute the complex exponential of an imaginary scalar,
	// i.e. Euler's formula: e^(i _theta) = cos(_theta) + i sin(_theta)
		tlib.cexpimag(_theta)
		
/* Matrix Tools */
	// Returns the identity matrix for the given matrix type
		tlib.ident()
		
	// Visualize the complex numbers (Run in text layer)
		tlib.matVisualize()
		
	// Multiply two matrix
		tlib.matMul(matrix, matrix)
		tlib.matXform(matrix, [x, y])
		tlib.matXform(matrix, posProp)
		
/* Vector Tools */
	// Conversion between polar coordinate and Cartesian coordinate
		tlib.toPolar(x, y)
		tlib.toPolar([x, y])
		tlib.toPolar(posProp)
		
	// Conversion between polar coordinate and Cartesian coordinate
		tlib.toCartesian(r, theta)
		tlib.toCartesian([r, theta])
		tlib.toCartesian(posProp)
		
/* Geometry Tools */
	/*
	 * This function receives four points ABCD
	 * and returns the intersection of line segments AC and BD
	 */
		tlib.intersection()
		tlib.intersection([x, y], [x, y], [x, y], [x, y])
		tlib.intersection(posProp, posProp, posProp, posProp)
		
/* Path Tools */
	/* 
	 * tlib.linkLine() Runs in the path property
	 * treats the layer using this expression as the zeroth layer
	 * Above is positive 1, 2, 3, 4...
	 * Below are negative -1, -2, -3, -4...
	 * then concatenating them in the specified order
	 * Eg : tlib.linkLine([1, 2, 3, 4, 6, 7])
	 * When no parameters are passed in
	 * the layers 1 and 2 above this layer are connected by default
	 */
		tlib.linkLine()
		tlib.linkLine([order])
		tlib.linkLine([order], isClosed)
		
	/*
	 * Can only be used in path attributes or mask attributes
	 * this function executes the passed in custom function
	 * for each path point of the original path
	 * and packs the returned one into a new path
	 * When pathProp is undefined, the path in thisProperty is called
	 */
		tlib.forEach(func())
		tlib.forEach(func(), pathProp)

	/*
	 * Can only be used in path attributes or mask attributes
	 * Resample the original path and return a new path
	 * When int is undefined, the default parameter is 30
	 * When pathProp is undefined, the path in thisProperty is called
	 */
		tlib.resample()
		tlib.resample(int)
		tlib.resample(int, pathProp)

	/*
	 * Can only be used in path attributes or mask attributes
	 * This function performs complex plane transformation
	 * for each point on the specified path, in the form of re^it
	 * When pathProp is undefined, the path in thisProperty is called
	 */
		tlib.pathComplexXform(r, theta)
		tlib.pathComplexXform(r, theta, pathProp)

	/*
	 * Can only be used in path attributes or mask attributes
	 * This function performs a matrix transformation
	 * for each point on the specified path
	 * When pathProp is undefined, the path in thisProperty is called
	 */
		tlib.pathMatrixXform(matrix)
		tlib.pathMatrixXform(matrix, pathProp)
```
***
##### Report issues
Feel free to report any issue you would encounter using the module
