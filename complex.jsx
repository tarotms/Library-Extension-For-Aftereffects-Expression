/* 
 * COMPLEX FOR ADOBE AFTER EFFECTS
 */

{
info        : "complex.h",
version     : "1.0.0",

/* 
 * complex(_real, _imag)
 * creal(_complex)
 * cimag(_complex)
 * conj(_complex)
 * cVisualize(_complex)
 * cadd(_complex1, _complex2)
 * csub(_complex1, _complex2)
 * cmult(_complex1, _complex2)
 * cabs(_complex)
 * cexpimag(_theta)
 */

// Private Function
    __unpack(__prop){
            let __return = (typeof(__prop)=="function")?__prop.value:__prop
            return __return
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
}