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
			//