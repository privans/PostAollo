import { describe, expect } from '@jest/globals';
import { EtherWallet, Web3Validator } from "../../../src";
import { ethers, isHexString } from "ethers";
import { Web3Signer } from "../../../src";
import { TWalletBaseItem } from "../../../src";



/**
 *	unit test
 */
describe( "Signer"