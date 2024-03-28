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
			const mnemonic : string = 'olympic cradle tragic crucial exit annual silly cloth 