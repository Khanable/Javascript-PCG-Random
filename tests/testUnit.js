/*******************************************************************************
 * Tests Init
*******************************************************************************/
var tests = [];
var Test = function(name, func) {
	this.name = name;
	this.func = func;
}

/*******************************************************************************
 * Profiling Init
*******************************************************************************/
var profiler = new Profile.Profiler(document.getElementById('profiling'));

/*******************************************************************************
 * Random.UInt
 * Tests
*******************************************************************************/
tests.push(new Test('UInt Constructor', function(assert) {
	var uint = new Random.UInt(8);
	assert.ok(uint.uint == 8);
	assert.ok(uint._data[0] == true);
	assert.ok(uint._data[1] == false);
	assert.ok(uint._data[2] == false);
	assert.ok(uint._data[3] == false);

	uint = new Random.UInt(4, true);
	assert.ok(uint.uint == 0);
	for(var i in uint._data) {
		assert.ok(uint._data[i] == false);
	}

	uint = new Random.UInt([true, false, false, false]);
	assert.ok(uint.uint == 8);
	assert.ok(uint._data[0] == true);
	assert.ok(uint._data[1] == false);
	assert.ok(uint._data[2] == false);
	assert.ok(uint._data[3] == false);

	uint = new Random.UInt(-4);
	assert.ok(uint.uint == 12);
	assert.ok(uint._data[0] == true);
	assert.ok(uint._data[1] == true);
	assert.ok(uint._data[2] == false);
	assert.ok(uint._data[3] == false);
}));


tests.push(new Test('Logic Tests', function(assert) {
	var uint = new Random.UInt(1);
	var LogicTest = function(a, b, result) {
		this.a = a;
		this.b = b;
		this.result = result;
	}

	var andTests = [];
	andTests.push(new LogicTest(false, false, false));
	andTests.push(new LogicTest(false, true, false));
	andTests.push(new LogicTest(true, false, false));
	andTests.push(new LogicTest(true, true, true));

	var xorTests = [];
	xorTests.push(new LogicTest(false, false, false));
	xorTests.push(new LogicTest(false, true, true));
	xorTests.push(new LogicTest(true, false, true));
	xorTests.push(new LogicTest(true, true, false));

	var orTests = [];
	orTests.push(new LogicTest(false, false, false));
	orTests.push(new LogicTest(false, true, true));
	orTests.push(new LogicTest(true, false, true));
	orTests.push(new LogicTest(true, true, true));

	var xnorTests = [];
	xnorTests.push(new LogicTest(false, false, true));
	xnorTests.push(new LogicTest(false, true, false));
	xnorTests.push(new LogicTest(true, false, false));
	xnorTests.push(new LogicTest(true, true, true));

	var allTests = [andTests, xorTests, orTests, xnorTests];
	var operation = [uint._and, uint._xor, uint._or, uint._xnor];
	for(var i in allTests) {
		for(var j in allTests[i]) {
			var cur = allTests[i][j];
			var op = operation[i];
			assert.ok(op(cur.a, cur.b) == cur.result);
		}
	}
}));


tests.push(new Test('UInt _increaseSize', function(assert) {
	var uint = new Random.UInt(2, true);

	var uint = new Random.UInt(uint._increaseSize(5, uint.data));
	assert.ok(uint.length == 7);
	var uint = new Random.UInt(uint._increaseSize(32, uint.data));
	assert.ok(uint.length == 39);
}));


tests.push(new Test('UInt _truncate', function(assert) {
	var uint = new Random.UInt(32, true);
	var data = uint.data;

	data = uint._truncate(16, data);
	assert.ok(data.length == 16);
	data = uint._truncate(1, data);
	assert.ok(data.length == 1);
	data = uint._truncate(0, data);
	assert.ok(data.length == 1);
}));


tests.push(new Test('UInt toLength', function(assert) {
	var uint = new Random.UInt(32, true);

	uint = uint.toLength(16);
	assert.ok(uint.length == 16);
	//uint = uint.toLength(32);
	//assert.ok(uint.length == 32);
}));


tests.push(new Test('UInt add', function(assert) {
	var src = new Random.UInt(5);
	var dst = new Random.UInt(2);
	assert.ok(src.add(dst).uint == 7);

	src = new Random.UInt(7);
	dst = new Random.UInt(2);
	assert.ok(src.add(dst).uint == 1);
}));

tests.push(new Test('UInt div', function(assert) {
	var src = new Random.UInt(4);
	var dst = new Random.UInt(2);

	assert.ok(src.div(dst).uint == 2);

	src = new Random.UInt(9);
	dst = new Random.UInt(3);
	assert.ok(src.div(dst).uint == 3);

	src = new Random.UInt(16);
	dst = new Random.UInt(8);
	assert.ok(src.div(dst).uint == 2);

	src = new Random.UInt(10);
	dst = new Random.UInt(2);
	assert.ok(src.div(dst).uint == 5);

	src = new Random.UInt(10);
	dst = new Random.UInt(2).toLength(32);
	assert.ok(src.div(dst).uint == 5);
}));


