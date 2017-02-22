/*******************************************************************************
 * Random Namespace
*******************************************************************************/
'use strict';
const Random = {};

/*******************************************************************************
 * Random.UInt Class
 * Data stored as MSB
 * Number representations over 2 to the power 53 will not convert to binary correctly
 * or return the correct representation on converting to uint (Resolution will be lost).
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
*******************************************************************************/
Object.defineProperty(Random, 'UInt', {enumerable: false, value:
function(data, isLength) {
	Object.defineProperty(this, '_data', {writable: true, value: null});
	Object.defineProperty(this, '_maxValue', {writable: true, value: null });
	Object.defineProperty(this, '_uint', {writable: true, value: null});

	if ( typeof(data) == 'number' && !isLength ) {
		var uV = data >= 0 ? data : data*-1;
		//Handle 0 requiring 1 bit
		var requiredBits = uV > 0 ? Math.floor(Math.log2(uV))+1 : 1;
		this._data = [];

		if (requiredBits > 54) { 
			console.log(`
				Warning, number above 2 to the power 53, number will not convert to binary correctly
				or return the correct representation on converting to uint
				`);
		}

		var curV = uV;
		for(var i = requiredBits-1; i >= 0; i--) {
			var curBitValue = Math.pow(2, i);
			if ( curV >= curBitValue ) {
				curV -= curBitValue;
				this._data.push(true);
			}
			else {
				this._data.push(false);
			}
		}

		if ( data < 0 ) {
			//Add one more bit for signed indicator, off before converting to negative
			this._data.unshift(false);
			this._data = this._twosComplement(this._data);
			this._uint = this._toNumber(this._data);
		}
		else {
			this._uint = uV;
		}
	}
	else if ( typeof(data) == 'number' && isLength ) {
		this._data = new Array(data).fill(false);
		this._uint = 0;
	}
	else {
		this._data = data.slice();
		this._uint = this._toNumber(this._data);
	}

	this._maxValue = Math.pow(2, this._data.length)-1;

	Object.seal(this);
}});
Object.defineProperty(Random.UInt, 'prototype', {value: {}});

Object.seal(Random.UInt);

/*******************************************************************************
 * Random.UInt Prototype
*******************************************************************************/
Object.defineProperty(Random.UInt.prototype, 'minValue', {enumerable: true, value: 0});
Object.defineProperty(Random.UInt.prototype, 'data', {enumerable: true, get: function() { return this._data.slice(); }});
Object.defineProperty(Random.UInt.prototype, 'length', {enumerable: true, get: function() { return this._data.length; }});
Object.defineProperty(Random.UInt.prototype, 'maxValue', {enumerable: true, get: function() { return this._maxValue; }});
Object.defineProperty(Random.UInt.prototype, 'uint', {enumerable: true, get: function() { return this._uint; }});
Object.defineProperty(Random.UInt.prototype, 'one', {enumerable: true, value: new Random.UInt(1) });

Object.defineProperty(Random.UInt.prototype, '_oneData', {value: Random.UInt.prototype.one.data});
Object.defineProperty(Random.UInt.prototype, '_CompareCheck', {value:
	{
		Equal: 0,
		Greater: 1,
		Less: 2,
	}
});
Object.seal(Random.UInt.prototype._CompareCheck);


Object.defineProperty(Random.UInt.prototype, '_matchSize', {value:
function(data1, data2) {
	//Largest length is always src1, smallest always src2
	var src1 = data1.length >= data2.length ? data1 : data2;
	var src2 = data1.length >= data2.length ? data2 : data1;
	
	//Increase size of src2 if required
	if ( src1.length > src2.length ) {
		src2 = this._increaseSize(src1.length-src2.length, src2);
	}

	//Maintain mapping for how the data came in, comes out in the same number
	if ( src1 == data2 ) {
		var temp = src2;
		src2 = data2;
		src1 = temp;
	}

	return {src1: src1, src2: src2};
}});
Object.seal(Random.UInt.prototype._matchSize);

Object.defineProperty(Random.UInt.prototype, '_xor', {value:
function(v1, v2) {
	return !(v1 == v2);
}});
Object.seal(Random.UInt.prototype._xor);

Object.defineProperty(Random.UInt.prototype, '_xnor', {value:
function(v1, v2) {
	return (v1 == v2);
}});
Object.seal(Random.UInt.prototype._xnor);

