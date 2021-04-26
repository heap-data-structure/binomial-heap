[@aureooms/js-binomial-heap](http://make-github-pseudonymous-again.github.io/js-binomial-heap)
==

<img src="https://cdn.rawgit.com/make-github-pseudonymous-again/js-binomial-heap/main/media/sketch.svg" width="864">

Binomial heap data structures for JavaScript.
See [docs](https://make-github-pseudonymous-again.github.io/js-binomial-heap/index.html).
Parent is [@aureooms/js-heap](https://github.com/make-github-pseudonymous-again/js-heap).

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

[![License](https://img.shields.io/github/license/make-github-pseudonymous-again/js-binomial-heap.svg?style=flat)](https://raw.githubusercontent.com/make-github-pseudonymous-again/js-binomial-heap/main/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@aureooms/js-binomial-heap.svg?style=flat)](https://www.npmjs.org/package/@aureooms/js-binomial-heap)
[![Build Status](https://img.shields.io/travis/make-github-pseudonymous-again/js-binomial-heap.svg?style=flat)](https://travis-ci.org/make-github-pseudonymous-again/js-binomial-heap)
[![Coverage Status](https://img.shields.io/coveralls/make-github-pseudonymous-again/js-binomial-heap.svg?style=flat)](https://coveralls.io/r/make-github-pseudonymous-again/js-binomial-heap)
[![Dependencies Status](https://img.shields.io/david/make-github-pseudonymous-again/js-binomial-heap.svg?style=flat)](https://david-dm.org/make-github-pseudonymous-again/js-binomial-heap#info=dependencies)
[![devDependencies Status](https://img.shields.io/david/dev/make-github-pseudonymous-again/js-binomial-heap.svg?style=flat)](https://david-dm.org/make-github-pseudonymous-again/js-binomial-heap#info=devDependencies)
[![Code Climate](https://img.shields.io/codeclimate/github/make-github-pseudonymous-again/js-binomial-heap.svg?style=flat)](https://codeclimate.com/github/make-github-pseudonymous-again/js-binomial-heap)
[![NPM downloads per month](https://img.shields.io/npm/dm/@aureooms/js-binomial-heap.svg?style=flat)](https://www.npmjs.org/package/@aureooms/js-binomial-heap)
[![GitHub issues](https://img.shields.io/github/issues/make-github-pseudonymous-again/js-binomial-heap.svg?style=flat)](https://github.com/make-github-pseudonymous-again/js-binomial-heap/issues)
[![Documentation](https://make-github-pseudonymous-again.github.io/js-binomial-heap/badge.svg)](https://make-github-pseudonymous-again.github.io/js-binomial-heap/source.html)

## Reference

  - http://www.cs.princeton.edu/~wayne/cs423/lectures/heaps-4up.pdf
