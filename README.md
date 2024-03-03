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

[![License](https://img.shields.io/github/license/heap-data-structure/binomial-heap.svg)](https://raw.githubusercontent.com/heap-data-structure/binomial-heap/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@heap-data-structure/binomial-heap.svg)](https://www.npmjs.org/package/@heap-data-structure/binomial-heap)
[![Tests](https://img.shields.io/github/actions/workflow/status/heap-data-structure/binomial-heap/ci.yml?branch=main&event=push&label=tests)](https://github.com/heap-data-structure/binomial-heap/actions/workflows/ci.yml?query=branch:main)
[![Dependencies](https://img.shields.io/librariesio/github/heap-data-structure/binomial-heap.svg)](https://github.com/heap-data-structure/binomial-heap/network/dependencies)
[![GitHub issues](https://img.shields.io/github/issues/heap-data-structure/binomial-heap.svg)](https://github.com/heap-data-structure/binomial-heap/issues)
[![Downloads](https://img.shields.io/npm/dm/@heap-data-structure/binomial-heap.svg)](https://www.npmjs.org/package/@heap-data-structure/binomial-heap)

[![Code issues](https://img.shields.io/codeclimate/issues/heap-data-structure/binomial-heap.svg)](https://codeclimate.com/github/heap-data-structure/binomial-heap/issues)
[![Code maintainability](https://img.shields.io/codeclimate/maintainability/heap-data-structure/binomial-heap.svg)](https://codeclimate.com/github/heap-data-structure/binomial-heap/trends/churn)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/heap-data-structure/binomial-heap/main.svg)](https://codecov.io/gh/heap-data-structure/binomial-heap)
[![Code technical debt](https://img.shields.io/codeclimate/tech-debt/heap-data-structure/binomial-heap.svg)](https://codeclimate.com/github/heap-data-structure/binomial-heap/trends/technical_debt)
[![Documentation](https://heap-data-structure.github.io/binomial-heap/badge.svg)](https://heap-data-structure.github.io/binomial-heap/source.html)
[![Package size](https://img.shields.io/bundlephobia/minzip/@heap-data-structure/binomial-heap)](https://bundlephobia.com/result?p=@heap-data-structure/binomial-heap)

## :scroll: Reference

  - http://www.cs.princeton.edu/~wayne/cs423/lectures/heaps-4up.pdf