Object.defineProperty(Random.UInt.prototype, '_and', {value:
function(v1, v2) {
	return v1 == true && v2 == true;
}});
Object.seal(Random.UInt.prototype._and);

Object.defineProperty(Random.UInt.prototype, '_or', {value:
function(v1, v2) {
	return !(v1 == false && v2 == false);
}});
Object.seal(Random.UInt.prototype._or);

Object.defineProperty(Random.UInt.prototype, '_allFalseOfSize', {value:
function(numBits) {
	return new Array(numBits).fill(false);
}});
Object.seal(Random.UInt.prototype._allFalseOfSize);

Object.defineProperty(Random.UInt.prototype, '_invertAllBits', {value:
function(data) {
	return data.map(function(e) { return !e; });
}});
Object.seal(Random.UInt.prototype._invertAllBits);

Object.defineProperty(Random.UInt.prototype, '_allTrueOfSize', {value:
function(numBits) {
	return new Array(numBits).fill(true);
}});
Object.seal(Random.UInt.prototype._allTrueOfSize);

//Performs Logical not arithmetic shift
//change if ever turn this into a signed int in twos complement notation
//https://en.wikipedia.org/wiki/Arithmetic_shift
Object.defineProperty(Random.UInt.prototype, '_shift', {value:
function(data, startIndex, dir, testFunc, byAmount) {
	if ( byAmount == undefined ) { var byAmount = 1; }

	if ( byAmount > 0 ) {
		var src = data;
		var rtn = this._allFalseOfSize(data.length);
		for(var i = startIndex; testFunc.call(data, i); i+=dir) {
			var curBit = src[i];
			var target = i + (byAmount * dir);
			if ( testFunc.call(data, target) ) {
				rtn[target] = curBit;
			}
		}
		return rtn;
	}
	else {
		return data;
	}
}});
Object.seal(Random.UInt.prototype._shift);

Object.defineProperty(Random.UInt.prototype, '_rShift', {value:
function(data, byAmount) {
	return this._shift(data, 0, 1, function(v) { return v < this.length; }, byAmount);
}});
Object.seal(Random.UInt.prototype._rShift);

Object.defineProperty(Random.UInt.prototype, '_lShift', {value:
function(data, byAmount) {
	return this._shift(data, data.length-1, -1, function(v) { return v >= 0; }, byAmount);
}});
Object.seal(Random.UInt.prototype._lShift);

Object.defineProperty(Random.UInt.prototype, '_twosComplement', {value:
function(data) {
	var rtn = this._invertAllBits(data);
	rtn = this._add(rtn, this._oneData);
	return rtn;
}});
Object.seal(Random.UInt.prototype._twosComplement);

Object.defineProperty(Random.UInt.prototype, '_increaseSize', {value:
function(byAmount, data, fillWith) {
	var rtn = data;
	if ( fillWith == undefined ) { var fillWith = false; }
	if ( byAmount > 0 ) {
		rtn = data.slice();
		for(var i = 0 ; i < byAmount; i++) {
			rtn.unshift(fillWith);
		}
	}
	return rtn;
}});
Object.seal(Random.UInt.prototype._increaseSize);

Object.defineProperty(Random.UInt.prototype, '_toNumber', {value:
function(data) {
	var rtn = 0;
	var curExponent = data.length-1;
	for(var i = 0; i < data.length; i++) {
		if ( data[i] == true ) {
			rtn += Math.pow(2, curExponent);
		}
		curExponent-=1;
	}
	return rtn;
}});
Object.seal(Random.UInt.prototype._toNumber);

Object.defineProperty(Random.UInt.prototype, '_sub', {value:
	function(data1, data2) {
		return this._add(data1, this._twosComplement(data2));
	}
});
Object.seal(Random.UInt.prototype._sub);

//Ignores overflow 
Object.defineProperty(Random.UInt.prototype, '_add', {value:
function(data1, data2) {
	var matchSize = this._matchSize(data1, data2);
	var src1 = matchSize.src1;
	var src2 = matchSize.src2;
	var rtn = [];

	//Using full adder design
	//https://en.wikipedia.org/wiki/Adder_(electronics)#Fulladder
	var carry = false;
	for( var i = src1.length-1; i >= 0; i-- ) {
		var a = src1[i];
		var b = src2[i];

		var abXor = this._xor(a, b);
		var s = this._xor(abXor, carry);
		carry = this._or( this._and(abXor, carry), this._and(a, b) );

		rtn.unshift(s);
	}

	return rtn;
}});
Object.seal(Random.UInt.prototype._add);

