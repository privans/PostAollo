import { describe, expect } from '@jest/globals';
import { EtherWallet, Web3Validator } from "../../../src";
import { ethers, isHexString } from "ethers";
import { Web3Signer } from "../../../src";
import { TWalletBaseItem } from "../../../src";



/**
 *	unit test
 */
describe( "Signer", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Sign and validate", () =>
	{
		it( "should sign a object and validate it", async () =>
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
			let toBeSignedObject = {
				version : '1.0.0',
				deleted : 0,
				wallet : walletObj.address,