import { describe, expect } from '@jest/globals';
import { ethers, isAddress } from "ethers";
import { TWalletBaseItem, EtherWallet } from "../../../src";
import _ from "lodash";

/**
 *	WalletFactory unit test
 */
describe( "EtherWallet", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Create Wallet from Mnemonic", () =>
	{
		it( "should check PrivateKey, PublicKey and Address", async () =>
		{
			// Create a wallet from the mnemonic
			const walletObj = EtherWallet.createWalletFromMnemonic();
			expect( walletObj ).not.toBeNull();
			expect( EtherWallet.isValidAddress( walletObj.address ) ).toBeTruthy();
			expect( EtherWallet.isValidPrivateKey( walletObj.privateKey ) ).toBeTruthy();
			expect( EtherWallet.isValidPublicKey( walletObj.publicKey ) ).toBeTruthy();

			expect( EtherWallet.isValidLowercaseHex( walletObj.address ) ).toBeTruthy();
			expect( EtherWallet.isValidLowercaseHex( walletObj.privateKey ) ).toBeTruthy();
			expect( EtherWallet.isValidLowercaseHex( walletObj.publicKey ) ).toBeTruthy();
		} );

		it( "should create a wallet from a empty mnemonic", async () =>
		{
			// Create a wallet from the mnemonic
			const walletObj = EtherWallet.createWalletFromMnemonic();
			//
			//	{
			//		isHD: true,
			//		mnemonic: 'million butter obtain fuel address truck grunt recall gain rotate debris flee',
			//		password: '',
			//		address: '0x03a06e86556C819199E602851e4453a89718cB36',
			//		publicKey: '0x0384636daeaf2f410f7c4a6749a143096838a0482bcee94e412ca3a683bca3ac00',
			//		privateKey: '0x44dd0864d00e37090622a17e66c0914bd71a1245a3a2e4f88611775854f4eafc',
			//		index: 0,
			//		path: "m/44'/60'/0'/0/0"
			//	}
			//
			//console.log( walletObj );

			expect( walletObj ).not.toBeNull();
			if ( walletObj.mnemonic )
			{
				expect( walletObj.mnemonic.split( " " ).length ).toBe( 12 );
			}
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
		} );

		it( "should create a wallet with a user-specified mnemonic phrase", async () =>
		{
			const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const walletObj = EtherWallet.createWalletFromMnemonic( mnemonic );
			// console.log( walletObj );
			// {
			// 	isHD: true,
			// 		mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			// 	password: '',
			// 	address: '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357',
			// 	publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			// 	privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			// 	index: 0,
			// 	path: "m/44'/60'/0'/0/0"
			// }

			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( mnemonic );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );
		} );

		it( "should throw an error if the mnemonic is not valid", async () =>
		{
			try
			{
				EtherWallet.createWalletFromMnemonic( "input an invalid mnemonic" );
			}
			catch ( error : any )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toHaveProperty( 'message' );
				expect( error.message ).toEqual( "EtherWallet.createWalletFromMnemonic :: invalid mnemonic" );
			}
		} );
	} );

	describe( "create Wallet From an Extended Keys", () =>
	{
		it( "should create a wallet from an Extended Private Key", async () =>
		{
			/**
			 * 	https://iancoleman.io/bip39/
			 *
			 * 	BIP39 Mnemonic
			 * 	`retire inflict prevent believe question pipe rebel state visit little bind accuse`
			 *
			 * 	from `Account Extended Private Key`
			 * 	depth = 3
			 */
			const extendedPrivateKey = `xprv9y98x2R6KuC98hQ9k1fVYBuM25GZQW25fqcjNZrBWsSRDarET2dgHUJsmHk7nvBwwk9yCyHQxjxvUwYhPfkXU2PF2SHpmUUTvL1RUPfKNpp`;
			const walletObj = EtherWallet.createWalletFromExtendedKey( extendedPrivateKey );
			//console.log( walletObj );
			//	    {
			//       isHD: true,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9',
			//       publicKey: '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       privateKey: undefined
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.isHD ).toBe( true );
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.password ).toBe( '' );
			expect( walletObj.address ).toBe( '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9' );
			expect( walletObj.publicKey ).toBe( '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c' );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( "m/44'/60'/0'/0/0" );
			expect( walletObj.privateKey ).toBe( undefined );
		} );

		it( "should create a wallet from an Extended Public Key", async () =>
		{
			/**
			 * 	https://iancoleman.io/bip39/
			 *
			 * 	BIP39 Mnemonic
			 * 	`retire inflict prevent believe question pipe rebel state visit little bind accuse`
			 *
			 * 	from `Account Extended Public Key`
			 * 	depth = 3
			 */
			const extendedPublicKey = `xpub6C8VMXwzAGkSMBUcr3CVuKr5a773oxjw34YLAxFo5CyQ6PBNzZwvqGdMcaMyZuumjLGLydzykL5rKVAUK9yD5XCikmDqN8mHCNgcHHsRDuH`;
			const walletObj = EtherWallet.createWalletFromExtendedKey( extendedPublicKey );
			//console.log( walletObj );
			//	    {
			//       isHD: true,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9',
			//       publicKey: '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       privateKey: undefined
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.isHD ).toBe( true );
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.password ).toBe( '' );
			expect( walletObj.address ).toBe( '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9' );
			expect( walletObj.publicKey ).toBe( '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c' );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( "m/44'/60'/0'/0/0" );
			expect( walletObj.privateKey ).toBe( undefined );
		} );

		it( "should create a wallet from a BIP32 Extended Private Key", async () =>
		{
			/**
			 * 	https://iancoleman.io/bip39/
			 *
			 * 	BIP39 Mnemonic
			 * 	`retire inflict prevent believe question pipe rebel state visit little bind accuse`
			 *
			 * 	from `BIP32 Extended Private Key`
			 * 	depth = 4
			 */
			const BIP32extendedPrivateKey = `xprvA1V3sGKQ5dLzHV6kEZ1GNUN8wgJaxkHDGenj13BTJHJqZscF4Bnw28MA32GcrGGwWN6z2f3NY1z9ikVVw33ABWmh7vyszcb1caoixa3tTvR`;
			const walletObj = EtherWallet.createWalletFromExtendedKey( BIP32extendedPrivateKey );
			//console.log( walletObj );
			//
			//	    {
			//       isHD: true,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9',
			//       publicKey: '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       privateKey: undefined
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.isHD ).toBe( true );
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.password ).toBe( '' );
			expect( walletObj.address ).toBe( '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9' );
			expect( walletObj.publicKey ).toBe( '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c' );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( "m/44'/60'/0'/0/0" );
			expect( walletObj.privateKey ).toBe( undefined );
		} );

		it( "should create a wallet from a BIP32 Extended Public Key", async () =>
		{
			/**
			 * 	https://iancoleman.io/bip39/
			 *
			 * 	BIP39 Mnemonic
			 * 	`retire inflict prevent believe question pipe rebel state visit little bind accuse`
			 *
			 * 	from `BIP32 Extended Public Key`
			 * 	depth = 4
			 */
			const BIP32extendedPublicKey = `xpub6EUQGmrHuzuHVyBDLaYGjcJsVi95ND14dsiKoRb4rcqpSfwPbj7BZvfdtLb7KJLNJWZRbMAxkEoe5NwyxEEoZmFUNfPH7Hg3SXrEqPsXoMN`;
			const walletObj = EtherWallet.createWalletFromExtendedKey( BIP32extendedPublicKey );
			//console.log( walletObj );
			//
			//	    {
			//       isHD: true,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9',
			//       publicKey: '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       privateKey: undefined
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.isHD ).toBe( true );
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.password ).toBe( '' );
			expect( walletObj.address ).toBe( '0xa5e2d3e4add1e1df39621af8a1ea237d5732acb9' );
			expect( walletObj.publicKey ).toBe( '0x0316e662d08cbedd52d5dfdb0ba322d7f8b015c6572c4f1dec99c4888303dab44c' );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( "m/44'/60'/0'/0/0" );
			expect( walletObj.privateKey ).toBe( undefined );
		} );
	});

	describe( "Create Wallet from a Private Key", () =>
	{
		it( "should create a wallet from a empty private key", async () =>
		{

			const walletObj = EtherWallet.createWalletFromPrivateKey();

			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			//expect( walletObj.index ).not.toBeDefined();
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );
		} );

		it( "should create a wallet from a private key", async () =>
		{
			// Create a wallet from the specified private key
			const privateKey = "0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a";
			const publicKey = "0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622";
			const address = "0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357";

			const walletObj = EtherWallet.createWalletFromPrivateKey( privateKey );
			// console.log( walletObj );
			// {
			// 	isHD: false,
			// 		mnemonic: '',
			// 	password: '',
			// 	address: '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357',
			// 	publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			// 	privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			// 	index: 0,
			// 	path: null
			// }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey ).toEqual( privateKey );
			expect( walletObj.publicKey ).toEqual( publicKey );
			expect( walletObj.address ).toEqual( address.trim().toLowerCase() );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );
		} );

		it( "should create a HD wallet from a private key", async () =>
		{
			// Create a wallet from the specified private key
			const privateKey = "0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a";
			const publicKey = "0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622";
			const address = "0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357";

			const walletObj = EtherWallet.createWalletFromPrivateKey( privateKey );
			// console.log( walletObj );
			// {
			// 	isHD: false,
			// 		mnemonic: '',
			// 	password: '',
			// 	address: '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357',
			// 	publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			// 	privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			// 	index: 0,
			// 	path: null
			// }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey ).toEqual( privateKey );
			expect( walletObj.publicKey ).toEqual( publicKey );
			expect( walletObj.address ).toEqual( address.trim().toLowerCase() );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );
		} );

		it( "should throw an error if the private key is not valid", async () =>
		{
			// Try to create a wallet from an invalid private key
			const privateKey = "xxf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a";

			try
			{
				EtherWallet.createWalletFromPrivateKey( privateKey );
			}
			catch ( error : any )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toHaveProperty( 'message' );
				expect( error.message ).toEqual( "EtherWallet.createWalletFromPrivateKey :: invalid format of private key" );
			}
		} );
	} );

	describe( "Create Wallet from a seed string", () =>
	{
		it ( "should create a wallet from a seed string", async () =>
		{
			//
			//	step 1: create a new wallet from a random private key
			//
			const seedString = `xxf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a`;
			const walletObj = EtherWallet.createWalletFromSeedString( seedString );
			//console.log( `walletObj :`, walletObj );
			//	    walletObj : {
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xe5e6c11456ffe01b81f9d270a9d6af4db18c86c1',
			//       publicKey: '0x035f72f81328a6f20be8626a3c5397206d66d768bc1d24bd00953e7c8aaeeddbc8',
			//       privateKey: '',
			//       index: 0,
			//       path: null
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey ).toBe( '' );
			expect( walletObj.publicKey ).toBe( '0x035f72f81328a6f20be8626a3c5397206d66d768bc1d24bd00953e7c8aaeeddbc8' );
			expect( walletObj.address ).toBe( `0xe5e6c11456ffe01b81f9d270a9d6af4db18c86c1` );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );

		});
	});

	describe( "Create Wallet from Keystore", () =>
	{
		it( "should create a wallet from keystore string", async () =>
		{
			//
			//	step 1: create a new wallet from a random private key
			//
			const walletObj = EtherWallet.createWalletFromPrivateKey();

			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );

			//
			//	step 2: get the keystore string of wallet
			//
			const password : string = '00000000';
			const keystoreJson : string = await EtherWallet.getKeystoreOfWallet( walletObj, password );
			expect( keystoreJson ).toBeDefined();
			expect( typeof keystoreJson ).toBe( "string" );
			expect( _.isString( keystoreJson ) && ! _.isEmpty( keystoreJson ) ).toBeTruthy();

			//	should output:
			//	{"address":"d4a9f003c167df8d5b1851c73b42b8c3d6b2276a","id":"ae16f5fc-92d5-45d5-8db0-051ebed0e19b","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"75aa6bfbea37eced7c404f3149739b9e"},"ciphertext":"7cfa38b1e0c9b8bd7afbfbd247b7ac7a71af6788a6c9548762b3cf895626de4c","kdf":"scrypt","kdfparams":{"salt":"457447b29ae32b0470bc97818ceb17383498cf5620b668704134ea40114d2ddd","n":131072,"dklen":32,"p":1,"r":8},"mac":"c63c48b18ead9420a3bd448d99bdf50c6da685aec9092e3c9628817e4e2d40e9"}}
			//console.log( keystoreJson );

			//
			//	step 3: recover the wallet from the keystore json string
			//
			const walletAgain = await EtherWallet.createWalletFromKeystore( keystoreJson, password );
			expect( walletAgain ).toBeDefined();
			expect( EtherWallet.isValidWalletFactoryData( walletAgain ) ).toBeTruthy();
			expect( walletAgain.address ).toBe( walletObj.address );
			expect( walletAgain.index ).toBe( walletObj.index );
			expect( walletAgain.privateKey ).toBe( walletObj.privateKey );
			expect( walletAgain.publicKey ).toBe( walletObj.publicKey );
			expect( walletAgain.path ).toBe( walletObj.path );
			expect( walletAgain.password ).toBe( walletObj.password );
		});
	} );

	describe( "Create Watch Wallet", () =>
	{
		it( "should throw an error about invalid address", async () =>
		{
			try
			{
				EtherWallet.createWalletFromAddress( '1' );
			}
			catch ( err : any )
			{
				//	Assert that the error is thrown
				expect( err ).toBeDefined();
				expect( err ).toHaveProperty( 'message' );
				expect( err.message ).toEqual( "EtherWallet.createWalletFromAddress :: invalid address" );
			}
		});

		it( "should create a watch wallet from address", async () =>
		{
			//	create a wallet by mnemonic
			const walletObj : TWalletBaseItem = EtherWallet.createWalletFromMnemonic();
			expect( walletObj ).toBeDefined();
			expect( walletObj ).toHaveProperty( 'isHD' );
			expect( walletObj ).toHaveProperty( 'address' );
			expect( walletObj ).toHaveProperty( 'privateKey' );
			expect( walletObj ).toHaveProperty( 'publicKey' );
			expect( walletObj ).toHaveProperty( 'index' );
			expect( walletObj ).toHaveProperty( 'path' );
			expect( isAddress( walletObj.address ) ).toBeTruthy();

			const watchWallet : TWalletBaseItem = EtherWallet.createWalletFromAddress( walletObj.address );
			expect( watchWallet ).toBeDefined();
			expect( watchWallet ).toHaveProperty( 'isHD' );
			expect( watchWallet ).toHaveProperty( 'address' );
			expect( watchWallet ).toHaveProperty( 'privateKey' );
			expect( watchWallet ).toHaveProperty( 'publicKey' );
			expect( watchWallet ).toHaveProperty( 'index' );
			expect( watchWallet ).toHaveProperty( 'path' );
			expect( isAddress( walletObj.address ) ).toBeTruthy();
			expect( walletObj.address ).toBe( walletObj.address );
			expect( watchWallet.isHD ).toBeFalsy();
		});
	} );

	describe( "Derive the next wallet", () =>
	{
		it( "should create a new address from a specified HD wallet", async () =>
		{
			const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const firstAddress = '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357';
			const secondAddress = '0x75BaAEc1C767A6A6F076dEEeA665F8642973dafA';
			const thirdAddress = '0xE05eCB996dA9D59315d569D65C93Af68bA9AA4a5';

			const businessAddressIndex : number | undefined = 1111;
			const isValidNonHardenedAddressIndex = EtherWallet.isValidNonHardenedAddressIndex( businessAddressIndex );
			expect( isValidNonHardenedAddressIndex ).toBeTruthy();

			//	...
			const walletObj = EtherWallet.createWalletFromMnemonic( mnemonic );
			expect( walletObj.address ).toBe( firstAddress.trim().toLowerCase() );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );

			const secondWalletObj = EtherWallet.deriveNextWallet( walletObj );
			expect( secondWalletObj.address ).toBe( secondAddress.trim().toLowerCase() );
			expect( secondWalletObj.index ).toBe( 1 );
			expect( secondWalletObj.path ).toBe( ethers.getIndexedAccountPath( 1 ) );

			const thirdWalletObj = EtherWallet.deriveNextWallet( secondWalletObj );
			expect( thirdWalletObj.address ).toBe( thirdAddress.trim().toLowerCase() );
			expect( thirdWalletObj.index ).toBe( 2 );
			expect( thirdWalletObj.path ).toBe( ethers.getIndexedAccountPath( 2 ) );
		} );
	} )
} );
