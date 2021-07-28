export default function BinomialHeap(BinomialTree) {
	const binomial_heap_push = function (compare, list, tree, rank) {
		// Ensures list has at least rank cells

		let i = rank - list.length;

		while (i-- > 0) {
			list.push(null);
		}

		// Loop invariant
		// tree and list[i] have the same rank

		const len = list.length;

		for (i = rank; i < len && list[i] !== null; ++i) {
			// There is already a tree with this rank

			tree = tree.merge(compare, list[i]);
			list[i] = null;
		}

		// Do not forget to append null if
		// we are lacking space

		if (i === len) {
			list.push(null);
		}

		// Cell is empty
		// we can just put the new tree here

		list[i] = tree;
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
			else if (list[i] !== null) {
				carry = list[i].merge(compare, other[i]);
				list[i] = null;
			}

			// (3) other[i] != null and list[i] = null and carry = null
			// --> put other[i] in list
			else {
				list[i] = other[i];
			}
		}

		// Do not forget to append last carry

		if (carry !== null) {
			list.push(carry);
		}
	};

	const find_min_index = function (compare, list, j, len) {
		// There MUST be at least one
		// non null element in this list
		// we look for the first one

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

		return i;
	};

	const remove_head_at_index = function (compare, list, i, len) {
		const orphans = list[i].children;
		list[i] = null;

		change_parent(null, orphans);

		// We just removed the ith element
		// if list[i] is the last cell
		// of list we can drop it

		if (i === len - 1) {
			list.pop();
		}

		// We merge back the children of
		// the removed tree into the heap

		merge(compare, list, orphans);
	};

	const binomial_heap_pop = function (compare, list) {
		const len = list.length;

		const i = find_min_index(compare, list, 0, len);

		const tree = list[i];

		remove_head_at_index(compare, list, i, len);

		return tree;
	};

	const change_parent = function (parent, children) {
		const len = children.length;

		for (let i = 0; i < len; ++i) {
			children[i].setparent(parent);
		}
	};

	const shift_up = function (tree, parent) {
		// Console.log( "tree", tree.value );
		// console.log( "parent", parent.value );

		// Here, we cannot just swap values as it would invalidate
		// externally stored references.
		// Instead, we swap children lists and update references
		// between the tree and its parent.
		// Then we update and return the new tree's parent.

		// console.log( "tree.children", tree.children );
		// console.log( "parent.children", parent.children );

		const tmp = parent.children;
		parent.children = tree.children;
		tree.children = tmp;

		const i = parent.rank();

		// Console.log( tree.children, i );

		tree.children[i] = parent;

		tree.parent = parent.parent;

		change_parent(tree, tree.children);
		change_parent(parent, parent.children);

		// Console.log( "tree.children", tree.children );
		// console.log( "parent.children", parent.children );

		return tree.parent;
	};

	const percolate_up = function (list, tree) {
		let parent = tree.parent;

		if (parent !== null) {
			while (true) {
				parent = shift_up(tree, parent);

				if (parent === null) {
					break;
				}

				// TODO this call might not be necessary
				parent.children[tree.rank()] = tree;
			}

			list[tree.rank()] = tree;
		}
	};

	const decreasekey = function (compare, list, tree, value) {
		tree.value = value;
		let parent = tree.parent;

		if (parent !== null) {
			while (true) {
				const d = compare(value, parent.value);

				if (d >= 0) {
					return;
				}

				parent = shift_up(tree, parent);

				if (parent === null) {
					break;
				}

				// TODO this call should be in if ( d >= 0 )
				parent.children[tree.rank()] = tree;
			}

			list[tree.rank()] = tree;
		}
	};

	const deletetree = function (compare, list, tree) {
		percolate_up(list, tree);

		remove_head_at_index(compare, list, tree.rank(), list.length);

		tree.detach();
	};

	const Heap = function (compare) {
		// The compare function to use to compare values

		this.compare = compare;

		// Number of elements in this heap

		this.length = 0;

		// List of binomial trees

		this.list = [];
	};

	Heap.prototype.head = function () {
		if (this.length === 0) {
			return undefined;
		}

		const i = find_min_index(this.compare, this.list, 0, this.list.length);

		const tree = this.list[i];

		return tree.value;
	};

	Heap.prototype.headreference = function () {
		if (this.length === 0) {
			return null;
		}

		const i = find_min_index(this.compare, this.list, 0, this.list.length);

		const tree = this.list[i];

		return tree;
	};

	Heap.prototype.pop = function () {
		if (this.length === 0) {
			return undefined;
		}

		--this.length;

		return binomial_heap_pop(this.compare, this.list).value;
	};

	Heap.prototype.popreference = function () {
		if (this.length === 0) {
			return null;
		}

		--this.length;

		return binomial_heap_pop(this.compare, this.list).detach();
	};

	Heap.prototype.push = function (value) {
		// Push a new tree of rank 0

		const tree = new BinomialTree(value, []);

		this.pushreference(tree);

		return tree;
	};

	Heap.prototype.pushreference = function (tree) {
		++this.length;

		// Push an existing tree of rank 0

		binomial_heap_push(this.compare, this.list, tree, 0);
	};

	Heap.prototype.merge = function (other) {
		merge(this.compare, this.list, other.list);

		this.length += other.length;

		return this;
	};

	Heap.prototype.update = function (tree, value) {
		const d = this.compare(value, tree.value);

		if (d < 0) {
			this.decreasekey(tree, value);
		} else if (d > 0) {
			this.increasekey(tree, value);
		} else {
			// D === 0 does not imply tree.value === value

			tree.value = value;
		}
	};

	Heap.prototype.decreasekey = function (tree, value) {
		decreasekey(this.compare, this.list, tree, value);
	};

	Heap.prototype.increasekey = function (tree, value) {
		deletetree(this.compare, this.list, tree);

		tree.value = value;

		binomial_heap_push(this.compare, this.list, tree, 0);
	};

	Heap.prototype.delete = function (tree) {
		--this.length;

		deletetree(this.compare, this.list, tree);
	};

	return Heap;
}
