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
	