Object.defineProperty(Random.UInt.prototype, '_div', {value:
	function(data1, data2) {
		var matchSize = this._matchSize(data1, data2);
		var src1 = matchSize.src1;
		var src2 = matchSize.src2;
		var rtn = null;

		//Using Integer division (unsigned) with remainder algorithm from
		//https://en.wikipedia.org/wiki/Division_algorithm
		if ( this._compare(src2, [false], this._CompareCheck.Greater) ) {
			var q = this._allFalseOfSize(src1.length);
			var r = this._allFalseOfSize(src1.length);
			var minusSrc2 = this._twosComplement(src2);
			//Divisor is src2
			//Numerator is src1
			//Quotient is q
			//Remainder is r

			//Modification here from source algorithm above
			for( var i = 0; i < src1.length; i++ ) {
				r = this._lShift(r, 1);
				r[r.length-1] = src1[i];
				if ( this._greaterOrEqual(r, src2) ) {
					r = this._add(r, minusSrc2);
					q[i] = true;
				}
			}
			rtn = q;
		}
		else {
			console.log('Error: Divison by zero');
			rtn = src2.slice();
		}

		return rtn;
	}
});
Object.seal(Random.UInt.prototype._div);

Object.defineProperty(Random.UInt.prototype, '_truncate', {value:
function(toBits, data) {
	if ( toBits < data.length && toBits > 0 ) {
		return data.slice(data.length-toBits, data.length);
	}
	else {
		return data;
	}
}});
Object.seal(Random.UInt.prototype._truncate);

Object.defineProperty(Random.UInt.prototype, '_compare', {value:
	function(data1, data2, compareCheck) {
		//Using design implementations from
		//https://en.wikipedia.org/wiki/Digital_comparator
		var matchSize = this._matchSize(data1, data2);
		var src1 = matchSize.src1;
		var src2 = matchSize.src2;
		var rtn = true; //Assume success
		var foundInequality = false;

		for(var i in src1) {
			var a = src1[i];
			var b = src2[i];

			//Locate Inequality
			if ( !this._xnor(a, b) ) {
				foundInequality = true;

				//If check for a point of failure
				if ( 
					compareCheck == this._CompareCheck.Equal ||
					compareCheck == this._CompareCheck.Greater && !this._and(a, !b) ||
					compareCheck == this._CompareCheck.Less && !this._and(!a, b)
				) {
					rtn = false;	
				}

				break;
			}
		}

		//Handle case where we are not testing for an equal result and didnt' find
		//an inequality
		if ( !foundInequality && compareCheck != this._CompareCheck.Equal ) {
			rtn = false;
		}

		return rtn;
	}
});
Object.seal(Random.UInt.prototype._compare);

Object.defineProperty(Random.UInt.prototype, '_greaterOrEqual', {value:
	function(data1, data2) {
		var equal = this._compare(data1, data2, this._CompareCheck.Equal);
		var greater = this._compare(data1, data2, this._CompareCheck.Greater);
		return equal || greater ? true : false;
	}
});
Object.seal(Random.UInt.prototype._greaterOrEqual);

Object.defineProperty(Random.UInt.prototype, '_mod', {value:
	function(data1, data2) {
		//Trunicated Mod from
		//https://en.wikipedia.org/wiki/Modulo_operation
		var matchSize = this._matchSize(data1, data2);
		var a = matchSize.src1;
		var n = matchSize.src2;

		return this._sub(a, this._mul(n, this._div(a, n)));
	}
});
Object.seal(Random.UInt.prototype._mod);

Object.defineProperty(Random.UInt.prototype, '_mul', {enumerable: true, value:
function(data1, data2) {
	var matchSize = this._matchSize(data1, data2);
	var src1 = matchSize.src1;
	var src2 = matchSize.src2;

	//Using Booths multiplication algorithm
	//https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm
	var m = src1;
	var r = src2;
	var minusM = this._twosComplement(m);
	var x = src1.length;
	var y = src2.length;
	var registerLength = x+y+1;
	var splice = Array.prototype.splice;

	//Init Registers
	var a = this._allFalseOfSize(registerLength);
	splice.apply(a, [0, m.length].concat(m));

	var s = this._allFalseOfSize(registerLength);
	splice.apply(s, [0, minusM.length].concat(minusM));

	var p = this._allFalseOfSize(registerLength);
	splice.apply(p, [x, r.length].concat(r));

	//Perform operations
	for(var i = 0; i < y; i++) {
		var leastSignificantBit = p[p.length-1];
		var leastSignificantBitMinusOne = p[p.length-2];
		if ( this._xor(leastSignificantBitMinusOne, leastSignificantBit) ) {
			if ( leastSignificantBit ) {
				p = this._add(p, a);
			}
			else if ( leastSignificantBitMinusOne ) {
				p = this._add(p, s);
			}
		} 
		p = this._rShift(p);
	}

	return p.slice(x, p.length-1);
}});
Object.seal(Random.UInt.prototype._mul);

