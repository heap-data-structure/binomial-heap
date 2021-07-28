# Examples

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

import {
  BinomialHeap,
  LazyBinomialHeap,
  BinomialTree,
  BinomialTreeWithParent,
} from '@heap-data-structure/binomial-heap';

import {increasing} from '@total-order/primitive';

let Heap = LazyBinomialHeap(BinomialTree);

let a = new Heap(increasing) ;
let b = new Heap(increasing) ;

a.push(5);
a.push(1);
a.push(4);
b.push(3);
b.push(2);

a.length; // 3
b.length; // 2

a.merge(b);
delete b;

a.length; // 5

a.pop(); // 1
a.pop(); // 2
a.pop(); // 3
a.pop(); // 4
a.pop(); // 5

a.length; // 0
```