tests.push(new Test('UInt mod', function(assert) {
	var src = new Random.UInt(4);
	var dst = new Random.UInt(2);
	assert.ok(src.mod(dst).uint == 0);

	src = new Random.UInt(6);
	dst = new Random.UInt(5);
	assert.ok(src.mod(dst).uint == 1);

	src = new Random.UInt(7);
	dst = new Random.UInt(5);
	assert.ok(src.mod(dst).uint == 2);
}));

tests.push(new Test('UInt mul', function(assert) {
	var src = new Random.UInt(3, true);
	var dst = new Random.UInt(2);
	src = src.add(dst);
	assert.ok(src.mul(dst).uint == 4);

	src = new Random.UInt(5, true);
	dst = new Random.UInt(3);
	src = src.add(new Random.UInt(6));
	assert.ok(src.mul(dst).uint == 18);

	src = new Random.UInt(5);
	dst = new Random.UInt(2);
	assert.ok(src.mul(dst).uint == 2);
}));

tests.push(new Test('UInt rShift', function(assert) {
	var uint = new Random.UInt(16);
	assert.ok(uint.rShift(0).uint == 16);
	assert.ok(uint.rShift().uint == 8);
	assert.ok(uint.rShift(2).uint == 4);
	assert.ok(uint.rShift(3).uint == 2);
	assert.ok(uint.rShift(4).uint == 1);
	assert.ok(uint.rShift(5).uint == 0);
}));

tests.push(new Test('UInt lShift', function(assert) {
	var uint = new Random.UInt(5, true);
	uint = uint.add(new Random.UInt(1));
	assert.ok(uint.rShift(0).uint == 1);
	assert.ok(uint.lShift().uint == 2);
	assert.ok(uint.lShift(2).uint == 4);
	assert.ok(uint.lShift(3).uint == 8);
	assert.ok(uint.lShift(4).uint == 16);
	assert.ok(uint.lShift(5).uint == 0);
}));

tests.push(new Test('UInt equal', function(assert) {
	var uint1 = new Random.UInt(2);
	var uint2 = new Random.UInt(2);
	assert.ok(uint1.equal(uint2));

	uint2 = new Random.UInt(3);
	assert.ok(!uint1.equal(uint2));

	uint2 = new Random.UInt(1);
	assert.ok(!uint1.equal(uint2));
}));

tests.push(new Test('UInt greater', function(assert) {
	var uint1 = new Random.UInt(2);
	var uint2 = new Random.UInt(2);
	assert.ok(!uint1.greater(uint2));

	uint2 = new Random.UInt(3);
	assert.ok(!uint1.greater(uint2));

	uint2 = new Random.UInt(1);
	assert.ok(uint1.greater(uint2));

	uint1 = new Random.UInt(3);
	uint2 = new Random.UInt(32, true);
	assert.ok(uint1.greater(uint2));
}));

tests.push(new Test('UInt less', function(assert) {
	var uint1 = new Random.UInt(2);
	var uint2 = new Random.UInt(2);
	assert.ok(!uint1.less(uint2));

	uint2 = new Random.UInt(3);
	assert.ok(uint1.less(uint2));

	uint2 = new Random.UInt(1);
	assert.ok(!uint1.less(uint2));
}));

tests.push(new Test('UInt lessOrEqual', function(assert) {
	var uint1 = new Random.UInt(2);
	var uint2 = new Random.UInt(2);
	assert.ok(uint1.lessOrEqual(uint2));

	uint2 = new Random.UInt(3);
	assert.ok(uint1.lessOrEqual(uint2));

	uint2 = new Random.UInt(1);
	assert.ok(!uint1.lessOrEqual(uint2));
}));

tests.push(new Test('UInt greaterOrEqual', function(assert) {
	var uint1 = new Random.UInt(2);
	var uint2 = new Random.UInt(2);
	assert.ok(uint1.greaterOrEqual(uint2));

	uint2 = new Random.UInt(3);
	assert.ok(!uint1.greaterOrEqual(uint2));

	uint2 = new Random.UInt(1);
	assert.ok(uint1.greaterOrEqual(uint2));
}));

/*******************************************************************************
 * Random.UInt
 * Profiling
*******************************************************************************/
var envTemp = null;

var indexProfile = Object.create(Profile.EnvBase); 
indexProfile.index = 0;
indexProfile.call = function () {
	new Random.UInt(this.index);
}
indexProfile.next = function() {
	this.index+=1;
}
indexProfile.numTimes = function() {
	return 100;
}
profiler.addProfile(new Profile.Profile('UInt Creation from Number i', indexProfile));

