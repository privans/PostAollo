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
					re