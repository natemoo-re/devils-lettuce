const weightedRandom = (function () {
	/* Number of unique items before a value will re-appear */
	let uniqueBeforeDuplicate = 4;
	let cache = [];

	function getItem(set, randomNumber) {
		/* Removes first (oldest) item in array if array is too long */
		if (cache.length >= uniqueBeforeDuplicate) { cache.shift() };

		let sumW = Array.from(set.values()).reduce((a, b) => a + b, 0);
		let items = Array.from(set.keys());
		let weights = Array.from(set.values());
		// console.log(sumW, items, weights);

		let i = weights.findIndex(findIndexFunc, {
			accumulator: 0,
			select: randomNumber * sumW
		});
		let unique = !cache.includes(i);
		
		return [items[i], i];
	};

	return getItem

}());

function findIndexFunc(weight, index) {
	if (this.accumulator < this.select) {
		this.accumulator += weight;
	};
	return (this.accumulator >= this.select);
}

function getRandomButUniqueItem(map, r) {
	let [ item, i ] = weightedRandom(map, r);
	return [ item, i ];
}
