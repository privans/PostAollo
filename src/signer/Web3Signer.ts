import { ethers, isHexString, SigningKey } from "ethers"
import { Web3Encoder } from "./Web3Encoder";
import { EtherWallet } from "./EtherWallet";
import _ from "lodash";
import { ValidateSerializable } from "../validators/ValidateSerializable";


/**
 * 	@class Web3Signer
 */
export class Web3Signer
{
	/**
	 *	@param privateKey	{ string | SigningKey }
	 *	@param obj		{ any }
	 *	@param exceptedKeys	{ Array<string> }
	 *	@returns {Promise<string>}
	 */
	public static signObject( privateKey : string | SigningKey, obj : any, exceptedKeys ? : Array<string> ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! privateKey )
				{
					return reject( `Web3Signer.signObject :: invalid privateKey` );
				}
				if ( ! obj )
				{
					return reject( `Web3Signer.signObject :: invalid obj` );
				}
				if ( ! EtherWallet.isValidAddress( obj.wallet ) )
				{
					return reject( `Web3Signer.signObject :: invalid obj.wallet` );
				}

				const errorValidateSerializable : string | null = new ValidateSerializable().validate( obj );
				if ( null !== errorValidateSerializable )
				{
					return reject( `Web3Signer.signObject :: ${ errorValidateSerializable }` );
				}

				const message : string = await Web3Encoder.encode( obj, exceptedKeys );
				const sig : string = await this.signMessage( privateKey, message );

				//	...
				resolve( sig );
			}
			catc