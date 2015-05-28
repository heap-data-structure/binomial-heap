[js-binomial-heap](http://aureooms.github.io/js-binomial-heap)
==
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/aureooms/js-binomial-heap?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Binomial heap code bricks in JavaScript.

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
```

[![NPM license](http://img.shields.io/npm/l/aureooms-js-binomial-heap.svg?style=flat)](https://raw.githubusercontent.com/aureooms/js-binomial-heap/master/LICENSE)
[![NPM version](http://img.shields.io/npm/v/aureooms-js-binomial-heap.svg?style=flat)](https://www.npmjs.org/package/aureooms-js-binomial-heap)
[![Bower version](http://img.shields.io/bower/v/aureooms-js-binomial-heap.svg?style=flat)](http://bower.io/search/?q=aureooms-js-binomial-heap)
[![Build Status](http://img.shields.io/travis/aureooms/js-binomial-heap.svg?style=flat)](https://travis-ci.org/aureooms/js-binomial-heap)
[![Coverage Status](http://img.shields.io/coveralls/aureooms/js-binomial-heap.svg?style=flat)](https://coveralls.io/r/aureooms/js-binomial-heap)
[![Dependencies Status](http://img.shields.io/david/aureooms/js-binomial-heap.svg?style=flat)](https://david-dm.org/aureooms/js-binomial-heap#info=dependencies)
[![devDependencies Status](http://img.shields.io/david/dev/aureooms/js-binomial-heap.svg?style=flat)](https://david-dm.org/aureooms/js-binomial-heap#info=devDependencies)
[![Code Climate](http://img.shields.io/codeclimate/github/aureooms/js-binomial-heap.svg?style=flat)](https://codeclimate.com/github/aureooms/js-binomial-heap)
[![NPM downloads per month](http://img.shields.io/npm/dm/aureooms-js-binomial-heap.svg?style=flat)](https://www.npmjs.org/package/aureooms-js-binomial-heap)
[![GitHub issues](http://img.shields.io/github/issues/aureooms/js-binomial-heap.svg?style=flat)](https://github.com/aureooms/js-binomial-heap/issues)
[![Inline docs](http://inch-ci.org/github/aureooms/js-binomial-heap.svg?branch=master&style=shields)](http://inch-ci.org/github/aureooms/js-binomial-heap)

Can be managed through [jspm](https://github.com/jspm/jspm-cli),
[duo](https://github.com/duojs/duo),
[component](https://github.com/componentjs/component),
[bower](https://github.com/bower/bower),
[ender](https://github.com/ender-js/Ender),
[jam](https://github.com/caolan/jam),
[spm](https://github.com/spmjs/spm),
and [npm](https://github.com/npm/npm).

## Description

This package contains binomial heap implementations.


## Install

### jspm
```terminal
jspm install github:aureooms/js-binomial-heap
# or
jspm install npm:aureooms-js-binomial-heap
```
### duo
No install step needed for duo!

### component
```terminal
component install aureooms/js-binomial-heap
```

### bower
```terminal
bower install aureooms-js-binomial-heap
```

### ender
```terminal
ender add aureooms-js-binomial-heap
```

### jam
```terminal
jam install aureooms-js-binomial-heap
```

### spm
```terminal
spm install aureooms-js-binomial-heap --save
```

### npm
```terminal
npm install aureooms-js-binomial-heap --save
```

## Require
### jspm
```js
let binomialheap = require( "github:aureooms/js-binomial-heap" ) ;
// or
import binomialheap from 'aureooms-js-binomial-heap' ;
```
### duo
```js
let binomialheap = require( "aureooms/js-binomial-heap" ) ;
```

### component, ender, spm, npm
```js
let binomialheap = require( "aureooms-js-binomial-heap" ) ;
```

### bower
The script tag exposes the global variable `binomialheap`.
```html
<script src="bower_components/aureooms-js-binomial-heap/js/dist/binomial-heap.min.js"></script>
```
Alternatively, you can use any tool mentioned [here](http://bower.io/docs/tools/).

### jam
```js
require( [ "aureooms-js-binomial-heap" ] , function ( binomialheap ) { ... } ) ;
```

## Use

```js
// can choose between 3 different implementations
//
//   - BinomialHeap( BinomialTreeWithParent )
//      # head -> value
//      # headreference -> reference
//      # pop -> value
//      # popreference -> reference
//      # push( value ) -> reference
//      # pushreference( reference )
//      # merge( other )
//      # update( reference , value )
//      # decreasekey( reference , value )
//      # increasekey( reference , value )
//      # delete( reference )
//
//   - BinomialHeap( BinomialTree )
//      # head -> value
//      # pop -> value
//      # push( value )
//      # merge( other )
//
//   - LazyBinomialHeap( BinomialTree )
//      # pop -> value
//      # push( value )
//      # merge( other )

let compare = require( "aureooms-js-compare" ) ;

let Heap = binomialheap. ... ( binomialheap. ... ) ;

let a = new Heap( compare.increasing ) ;
let b = new Heap( compare.increasing ) ;

a.push( 5 ) ;
a.push( 1 ) ;
a.push( 4 ) ;
b.push( 3 ) ;
b.push( 2 ) ;

a.length ; // 3
b.length ; // 2

a.merge( b ) ;
delete b ;

a.length ; // 5

a.pop( ) ; // 1
a.pop( ) ; // 2
a.pop( ) ; // 3
a.pop( ) ; // 4
a.pop( ) ; // 5

a.length ; // 0
```

## Reference

  - http://www.cs.princeton.edu/~wayne/cs423/lectures/heaps-4up.pdf

