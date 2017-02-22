var TestSettings = {
	rounds: 5,
	initState: 42,
	initSeq: 54,
	numValues: 6,
	numWrap: 6,
};

var Expected = function(bit32, coins, rolls, cards) {
	this.bit32 = bit32;
	this.again = bit32;
	this.coins = coins;
	this.rolls = rolls;
	this.cards = cards;
}
var expectedOutput = [];
expectedOutput.push(new Expected(
	['0xa15c02b7', '0x7b47f409', '0xba1d3330', '0x83d2f293', '0xbfa4784b', '0xcbed606e'],
	['H', 'H', 'T', 'T', 'T', 'H', 'T', 'H', 'H', 'H', 'T', 'H', 'T', 'T', 'T', 'H', 'H', 'H', 'H', 'H', 'T', 'T', 'T', 'H', 'H', 'H', 'T', 'H', 'T', 'H', 'T', 'H', 'T', 'T', 'H', 'T', 'T', 'T', 'H', 'H', 'H', 'H', 'H', 'H', 'T', 'T', 'T', 'T', 'H', 'H', 'T', 'T', 'T', 'T', 'T', 'H', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'H', 'T'], 
	['3', '4', '1', '1', '2', '2', '3', '2', '4', '3', '2', '4', '3', '3', '5', '2', '3', '1', '3', '1', '5', '1', '4', '1', '5', '6', '4', '6', '6', '2', '6', '3', '3'],
	['Qd', 'Ks', '6d', '3s', '3d', '4c', '3h', 'Td', 'Kc', '5c', 'Jh', 'Kd', 'Jd', 'As', '4s', '4h', 'Ad', 'Th', 'Ac', 'Jc', '7s', 'Qs', '2s', '7h', 'Kh', '2d', '6c', 'Ah', '4d', 'Qh', '9h', '6s', '5s', '2c', '9c', 'Ts', '8d', '9s', '3c', '8c', 'Js', '5d', '2h', '6h', '7d', '8s', '9d', '5h', '8h', 'Qc', '7c', 'Tc']
));
expectedOutput.push(new Expected(
	['0x74ab93ad', '0x1c1da000', '0x494ff896', '0x34462f2f', '0xd308a3e5', '0x0fa83bab'],
	['H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'T',  'H',  'H',  'H',  'T',  'H',  'T',  'H',  'T',  'H',  'T',  'H',  'T',  'T',  'T',  'T',  'H',  'H',  'T',  'T',  'T',  'H',  'H',  'T',  'H',  'H',  'T',  'H',  'T',  'T',  'H',  'H',  'T',  'T',  'T',  'H',  'H',  'H',  'H',  'H',  'H',  'T',  'H',  'T',  'T',  'H',  'T',  'H',  'T',  'T',  'T',  'T',  'T',  'T',  'T'] 
	['5', '1', '1', '3', '3', '2', '4', '5', '3', '2', '2', '6', '4', '3', '2', '4', '2', '4', '3', '2', '3', '6', '3', '2', '3', '4', '2', '4', '1', '1', '5', '4', '4'],
	['7d', '2s', '7h', 'Td', '8s', '3c', '3d', 'Js', '2d', 'Tc', '4h', 'Qs', '5c', '9c', 'Th', '2c', 'Jc', 'Qd', '9d', 'Qc', '7s', '3s', '5s', '6h', '4d', 'Jh', '4c', 'Ac', '4s', '5h', '5d', 'Kc', '8h', '8d', 'Jd', '9s', 'Ad', '6s', '6c', 'Kd', '2h', '3h', 'Kh', 'Ts', 'Qh', '9h', '6d', 'As', '7c', 'Ks', 'Ah', '8c']
));
expectedOutput.push(new Expected(
	['0x39af5f9f', '0x04196b18', '0xc3c3eb28', '0xc076c60c', '0xc693e135', '0xf8f63932'],
	['H', 'T', 'T', 'H', 'H', 'T', 'T', 'T', 'T', 'T', 'H', 'T', 'T', 'H', 'H', 'H', 'T', 'H', 'T', 'T', 'H', 'H', 'T', 'T', 'H', 'T', 'H', 'H', 'T', 'H', 'T', 'H', 'T', 'T', 'T', 'T', 'H', 'H', 'T', 'T', 'T', 'H', 'H', 'T', 'H', 'H', 'T', 'T', 'H', 'T', 'T', 'H', 'H', 'H', 'T', 'H', 'H', 'H', 'T', 'H', 'T', 'T', 'T', 'H', 'T'] 
	['5', '1', '5', '3', '2', '2', '4', '5', '3', '3', '1', '3', '4', '6', '3', '2', '3', '4', '2', '2', '3', '1', '5', '2', '4', '6', '6', '4', '2', '4', '3', '3', '6'],
	['Kd', 'Jh', 'Kc', 'Qh', '4d', 'Qc', '4h', '9d', '3c', 'Kh', 'Qs', '8h', '5c', 'Jd', '7d', '8d', '3h', '7c', '8s', '3s', '2h', 'Ks', '9c', '9h', '2c', '8c', 'Ad', '7s', '4s', '2s', '5h', '6s', '4c', 'Ah', '7h', '5s', 'Ac', '3d', '5d', 'Qd', 'As', 'Tc', '6h', '9s', '2d', '6c', '6d', 'Td', 'Jc', 'Ts', 'Th', 'Js']
));
expectedOutput.push(new Expected(
	['0x55ce6851', '0x97a7726d', '0x17e10815', '0x58007d43', '0x962fb148', '0xb9bb55bd'],
	['H', 'H', 'T', 'H', 'H', 'T', 'T', 'T', 'T', 'H', 'T', 'H', 'H', 'H', 'H', 'H', 'T', 'T', 'H', 'H', 'H', 'T', 'T', 'T', 'H', 'H', 'T', 'H', 'T', 'H', 'T', 'H', 'T', 'H', 'H', 'T', 'T', 'H', 'T', 'H', 'H', 'H', 'H', 'H', 'H', 'T', 'H', 'H', 'T', 'H', 'H', 'T', 'H', 'H', 'T', 'T', 'T', 'T', 'H', 'H', 'T', 'H', 'H', 'T', 'T'],
	['6', '6', '3', '2', '3', '4', '2', '6', '4', '2', '6', '3', '2', '3', '5', '5', '3', '4', '4', '6', '6', '2', '6', '5', '4', '4', '6', '1', '6', '1', '3', '6', '5'],
	['Qd', '8h', '5d', '8s', '8d', 'Ts', '7h', 'Th', 'Qs', 'Js', '7s', 'Kc', '6h', '5s', '4d', 'Ac', 'Jd', '7d', '7c', 'Td', '2c', '6s', '5h', '6d', '3s', 'Kd', '9s', 'Jh', 'Kh', 'As', 'Ah', '9h', '3c', 'Qh', '9c', '2d', 'Tc', '9d', '2s', '3d', 'Ks', '4h', 'Qc', 'Ad', 'Jc', '8c', '2h', '3h', '4s', '4c', '5c', '6c']
));
expectedOutput.push(new Expected(
	['0xfcef7cd6', '0x1b488b5a', '0xd0daf7ea', '0x1d9a70f7', '0x241a37cf', '0x9a3857b7'],
	['H', 'H', 'H', 'H', 'T', 'H', 'H', 'T', 'T', 'H', 'T', 'T', 'H', 'H', 'H', 'T', 'T', 'T', 'H', 'H', 'T', 'H', 'T', 'H', 'T', 'T', 'T', 'T', 'H', 'T', 'T', 'H', 'T', 'H', 'T', 'T', 'T', 'H', 'H', 'H', 'T', 'H', 'T', 'H', 'T', 'T', 'H', 'T', 'T', 'H', 'T', 'H', 'H', 'T', 'H', 'T', 'H', 'H', 'H', 'T', 'H', 'T', 'H', 'T', 'T'],
	['5', '4', '1', '2', '6', '1', '3', '1', '5', '6', '3', '6', '2', '1', '4', '4', '5', '2', '1', '5', '6', '5', '6', '4', '4', '4', '5', '2', '6', '4', '3', '5', '6'],
	['4d', '9s', 'Qc', '9h', 'As', 'Qs', '7s', '4c', 'Kd', '6h', '6s', '2c', '8c', '5d', '7h', '5h', 'Jc', '3s', '7c', 'Jh', 'Js', 'Ks', 'Tc', 'Jd', 'Kc', 'Th', '3h', 'Ts', 'Qh', 'Ad', 'Td', '3c', 'Ah', '2d', '3d', '5c', 'Ac', '8s', '5s', '9c', '2h', '6c', '6d', 'Kh', 'Qd', '8d', '7d', '2s', '8h', '4h', '9d', '4s']
));



function tossCoins(rand) {
	var rtn = [];
	for(var i = 0; i < 65; ++i) {
		rtn.push('{0}'.format(rand.nextIntRange(0, 2) ? 'H' : 'T'));
	}
	return rtn;
}

function rollDice(rand) {
	var rtn = [];
	for(var i = 0; i < 33; ++i) {
		rtn.push('{0}'.format(rand.nextIntRange(0, 6)+1));
	}
	return rtn;
}

function dealCards(rand) {
	var cardEnum = { Suits: 4, Numbers: 13, Cards: 52 };
	
	var cards = [];
	for( var i = 0; i < cardEnum.Cards; i++ ) {
		cards[i] = i;
	}

	for( var i = cardEnum.Cards; i > 1; i-- ) {
		var chosen = rand.nextIntRange(0, i);
		var card = cards[chosen];
		cards[chosen] = cards[i-1];
		cards[i-1] = card;
	}

	var number = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
	var suit = ['h', 'c', 'd', 's'];
	var rtn = [];
	for( var i = 0; i < cardEnum.Cards; i++ ) {
		rtn.push('{0}{1}'.format(number[Math.floor(cards[i] / cardEnum.Suits)], suit[cards[i] % cardEnum.Suits]));
	}
	return rtn;
}

function randNums(rand, numValues) {
	var rtn = [];
	for(var i = 0; i < numValues; ++i) {
		rtn.push('0x{0}'.format(rand.nextInt().toString(16)));
	}
	return rtn;
}



function writeLine(root, str) {
	var newDiv = document.createElement('div');
	root.appendChild(newDiv);
	newDiv.innerHTML += str;
}


function output(rootID, testSettings) {
	var root = document.getElementById(rootID);
	var rand = new Random.RandomFactory32(testSettings.initState, testSettings.initSeq);
	var randomResults = null;
	var s = null;

	for(let round = 1; round < testSettings.rounds; round++) {

		writeLine(root, 'Round {0}:'.format(round));
		for(let i = 0; i < 2; i++) {
			randomResults = randNums(rand, testSettings.numValues);

			s = '';
			for(let j in randomResults) {
				if ( j > 0 && j % testSettings.numWrap == 0 ) {
					writeLine(root, s);
				}
				s += '{0} '.format(randomResults[j]);
			}
			writeLine(root, s);

			if ( i == 0 ) {
				writeLine(root, 'Again:');
				rand.advance(testSettings.numValues*-1);
			}
		}

		randomResults = tossCoins(rand);
		writeLine(root, 'Coins:');
		s = '';
		for(let cur of randomResults) {
			s += '{0}'.format(cur);
		}
		writeLine(root, s);


		randomResults = rollDice(rand);
		writeLine(root, 'Rolls:');
		s = '';
		for(let cur of randomResults) {
			s += '{0} '.format(cur);
		}
		writeLine(root, s);


		randomResults = dealCards(rand);
		writeLine(root, 'Cards:');
		s = '';
		for(let i in randomResults) {
			s += '{0} '.format(randomResults[i]);
			if ( i > 0 && i % 22 == 0 ) {
				writeLine(root, s);
				s = '';
			}
		}
		writeLine(root, s);

		writeLine(root, '<br>');
	}
	
}


function runTests(testSettings) {
	var curSrc = null;
	var curDst = null;
	var rand = new Random.RandomFactory32(testSettings.initState, testSettings.initSeq);
	var test = 
		function(assert) {
			assert.ok(curSrc.every( function(e, i) { return e == curDst[i]; } ));
		};

	for(let i = 0; i < testSettings.rounds; i++) {
		QUnit.module('Round {0}'.format(i+1));

		curSrc = expectedOutput[i].bit32;
		curDst = randNums(rand, testSettings.numValues);
		QUnit.test('{0}'.format('32Bit'), test);

		rand.advance(testSettings.numValues*-1);
		curSrc = expectedOutput[i].again;
		curDst = randNums(rand, testSettings.numValues);
		QUnit.test('{0}'.format('Again'), test);

		curSrc = expectedOutput[i].coins;
		curDst = tossCoins(rand);
		QUnit.test('{0}'.format('Coins'), test);

		curSrc = expectedOutput[i].rolls;
		curDst = rollDice(rand);
		QUnit.test('{0}'.format('Rolls'), test);

		curSrc = expectedOutput[i].cards;
		curDst = dealCards(rand);
		QUnit.test('{0}'.format('Cards'), test);
	}
}


function profile(elementID, testSettings) {
	var profiler = new Profile.Profiler(document.getElementById(elementID));
	var rand = new Random.RandomFactory32(testSettings.initState, testSettings.initSeq);
	
	var env = Object.create(Profile.EnvBase);
	env.rand = rand;
	env.testSettings = testSettings;
	env.next = function() {};
	env.numTimes = function() { return this.testSettings.rounds; };
	env.call = function() { 
		randNums(this.rand, this.testSettings.numValues);
		this.rand.advance(this.testSettings.numValues*-1);
		randNums(this.rand, this.testSettings.numValues);
		tossCoins(rand);
		rollDice(rand);
		dealCards(rand);
 	}
	profiler.addProfile(new Profile.Profile('Profile Rounds', env));

	profiler.run();
}
