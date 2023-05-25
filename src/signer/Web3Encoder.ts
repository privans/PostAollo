
import _ from "lodash";

/**
 * 	@class Web3Encoder
 */
export class Web3Encoder
{
	/**
	 *	@param obj		{Record<string, any>}
	 *	@param exceptedKeys	{Array<string>}
	 *	@returns {Promise<string>}
	 */
	public static encode( obj : Record<string, any>, exceptedKeys ? : Array<string> ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! obj )
				{
					return reject( `Web3Encoder.encode :: invalid obj` );
				}

				let keysToRemove : Array<string> = [ 'sig', 'hash', 'createdAt', 'updatedAt' ];
				if ( Array.isArray( exceptedKeys ) && exceptedKeys.length > 0 )
				{
					keysToRemove = Array.from( new Set( [ ...keysToRemove, ...exceptedKeys ] ) );
				}

				const cleanedUpObj : Record<string, any> = this.removeObjectKeys( obj, keysToRemove );
				const sortedObj : Record<string, any> = this.sortObjectByKeys( cleanedUpObj );
				const encodedMessage : string = JSON.stringify( sortedObj );

				resolve( encodedMessage );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param encodedMessage	{string}
	 *	@returns {Promise<Record<string, any>>}
	 */
	public static decode( encodedMessage : string ) : Promise<Record<string, any>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				resolve( JSON.parse( encodedMessage ) );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	determine whether the key of an object is of string type
	 *	@param obj
	 *	@param key
	 *	@returns {boolean}
	 */
	public static isStringKey( obj : object, key : string ) : obj is Record<string, any>
	{
		return key in obj;
	}

	/**
	 *	@param obj		{ Record<string, any> }
	 *	@param keysToRemove	{ Array<string> }
	 *	@returns { Record<string, any> }
	 */
	public static removeObjectKeys( obj : Record<string, any>, keysToRemove : Array<string> ) : Record<string, any>
	{
		if ( ! _.isObject( obj ) || null === obj )