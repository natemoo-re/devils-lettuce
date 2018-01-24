class AppState {
	constructor(seeds, items) {
		this.seedA = seeds[0];
		this.seedB = seeds[1];
		this.itemA = items[0];
		this.itemB = items[1];
	}
}

/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
class Random {
	get value() {
		return this._seed;
	}
	
	constructor(seed) {
		this._seed = seed % 2147483647;
		if (this._seed <= 0) this._seed += 2147483646;
	}

	/**
	 * Returns a pseudo-random value between 1 and 2^32 - 2.
	*/
	next() {
		return this._seed = this._seed * 16807 % 2147483647;
	}

	/**
	 * Returns a pseudo-random floating point number in range [0, 1).
	*/	
	nextFloat(opt_minOrMax, opt_max) {
		// We know that result of next() will be 1 to 2147483646 (inclusive).
		return (this.next() - 1) / 2147483646;
	}
}

let Current;

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("up").addEventListener("click", generate);
	document.getElementById("down").addEventListener("click", generate);

	init();
});

function init(state) {
	if (!window.location.search) {
		generate();
	} else {
		let [seedA, seedB] = getSearch();

		let [itemA, itemB, button] = getItemsFromSeeds(seedA, seedB);
		Current = new AppState([seedA, seedB], [itemA, itemB]);
		let [elA, elB] = displayResult(itemA, itemB, button);
		elA.reveal(600, 200);
		elB.reveal(600, 200);
	}
}

function getItemsFromSeeds(seedA, seedB) {
	let valA = Number.parseFloat("0." + new Random(seedA.repeat(3)).value);
	let valB = Number.parseFloat("0." + new Random(seedB.repeat(8)).value);
	
	let [ itemA ] = getRandomButUniqueItem(Demons, valA);
	let [ itemB ] = getRandomButUniqueItem(Greens, valB);
	
	return [ itemA, itemB ];
}

function getSearch() {
	let seed = window.location.search.split("?s=")[1];
	let seedA = seed.slice(0, 2);
	let seedB = seed.slice(2);
	return [seedA, seedB, seed];
}

function displayResult(demon, green) {
	let containerA = document.getElementById('demon');
	let containerB = document.getElementById('green');
	
	let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const BaffleOpts = {
		characters: chars,
		speed: 67
	}

	let A = baffle(containerA)
	let B = baffle(containerB);
	A.start().set(BaffleOpts).text(text => demon);
	B.start().set(BaffleOpts).text(text => green);

	return [A, B];
}

function setSearch(seedA, seedB) {
	let initQ = window.location.search;
	let newQ = "?s=" + seedA + seedB;

	if (initQ == newQ) {
	} else {
		window.location.search = newQ;
	}
}

class Seed {
	get value() {
		return this._value.toString().padEnd(this._length, "0");
	}

	constructor(length) {
		this._length = length;
		this.getRandomOf(length);
	}

	getRandomOf(length) {
		let max = "1" + "0".repeat(length);
		max = parseInt(max);
		this._value = Math.floor(Math.random() * max);
	}
}

History = []

function generate() {
	let seedA = new Seed(2).value;
	let seedB = new Seed(2).value;
	
	let [ itemA, itemB ] = getItemsFromSeeds(seedA, seedB);
	let Next = new AppState([seedA, seedB], [itemA, itemB]);

	if (!Current) {
		setCurrent(Next);

	} else {
		if ((Current.itemA !== Next.itemA) && (Current.itemB !== Next.itemB)) {
			setCurrent(Next);
		} else {
			generate();
		}
	}
}
window.onpopstate = (e) => init(e);

function setCurrent(Next) {
	Current = Next;
	window.history.pushState(Current, "", `?s=${Current.seedA}${Current.seedB}`);
	init();
	// window.location.search = `?s=${Current.seedA}${Current.seedB}`;
}