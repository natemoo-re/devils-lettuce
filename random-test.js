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
		console.log(sumW, items, weights);

		let i = weights.findIndex(findIndexFunc, {
			accumulator: 0,
			select: randomNumber * sumW
		});
		console.log(i);
		let unique = !cache.includes(i);
		
		return [items[i], i];
		// if (unique) {
		// 	cache.push(i);
		// 	return [items[i], i];
		// } else {
		// 	console.log(`${i} IS NOT UNIQUE!`, randomNumber);
		// 	console.groupEnd();
		// 	return ["DUPLICATE", -1];
		// }
	};

	return getItem

}());

function findIndexFunc(weight, index) {
	console.log(`[${index}] ${weight}`, this.accumulator, this.select)
	if (this.accumulator < this.select) {
		this.accumulator += weight;
	};
	return (this.accumulator >= this.select);
}

function getRandomButUniqueItem(map, r) {
	let [ item, i ] = weightedRandom(map, r);
	// let unique = (item !== "DUPLICATE");
	// return (unique) ? [item, i] : getRandomButUniqueItem(map);
	return [ item, i ];
}

// function audit(length) {
// 	console.group("Audit");
	
// 	for (let i = 0; i < length; i++) {
// 		let [item, i] = getRandomButUniqueItem(Demons);
// 		console.log("%o	%o", i, item);
// 	}
// 	console.groupEnd();
// }

// document.addEventListener('DOMContentLoaded', () => {
// 	audit(12);

// 	// document.getElementById("up").addEventListener("click", () => {
// 	// 	let uniq = getRandomButUniqeItem(demons);
// 	// 	document.getElementById('demon').innerHTML = uniq;
// 	// });
// })
