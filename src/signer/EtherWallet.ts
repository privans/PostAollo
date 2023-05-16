
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

		return walletObject;
	}

	/**
	 * 	Create a wallet from a mnemonic phrase.
	 *	@param mnemonic	- string
	 *	@returns {TWalletBaseItem}
	 */
	public static createWalletFromMnemonic( mnemonic? : string ) : TWalletBaseItem
	{
		//
		//	TODO
		//	should add parameter password
		//
		let mnemonicObj;
		if ( ! mnemonic )
		{
			//	If the user does not specify a mnemonic phrase,
			//	a random one will be created.
			mnemonicObj = ethers.Wallet.createRandom().mnemonic;
			//	console.log(mnemonicObj.phrase);
		}
		else
		{
			if ( ! ethers.Mnemonic.isValidMnemonic( mnemonic ) )
			{
				throw new Error( 'EtherWallet.createWalletFromMnemonic :: invalid mnemonic' );
			}

			mnemonicObj = ethers.Mnemonic.fromPhrase( mnemonic )
			// console.log(mnemonicObj.phrase);
		}
		if ( ! mnemonicObj || ! mnemonicObj.phrase )
		{
			throw new Error( `EtherWallet.createWalletFromMnemonic :: failed to create mnemonic object` );
		}

		const walletObj = ethers.HDNodeWallet.fromMnemonic( mnemonicObj )
		return this.decorateResult({
			isHD : true,
			mnemonic : walletObj?.mnemonic?.phrase,
			password : '',
			address : walletObj?.address,
			publicKey : walletObj?.publicKey,
			privateKey : walletObj?.privateKey,
			index : walletObj?.index,
			path : walletObj?.path
		});
	}

	/**
	 * 	Returns the wallet details for the JSON Keystore Wallet json using {password}.
	 * 	https://docs.ethers.org/v6/api/wallet/
	 *	https://docs.ethers.org/v6/api/wallet/#KeystoreAccount
	 *	@param keystoreJson	{string} Wallet keystore JSON string
	 *	@param password		{string} decrypt keystoreJson using {password}
	 *	@returns {Promise<TWalletBaseItem>}
	 */
	public static createWalletFromKeystore( keystoreJson : string, password: string = '' ) : Promise<TWalletBaseItem>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( ! isKeystoreJson( keystoreJson ) )
				{
					return reject( `EtherWallet.createWalletFromKeystore :: invalid keystoreJson` );
				}

				const progressCallback : ProgressCallback = ( _percent: number ) =>
				{
					//	A callback during long-running operations to update any UI or
					//	provide programmatic access to the progress.
					//
					// 	The percent is a value between 0 and 1.
				};

				//	Returns the account details for the JSON Keystore Wallet json using password.
				const keystoreAccount : KeystoreAccount = await decryptKeystoreJson( keystoreJson, password, progressCallback );
				if ( ! keystoreAccount )
				{
					return reject( `EtherWallet.createWalletFromKeystore :: error in decryptKeystoreJson` );
				}

				const wallet : TWalletBaseItem = this.createWalletFromPrivateKey( keystoreAccount.privateKey );
				if ( ! this.isValidWalletFactoryData( wallet ) )
				{
					return reject( `EtherWallet.createWalletFromKeystore :: error in createWalletFromPrivateKey` );
				}

				resolve( wallet );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Resolved to the JSON Keystore Wallet for {wallet} encrypted with {password}.
	 *	@param wallet	{TWalletBaseItem}
	 *	@param password	{string}		encrypt {wallet} with {password}
	 *	@returns {Promise<string>}
	 */
	public static getKeystoreOfWallet( wallet : TWalletBaseItem, password: string = '' ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidWalletFactoryData( wallet ) )
				{
					return reject( `EtherWallet.getKeystoreOfWallet :: invalid wallet` );
				}
				if ( ! _.isString( wallet.address ) || _.isEmpty( wallet.address ) )
				{
					return reject( `EtherWallet.getKeystoreOfWallet :: invalid wallet.address` );
				}
				if ( ! _.isString( wallet.privateKey ) || _.isEmpty( wallet.privateKey ) )
				{
					return reject( `EtherWallet.getKeystoreOfWallet :: invalid wallet.privateKey` );
				}

				const account : KeystoreAccount = {
					address: wallet.address,
					mnemonic: undefined,
					privateKey: wallet.privateKey,
				};
				const encryptOptions : EncryptOptions = {
					progressCallback : ( _percent: number ) =>
					{
						//	A callback during long-running operations to update any UI or
						//	provide programmatic access to the progress.
						//
						// 	The percent is a value between 0 and 1.
					}
				};

				//	Resolved to the JSON Keystore Wallet for account encrypted with password.
				const keystore : string = await encryptKeystoreJson( account, password, encryptOptions );
				resolve( keystore );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Create a wallet from an Extended Key
	 *
	 * 	@remark
	 * 	https://iancoleman.io/bip39/
	 *
	 *	The BIP44 hierarchical path is a standardized method for deriving cryptocurrency addresses from a single master seed.
	 *	It is used by many popular cryptocurrency wallets, including Bitcoin, Ethereum, and LiteCoin.
	 *	The path is defined as follows:
	 *	`m/purpose'/coin_type'/account'/change/address_index`
	 *
	 *       for Ethereum wallet:
	 *       `m/44'/60'/0'/0/0`
	 *
	 *       m
	 *       - is the root node of the path.
	 *
	 *       purpose
	 *       - is a constant value that indicates the purpose of the path.
	 *         For BIP44, the purpose value is always 44'.
	 *
	 *       coin_type
	 *       - is a code that identifies the cryptocurrency.
	 *         For Bitcoin, the coin_type value is 0'.
	 *         For Ethereum, the coin_type value is 60'.
	 *
	 *       account
	 *       - is an index that identifies a specific account within a wallet.
	 *         The account index is typically a zero-based integer.
	 *
	 *       change
	 *       - is a boolean flag that indicates whether the address is a change address or an external address.
	 *         Change addresses are used for receiving change from transactions, while external addresses are used for receiving payments.
	 *         The change flag is typically a zero or one.
	 *
	 *       address_index
	 *       - is an index that identifies a specific address within an account.
	 *         The address index is typically a zero-based integer.
	 *
	 *	@param extendedKey	{string} BIP32 Root Key | Account Extended Private Key | Account Extended Public Key | BIP32 Extended Private Key | BIP32 Extended Public Key
	 *	@returns {TWalletBaseItem}
	 */
	public static createWalletFromExtendedKey( extendedKey : string ) : TWalletBaseItem
	{
		if ( ! extendedKey || ! _.isString( extendedKey ) )
		{
			throw new Error( 'EtherWallet.createWalletFromExtendedKey :: no extended private key specified.' );
		}

		const walletObj = ethers.HDNodeWallet.fromExtendedKey( extendedKey )
		let wallet = {} as TWalletBaseItem;
		wallet.isHD = true;
		wallet.mnemonic = '';
		wallet.password = '';

		//	...
		let deriveWallet;

		/**
		 * 	The depth of this wallet,
		 * 	which is the number of components in its path.
		 */
		switch ( walletObj.depth )