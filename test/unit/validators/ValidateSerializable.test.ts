import { describe, expect } from '@jest/globals';
import { ValidateSerializable } from "../../../src";


/**
 *	unit test
 */
describe( "ValidateSerializable", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Validate Serializable", () =>
	{
		it( "should check whether an object can be serialized", async () =>
		{
			expect( new ValidateSerializable().validate( undefined ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: undefine