Object.defineProperty(Random.UInt.prototype, 'toLength', {enumerable: true, value:
function(bits, fillWith) {
	if (bits > this.length) {
		return new Random.UInt(this._increaseSize(bits-this.length, this.data, fillWith));
	}
	else if ( bits < this.length ) {
		return new Random.UInt(this._truncate(bits, this.data));
	}
	else {
		return this;
	}
}});
Object.seal(Random.UInt.prototype.toLength);

Object.defineProperty(Random.UInt.prototype, 'sub', {enumerable: true, value:
function(uint) {
	return new Random.UInt(this._sub(this.data, uint.data));
}});
Object.seal(Random.UInt.prototype.sub);

//Ignores overflow 
Object.defineProperty(Random.UInt.prototype, 'add', {enumerable: true, value:
function(uint) {
	return new Random.UInt(this._add(this.data, uint.data));
}});
Object.seal(Random.UInt.prototype.add);

Object.defineProperty(Random.UInt.prototype, 'div', {enumerable: true, value:
	function(uint) {
		return new Random.UInt(this._div(this.data, uint.data));
	}
});
Object.seal(Random.UInt.prototype.div);

Object.defineProperty(Random.UInt.prototype, 'mod', {value:
	function(uint) {
		return new Random.UInt(this._mod(this.data, uint.data));
	}
});
Object.seal(Random.UInt.prototype.mod);

Object.defineProperty(Random.UInt.prototype, 'mul', {enumerable: true, value:
function(uint) {
	return new Random.UInt(this._mul(this.data, uint.data));
}});
Object.seal(Random.UInt.prototype.mul);

Object.defineProperty(Random.UInt.prototype, 'rShift', {enumerable: true, value:
function(byAmount) {
	return new Random.UInt(this._rShift(this.data, byAmount));
}});
Object.seal(Random.UInt.prototype.rShift);

Object.defineProperty(Random.UInt.prototype, 'lShift', {enumerable: true, value:
function(byAmount) {
	return new Random.UInt(this._lShift(this.data, byAmount));
}});
Object.seal(Random.UInt.prototype.lShift);

Object.defineProperty(Random.UInt.prototype, 'equal', {enumerable: true, value:
	function(uint) {
		return this._compare(this.data, uint.data, this._CompareCheck.Equal);
	}
});
Object.seal(Random.UInt.prototype.equal);

Object.defineProperty(Random.UInt.prototype, 'greater', {enumerable: true, value:
	function(uint) {
		return this._compare(this.data, uint.data, this._CompareCheck.Greater);
	}
});
Object.seal(Random.UInt.prototype.greater);

Object.defineProperty(Random.UInt.prototype, 'less', {enumerable: true, value:
	function(uint) {
		return this._compare(this.data, uint.data, this._CompareCheck.Less);
	}
});
Object.seal(Random.UInt.prototype.less);

Object.defineProperty(Random.UInt.prototype, 'lessOrEqual', {enumerable: true, value:
	function(uint) {
		var equal = this._compare(this.data, uint.data, this._CompareCheck.Equal);
		var less = this._compare(this.data, uint.data, this._CompareCheck.Less);
		return equal || less ? true : false;
	}
});
Object.seal(Random.UInt.prototype.lessOrEqual);

Object.defineProperty(Random.UInt.prototype, 'greaterOrEqual', {enumerable: true, value:
	function(uint) {
		return this._greaterOrEqual(this.data, uint.data);
	}
});
Object.seal(Random.UInt.prototype.greaterOrEqual);

