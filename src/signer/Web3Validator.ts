import { verifyMessage } from "ethers";
import { Web3Encoder } from "./Web3Encoder";
import _ from "lodash";
import { EtherWallet } from "./EtherWallet";

/**
 * 	@class Web3Validator
 */
export class Web3Validator
{
	/**
	 *	@param signerWalletAddress	{string}
	 *	@param obj			{any}
	 *	@param sig			{string}
	 *	@param exceptedKeys		{Array<string>}
	 *	@returns {boolean}
	 */
	public static validateObject( signerWalletAddress : string, obj : any, sig : string, exceptedKeys ? : Array<string> ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! EtherWallet.isValidAddress( signerWalletAddress ) )
				{
					return reject( `Web3Validator.validateObject :: invalid signerWalletAddress` );
				}
				if ( ! _.isObject( obj ) || null === obj )
				{
					return reject( `Web3Validator.validateObject :: invalid obj` );
				}
				if ( ! _.isString( sig ) || _.isEmpty( sig ) )
				{
					return reject( `Web3Validator.validateObject :: invalid sig` );
				}

				//	...
				const dataToSign : string = await Web3Encoder.encode( obj, exceptedKeys );
				const isSignatureValid = this.validateMessage( signerWalletAddress, dataToSign, sig );

				resolve( isSignatureValid );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param sign