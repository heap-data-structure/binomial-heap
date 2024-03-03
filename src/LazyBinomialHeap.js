import LazyStack from './LazyStack.js';

export default function LazyBinomialHeap(BinomialTree) {
	const lazy_binomial_heap_push = function (lazy, tree, rank) {
		// Lightweight binomial heap containing a unique tree
		const sequence = [];

		// Offset tree by its rank
		let i = rank;

		while (i--) {
			sequence.push(null);
		}

		sequence.push(tree);

		// Do not merge the generated sequence immediately
		lazy.push(sequence);
	};

	const merge = function (compare, list, other) {
		if (other.length === 0) {
			return;
		}

		// Merging two binomial heaps is like
		// adding two little endian integers
		// so, we first make sure that we have
		// enough place to store the result

		let i = other.length - list.length;

		while (i-- > 0) {
			list.push(null);
		}

		let carry = null;

		const len = list.length;

		// Remember len >= other.length

		for (i = 0; i < len; ++i) {
			// Other[i] can be either null or not
			// list[i] can be either null or not
			// carry can be either null or not
			// --> 2^3 = 8 possibilities
			//
			//    null ? | other[i] | list[i] | carry
			// ---------------------------------------
			//     (0)   |    no    |     no  |   no
			//     (1)   |    no    |     no  |  yes
			//     (2)   |    no    |    yes  |   no
			//     (3)   |    no    |    yes  |  yes
			//     (4)   |   yes    |     no  |   no
			//     (5)   |   yes    |     no  |  yes
			//     (6)   |   yes    |    yes  |   no
			//     (7)   |   yes    |    yes  |  yes

			if (i >= other.length || other[i] === null) {
				if (carry !== null) {
					// (6) other[i] = null and list[i] = null and carry != null
					// --> put carry in current cell

					if (list[i] === null) {
						list[i] = carry;
						carry = null;
					}

					// (4) other[i] = null and list[i] != null and carry != null
					// --> merge carry with current cell
					else {
						carry = carry.merge(compare, list[i]);
						list[i] = null;
					}
				}

				// We do not need to do anything for
				// those 2 cases (carry and other[i] are null).
				// ==
				// (5) other[i] = null and list[i] != null and carry = null
				// (7) other[i] = null and list[i] = null and carry = null
			}

			// (0) other[i] != null and list[i] != null and carry != null
			// (2) other[i] != null and list[i] = null and carry != null
			// --> merge carry with other[i]
			else if (carry !== null) {
				carry = carry.merge(compare, other[i]);
			}

			// (1) other[i] != null and list[i] != null and carry = null
			// --> merge current cell with other[i]
			else if (list[i] === null) {
				list[i] = other[i];
			}

			// (3) other[i] != null and list[i] = null and carry = null
			// --> put other[i] in list
			else {
				carry = list[i].merge(compare, other[i]);
				list[i] = null;
			}
		}

		// Do not forget to append last carry

		if (carry !== null) {
			list.push(carry);
		}
	};

	const lazy_binomial_heap_pop = function (compare, list, lazy) {
		// Amortized merge of stored values

		while (!lazy.empty()) merge(compare, list, lazy.pop());

		// Standard O(log n) optimum search method

		const len = list.length;

		// There MUST be at least one
		// non null element in this list
		// we look for the first one

		let j = 0;
		for (; j < len - 1 && list[j] === null; ++j);

		// Here j is necessarily < len
		// and list[j] is non null

		let i = j;
		let opt = list[j].value;

		// We lookup remaining elements to see if there
		// is not a better candidate

		for (++j; j < len; ++j) {
			const item = list[j];

			if (item !== null) {
				const candidate = item.value;

				if (compare(candidate, opt) < 0) {
					i = j;
					opt = candidate;
				}
			}
		}

		const orphan = list[i].children;
		list[i] = null;

		// We just removed the ith element
		// if list[i] is the last cell
		// of list we can drop it

		if (i === len - 1) {
			list.pop();
		}

		// We store the children in the
		// lazy list

		lazy.push(orphan);

		return opt;
	};

	const Heap = function (compare) {
		// The compare function to use to compare values

		this.compare = compare;

		// Number of elements in this heap

		this.length = 0;

		// List of binomial trees

		this.list = [];

		// List of binomial heaps waiting to be merged

		this.lazy = new LazyStack();
	};

	Heap.prototype.pop = function () {
		if (this.length === 0) {
			return undefined;
		}

		--this.length;

		return lazy_binomial_heap_pop(this.compare, this.list, this.lazy);
	};

	Heap.prototype.push = function (value) {
		++this.length;

		// Push a new tree of rank 0

		return lazy_binomial_heap_push(this.lazy, new BinomialTree(value, []), 0);
	};

	Heap.prototype.merge = function (other) {
		this.lazy.meld(other.lazy);

		this.length += other.length;

		return this;
	};

	return Heap;
}
