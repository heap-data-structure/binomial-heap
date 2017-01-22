[@aureooms/js-binomial-heap](http://aureooms.github.io/js-binomial-heap)
==

<img src="https://cdn.rawgit.com/aureooms/js-binomial-heap/master/media/sketch.svg" width="864">

Binomial heap data structures for JavaScript.
See [docs](https://aureooms.github.io/js-binomial-heap/index.html).
Parent is [@aureooms/js-heap](https://github.com/aureooms/js-heap).

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
let heaps = [
  new ( BinomialHeap( BinomialTreeWithParent ) )( compare.increasing ) ,
  new ( BinomialHeap( BinomialTree ) )( compare.increasing ) ,
  new ( LazyBinomialHeap( BinomialTree ) )( compare.increasing ) ,
  new ( LazyBinomialHeap( BinomialTreeWithParent ) )( compare.increasing ) ,
] ;
```

[![NPM license](http://img.shields.io/npm/l/aureooms-js-binomial-heap.svg?style=flat)](https://raw.githubusercontent.com/aureooms/js-binomial-heap/master/LICENSE)
[![NPM version](http://img.shields.io/npm/v/aureooms-js-binomial-heap.svg?style=flat)](https://www.npmjs.org/package/aureooms-js-binomial-heap)
[![Build Status](http://img.shields.io/travis/aureooms/js-binomial-heap.svg?style=flat)](https://travis-ci.org/aureooms/js-binomial-heap)
[![Coverage Status](http://img.shields.io/coveralls/aureooms/js-binomial-heap.svg?style=flat)](https://coveralls.io/r/aureooms/js-binomial-heap)
[![Dependencies Status](http://img.shields.io/david/aureooms/js-binomial-heap.svg?style=flat)](https://david-dm.org/aureooms/js-binomial-heap#info=dependencies)
[![devDependencies Status](http://img.shields.io/david/dev/aureooms/js-binomial-heap.svg?style=flat)](https://david-dm.org/aureooms/js-binomial-heap#info=devDependencies)
[![Code Climate](http://img.shields.io/codeclimate/github/aureooms/js-binomial-heap.svg?style=flat)](https://codeclimate.com/github/aureooms/js-binomial-heap)
[![NPM downloads per month](http://img.shields.io/npm/dm/aureooms-js-binomial-heap.svg?style=flat)](https://www.npmjs.org/package/aureooms-js-binomial-heap)
[![GitHub issues](http://img.shields.io/github/issues/aureooms/js-binomial-heap.svg?style=flat)](https://github.com/aureooms/js-binomial-heap/issues)
[![Documentation](https://aureooms.github.io/js-binomial-heap/badge.svg)](https://aureooms.github.io/js-binomial-heap/source.html)

## Reference

  - http://www.cs.princeton.edu/~wayne/cs423/lectures/heaps-4up.pdf
