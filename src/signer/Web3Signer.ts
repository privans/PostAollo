import { ethers, isHexString, SigningKey } from "ethers"
import { Web3Encoder } from "./Web3Encoder";
import { EtherWallet } from "./EtherWallet";
import _ from "lodash";
import { ValidateSerializable } from "../validators/ValidateSerializable";


/**
 * 	@class Web3Signer
 */
export class Web3Signer
{
	/**
	 *	@param privateKey	{ string | SigningKey }
	 *	@param obj		{ any }
	 *	@param exceptedKeys	{ Array<s