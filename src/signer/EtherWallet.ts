
import {
	ethers,
	KeystoreAccount, EncryptOptions, ProgressCallback,
	isKeystoreJson, decryptKeystoreJson, encryptKeystoreJson, isAddress, isHexString, keccak256, toUtf8Bytes
} from "ethers";
import { TWalletBaseItem } from "../models/TWallet";
import _ from "lodash";


/**
 * 	Non-hardened Derivation
 * 	0          -> 0x7FFFFFFF
 *
 * 	Hardened Derivation
 * 	0x7FFFFFFF -> 0xFFFFFFFF
 */
export const NonHardenedEnd = 0x7FFFFFFF;
export const HardenedStart = 0x80000000;



/**
 * 	@class
 */
export class EtherWallet
{
	/**
	 *	@param wallet	{any} wallet object
	 *	@returns {boolean}
	 */
	public static isValidWalletFactoryData( wallet : any ) : boolean
	{
		return _.isObject( wallet ) &&
			_.has( wallet, 'isHD' ) &&
			_.has( wallet, 'mnemonic' ) &&
			_.has( wallet, 'password' ) &&
			_.has( wallet, 'address' ) &&
			_.has( wallet, 'publicKey' ) &&
			_.has( wallet, 'privateKey' ) &&
			_.has( wallet, 'index' ) &&
			_.has( wallet, 'path' );
	}

	// public static createDerivedWalletObject( walletItem : TWalletBaseItem, derivePath ?: string )
	// {
	// 	const walletObject = this.createWalletObject( walletItem );
	// 	if ( walletObject )
	// 	{
	// 		const derivedWalletObject = walletObject.derivePath( derivePath );
	// 	}
	// }

	/**
	 *	@param walletItem	{TWalletBaseItem}
	 *	@returns { ethers.HDNodeWallet | ethers.Wallet | null }
	 */
	public static createWalletObject( walletItem : TWalletBaseItem ) : ethers.HDNodeWallet | ethers.HDNodeVoidWallet | ethers.Wallet | null
	{
		if ( null === walletItem )
		{
			throw new Error( `EtherWallet.createWalletObject :: invalid walletItem` );
		}

		let walletObject = null;
		if ( walletItem.mnemonic &&
			ethers.Mnemonic.isValidMnemonic( walletItem.mnemonic ) )
		{
			const mnemonicObj = ethers.Mnemonic.fromPhrase( walletItem.mnemonic );
			if ( ! mnemonicObj || ! mnemonicObj.phrase )
			{
				throw new Error( `EtherWallet.createWalletObject :: failed to create mnemonic object` );
			}

			walletObject = ethers.HDNodeWallet.fromMnemonic( mnemonicObj );
		}
		else if ( _.isString( walletItem.privateKey ) && ! _.isEmpty( walletItem.privateKey ) )
		{
			let privateKeyObj;
			try
			{
				if ( ! walletItem.privateKey.startsWith( '0x' ) )
				{
					walletItem.privateKey = '0x' + walletItem.privateKey;
				}
				privateKeyObj = new ethers.SigningKey( walletItem.privateKey );
			}
			catch ( error )
			{
				throw new Error( 'EtherWallet.createWalletObject :: invalid format of private key' );
			}

			walletObject = new ethers.Wallet( privateKeyObj );
		}