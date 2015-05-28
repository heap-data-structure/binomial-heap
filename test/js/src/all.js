
var heapspec = require( "aureooms-js-heap-spec" ) ;

var heapswithreferences = [


	[ "__BinomialHeap__, BinomialTreeWithParent" , function ( compare ) {

		return new ( binomialheap.__BinomialHeap__( binomialheap.BinomialTreeWithParent ) )( compare ) ;

	} ] ,


] ;

var heapswithoutreferences = [

	[ "__BinomialHeap__, BinomialTree" , function ( compare ) {

		return new ( binomialheap.__BinomialHeap__( binomialheap.BinomialTree ) )( compare ) ;

	} ] ,
] ;

var lazyheaps = [

	[ "__LazyBinomialHeap__, BinomialTree" , function ( compare ) {

		return new ( binomialheap.__LazyBinomialHeap__( binomialheap.BinomialTree ) )( compare ) ;

	} ] ,
	[ "__LazyBinomialHeap__, BinomialTreeWithParent" , function ( compare ) {

		return new ( binomialheap.__LazyBinomialHeap__( binomialheap.BinomialTreeWithParent ) )( compare ) ;

	} ]
] ;

heapspec.test( heapswithreferences , true ) ;
heapspec.test( heapswithoutreferences , false ) ;
heapspec.pushpop( lazyheaps ) ;
heapspec.merge( lazyheaps ) ;
