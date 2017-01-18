"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = BinomialHeap;
function BinomialHeap(BinomialTree) {

	var binomial_heap_push = function binomial_heap_push(compare, list, tree, rank) {

		var i, len;

		// ensures list has at least rank cells

		i = rank - list.length;

		while (i-- > 0) {
			list.push(null);
		}

		// loop invariant
		// tree and list[i] have the same rank

		len = list.length;

		for (i = rank; i < len && list[i] !== null; ++i) {

			// there is already a tree with this rank

			tree = tree.merge(compare, list[i]);
			list[i] = null;
		}

		// do not forget to append null if
		// we are lacking space

		if (i === len) {
			list.push(null);
		}

		// cell is empty
		// we can just put the new tree here

		list[i] = tree;
	};

	var merge = function merge(compare, list, other) {

		var i, len, carry;

		if (other.length === 0) {
			return;
		}

		// merging two binomial heaps is like
		// adding two little endian integers
		// so, we first make sure that we have
		// enough place to store the result

		i = other.length - list.length;

		while (i-- > 0) {
			list.push(null);
		}

		carry = null;

		len = list.length;

		// remember len >= other.length

		for (i = 0; i < len; ++i) {

			// other[i] can be either null or not
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

		// do not forget to append last carry

		if (carry !== null) {
			list.push(carry);
		}
	};

	var find_min_index = function find_min_index(compare, list, j, len) {

		var i, opt, item, candidate;

		// there MUST be at least one
		// non null element in this list
		// we look for the first one

		for (; j < len - 1 && list[j] === null; ++j) {}

		// here j is necessarily < len
		// and list[j] is non null

		i = j;
		opt = list[j].value;

		// we lookup remaining elements to see if there
		// is not a better candidate

		for (++j; j < len; ++j) {

			item = list[j];

			if (item !== null) {

				candidate = item.value;

				if (compare(candidate, opt) < 0) {

					i = j;
					opt = candidate;
				}
			}
		}

		return i;
	};

	var remove_head_at_index = function remove_head_at_index(compare, list, i, len) {

		var orphans;

		orphans = list[i].children;
		list[i] = null;

		change_parent(null, orphans);

		// we just removed the ith element
		// if list[i] is the last cell
		// of list we can drop it

		if (i === len - 1) {
			list.pop();
		}

		// we merge back the children of
		// the removed tree into the heap

		merge(compare, list, orphans);
	};

	var binomial_heap_pop = function binomial_heap_pop(compare, list) {

		var i, len, tree;

		len = list.length;

		i = find_min_index(compare, list, 0, len);

		tree = list[i];

		remove_head_at_index(compare, list, i, len);

		return tree;
	};

	var change_parent = function change_parent(parent, children) {

		var i, len;

		for (i = 0, len = children.length; i < len; ++i) {
			children[i].setparent(parent);
		}
	};

	var shift_up = function shift_up(tree, parent) {

		var tmp, i;

		// console.log( "tree", tree.value );
		// console.log( "parent", parent.value );

		// Here, we cannot just swap values as it would invalidate
		// externally stored references.
		// Instead, we swap children lists and update references
		// between the tree and its parent.
		// Then we update and return the new tree's parent.

		// console.log( "tree.children", tree.children );
		// console.log( "parent.children", parent.children );

		tmp = parent.children;
		parent.children = tree.children;
		tree.children = tmp;

		i = parent.rank();

		// console.log( tree.children, i );

		tree.children[i] = parent;

		tree.parent = parent.parent;

		change_parent(tree, tree.children);
		change_parent(parent, parent.children);

		// console.log( "tree.children", tree.children );
		// console.log( "parent.children", parent.children );

		return tree.parent;
	};

	var percolate_up = function percolate_up(list, tree) {

		var tmp, parent;

		parent = tree.parent;

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

	var decreasekey = function decreasekey(compare, list, tree, value) {

		var d, tmp, parent;

		tree.value = value;
		parent = tree.parent;

		if (parent !== null) {

			while (true) {

				d = compare(value, parent.value);

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

	var deletetree = function deletetree(compare, list, tree) {

		percolate_up(list, tree);

		remove_head_at_index(compare, list, tree.rank(), list.length);

		tree.detach();
	};

	var Heap = function Heap(compare) {

		// the compare function to use to compare values

		this.compare = compare;

		// number of elements in this heap

		this.length = 0;

		// list of binomial trees

		this.list = [];
	};

	Heap.prototype.head = function () {

		var i, tree;

		if (this.length === 0) {
			return undefined;
		}

		i = find_min_index(this.compare, this.list, 0, this.list.length);

		tree = this.list[i];

		return tree.value;
	};

	Heap.prototype.headreference = function () {

		var i, tree;

		if (this.length === 0) {
			return null;
		}

		i = find_min_index(this.compare, this.list, 0, this.list.length);

		tree = this.list[i];

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

		var tree;

		// push a new tree of rank 0

		tree = new BinomialTree(value, []);

		this.pushreference(tree);

		return tree;
	};

	Heap.prototype.pushreference = function (tree) {

		++this.length;

		// push an existing tree of rank 0

		binomial_heap_push(this.compare, this.list, tree, 0);
	};

	Heap.prototype.merge = function (other) {

		merge(this.compare, this.list, other.list);

		this.length += other.length;

		return this;
	};

	Heap.prototype.update = function (tree, value) {

		var d;

		d = this.compare(value, tree.value);

		if (d < 0) {
			this.decreasekey(tree, value);
		} else if (d > 0) {
			this.increasekey(tree, value);
		} else {

			// d === 0 does not imply tree.value === value

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CaW5vbWlhbEhlYXAuanMiXSwibmFtZXMiOlsiQmlub21pYWxIZWFwIiwiQmlub21pYWxUcmVlIiwiYmlub21pYWxfaGVhcF9wdXNoIiwiY29tcGFyZSIsImxpc3QiLCJ0cmVlIiwicmFuayIsImkiLCJsZW4iLCJsZW5ndGgiLCJwdXNoIiwibWVyZ2UiLCJvdGhlciIsImNhcnJ5IiwiZmluZF9taW5faW5kZXgiLCJqIiwib3B0IiwiaXRlbSIsImNhbmRpZGF0ZSIsInZhbHVlIiwicmVtb3ZlX2hlYWRfYXRfaW5kZXgiLCJvcnBoYW5zIiwiY2hpbGRyZW4iLCJjaGFuZ2VfcGFyZW50IiwicG9wIiwiYmlub21pYWxfaGVhcF9wb3AiLCJwYXJlbnQiLCJzZXRwYXJlbnQiLCJzaGlmdF91cCIsInRtcCIsInBlcmNvbGF0ZV91cCIsImRlY3JlYXNla2V5IiwiZCIsImRlbGV0ZXRyZWUiLCJkZXRhY2giLCJIZWFwIiwicHJvdG90eXBlIiwiaGVhZCIsInVuZGVmaW5lZCIsImhlYWRyZWZlcmVuY2UiLCJwb3ByZWZlcmVuY2UiLCJwdXNocmVmZXJlbmNlIiwidXBkYXRlIiwiaW5jcmVhc2VrZXkiLCJkZWxldGUiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUF3QkEsWTtBQUFULFNBQVNBLFlBQVQsQ0FBd0JDLFlBQXhCLEVBQXVDOztBQUVyRCxLQUFJQyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFXQyxPQUFYLEVBQW9CQyxJQUFwQixFQUEwQkMsSUFBMUIsRUFBZ0NDLElBQWhDLEVBQXVDOztBQUUvRCxNQUFJQyxDQUFKLEVBQU9DLEdBQVA7O0FBRUE7O0FBRUFELE1BQUlELE9BQU9GLEtBQUtLLE1BQWhCOztBQUVBLFNBQVFGLE1BQU0sQ0FBZCxFQUFrQjtBQUNqQkgsUUFBS00sSUFBTCxDQUFXLElBQVg7QUFDQTs7QUFFRDtBQUNBOztBQUVBRixRQUFNSixLQUFLSyxNQUFYOztBQUVBLE9BQU1GLElBQUlELElBQVYsRUFBaUJDLElBQUlDLEdBQUosSUFB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O0FBUUEsUUFBTzhCLElBQVA7QUFFQSIsImZpbGUiOiJCaW5vbWlhbEhlYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCaW5vbWlhbEhlYXAgKCBCaW5vbWlhbFRyZWUgKSB7XG5cblx0dmFyIGJpbm9taWFsX2hlYXBfcHVzaCA9IGZ1bmN0aW9uICggY29tcGFyZSwgbGlzdCwgdHJlZSwgcmFuayApIHtcblxuXHRcdHZhciBpLCBsZW47XG5cblx0XHQvLyBlbnN1cmVzIGxpc3QgaGFzIGF0IGxlYXN0IHJhbmsgY2VsbHNcblxuXHRcdGkgPSByYW5rIC0gbGlzdC5sZW5ndGg7XG5cblx0XHR3aGlsZSAoIGkgLS0+IDAgKSB7XG5cdFx0XHRsaXN0LnB1c2goIG51bGwgKTtcblx0XHR9XG5cblx0XHQvLyBsb29wIGludmFyaWFudFxuXHRcdC8vIHRyZWUgYW5kIGxpc3RbaV0gaGF2ZSB0aGUgc2FtZSByYW5rXG5cblx0XHRsZW4gPSBsaXN0Lmxlbmd0aDtcblxuXHRcdGZvciAoIGkgPSByYW5rIDsgaSA8IGxlbiAmJiBsaXN0W2ldICE9PSBudWxsIDsgKytpICkge1xuXG5cdFx0XHQvLyB0aGVyZSBpcyBhbHJlYWR5IGEgdHJlZSB3aXRoIHRoaXMgcmFua1xuXG5cdFx0XHR0cmVlID0gdHJlZS5tZXJnZSggY29tcGFyZSwgbGlzdFtpXSApO1xuXHRcdFx0bGlzdFtpXSA9IG51bGw7XG5cblx0XHR9XG5cblx0XHQvLyBkbyBub3QgZm9yZ2V0IHRvIGFwcGVuZCBudWxsIGlmXG5cdFx0Ly8gd2UgYXJlIGxhY2tpbmcgc3BhY2VcblxuXHRcdGlmICggaSA9PT0gbGVuICkge1xuXHRcdFx0bGlzdC5wdXNoKCBudWxsICk7XG5cdFx0fVxuXG5cdFx0Ly8gY2VsbCBpcyBlbXB0eVxuXHRcdC8vIHdlIGNhbiBqdXN0IHB1dCB0aGUgbmV3IHRyZWUgaGVyZVxuXG5cdFx0bGlzdFtpXSA9IHRyZWU7XG5cblx0fTtcblxuXG5cdHZhciBtZXJnZSA9IGZ1bmN0aW9uICggY29tcGFyZSwgbGlzdCwgb3RoZXIgKSB7XG5cblx0XHR2YXIgaSwgbGVuLCBjYXJyeTtcblxuXHRcdGlmICggb3RoZXIubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIG1lcmdpbmcgdHdvIGJpbm9taWFsIGhlYXBzIGlzIGxpa2Vcblx0XHQvLyBhZGRpbmcgdHdvIGxpdHRsZSBlbmRpYW4gaW50ZWdlcnNcblx0XHQvLyBzbywgd2UgZmlyc3QgbWFrZSBzdXJlIHRoYXQgd2UgaGF2ZVxuXHRcdC8vIGVub3VnaCBwbGFjZSB0byBzdG9yZSB0aGUgcmVzdWx0XG5cblx0XHRpID0gb3RoZXIubGVuZ3RoIC0gbGlzdC5sZW5ndGg7XG5cblx0XHR3aGlsZSAoIGkgLS0+IDAgKSB7XG5cdFx0XHRsaXN0LnB1c2goIG51bGwgKTtcblx0XHR9XG5cblx0XHRjYXJyeSA9IG51bGw7XG5cblx0XHRsZW4gPSBsaXN0Lmxlbmd0aDtcblxuXHRcdC8vIHJlbWVtYmVyIGxlbiA+PSBvdGhlci5sZW5ndGhcblxuXHRcdGZvciAoIGkgPSAwIDsgaSA8IGxlbiA7ICsraSApIHtcblxuXHRcdFx0Ly8gb3RoZXJbaV0gY2FuIGJlIGVpdGhlciBudWxsIG9yIG5vdFxuXHRcdFx0Ly8gbGlzdFtpXSBjYW4gYmUgZWl0aGVyIG51bGwgb3Igbm90XG5cdFx0XHQvLyBjYXJyeSBjYW4gYmUgZWl0aGVyIG51bGwgb3Igbm90XG5cdFx0XHQvLyAtLT4gMl4zID0gOCBwb3NzaWJpbGl0aWVzXG5cdFx0XHQvL1xuXHRcdFx0Ly8gICAgbnVsbCA/IHwgb3RoZXJbaV0gfCBsaXN0W2ldIHwgY2Fycnlcblx0XHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly8gICAgICgwKSAgIHwgICAgbm8gICAgfCAgICAgbm8gIHwgICBub1xuXHRcdFx0Ly8gICAgICgxKSAgIHwgICAgbm8gICAgfCAgICAgbm8gIHwgIHllc1xuXHRcdFx0Ly8gICAgICgyKSAgIHwgICAgbm8gICAgfCAgICB5ZXMgIHwgICBub1xuXHRcdFx0Ly8gICAgICgzKSAgIHwgICAgbm8gICAgfCAgICB5ZXMgIHwgIHllc1xuXHRcdFx0Ly8gICAgICg0KSAgIHwgICB5ZXMgICAgfCAgICAgbm8gIHwgICBub1xuXHRcdFx0Ly8gICAgICg1KSAgIHwgICB5ZXMgICAgfCAgICAgbm8gIHwgIHllc1xuXHRcdFx0Ly8gICAgICg2KSAgIHwgICB5ZXMgICAgfCAgICB5ZXMgIHwgICBub1xuXHRcdFx0Ly8gICAgICg3KSAgIHwgICB5ZXMgICAgfCAgICB5ZXMgIHwgIHllc1xuXG5cdFx0XHRpZiAoIGkgPj0gb3RoZXIubGVuZ3RoIHx8IG90aGVyW2ldID09PSBudWxsICkge1xuXG5cdFx0XHRcdGlmICggY2FycnkgIT09IG51bGwgKSB7XG5cblxuXHRcdFx0XHRcdC8vICg2KSBvdGhlcltpXSA9IG51bGwgYW5kIGxpc3RbaV0gPSBudWxsIGFuZCBjYXJyeSAhPSBudWxsXG5cdFx0XHRcdFx0Ly8gLS0+IHB1dCBjYXJyeSBpbiBjdXJyZW50IGNlbGxcblxuXHRcdFx0XHRcdGlmICggbGlzdFtpXSA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdGxpc3RbaV0gPSBjYXJyeTtcblx0XHRcdFx0XHRcdGNhcnJ5ID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdC8vICg0KSBvdGhlcltpXSA9IG51bGwgYW5kIGxpc3RbaV0gIT0gbnVsbCBhbmQgY2FycnkgIT0gbnVsbFxuXHRcdFx0XHRcdC8vIC0tPiBtZXJnZSBjYXJyeSB3aXRoIGN1cnJlbnQgY2VsbFxuXG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRjYXJyeSA9IGNhcnJ5Lm1lcmdlKCBjb21wYXJlLCBsaXN0W2ldICk7XG5cdFx0XHRcdFx0XHRsaXN0W2ldID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIGZvclxuXHRcdFx0XHQvLyB0aG9zZSAyIGNhc2VzIChjYXJyeSBhbmQgb3RoZXJbaV0gYXJlIG51bGwpLlxuXHRcdFx0XHQvLyA9PVxuXHRcdFx0XHQvLyAoNSkgb3RoZXJbaV0gPSBudWxsIGFuZCBsaXN0W2ldICE9IG51bGwgYW5kIGNhcnJ5ID0gbnVsbFxuXHRcdFx0XHQvLyAoNykgb3RoZXJbaV0gPSBudWxsIGFuZCBsaXN0W2ldID0gbnVsbCBhbmQgY2FycnkgPSBudWxsXG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gKDApIG90aGVyW2ldICE9IG51bGwgYW5kIGxpc3RbaV0gIT0gbnVsbCBhbmQgY2FycnkgIT0gbnVsbFxuXHRcdFx0Ly8gKDIpIG90aGVyW2ldICE9IG51bGwgYW5kIGxpc3RbaV0gPSBudWxsIGFuZCBjYXJyeSAhPSBudWxsXG5cdFx0XHQvLyAtLT4gbWVyZ2UgY2Fycnkgd2l0aCBvdGhlcltpXVxuXG5cdFx0XHRlbHNlIGlmICggY2FycnkgIT09IG51bGwgKSB7XG5cblx0XHRcdFx0Y2FycnkgPSBjYXJyeS5tZXJnZSggY29tcGFyZSwgb3RoZXJbaV0gKTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyAoMSkgb3RoZXJbaV0gIT0gbnVsbCBhbmQgbGlzdFtpXSAhPSBudWxsIGFuZCBjYXJyeSA9IG51bGxcblx0XHRcdC8vIC0tPiBtZXJnZSBjdXJyZW50IGNlbGwgd2l0aCBvdGhlcltpXVxuXG5cdFx0XHRlbHNlIGlmICggbGlzdFtpXSAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRjYXJyeSA9IGxpc3RbaV0ubWVyZ2UoIGNvbXBhcmUsIG90aGVyW2ldICk7XG5cdFx0XHRcdGxpc3RbaV0gPSBudWxsO1xuXG5cdFx0XHR9XG5cblxuXHRcdFx0Ly8gKDMpIG90aGVyW2ldICE9IG51bGwgYW5kIGxpc3RbaV0gPSBudWxsIGFuZCBjYXJyeSA9IG51bGxcblx0XHRcdC8vIC0tPiBwdXQgb3RoZXJbaV0gaW4gbGlzdFxuXG5cdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRsaXN0W2ldID0gb3RoZXJbaV07XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGRvIG5vdCBmb3JnZXQgdG8gYXBwZW5kIGxhc3QgY2FycnlcblxuXHRcdGlmICggY2FycnkgIT09IG51bGwgKSB7XG5cdFx0XHRsaXN0LnB1c2goIGNhcnJ5ICk7XG5cdFx0fVxuXG5cdH07XG5cblx0dmFyIGZpbmRfbWluX2luZGV4ID0gZnVuY3Rpb24gKCBjb21wYXJlLCBsaXN0LCBqLCBsZW4gKSB7XG5cblx0XHR2YXIgaSwgb3B0LCBpdGVtLCBjYW5kaWRhdGU7XG5cblx0XHQvLyB0aGVyZSBNVVNUIGJlIGF0IGxlYXN0IG9uZVxuXHRcdC8vIG5vbiBudWxsIGVsZW1lbnQgaW4gdGhpcyBsaXN0XG5cdFx0Ly8gd2UgbG9vayBmb3IgdGhlIGZpcnN0IG9uZVxuXG5cdFx0Zm9yICggOyBqIDwgbGVuIC0gMSAmJiBsaXN0W2pdID09PSBudWxsIDsgKytqICkgO1xuXG5cdFx0Ly8gaGVyZSBqIGlzIG5lY2Vzc2FyaWx5IDwgbGVuXG5cdFx0Ly8gYW5kIGxpc3Rbal0gaXMgbm9uIG51bGxcblxuXHRcdGkgPSBqO1xuXHRcdG9wdCA9IGxpc3Rbal0udmFsdWU7XG5cblx0XHQvLyB3ZSBsb29rdXAgcmVtYWluaW5nIGVsZW1lbnRzIHRvIHNlZSBpZiB0aGVyZVxuXHRcdC8vIGlzIG5vdCBhIGJldHRlciBjYW5kaWRhdGVcblxuXHRcdGZvciAoICsraiA7IGogPCBsZW4gOyArK2ogKSB7XG5cblx0XHRcdGl0ZW0gPSBsaXN0W2pdO1xuXG5cdFx0XHRpZiAoIGl0ZW0gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0Y2FuZGlkYXRlID0gaXRlbS52YWx1ZTtcblxuXHRcdFx0XHRpZiAoIGNvbXBhcmUoIGNhbmRpZGF0ZSwgb3B0ICkgPCAwICkge1xuXG5cdFx0XHRcdFx0aSA9IGo7XG5cdFx0XHRcdFx0b3B0ID0gY2FuZGlkYXRlO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGk7XG5cblx0fTtcblxuXHR2YXIgcmVtb3ZlX2hlYWRfYXRfaW5kZXggPSBmdW5jdGlvbiAoIGNvbXBhcmUsIGxpc3QsIGksIGxlbiApIHtcblxuXHRcdHZhciBvcnBoYW5zO1xuXG5cdFx0b3JwaGFucyA9IGxpc3RbaV0uY2hpbGRyZW47XG5cdFx0bGlzdFtpXSA9IG51bGw7XG5cblx0XHRjaGFuZ2VfcGFyZW50KCBudWxsLCBvcnBoYW5zICk7XG5cblx0XHQvLyB3ZSBqdXN0IHJlbW92ZWQgdGhlIGl0aCBlbGVtZW50XG5cdFx0Ly8gaWYgbGlzdFtpXSBpcyB0aGUgbGFzdCBjZWxsXG5cdFx0Ly8gb2YgbGlzdCB3ZSBjYW4gZHJvcCBpdFxuXG5cdFx0aWYgKCBpID09PSBsZW4gLSAxICkge1xuXHRcdFx0bGlzdC5wb3AoKTtcblx0XHR9XG5cblx0XHQvLyB3ZSBtZXJnZSBiYWNrIHRoZSBjaGlsZHJlbiBvZlxuXHRcdC8vIHRoZSByZW1vdmVkIHRyZWUgaW50byB0aGUgaGVhcFxuXG5cdFx0bWVyZ2UoIGNvbXBhcmUsIGxpc3QsIG9ycGhhbnMgKTtcblxuXHR9O1xuXG5cdHZhciBiaW5vbWlhbF9oZWFwX3BvcCA9IGZ1bmN0aW9uICggY29tcGFyZSwgbGlzdCApIHtcblxuXHRcdHZhciBpLCBsZW4sIHRyZWU7XG5cblx0XHRsZW4gPSBsaXN0Lmxlbmd0aDtcblxuXHRcdGkgPSBmaW5kX21pbl9pbmRleCggY29tcGFyZSwgbGlzdCwgMCwgbGVuICk7XG5cblx0XHR0cmVlID0gbGlzdFtpXTtcblxuXHRcdHJlbW92ZV9oZWFkX2F0X2luZGV4KCBjb21wYXJlLCBsaXN0LCBpLCBsZW4gKTtcblxuXHRcdHJldHVybiB0cmVlO1xuXHR9O1xuXG5cdHZhciBjaGFuZ2VfcGFyZW50ID0gZnVuY3Rpb24gKCBwYXJlbnQsIGNoaWxkcmVuICkge1xuXG5cdFx0dmFyIGksIGxlbjtcblxuXHRcdGZvciAoIGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGggOyBpIDwgbGVuIDsgKytpICkge1xuXHRcdFx0Y2hpbGRyZW5baV0uc2V0cGFyZW50KHBhcmVudCk7XG5cdFx0fVxuXG5cdH07XG5cblx0dmFyIHNoaWZ0X3VwID0gZnVuY3Rpb24gKCB0cmVlLCBwYXJlbnQgKSB7XG5cblx0XHR2YXIgdG1wLCBpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coIFwidHJlZVwiLCB0cmVlLnZhbHVlICk7XG5cdFx0Ly8gY29uc29sZS5sb2coIFwicGFyZW50XCIsIHBhcmVudC52YWx1ZSApO1xuXG5cdFx0Ly8gSGVyZSwgd2UgY2Fubm90IGp1c3Qgc3dhcCB2YWx1ZXMgYXMgaXQgd291bGQgaW52YWxpZGF0ZVxuXHRcdC8vIGV4dGVybmFsbHkgc3RvcmVkIHJlZmVyZW5jZXMuXG5cdFx0Ly8gSW5zdGVhZCwgd2Ugc3dhcCBjaGlsZHJlbiBsaXN0cyBhbmQgdXBkYXRlIHJlZmVyZW5jZXNcblx0XHQvLyBiZXR3ZWVuIHRoZSB0cmVlIGFuZCBpdHMgcGFyZW50LlxuXHRcdC8vIFRoZW4gd2UgdXBkYXRlIGFuZCByZXR1cm4gdGhlIG5ldyB0cmVlJ3MgcGFyZW50LlxuXG5cdFx0Ly8gY29uc29sZS5sb2coIFwidHJlZS5jaGlsZHJlblwiLCB0cmVlLmNoaWxkcmVuICk7XG5cdFx0Ly8gY29uc29sZS5sb2coIFwicGFyZW50LmNoaWxkcmVuXCIsIHBhcmVudC5jaGlsZHJlbiApO1xuXG5cdFx0dG1wID0gcGFyZW50LmNoaWxkcmVuO1xuXHRcdHBhcmVudC5jaGlsZHJlbiA9IHRyZWUuY2hpbGRyZW47XG5cdFx0dHJlZS5jaGlsZHJlbiA9IHRtcDtcblxuXG5cdFx0aSA9IHBhcmVudC5yYW5rKCk7XG5cblx0XHQvLyBjb25zb2xlLmxvZyggdHJlZS5jaGlsZHJlbiwgaSApO1xuXG5cdFx0dHJlZS5jaGlsZHJlbltpXSA9IHBhcmVudDtcblxuXHRcdHRyZWUucGFyZW50ID0gcGFyZW50LnBhcmVudDtcblxuXHRcdGNoYW5nZV9wYXJlbnQoIHRyZWUsIHRyZWUuY2hpbGRyZW4gKTtcblx0XHRjaGFuZ2VfcGFyZW50KCBwYXJlbnQsIHBhcmVudC5jaGlsZHJlbiApO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coIFwidHJlZS5jaGlsZHJlblwiLCB0cmVlLmNoaWxkcmVuICk7XG5cdFx0Ly8gY29uc29sZS5sb2coIFwicGFyZW50LmNoaWxkcmVuXCIsIHBhcmVudC5jaGlsZHJlbiApO1xuXG5cdFx0cmV0dXJuIHRyZWUucGFyZW50O1xuXG5cdH07XG5cblx0dmFyIHBlcmNvbGF0ZV91cCA9IGZ1bmN0aW9uICggbGlzdCwgdHJlZSApIHtcblxuXHRcdHZhciB0bXAsIHBhcmVudDtcblxuXHRcdHBhcmVudCA9IHRyZWUucGFyZW50O1xuXG5cdFx0aWYgKCBwYXJlbnQgIT09IG51bGwgKSB7XG5cblx0XHRcdHdoaWxlICggdHJ1ZSApIHtcblxuXHRcdFx0XHRwYXJlbnQgPSBzaGlmdF91cCggdHJlZSwgcGFyZW50ICk7XG5cblx0XHRcdFx0aWYgKCBwYXJlbnQgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUT0RPIHRoaXMgY2FsbCBtaWdodCBub3QgYmUgbmVjZXNzYXJ5XG5cdFx0XHRcdHBhcmVudC5jaGlsZHJlblt0cmVlLnJhbmsoKV0gPSB0cmVlO1xuXG5cdFx0XHR9XG5cblx0XHRcdGxpc3RbdHJlZS5yYW5rKCldID0gdHJlZTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHZhciBkZWNyZWFzZWtleSA9IGZ1bmN0aW9uICggY29tcGFyZSwgbGlzdCwgdHJlZSwgdmFsdWUgKSB7XG5cblx0XHR2YXIgZCwgdG1wLCBwYXJlbnQ7XG5cblx0XHR0cmVlLnZhbHVlID0gdmFsdWU7XG5cdFx0cGFyZW50ID0gdHJlZS5wYXJlbnQ7XG5cblx0XHRpZiAoIHBhcmVudCAhPT0gbnVsbCApIHtcblxuXHRcdFx0d2hpbGUgKCB0cnVlICkge1xuXG5cdFx0XHRcdGQgPSBjb21wYXJlKCB2YWx1ZSwgcGFyZW50LnZhbHVlICk7XG5cblx0XHRcdFx0aWYgKCBkID49IDAgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFyZW50ID0gc2hpZnRfdXAoIHRyZWUsIHBhcmVudCApO1xuXG5cdFx0XHRcdGlmICggcGFyZW50ID09PSBudWxsICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVE9ETyB0aGlzIGNhbGwgc2hvdWxkIGJlIGluIGlmICggZCA+PSAwIClcblx0XHRcdFx0cGFyZW50LmNoaWxkcmVuW3RyZWUucmFuaygpXSA9IHRyZWU7XG5cblx0XHRcdH1cblxuXHRcdFx0bGlzdFt0cmVlLnJhbmsoKV0gPSB0cmVlO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dmFyIGRlbGV0ZXRyZWUgPSBmdW5jdGlvbiAoIGNvbXBhcmUsIGxpc3QsIHRyZWUgKSB7XG5cblx0XHRwZXJjb2xhdGVfdXAoIGxpc3QsIHRyZWUgKTtcblxuXHRcdHJlbW92ZV9oZWFkX2F0X2luZGV4KCBjb21wYXJlLCBsaXN0LCB0cmVlLnJhbmsoKSwgbGlzdC5sZW5ndGggKTtcblxuXHRcdHRyZWUuZGV0YWNoKCk7XG5cblx0fTtcblxuXHR2YXIgSGVhcCA9IGZ1bmN0aW9uICggY29tcGFyZSApIHtcblxuXHRcdC8vIHRoZSBjb21wYXJlIGZ1bmN0aW9uIHRvIHVzZSB0byBjb21wYXJlIHZhbHVlc1xuXG5cdFx0dGhpcy5jb21wYXJlID0gY29tcGFyZTtcblxuXG5cdFx0Ly8gbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgaGVhcFxuXG5cdFx0dGhpcy5sZW5ndGggPSAwO1xuXG5cblx0XHQvLyBsaXN0IG9mIGJpbm9taWFsIHRyZWVzXG5cblx0XHR0aGlzLmxpc3QgPSBbXTtcblxuXHR9O1xuXG5cdEhlYXAucHJvdG90eXBlLmhlYWQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgaSwgdHJlZTtcblxuXHRcdGlmICggdGhpcy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdGkgPSBmaW5kX21pbl9pbmRleCggdGhpcy5jb21wYXJlLCB0aGlzLmxpc3QsIDAsIHRoaXMubGlzdC5sZW5ndGggKTtcblxuXHRcdHRyZWUgPSB0aGlzLmxpc3RbaV07XG5cblx0XHRyZXR1cm4gdHJlZS52YWx1ZTtcblxuXHR9O1xuXG5cdEhlYXAucHJvdG90eXBlLmhlYWRyZWZlcmVuY2UgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgaSwgdHJlZTtcblxuXHRcdGlmICggdGhpcy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpID0gZmluZF9taW5faW5kZXgoIHRoaXMuY29tcGFyZSwgdGhpcy5saXN0LCAwLCB0aGlzLmxpc3QubGVuZ3RoICk7XG5cblx0XHR0cmVlID0gdGhpcy5saXN0W2ldO1xuXG5cdFx0cmV0dXJuIHRyZWU7XG5cblx0fTtcblxuXHRIZWFwLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHRoaXMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQtLXRoaXMubGVuZ3RoO1xuXG5cdFx0cmV0dXJuIGJpbm9taWFsX2hlYXBfcG9wKCB0aGlzLmNvbXBhcmUsIHRoaXMubGlzdCApLnZhbHVlO1xuXG5cdH07XG5cblx0SGVhcC5wcm90b3R5cGUucG9wcmVmZXJlbmNlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCB0aGlzLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdC0tdGhpcy5sZW5ndGg7XG5cblx0XHRyZXR1cm4gYmlub21pYWxfaGVhcF9wb3AoIHRoaXMuY29tcGFyZSwgdGhpcy5saXN0ICkuZGV0YWNoKCk7XG5cblx0fTtcblxuXHRIZWFwLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblxuXHRcdHZhciB0cmVlO1xuXG5cdFx0Ly8gcHVzaCBhIG5ldyB0cmVlIG9mIHJhbmsgMFxuXG5cdFx0dHJlZSA9IG5ldyBCaW5vbWlhbFRyZWUoIHZhbHVlLCBbXSApO1xuXG5cdFx0dGhpcy5wdXNocmVmZXJlbmNlKCB0cmVlICk7XG5cblx0XHRyZXR1cm4gdHJlZTtcblxuXHR9O1xuXG5cdEhlYXAucHJvdG90eXBlLnB1c2hyZWZlcmVuY2UgPSBmdW5jdGlvbiAoIHRyZWUgKSB7XG5cblx0XHQrK3RoaXMubGVuZ3RoO1xuXG5cdFx0Ly8gcHVzaCBhbiBleGlzdGluZyB0cmVlIG9mIHJhbmsgMFxuXG5cdFx0Ymlub21pYWxfaGVhcF9wdXNoKCB0aGlzLmNvbXBhcmUsIHRoaXMubGlzdCwgdHJlZSwgMCApO1xuXG5cdH07XG5cblx0SGVhcC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbiAoIG90aGVyICkge1xuXG5cdFx0bWVyZ2UoIHRoaXMuY29tcGFyZSwgdGhpcy5saXN0LCBvdGhlci5saXN0ICk7XG5cblx0XHR0aGlzLmxlbmd0aCArPSBvdGhlci5sZW5ndGg7XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdEhlYXAucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICggdHJlZSwgdmFsdWUgKSB7XG5cblx0XHR2YXIgZDtcblxuXHRcdGQgPSB0aGlzLmNvbXBhcmUoIHZhbHVlLCB0cmVlLnZhbHVlICk7XG5cblx0XHRpZiAoIGQgPCAwICkge1xuXHRcdFx0dGhpcy5kZWNyZWFzZWtleSggdHJlZSwgdmFsdWUgKTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICggZCA+IDAgKSB7XG5cdFx0XHR0aGlzLmluY3JlYXNla2V5KCB0cmVlLCB2YWx1ZSApO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXG5cdFx0XHQvLyBkID09PSAwIGRvZXMgbm90IGltcGx5IHRyZWUudmFsdWUgPT09IHZhbHVlXG5cblx0XHRcdHRyZWUudmFsdWUgPSB2YWx1ZTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdEhlYXAucHJvdG90eXBlLmRlY3JlYXNla2V5ID0gZnVuY3Rpb24gKCB0cmVlLCB2YWx1ZSApIHtcblxuXHRcdGRlY3JlYXNla2V5KCB0aGlzLmNvbXBhcmUsIHRoaXMubGlzdCwgdHJlZSwgdmFsdWUgKTtcblxuXHR9O1xuXG5cdEhlYXAucHJvdG90eXBlLmluY3JlYXNla2V5ID0gZnVuY3Rpb24gKCB0cmVlLCB2YWx1ZSApIHtcblxuXHRcdGRlbGV0ZXRyZWUoIHRoaXMuY29tcGFyZSwgdGhpcy5saXN0LCB0cmVlICk7XG5cblx0XHR0cmVlLnZhbHVlID0gdmFsdWU7XG5cblx0XHRiaW5vbWlhbF9oZWFwX3B1c2goIHRoaXMuY29tcGFyZSwgdGhpcy5saXN0LCB0cmVlLCAwICk7XG5cblx0fTtcblxuXHRIZWFwLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoIHRyZWUgKSB7XG5cblx0XHQtLXRoaXMubGVuZ3RoO1xuXG5cdFx0ZGVsZXRldHJlZSggdGhpcy5jb21wYXJlLCB0aGlzLmxpc3QsIHRyZWUgKTtcblxuXHR9O1xuXG5cdHJldHVybiBIZWFwO1xuXG59XG4iXX0=