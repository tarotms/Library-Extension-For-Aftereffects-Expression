/* 
 * TLIBRARY FOR ADOBE AFTER EFFECTS
 */

{
info        : "TOOLLIBRARY 1.0.0",
version     : "1.0.0",

// Private Function
    __unpack(__prop){
            let __return = (typeof(__prop)=="function")?__prop.value:__prop
            return __return
    },

    __defaultArg(__arg, __defaultValue){
        return __arg == undefined?__defaultValue:__arg
    },
    
    __linkLayer(__indexShift){
        return thisComp.layer(thisLayer.index - __indexShift)
    },

    __length(__position1, __position2){
        return thisLayer.length(__position1, __position2)
    },

    __throwError(__string){
        __log = "\nTLIB Error\nVersion : "
        + this.version + "\n" + __string
        throw new Error (__log)
    },

    __Complex(__real, __imag){
        __obj = new Object()
        __obj.__type = "complex"
        __obj.real = __real
        __obj.imag = __imag
        return __obj
    },

    __checkComplex(__complex){
        if(typeof(__complex) != "object"){return false}
        if(__complex.__type != "complex"){return false}
        return true
    },

    __checkComplexs(__complex1, __complex2){
        return (this.__checkComplex(__complex1)
        && this.__checkComplex(__complex2))
    },

// Complex Number Tools
    complex(_real, _imag){
        if(_imag == undefined){
            let _pack = this.__unpack(_real)
            return this.__Complex(_pack[0], _pack[1])
        }else{
            return this.__Complex(_real, _imag)
        }
    },

    creal(_complex){
        return _complex.real
    },

    cimag(_complex){
        return _complex.imag
    },

    conj(_complex){
        return this.__Complex(_complex.real, -_complex.imag)
    },

    cVisualize(_complex){
        if(!this.__checkComplex(_complex)){
            this.__throwError("Not complex number")
        }
        let _x = _complex.real
        let _y = _complex.imag
        return [_x, _y]
    },

    cadd(_complex1, _complex2){
        if(!this.__checkComplexs(_complex1, _complex2)){
            this.__throwError("Not complex number")
        }
        let _return = this.__Complex(0, 0)
        _return.real = _complex1.real + _complex2.real
        _return.imag = _complex1.imag + _complex2.imag
        return _return
    },

    csub(_complex1, _complex2){
        if(!this.__checkComplexs(_complex1, _complex2)){
            this.__throwError("Not complex number")
        }
        let _return = this.__Complex(0, 0)
        _return.real = _complex1.real - _complex2.real
        _return.imag = _complex1.imag - _complex2.imag
        return _return
    },

    cmult(_complex1, _complex2){
        if(!this.__checkComplex(_complex1)){
            this.__throwError("Not complex number")
        }
        if(!this.__checkComplex(_complex2)){
            let _return = this.__Complex(0, 0)
            _return.real = _complex1.real * _complex2
            _return.imag = _complex1.imag * _complex2
            return _return
        }else{
            let _return = this.__Complex(0, 0)
            _return.real = _complex1.real * _complex2.real
                            - _complex1.imag * _complex2.imag
            _return.imag = _complex1.real * _complex2.imag
                            + _complex2.real * _complex1.imag
            return _return
        }
    },

    cabs(_complex){
        return Math.sqrt(_complex.real * _complex.real + _complex.imag * _complex.imag)
    },

    cexpimag(_theta){
        return this.__Complex(Math.cos(_theta), Math.cos(_theta))
    },

// Matrix Tools
    ident(){
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
    },

    matVisualize(_mat){
        let _return = ""
        for(let _ix in _mat){
            _return += "["
            _return += _mat[_ix]
            _return += "]\n"
        }
        return _return
    },

    matMul(_mat1, _mat2){
        const _dimensionRow = _mat1.length
        const _dimensionColume = _mat2[0].length
        if(_mat1[0].length != _mat2.length){
            this.__throwError("Matrix Dimension Mismatc")
        }
        let _return = new Array(_dimensionRow).fill(0)
        for(let i=0; i<_dimensionRow; i++){
            let _cacheArray = new Array(_dimensionColume).fill(0)
            for(let j=0; j<_dimensionColume; j++){
                let _colume = _mat2.map((_it)=>{return _it[j]})
                _cacheArray[j] = thisLayer.dot(_mat1[i], _colume)}
            _return[i] = _cacheArray
        }
        return _return
    },

    matXform(_mat, _position){
        let _pos = this.__unpack(_position)
        let _colume = [0, 0, 0, 1]
        let _arr = [[], [], [], []]
        for(let i=0; i<4; i++){
            _arr[i][0] = this.__defaultArg(_pos[i], _colume[i])
        }
        _return = this.matMul(_mat, _arr)
        return _return.slice(0, _position.length)
    },

// Vector Tools
    toPolar(_position, _theta){
        if(_theta == undefined){
            let _pos = this.__unpack(_position)
            let _x = _pos[0]
            let _y = _pos[1]
            let _trueR = Math.sqrt(_x * _x + _y * _y)
            let _trueTheta = Math.atan2(_y, _x)
            return [_trueR, _trueTheta]
        }else{
            let _x = _position
            let _y = _theta
            let _trueR = Math.sqrt(_x * _x + _y * _y)
            let _trueTheta = Math.atan2(_y, _x)
            return [_trueR, _trueTheta]
        }
    },

    toCartesian(_r, _theta){
        if(_theta == undefined){
            let _rArr = this.__unpack(_r)
            let _trueR = _rArr[0]
            let _trueTheta = _rArr[1]
            return [_trueR * Math.cos(_trueTheta), _trueR * Math.sin(_trueTheta)]
        }else{
            let _trueR = _r
            let _trueTheta = _theta
            return [_trueR * Math.cos(_trueTheta), _trueR * Math.sin(_trueTheta)]
        }
    },

// Geometry Tools
    intersection(_posProp1, _posProp2, _posProp3, _posProp4){
        _posProp1 = this.__defaultArg(_posProp1, this.__linkLayer(4).position)
        _posProp2 = this.__defaultArg(_posProp2, this.__linkLayer(3).position)
        _posProp3 = this.__defaultArg(_posProp3, this.__linkLayer(2).position)
        _posProp4 = this.__defaultArg(_posProp4, this.__linkLayer(1).position)
        let _pt1 = this.__unpack(_posProp1)
        let _pt2 = this.__unpack(_posProp2)
        let _pt3 = this.__unpack(_posProp3)
        let _pt4 = this.__unpack(_posProp4)
        if(
            (this.__length(_pt1, _pt2) < 1) ||
            (this.__length(_pt1, _pt3) < 1) ||
            (this.__length(_pt1, _pt4) < 1) ||
            (this.__length(_pt2, _pt3) < 1) ||
            (this.__length(_pt2, _pt4) < 1) ||
            (this.__length(_pt3, _pt4) < 1)
        ){
            this.__throwError("Any two points cannot be equal")
            return [0, 0]
        }
        let _returnx_ = ((_pt1[0]*(_pt2[1]*(_pt3[0]-_pt4[0])
            -_pt3[0]*_pt4[1]+_pt3[1]*_pt4[0])
            -(_pt1[1]*(_pt3[0]-_pt4[0])-_pt3[0]*_pt4[1]+_pt3[1]*_pt4[0])*_pt2[0])
            /(_pt1[0]*(_pt3[1]-_pt4[1])-_pt1[1]
            *(_pt3[0]-_pt4[0])-_pt2[0]*(_pt3[1]
            -_pt4[1])+_pt2[1]*(_pt3[0]-_pt4[0])))
        let _returny_ = ((_pt1[0]*_pt2[1]*(_pt3[1]-_pt4[1])
            -_pt1[1]*(_pt2[0]*(_pt3[1]-_pt4[1])
            +_pt3[0]*_pt4[1]-_pt3[1]*_pt4[0])
            +_pt2[1]*(_pt3[0]*_pt4[1]-_pt3[1]*_pt4[0]))
            /(_pt1[0]*(_pt3[1]-_pt4[1])-_pt1[1]
            *(_pt3[0]-_pt4[0])-_pt2[0]*(_pt3[1]-_pt4[1])
            +_pt2[1]*(_pt3[0]-_pt4[0])))
        return [_returnx_, _returny_]
    },

// Path Tools
    linkLine(_order, _isClosed){
        _order = this.__defaultArg(_order, [1, 2])
        _isClosed = this.__defaultArg(_isClosed, false)
        let _path = new Set()
        for(let _ix in _order){
            let _targetLayer = this.__linkLayer(_order[_ix])
            let _point = _targetLayer.toComp(_targetLayer.transform.anchorPoint).slice(0, 2)
            let _axisFix = thisLayer.sub(thisLayer.position, thisLayer.anchorPoint)
            _path.add(thisLayer.sub(_point, _axisFix))
        }
        return thisProperty.createPath([..._path], [], [], _isClosed)
    },

    forEach(_function, _path){
        _path = this.__defaultArg(_path, thisProperty)
        let _return = _path.points().map(_function)
        return thisProperty.createPath(_return, [], [], _path.isClosed())
    },

    resample(_int, _path){
        _int = this.__defaultArg(_int, 30)
        _path = this.__defaultArg(_path, thisProperty)
        let _return = new Set()
        for(let i=0; i<=parseInt(_int); i++){
            _return.add(_path.pointOnPath(i/_int))
        }
        return thisProperty.createPath([..._return], [], [], _path.isClosed())
    },

    pathComplexXform(_r, _theta, _path){
        _r = this.__defaultArg(this.__unpack(_r), 1)
        let _trueR = _r
        let _trueTheta = this.__defaultArg(this.__unpack(_theta), 0)
        let _truePath = this.__defaultArg(_path, thisProperty)

        let _return = _truePath.points().map((_it)=>{
            let _complex = this.complex(_it)
            let _reit = this.complex(this.toCartesian(_r, _theta))
            return this.cVisualize(this.cmult(_reit, _complex))
            })
        return thisProperty.createPath(_return, [], [], _truePath.isClosed())
    },

    pathMatrixXform(_mat, _path){
        let _truePath = this.__defaultArg(_path, thisProperty)
        let _return = _truePath.points().map((_it)=>{
                return this.matXform(_mat, _it)
            })
        return thisProperty.createPath(_return, [], [], _truePath.isClosed())
    },
}