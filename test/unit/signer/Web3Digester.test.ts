
import { describe, expect } from '@jest/globals';
import { EtherWallet } from "../../../src";
import { Web3Signer } from "../../../src";
import { TWalletBaseItem } from "../../../src";
import { Web3Digester } from "../../../src";



/**
 *	unit test
 */
describe( "Digester", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Digest using keccak256 algorithm", () =>
	{
		it( "should return the hash value of an object", async () =>
		{
			//
			//	create a wallet by mnemonic
			//
			const mnemonic : string = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const walletObj : TWalletBaseItem = EtherWallet.createWalletFromMnemonic( mnemonic );

			//
			//	create a new contact with ether signature
			//
			let toBeDigestedObject = {
				version : '1.0.0',
				deleted : 0,
				wallet : walletObj.address,
				address : '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
				sig : `1111`,
				name : `Sam`,
				avatar : 'https://avatars.githubusercontent.com/u/142800322?v=4',
				remark : 'no remark',
				timestamp : Date.now(),
				hash : `will be ignored`,
				createdAt: JSON.stringify( new Date() ),
				updatedAt: JSON.stringify( new Date() )
			};

			//	hash
			const hashValue1 = await Web3Digester.hashObject( toBeDigestedObject );
			toBeDigestedObject.hash = hashValue1;
			expect( hashValue1 ).toBeDefined();
			expect( typeof hashValue1 ).toBe( 'string' );
			expect( hashValue1.length ).toBeGreaterThanOrEqual( 0 );
			expect( Web3Digester.isValidHash( hashValue1 ) ).toBeTruthy();
			//console.log( hashValue1 );
			// 0x77846cd6ef81d02bcf9b5475a3dc759e8d0558f4892edd30a2186a3b450214b8

			//	update sig
			//	.sig will be ignored by default
			toBeDigestedObject.sig = await Web3Signer.signObject( walletObj.privateKey, toBeDigestedObject );

			//	hash again
			//	.hash will be ignored by default
			const hashValue2 = await Web3Digester.hashObject( toBeDigestedObject );
			expect( hashValue2 ).toBeDefined();
			expect( typeof hashValue2 ).toBe( 'string' );
			expect( hashValue2.length ).toBeGreaterThanOrEqual( 0 );

			//	...
			expect( hashValue1 ).toBe( hashValue2 );

		}, 60 * 10e3 );

	} );
} );