envTemp = Object.create(indexProfile); 
envTemp.call = function() {
	new Random.UInt(this.index, true);
}
profiler.addProfile(new Profile.Profile('UInt Creation from Length i', envTemp));

envTemp = Object.create(Profile.EnvBase);
envTemp.curData = [];
envTemp.call = function() {
	new Random.UInt(this.curData);
}
envTemp.next = function() {
	if ( this.curData.length % 2 == 0 ) {
		this.curData.push(true);
	}
	else {
		this.curData.push(false);
	}
} 
envTemp.numTimes = function() {
	return 100;
}
profiler.addProfile(new Profile.Profile('UInt Creation from data', envTemp));

envTemp = Object.create(Profile.EnvBase);
envTemp.call = function() {
	this.uint.toLength(this.targetLength);
}
envTemp.next = function() {
	if ( !this.reverse && this.targetLength >= envTemp.startSize*2) {
		this.reverse = true;
	}

	if ( this.reverse && this.targetLength > 0 ) {
		this.targetLength-=1;
	}
	else {
		this.targetLength+=1;
	}
}
envTemp.startSize = 32;
envTemp.reverse = false;
envTemp.targetLength = envTemp.startSize;
envTemp.numTimes = function() { return this.startSize*3; }
envTemp.uint = new Random.UInt(envTemp.startSize, true);
profiler.addProfile(new Profile.Profile('UInt toLength', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(32, true);
envTemp.dst = new Random.UInt(2);
envTemp.call = function() {
	this.src = this.src.add(this.dst);
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt add', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(32, true);
envTemp.dst = new Random.UInt(2);
envTemp.call = function() {
	this.src = this.src.div(this.dst);
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt div', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(32, true);
envTemp.dst = new Random.UInt(2);
envTemp.call = function() {
	this.src = this.src.mod(this.dst);
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt mod', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(32, true);
envTemp.dst = new Random.UInt(2);
envTemp.call = function() {
	this.src = this.src.mul(this.dst);
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt mul', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.uint = new Random.UInt(65535);
envTemp.call = function() {
	this.uint.rShift();
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 16; }
profiler.addProfile(new Profile.Profile('UInt rShift', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.uint = new Random.UInt(65535);
envTemp.call = function() {
	this.uint.lShift();
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 16; }
profiler.addProfile(new Profile.Profile('UInt lShift', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(32, true);
envTemp.dst = new Random.UInt(2);
envTemp.call = function() {
	this.src = this.src.xor(this.dst);
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt xor', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(32, true);
envTemp.dst = new Random.UInt(2);
envTemp.call = function() {
	this.src = this.src.or(this.dst);
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt or', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(32, true);
envTemp.dst = new Random.UInt(2);
envTemp.call = function() {
	this.src = this.src.and(this.dst);
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt and', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.uint = new Random.UInt(6329);
envTemp.call = function() {
	this.uint = this.uint.neg();
}
envTemp.next = function() {
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt neg', envTemp));


envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(65150);
envTemp.dst = new Random.UInt(65100);
envTemp.call = function() {
	this.src.greaterOrEqual(this.dst);
}
envTemp.next = function() {
	envTemp.dst = envTemp.dst.add(envTemp.dst.one);
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt greaterOrEqual', envTemp));

envTemp = Object.create(Profile.EnvBase);
envTemp.src = new Random.UInt(65150);
envTemp.dst = new Random.UInt(65100);
envTemp.call = function() {
	this.src.equal(this.dst);
}
envTemp.next = function() {
	envTemp.dst = envTemp.dst.add(envTemp.dst.one);
}
envTemp.numTimes = function() { return 100; }
profiler.addProfile(new Profile.Profile('UInt equal', envTemp));

/*******************************************************************************
 * Random.RandomFactory
 * Tests
*******************************************************************************/
tests.push(new Test('RandomFactory Constructor', function(assert) {
	var random = new Random.RandomFactory32(42, 54);

	var data = {};
	data.state = [false, false, false, true, true, false, false, false, false, true, false, true, false, true, true, true, false, false, false, false, false, true, true, false, true, false, true, true, true, false, false, false, false, false, true, false, true, true, false, false, false, false, true, false, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, false, false, false]
	data.inc = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, true, true, false, true];
	data.current = data.state;

	var test = function(e, i) { return e == this.current[i]; }

	assert.ok(random._state.data.every(test, data));

	data.current = data.inc;
	assert.ok(random._inc.data.every(test, data));
}));

/*******************************************************************************
 * Tests Run
*******************************************************************************/
var runTests = function(tests) {
	for(var i in tests) {
		var cur = tests[i];
		QUnit.test(cur.name, cur.func);
	}
}
runTests(tests);

/*******************************************************************************
 * Profiling Run
*******************************************************************************/
profiler.run();
