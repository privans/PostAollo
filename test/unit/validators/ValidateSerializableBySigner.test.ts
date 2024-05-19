import { describe, expect } from '@jest/globals';
import { EtherWallet, TWalletBaseItem, Web3Signer } from "../../../src";
import { ethers } from "ethers";


/**
 *	unit test
 */
describe( "ValidateSerializableBySigner", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Validate Serializable by Web3Signer", () =>
	{
		it( "should check whether an object can be serialized", async () =>
		{
			//
			//	create a wallet by mnemonic
			//
			const mnemonic : string = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const walletObj : TWalletBaseItem = EtherWallet.createWalletFromMnemonic( mnemonic );

			//	assert ...
			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( mnemonic );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );

			//
			//	create a new contact with ether signature
			//
			const toBeSignedObject = {
				version : '1.0.0',
				deleted : 0,
				wallet : walletObj.address,
				address : '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
				sig : ``,
				name : `Sam`,
				avatar : 'https://avatars.githubusercontent.com/u/142800322?v=4',
				remark : 'no remark',
				createdAt: JSON.stringify( new Date() ),
				updatedAt: JSON.stringify( new Date() )
			};


			/**
			 *	should throw an error description when the input object contains an undefined
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, undefined );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: invalid obj` );
			}

			try
			{
				await Web3Signer.signObject( walletObj.privateKey, { ...toBeSignedObject, key1 : undefined } );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: undefined, path: /key1` );
			}


			/**
			 * 	should throw an error description when the input object contains a function
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, () =>{ return 1; } );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: invalid obj.wallet` );
			}

			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					key1 : () =>{ return 1; }
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: function, path: /key1` );
			}


			/**
			 * 	should throw an error description when the input object contains a Symbol
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					key1 : Symbol('description')
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: symbol, path: /key1` );
			}


			/**
			 * 	should throw an error description when the input object contains a Map
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					myMap : new Map()
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: Map, path: /myMap` );
			}

			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					valid: "This is fine",
					invalidMap: new Map(), // Map is not serializable
					nested: {
						valid: 123,
						invalid: undefined // Undefined is not serializable
					}
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: Map, path: /invalidMap` );
			}


			/**
			 * 	should throw an error description when the input object contains a Set
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					mySet : new Set()
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: Set, path: /mySet` );
			}


			/**
			 * 	should throw an error description when the input object contains a BigInt
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					myBigint : BigInt( `111` )
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: BigInt, path: /myBigint` );
			}


			/**
			 * 	should throw an error description when the input object contains a Date
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					key1 : {
						myDate : new Date()
					}
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: Date Object, path: /key1/myDate` );
			}


			/**
			 * 	should throw an error description when the input object contains a RegExp
			 */
			try
			{
				await Web3Signer.signObject( walletObj.privateKey, {
					...toBeSignedObject,
					key1 : {
						myRegExp : new RegExp( `` )
					}
				} );
			}
			catch ( err )
			{
				expect( err ).toBe( `Web3Signer.signObject :: ValidateSerializable.traverse :: unserializable value found: RegExp Object, path: /key1/myRegExp` );
			}


			/**
			 * 	should return a valid sig
			 */
			const sig : string = await Web3Signer.signObject( walletObj.privateKey, {
				...toBeSignedObject
			} );
			expect( Web3Signer.isValidSig( sig ) ).toBeTruthy();


		}, 60 * 10e3 );

	} );
} );
