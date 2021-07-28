import LazyNode from './LazyNode.js' ;

/**
 * LazyStack#peek only valid if LazyStack#empty is false.
 * LazyStack#shift only valid if LazyStack#empty is false.
 */

export default function LazyStack ( ) {

	this.top = null ;
	this.bottom = null ;

}

LazyStack.prototype.empty = function ( ) {

	return this.top === null ;

} ;

LazyStack.prototype.push = function ( value ) {


	this.top = new LazyNode( value , this.top ) ;

	if ( this.bottom === null ) this.bottom = this.top ;

} ;

/**
 * Only valid if LazyStack#empty is false.
 */

LazyStack.prototype.pop = function ( ) {

	var value ;

	value = this.top.value ;

	this.top = this.top.next ;

	if ( this.top === null ) this.bottom = null ;

	return value ;

} ;

LazyStack.prototype.meld = function ( other ) {

	if ( this.bottom === null ) this.top = other.top ;

	else this.bottom.next = other.top ;

	this.bottom = other.bottom ;

} ;
