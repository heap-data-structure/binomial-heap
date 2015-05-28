
var heapspec = require( "aureooms-js-heap-spec" ) ;

var heapswithreferences = [


	[ "BinomialHeap, BinomialTreeWithParent" , function ( compare ) {

		return new ( binomialheap.BinomialHeap( binomialheap.BinomialTreeWithParent ) )( compare ) ;

	} ] ,


] ;

var heapswithoutreferences = [

	[ "BinomialHeap, BinomialTree" , function ( compare ) {

		return new ( binomialheap.BinomialHeap( binomialheap.BinomialTree ) )( compare ) ;

	} ] ,
] ;

var lazyheaps = [

	[ "LazyBinomialHeap, BinomialTree" , function ( compare ) {

		return new ( binomialheap.LazyBinomialHeap( binomialheap.BinomialTree ) )( compare ) ;

	} ] ,
	[ "LazyBinomialHeap, BinomialTreeWithParent" , function ( compare ) {

		return new ( binomialheap.LazyBinomialHeap( binomialheap.BinomialTreeWithParent ) )( compare ) ;

	} ]
] ;

heapspec.test( heapswithreferences , true ) ;
heapspec.test( heapswithoutreferences , false ) ;
heapspec.pushpop( lazyheaps ) ;
heapspec.merge( lazyheaps ) ;
