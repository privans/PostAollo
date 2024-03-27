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

	describe( "Validate Serializable b