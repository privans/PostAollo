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
			const mnemonic = 'olympic cradle tragic cru