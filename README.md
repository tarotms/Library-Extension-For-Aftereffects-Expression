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
##### Function
```javascript
/* Information */
		tlib.info
		tlib.version
		
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
##### Apply Xform Matrix To Path
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
***
##### 2D Path Rotates Along The Y Axis
```javascript
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
***
##### Apply Complex Plane Xform To Path
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
***
##### Complex Plane Rotation
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
##### Report issues
Feel free to report any issue you would encounter using the module