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
			expect( new ValidateSerializable().validate( undefined ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: undefined, path: /` );
			expect( new ValidateSerializable().validate( {
				key : undefined
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: undefined, path: /key` );

			expect( new ValidateSerializable().validate( () =>{ return 1; } ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: function, path: /` );
			expect( new ValidateSerializable().validate( {
				key1 : () =>{ return 1; }
			} ) ).toBe( `ValidateSeria