Object.defineProperty(Random.UInt.prototype, 'xor', {enumerable: true, value:
function(uint) {
	var matchSize = this._matchSize(this.data, uint.data);
	var src1 = matchSize.src1;
	var src2 = matchSize.src2;

	var otherData = src2;
	return new Random.UInt(src1.map( function(e, i) { return this._xor(e, otherData[i]) }, this ));
}});
Object.seal(Random.UInt.prototype.xor);

Object.defineProperty(Random.UInt.prototype, 'or', {enumerable: true, value:
function(uint) {
	var matchSize = this._matchSize(this.data, uint.data);
	var src1 = matchSize.src1;
	var src2 = matchSize.src2;

	var otherData = src2;
	return new Random.UInt(src1.map( function(e, i) { return this._or(e, otherData[i]) }, this ));
}});
Object.seal(Random.UInt.prototype.or);

Object.defineProperty(Random.UInt.prototype, 'and', {enumerable: true, value:
function(uint) {
	var matchSize = this._matchSize(this.data, uint.data);
	var src1 = matchSize.src1;
	var src2 = matchSize.src2;

	var otherData = src2;
	return new Random.UInt(src1.map( function(e, i) { return this._and(e, otherData[i]) }, this ));
}});
Object.seal(Random.UInt.prototype.and);

Object.defineProperty(Random.UInt.prototype, 'neg', {enumerable: true, value:
function() {
	var allOne = this._allTrueOfSize(this.length);
	return new Random.UInt(this._add(this._add(allOne, this._twosComplement(this._data)), this._oneData));
}});
Object.seal(Random.UInt.prototype.neg);


Object.seal(Random.UInt.prototype);

/*******************************************************************************
 * Random.RandomFactoryBase
*******************************************************************************/
Object.defineProperty(Random, 'RandomFactoryBase', {enumerable: true, value: {}});

Object.defineProperty(Random.RandomFactoryBase, '_UInt', {value: Random.UInt });
//Converted magic64 of 6364136223846793005 to binary bits as the maximum safe value javascript can support is 9007199254740991
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
Object.defineProperty(Random.RandomFactoryBase, '_multipler64', {value: new Random.UInt(
	[false, true, false, true, true, false, false, false, false, true, false, true, false, false, false, true, true, true, true, true, false, true, false, false, false, false, true, false, true, true, false, true, false, true, false, false, true, true, false, false, true, false, false, true, false, true, false, true, false, true, true, true, true, true, true, true, false, false, true, false, true, true, false, true]
)});

Object.defineProperty(Random.RandomFactoryBase, '_advance', {value: 
	function(state, delta, curMult, curPlus) {
		var zero = new this._UInt(curMult.length, true);
		var one = state.one.toLength(curMult.length);
		var two = one.add(one);
		var accMult = one;
		var accPlus = zero;
		curPlus = curPlus.toLength(curMult.length);

		//Convert Delta to uint if needed
		if ( typeof(delta) == 'number' ) {
			delta = this._convertNumberToUInt(delta, curMult.length);
		}
			

		while ( delta.greater(zero) ) {
			if ( delta.and(one).greater(zero) ) {
				accMult = accMult.mul(curMult);
				accPlus = accPlus.mul(curMult).add(curPlus);
			}
			curPlus = curMult.add(one).mul(curPlus);
			curMult = curMult.mul(curMult);
			delta = delta.div(two);
		}
		return accMult.mul(state).add(accPlus);
	}
});
Object.seal(Random.RandomFactoryBase._advance);

Object.defineProperty(Random.RandomFactoryBase, '_convertNumberToUInt', {value:
	function(n, length) {
		var rtn = new this._UInt(n);
		if ( n < 0 ) {
			rtn = rtn.toLength(length, true);
		}
		else {
			rtn = rtn.toLength(length);
		}
		return rtn;
	}
});
Object.seal(Random.RandomFactoryBase._convertNumberToUInt);

Object.defineProperty(Random.RandomFactoryBase, '_nextIntRange', {value:
function(start, end) {
	var bound = end.sub(start);
	var threshold = bound.neg().mod(bound);
	while(true) {
		var r = this._nextInt();
		if ( r.greaterOrEqual(threshold) ) {
			return start.add(r.mod(bound)).uint;
		}
	}
}});
Object.seal(Random.RandomFactoryBase._nextIntRange);

Object.defineProperty(Random.RandomFactoryBase, 'nextInt', {writable: true, enumerable: true, value: 
	function() {
		console.log('nextInt not implemented');
	}
});
Object.seal(Random.RandomFactoryBase.nextInt);

