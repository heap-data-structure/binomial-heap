'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = LazyBinomialHeap;

var _LazyStack = require('./LazyStack');

var _LazyStack2 = _interopRequireDefault(_LazyStack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LazyBinomialHeap(BinomialTree) {

	var lazy_binomial_heap_push = function lazy_binomial_heap_push(lazy, tree, rank) {

		var i, sequence;

		// lightweight binomial heap containing a unique tree

		sequence = [];

		// offset tree by its rank

		i = rank;

		while (i--) {
			sequence.push(null);
		}

		sequence.push(tree);

		// do not merge the generated sequence immediately

		lazy.push(sequence);
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

	var lazy_binomial_heap_pop = function lazy_binomial_heap_pop(compare, list, lazy) {

		var i, j, len, opt, item, candidate, orphan;

		// amortized merge of
		// stored values

		while (!lazy.empty()) {
			merge(compare, list, lazy.pop());
		} // standard O(log n) optimum search method

		len = list.length;

		// there MUST be at least one
		// non null element in this list
		// we look for the first one

		for (j = 0; j < len - 1 && list[j] === null; ++j) {}

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

		orphan = list[i].children;
		list[i] = null;

		// we just removed the ith element
		// if list[i] is the last cell
		// of list we can drop it

		if (i === len - 1) {
			list.pop();
		}

		// we store the children in the
		// lazy list

		lazy.push(orphan);

		return opt;
	};

	var Heap = function Heap(compare) {

		// the compare function to use to compare values

		this.compare = compare;

		// number of elements in this heap

		this.length = 0;

		// list of binomial trees

		this.list = [];

		// list of binomial heaps waiting to be merged

		this.lazy = new _LazyStack2.default();
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

		// push a new tree of rank 0

		return lazy_binomial_heap_push(this.lazy, new BinomialTree(value, []), 0);
	};

	Heap.prototype.merge = function (other) {

		this.lazy.meld(other.lazy);

		this.length += other.length;

		return this;
	};

	return Heap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MYXp5Qmlub21pYWxIZWFwLmpzIl0sIm5hbWVzIjpbIkxhenlCaW5vbWlhbEhlYXAiLCJCaW5vbWlhbFRyZWUiLCJsYXp5X2Jpbm9taWFsX2hlYXBfcHVzaCIsImxhenkiLCJ0cmVlIiwicmFuayIsImkiLCJzZXF1ZW5jZSIsInB1c2giLCJtZXJnZSIsImNvbXBhcmUiLCJsaXN0Iiwib3RoZXIiLCJsZW4iLCJjYXJyeSIsImxlbmd0aCIsImxhenlfYmlub21pYWxfaGVhcF9wb3AiLCJqIiwib3B0IiwiaXRlbSIsImNhbmRpZGF0ZSIsIm9ycGhhbiIsImVtcHR5IiwicG9wIiwidmFsdWUiLCJjaGlsZHJlbiIsIkhlYXAiLCJwcm90b3R5cGUiLCJ1bmRlZmluZWQiLCJtZWxkIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFFd0JBLGdCOztBQUZ4Qjs7Ozs7O0FBRWUsU0FBU0EsZ0JBQVQsQ0FBNEJDLFlBQTVCLEVBQTJDOztBQUV6RCxLQUFJQywwQkFBMEIsU0FBMUJBLHVCQUEwQixDQUFVQyxJQUFWLEVBQWdCQyxJQUFoQixFQUFzQkMsSUFBdEIsRUFBNEI7O0FBRXpELE1BQUlDLENBQUosRUFBT0MsUUFBUDs7QUFFQTs7QUFFQUEsYUFBVyxFQUFYOztBQUdBOztBQUVBRCxNQUFJRCxJQUFKOztBQUVBLFNBQVFDLEdBQVIsRUFBYztBQUNiQyxZQUFTQyxJQUFULENBQWUsSUFBZjtBQUNBOztBQUVERCxXQUFTQyxJQUFULENBQWVKLElBQWY7O0FBR0E7O0FBRUFELE9BQUtLLElBQUwsQ0FBV0QsUUFBWDtBQUVBLEVBeEJEOztBQTBCQSxLQUFJRSxRQUFRLFNBQVJBLEtBQVEsQ0FBV0MsT0FBWCxFQUFvQkMsSUFBcEIsRUFBMEJDLEtBQTFCLEVBQWtDOztBQUU3QyxNQUFJTixDQUFKLEVBQU9PLEdBQVAsRUFBWUMsS0FBWjs7QUFFQSxNQUFLRixNQUFNRyxNQUFOLEtBQWlCLENBQXRCLEVBQTBCO0FBQ3pCO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7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QVYsQ0FBZ0JqQixNQUFNVCxJQUF0Qjs7QUFFQSxPQUFLWSxNQUFMLElBQWVILE1BQU1HLE1BQXJCOztBQUVBLFNBQU8sSUFBUDtBQUNBLEVBUEQ7O0FBU0EsUUFBT1csSUFBUDtBQUNBIiwiZmlsZSI6IkxhenlCaW5vbWlhbEhlYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF6eVN0YWNrIGZyb20gJy4vTGF6eVN0YWNrJyA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExhenlCaW5vbWlhbEhlYXAgKCBCaW5vbWlhbFRyZWUgKSB7XG5cblx0dmFyIGxhenlfYmlub21pYWxfaGVhcF9wdXNoID0gZnVuY3Rpb24oIGxhenksIHRyZWUsIHJhbmsgKXtcblxuXHRcdHZhciBpLCBzZXF1ZW5jZTtcblxuXHRcdC8vIGxpZ2h0d2VpZ2h0IGJpbm9taWFsIGhlYXAgY29udGFpbmluZyBhIHVuaXF1ZSB0cmVlXG5cblx0XHRzZXF1ZW5jZSA9IFtdO1xuXG5cblx0XHQvLyBvZmZzZXQgdHJlZSBieSBpdHMgcmFua1xuXG5cdFx0aSA9IHJhbms7XG5cblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdHNlcXVlbmNlLnB1c2goIG51bGwgKTtcblx0XHR9XG5cblx0XHRzZXF1ZW5jZS5wdXNoKCB0cmVlICk7XG5cblxuXHRcdC8vIGRvIG5vdCBtZXJnZSB0aGUgZ2VuZXJhdGVkIHNlcXVlbmNlIGltbWVkaWF0ZWx5XG5cblx0XHRsYXp5LnB1c2goIHNlcXVlbmNlICk7XG5cblx0fTtcblxuXHR2YXIgbWVyZ2UgPSBmdW5jdGlvbiAoIGNvbXBhcmUsIGxpc3QsIG90aGVyICkge1xuXG5cdFx0dmFyIGksIGxlbiwgY2Fycnk7XG5cblx0XHRpZiAoIG90aGVyLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBtZXJnaW5nIHR3byBiaW5vbWlhbCBoZWFwcyBpcyBsaWtlXG5cdFx0Ly8gYWRkaW5nIHR3byBsaXR0bGUgZW5kaWFuIGludGVnZXJzXG5cdFx0Ly8gc28sIHdlIGZpcnN0IG1ha2Ugc3VyZSB0aGF0IHdlIGhhdmVcblx0XHQvLyBlbm91Z2ggcGxhY2UgdG8gc3RvcmUgdGhlIHJlc3VsdFxuXG5cdFx0aSA9IG90aGVyLmxlbmd0aCAtIGxpc3QubGVuZ3RoO1xuXG5cdFx0d2hpbGUgKCBpIC0tPiAwICkge1xuXHRcdFx0bGlzdC5wdXNoKCBudWxsICk7XG5cdFx0fVxuXG5cdFx0Y2FycnkgPSBudWxsO1xuXG5cdFx0bGVuID0gbGlzdC5sZW5ndGg7XG5cblx0XHQvLyByZW1lbWJlciBsZW4gPj0gb3RoZXIubGVuZ3RoXG5cblx0XHRmb3IgKCBpID0gMCA7IGkgPCBsZW4gOyArK2kgKSB7XG5cblx0XHRcdC8vIG90aGVyW2ldIGNhbiBiZSBlaXRoZXIgbnVsbCBvciBub3Rcblx0XHRcdC8vIGxpc3RbaV0gY2FuIGJlIGVpdGhlciBudWxsIG9yIG5vdFxuXHRcdFx0Ly8gY2FycnkgY2FuIGJlIGVpdGhlciBudWxsIG9yIG5vdFxuXHRcdFx0Ly8gLS0+IDJeMyA9IDggcG9zc2liaWxpdGllc1xuXHRcdFx0Ly9cblx0XHRcdC8vICAgIG51bGwgPyB8IG90aGVyW2ldIHwgbGlzdFtpXSB8IGNhcnJ5XG5cdFx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vICAgICAoMCkgICB8ICAgIG5vICAgIHwgICAgIG5vICB8ICAgbm9cblx0XHRcdC8vICAgICAoMSkgICB8ICAgIG5vICAgIHwgICAgIG5vICB8ICB5ZXNcblx0XHRcdC8vICAgICAoMikgICB8ICAgIG5vICAgIHwgICAgeWVzICB8ICAgbm9cblx0XHRcdC8vICAgICAoMykgICB8ICAgIG5vICAgIHwgICAgeWVzICB8ICB5ZXNcblx0XHRcdC8vICAgICAoNCkgICB8ICAgeWVzICAgIHwgICAgIG5vICB8ICAgbm9cblx0XHRcdC8vICAgICAoNSkgICB8ICAgeWVzICAgIHwgICAgIG5vICB8ICB5ZXNcblx0XHRcdC8vICAgICAoNikgICB8ICAgeWVzICAgIHwgICAgeWVzICB8ICAgbm9cblx0XHRcdC8vICAgICAoNykgICB8ICAgeWVzICAgIHwgICAgeWVzICB8ICB5ZXNcblxuXHRcdFx0aWYgKCBpID49IG90aGVyLmxlbmd0aCB8fCBvdGhlcltpXSA9PT0gbnVsbCApIHtcblxuXHRcdFx0XHRpZiAoIGNhcnJ5ICE9PSBudWxsICkge1xuXG5cblx0XHRcdFx0XHQvLyAoNikgb3RoZXJbaV0gPSBudWxsIGFuZCBsaXN0W2ldID0gbnVsbCBhbmQgY2FycnkgIT0gbnVsbFxuXHRcdFx0XHRcdC8vIC0tPiBwdXQgY2FycnkgaW4gY3VycmVudCBjZWxsXG5cblx0XHRcdFx0XHRpZiAoIGxpc3RbaV0gPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRsaXN0W2ldID0gY2Fycnk7XG5cdFx0XHRcdFx0XHRjYXJyeSA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHQvLyAoNCkgb3RoZXJbaV0gPSBudWxsIGFuZCBsaXN0W2ldICE9IG51bGwgYW5kIGNhcnJ5ICE9IG51bGxcblx0XHRcdFx0XHQvLyAtLT4gbWVyZ2UgY2Fycnkgd2l0aCBjdXJyZW50IGNlbGxcblxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2FycnkgPSBjYXJyeS5tZXJnZSggY29tcGFyZSwgbGlzdFtpXSApO1xuXHRcdFx0XHRcdFx0bGlzdFtpXSA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBmb3Jcblx0XHRcdFx0Ly8gdGhvc2UgMiBjYXNlcyAoY2FycnkgYW5kIG90aGVyW2ldIGFyZSBudWxsKS5cblx0XHRcdFx0Ly8gPT1cblx0XHRcdFx0Ly8gKDUpIG90aGVyW2ldID0gbnVsbCBhbmQgbGlzdFtpXSAhPSBudWxsIGFuZCBjYXJyeSA9IG51bGxcblx0XHRcdFx0Ly8gKDcpIG90aGVyW2ldID0gbnVsbCBhbmQgbGlzdFtpXSA9IG51bGwgYW5kIGNhcnJ5ID0gbnVsbFxuXG5cdFx0XHR9XG5cblx0XHRcdC8vICgwKSBvdGhlcltpXSAhPSBudWxsIGFuZCBsaXN0W2ldICE9IG51bGwgYW5kIGNhcnJ5ICE9IG51bGxcblx0XHRcdC8vICgyKSBvdGhlcltpXSAhPSBudWxsIGFuZCBsaXN0W2ldID0gbnVsbCBhbmQgY2FycnkgIT0gbnVsbFxuXHRcdFx0Ly8gLS0+IG1lcmdlIGNhcnJ5IHdpdGggb3RoZXJbaV1cblxuXHRcdFx0ZWxzZSBpZiAoIGNhcnJ5ICE9PSBudWxsICkge1xuXG5cdFx0XHRcdGNhcnJ5ID0gY2FycnkubWVyZ2UoIGNvbXBhcmUsIG90aGVyW2ldICk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gKDEpIG90aGVyW2ldICE9IG51bGwgYW5kIGxpc3RbaV0gIT0gbnVsbCBhbmQgY2FycnkgPSBudWxsXG5cdFx0XHQvLyAtLT4gbWVyZ2UgY3VycmVudCBjZWxsIHdpdGggb3RoZXJbaV1cblxuXHRcdFx0ZWxzZSBpZiAoIGxpc3RbaV0gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0Y2FycnkgPSBsaXN0W2ldLm1lcmdlKCBjb21wYXJlLCBvdGhlcltpXSApO1xuXHRcdFx0XHRsaXN0W2ldID0gbnVsbDtcblxuXHRcdFx0fVxuXG5cblx0XHRcdC8vICgzKSBvdGhlcltpXSAhPSBudWxsIGFuZCBsaXN0W2ldID0gbnVsbCBhbmQgY2FycnkgPSBudWxsXG5cdFx0XHQvLyAtLT4gcHV0IG90aGVyW2ldIGluIGxpc3RcblxuXHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0bGlzdFtpXSA9IG90aGVyW2ldO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBkbyBub3QgZm9yZ2V0IHRvIGFwcGVuZCBsYXN0IGNhcnJ5XG5cblx0XHRpZiAoIGNhcnJ5ICE9PSBudWxsICkge1xuXHRcdFx0bGlzdC5wdXNoKCBjYXJyeSApO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0dmFyIGxhenlfYmlub21pYWxfaGVhcF9wb3AgPSBmdW5jdGlvbiAoIGNvbXBhcmUsIGxpc3QsIGxhenkgKSB7XG5cblx0XHR2YXIgaSwgaiwgbGVuLCBvcHQsIGl0ZW0sIGNhbmRpZGF0ZSwgb3JwaGFuO1xuXG5cdFx0Ly8gYW1vcnRpemVkIG1lcmdlIG9mXG5cdFx0Ly8gc3RvcmVkIHZhbHVlc1xuXG5cdFx0d2hpbGUgKCAhIGxhenkuZW1wdHkoICkgKSBtZXJnZSggY29tcGFyZSwgbGlzdCwgbGF6eS5wb3AoICkgKSA7XG5cblx0XHQvLyBzdGFuZGFyZCBPKGxvZyBuKSBvcHRpbXVtIHNlYXJjaCBtZXRob2RcblxuXHRcdGxlbiA9IGxpc3QubGVuZ3RoO1xuXG5cdFx0Ly8gdGhlcmUgTVVTVCBiZSBhdCBsZWFzdCBvbmVcblx0XHQvLyBub24gbnVsbCBlbGVtZW50IGluIHRoaXMgbGlzdFxuXHRcdC8vIHdlIGxvb2sgZm9yIHRoZSBmaXJzdCBvbmVcblxuXHRcdGZvciAoIGogPSAwIDsgaiA8IGxlbiAtIDEgJiYgbGlzdFtqXSA9PT0gbnVsbCA7ICsraiApIDtcblxuXHRcdC8vIGhlcmUgaiBpcyBuZWNlc3NhcmlseSA8IGxlblxuXHRcdC8vIGFuZCBsaXN0W2pdIGlzIG5vbiBudWxsXG5cblx0XHRpID0gajtcblx0XHRvcHQgPSBsaXN0W2pdLnZhbHVlO1xuXG5cdFx0Ly8gd2UgbG9va3VwIHJlbWFpbmluZyBlbGVtZW50cyB0byBzZWUgaWYgdGhlcmVcblx0XHQvLyBpcyBub3QgYSBiZXR0ZXIgY2FuZGlkYXRlXG5cblx0XHRmb3IgKCArK2ogOyBqIDwgbGVuIDsgKytqICkge1xuXG5cdFx0XHRpdGVtID0gbGlzdFtqXTtcblxuXHRcdFx0aWYgKCBpdGVtICE9PSBudWxsICkge1xuXG5cdFx0XHRcdGNhbmRpZGF0ZSA9IGl0ZW0udmFsdWU7XG5cblx0XHRcdFx0aWYgKCBjb21wYXJlKCBjYW5kaWRhdGUsIG9wdCApIDwgMCApIHtcblxuXHRcdFx0XHRcdGkgPSBqO1xuXHRcdFx0XHRcdG9wdCA9IGNhbmRpZGF0ZTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdG9ycGhhbiA9IGxpc3RbaV0uY2hpbGRyZW47XG5cdFx0bGlzdFtpXSA9IG51bGw7XG5cblx0XHQvLyB3ZSBqdXN0IHJlbW92ZWQgdGhlIGl0aCBlbGVtZW50XG5cdFx0Ly8gaWYgbGlzdFtpXSBpcyB0aGUgbGFzdCBjZWxsXG5cdFx0Ly8gb2YgbGlzdCB3ZSBjYW4gZHJvcCBpdFxuXG5cdFx0aWYgKCBpID09PSBsZW4gLSAxICkge1xuXHRcdFx0bGlzdC5wb3AoKTtcblx0XHR9XG5cblx0XHQvLyB3ZSBzdG9yZSB0aGUgY2hpbGRyZW4gaW4gdGhlXG5cdFx0Ly8gbGF6eSBsaXN0XG5cblx0XHRsYXp5LnB1c2goIG9ycGhhbiApO1xuXG5cdFx0cmV0dXJuIG9wdDtcblx0fTtcblxuXHR2YXIgSGVhcCA9IGZ1bmN0aW9uICggY29tcGFyZSApIHtcblxuXHRcdC8vIHRoZSBjb21wYXJlIGZ1bmN0aW9uIHRvIHVzZSB0byBjb21wYXJlIHZhbHVlc1xuXG5cdFx0dGhpcy5jb21wYXJlID0gY29tcGFyZTtcblxuXG5cdFx0Ly8gbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgaGVhcFxuXG5cdFx0dGhpcy5sZW5ndGggPSAwO1xuXG5cblx0XHQvLyBsaXN0IG9mIGJpbm9taWFsIHRyZWVzXG5cblx0XHR0aGlzLmxpc3QgPSBbXTtcblxuXG5cdFx0Ly8gbGlzdCBvZiBiaW5vbWlhbCBoZWFwcyB3YWl0aW5nIHRvIGJlIG1lcmdlZFxuXG5cdFx0dGhpcy5sYXp5ID0gbmV3IExhenlTdGFjayggKSA7XG5cblx0fTtcblxuXG5cdEhlYXAucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggdGhpcy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdC0tdGhpcy5sZW5ndGg7XG5cblx0XHRyZXR1cm4gbGF6eV9iaW5vbWlhbF9oZWFwX3BvcCggdGhpcy5jb21wYXJlLCB0aGlzLmxpc3QsIHRoaXMubGF6eSApO1xuXG5cdH07XG5cblx0SGVhcC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXG5cdFx0Kyt0aGlzLmxlbmd0aDtcblxuXHRcdC8vIHB1c2ggYSBuZXcgdHJlZSBvZiByYW5rIDBcblxuXHRcdHJldHVybiBsYXp5X2Jpbm9taWFsX2hlYXBfcHVzaCggdGhpcy5sYXp5LCBuZXcgQmlub21pYWxUcmVlKCB2YWx1ZSwgW10gKSwgMCApO1xuXG5cdH07XG5cblxuXHRIZWFwLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uICggb3RoZXIgKSB7XG5cblx0XHR0aGlzLmxhenkubWVsZCggb3RoZXIubGF6eSApIDtcblxuXHRcdHRoaXMubGVuZ3RoICs9IG90aGVyLmxlbmd0aCA7XG5cblx0XHRyZXR1cm4gdGhpcyA7XG5cdH07XG5cblx0cmV0dXJuIEhlYXA7XG59XG4iXX0=