import ava from 'ava' ;

import * as spec from 'aureooms-js-heap-spec' ;

import {
	BinomialHeap,
	BinomialTreeWithParent,
	BinomialTree,
	LazyBinomialHeap,
} from '../../src' ;

const heapswithreferences = [


	[ "BinomialHeap, BinomialTreeWithParent" , function ( compare ) {

		return new ( BinomialHeap( BinomialTreeWithParent ) )( compare ) ;

	} ] ,


] ;

const heapswithoutreferences = [

	[ "BinomialHeap, BinomialTree" , function ( compare ) {

		return new ( BinomialHeap( BinomialTree ) )( compare ) ;

	} ] ,
] ;

const lazyheaps = [

	[ "LazyBinomialHeap, BinomialTree" , function ( compare ) {

		return new ( LazyBinomialHeap( BinomialTree ) )( compare ) ;

	} ] ,
	[ "LazyBinomialHeap, BinomialTreeWithParent" , function ( compare ) {

		return new ( LazyBinomialHeap( BinomialTreeWithParent ) )( compare ) ;

	} ]
] ;

spec.test( ava , heapswithreferences , { references : true , length : true } ) ;
spec.test( ava , heapswithoutreferences , { references : false , length : true } ) ;
spec.pushpop( ava , true , lazyheaps ) ;
spec.merge( ava , true , lazyheaps ) ;
