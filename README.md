:cherries:
[@heap-data-structure/binomial-heap](https://heap-data-structure.github.io/binomial-heap)
==
<p align="center">
<img src="https://raw.githubusercontent.com/heap-data-structure/binomial-heap/main/media/sketch.svg" width="600">
</p>

Binomial heap data structures for JavaScript.
See [docs](https://heap-data-structure.github.io/binomial-heap/index.html).
Parent is [@heap-data-structure](https://github.com/heap-data-structure/about).

```js
//
//    o       o           o--.             o
//    |\      |\          |\  \           /|\
//    o o  +  o o    =    o o  o    =    o o o
//      |       |           |  |\          | |\
//      o       o           o  o o         o o o
//                               |             |
//                               o             o
//

import {
  BinomialHeap,
  LazyBinomialHeap,
  BinomialTree,
  BinomialTreeWithParent,
} from '@heap-data-structure/binomial-heap';

import {increasing} from '@total-order/primitive';

let heaps = [
  new ( BinomialHeap( BinomialTreeWithParent ) )( increasing ) ,
  new ( BinomialHeap( BinomialTree ) )( increasing ) ,
  new ( LazyBinomialHeap( BinomialTree ) )( increasing ) ,
  new ( LazyBinomialHeap( BinomialTreeWithParent ) )( increasing ) ,
] ;
```

[![License](https://img.shields.io/github/license/heap-data-structure/binomial-heap.svg?style=flat)](https://raw.githubusercontent.com/heap-data-structure/binomial-heap/main/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@heap-data-structure/binomial-heap.svg?style=flat)](https://www.npmjs.org/package/@heap-data-structure/binomial-heap)
[![Build Status](https://img.shields.io/travis/heap-data-structure/binomial-heap.svg?style=flat)](https://travis-ci.org/heap-data-structure/binomial-heap)
[![Coverage Status](https://img.shields.io/coveralls/heap-data-structure/binomial-heap.svg?style=flat)](https://coveralls.io/r/heap-data-structure/binomial-heap)
[![Dependencies Status](https://img.shields.io/david/heap-data-structure/binomial-heap.svg?style=flat)](https://david-dm.org/heap-data-structure/binomial-heap#info=dependencies)
[![devDependencies Status](https://img.shields.io/david/dev/heap-data-structure/binomial-heap.svg?style=flat)](https://david-dm.org/heap-data-structure/binomial-heap#info=devDependencies)
[![Code Climate](https://img.shields.io/codeclimate/github/heap-data-structure/binomial-heap.svg?style=flat)](https://codeclimate.com/github/heap-data-structure/binomial-heap)
[![NPM downloads per month](https://img.shields.io/npm/dm/@heap-data-structure/binomial-heap.svg?style=flat)](https://www.npmjs.org/package/@heap-data-structure/binomial-heap)
[![GitHub issues](https://img.shields.io/github/issues/heap-data-structure/binomial-heap.svg?style=flat)](https://github.com/heap-data-structure/binomial-heap/issues)
[![Documentation](https://heap-data-structure.github.io/binomial-heapbadge.svg)](https://heap-data-structure.github.io/binomial-heapsource.html)

## :scroll: Reference

  - http://www.cs.princeton.edu/~wayne/cs423/lectures/heaps-4up.pdf
