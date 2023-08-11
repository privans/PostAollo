
import _ from "lodash";


/**
 * 	@class
 */
export class ValidateSerializable
{
	private seen : WeakSet<object> = new WeakSet();

	/**
	 *	Validates whether the provided object can be serialized to JSON
	 *	that can be used by the Web3Signer
	 *
	 *	@param obj	{any} the object to validate.
	 *	@returns { string | null }
	 *	- an error string if the object or any of its nested elements are not serializable.
	 *	- null if the object or any of its nested elements are serializable
	 */
	public validate( obj : any ) : string | null
	{
		try
		{
			//	reset the WeakSet for each validation to avoid cross-instance state issues
			this.seen = new WeakSet();

			//	traverse the obj
			this.traverse( obj );

			//	everything is going smoothly
			return null;
		}
		catch ( err )
		{
			if ( _.isString( err ) )
			{
				return err;
			}
			else if ( err )
			{
				const errObj = err as any;
				if ( _.isString( errObj.message ) )
				{
					return errObj.message;
				}

				return JSON.stringify( { err } );
			}
			else
			{
				return `${ this.constructor.name }.validate :: unknown error`;
			}
		}
	}

	/**
	 *	Recursively checks each property of the given value to ensure it is serializable.
	 *	@param value	{any}		the current value to check.
	 *	@param [path]	{string}	optional path
	 *	@private
	 */
	private traverse( value : any, path : string = `/` ) : void
	{
		if ( ! _.isString( path ) )
		{
			throw new Error( `${ this.constructor.name }.traverse :: invalid path` );
		}

		//	throw an error if the value is undefined, a function, or a symbol (all non-serializable)
		if ( undefined === value )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: undefined, path: ${ path }` );
		}
		if ( "function" === typeof value )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: function, path: ${ path }` );
		}
		if ( "symbol" === typeof value )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: symbol, path: ${ path }` );
		}

		/**
		 *	throw an error if the value is an instance of Map or Set (non-serializable)
		 */
		if ( value instanceof Map )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: Map, path: ${ path }` );
		}
		if ( value instanceof Set )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: Set, path: ${ path }` );
		}

		/**
		 * 	throw an error if the value is an instance of BigInt (non-serializable)
		 */
		if ( value instanceof BigInt || `bigint` === typeof value )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: BigInt, path: ${ path }` );
		}

		/**
		 * 	Optionally,
		 * 	allow Date and RegExp as they are handled by JSON.stringify
		 *
		 *	However, after being sent to the server,
		 *	the object will change when decoded again, so it cannot be used for signing data.
		 */
		if ( value instanceof Date )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: Date Object, path: ${ path }` );
		}
		if ( value instanceof RegExp )
		{
			throw new Error( `${ this.constructor.name }.traverse :: unserializable value found: RegExp Object, path: ${ path }` );
		}

		/**
		 * 	if the value is an object, check further
		 */
		if ( typeof value === "object" && null !== value )
		{
			//	detect circular references to prevent infinite loops
			if ( this.seen.has( value ) )
			{
				throw new Error( `${ this.constructor.name }.traverse :: circular reference detected, path: ${ path }` );
			}
			this.seen.add( value );

			//
			//	recursively check all properties of the object
			//
			for ( const key in value )
			{
				const subPath = this.buildPath( path, key );
				this.traverse( value[ key ], subPath );
			}
		}
	}

	/**
	 * 	build path
	 *
	 *	@param path	{string}
	 *	@param key	{string}
	 *	@returns {string}
	 *	@private
	 */
	private buildPath( path : string, key : string ) : string
	{
		if ( ! _.isString( path ) || ! _.isString( key ) )
		{
			return ``;
		}

		if ( path.endsWith( `/` ) )
		{
			return path + key;
		}
		else
		{
			return path + `/` + key;
		}
	}
}