Object.defineProperty(Random.RandomFactoryBase, 'advance', {writable: true, enumerable: true, value: 
	function() {
		console.log('advance not implemented');
	}
});
Object.seal(Random.RandomFactoryBase.advance);

Object.defineProperty(Random.RandomFactoryBase, 'nextIntRange', {writable: true, enumerable: true, value: 
	function() {
		console.log('nextIntRange not implemented');
	}
});
Object.seal(Random.RandomFactoryBase.nextIntRange);

Object.defineProperty(Random.RandomFactoryBase, 'nextFloat', {writable: true, enumerable: true, value:
function() {
		console.log('nextFloat not implemented');
}});
Object.seal(Random.RandomFactoryBase.nextFloat);


Object.seal(Random.RandomFactoryBase);

/*******************************************************************************
 * Random.RandomFactory32 Class
 * initState and initSeq should not be a number over 2 to the power 53
 * stateBitSize and seqBitSize can be larger then this power.
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
*******************************************************************************/
Object.defineProperty(Random, 'RandomFactory32', {enumerable: true, value: 
function(initState, initSeq, bitSize) {
	Object.defineProperty(this, '_state', {value: null, writable: true});
	Object.defineProperty(this, '_inc', {value: null, writable: true});
	var intSize = 64;

	this._state = new this._UInt(intSize, true);
	this._inc = new this._UInt(initSeq).toLength(intSize).lShift().or(this._state.one);

	//!Test Below
	if ( this._inc.uint % 2 == 0 ) { console.log('RandomFactory32 _inc is Even!, should be Odd'); }

	this.nextInt();
	this._state = this._state.add(new this._UInt(initState).toLength(intSize));
	this.nextInt();
	Object.seal(this);
}});
Object.defineProperty(Random.RandomFactory32, 'prototype', {value: Object.create(Random.RandomFactoryBase)});
Object.seal(Random.RandomFactory32);

/*******************************************************************************
 * Random.RandomFactory32 prototype
*******************************************************************************/
Object.defineProperty(Random.RandomFactory32.prototype, '_31', {value: new Random.UInt(31)});

Object.defineProperty(Random.RandomFactory32.prototype, '_nextInt', {value:
	function() {
		//Entry method is pcg_setseq_64_xsh_rr_32_random_r
		var oldState = this._state;

		//pcg_setseq_64_step_r
		this._state = oldState.mul(this._multipler64).add(this._inc); 

		//pcg_output_xsh_rr_64_32
		var xorShifted = oldState.rShift(18).xor(oldState).rShift(27);
		var rot = oldState.rShift(59);

		//pcg_rotr_32
		xorShifted = xorShifted.toLength(32);
		rot = rot.toLength(32);
		var temp = xorShifted.rShift(rot.uint);
		var temp2 = rot.neg().and(this._31);
		temp2 = xorShifted.lShift(temp2.uint);

		return temp.or(temp2).toLength(32);
	}
});
Object.seal(Random.RandomFactory32.prototype._nextInt);

Object.defineProperty(Random.RandomFactory32.prototype, 'advance', {enumerable: true, writable: false, value:
	function(delta) {
		this._state = this._advance(this._state, delta, this._multipler64, this._inc);
	}
});
Object.seal(Random.RandomFactory32.prototype.advance);

Object.defineProperty(Random.RandomFactory32.prototype, 'nextIntRange', {enumerable: true, writable: false, value:
	function(start, end) {
		if ( typeof(start) == 'number' ) {
			start = this._convertNumberToUInt(start, 32);
		}
		if ( typeof(end) == 'number' ) {
			end = this._convertNumberToUInt(end, 32);
		}
		return this._nextIntRange(start, end);
	}
});
Object.seal(Random.RandomFactory32.prototype.nextIntRange);

Object.defineProperty(Random.RandomFactory32.prototype, 'nextInt', {enumerable: true, writable: false, value:
	function() {
		return this._nextInt().uint;
	}
});
Object.seal(Random.RandomFactory32.prototype.nextInt);

Object.defineProperty(Random.RandomFactory32.prototype, 'nextFloat', {enumerable: true, writable: false, value:
	function() {
		return 1;
	}
});
Object.seal(Random.RandomFactory32.prototype.nextFloat);


Object.seal(Random.RandomFactory32.prototype);
/*******************************************************************************
 * Random Namespace seal
*******************************************************************************/
Object.seal(Random);
