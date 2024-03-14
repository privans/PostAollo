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
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: function, path: /key1` );

			expect( new ValidateSerializable().validate( Symbol('description') ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: symbol, path: /` );
			expect( new ValidateSerializable().validate( {
				key101 : Symbol('description')
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: symbol, path: /key101` );
			expect( new ValidateSerializable().validate( {
				apple : {
					key101 : Symbol('description')
				}
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: symbol, path: /apple/key101` );

			expect( new ValidateSerializable().validate( new Map() ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: Map, path: /` );
			expect( new ValidateSerializable().validate( {
				myMap : new Map()
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: Map, path: /myMap` );

			expect( new ValidateSerializable().validate( {
				mySet : new Set()
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: Set, path: /mySet` );

			expect( new ValidateSerializable().validate( BigInt( `111` ) ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: BigInt, path: /` );
			expect( new ValidateSerializable().validate( {
				myBigint : BigInt( `111` )
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: BigInt, path: /myBigint` );

			expect( new ValidateSerializable().validate( new Date() ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: Date Object, path: /` );
			expect( new ValidateSerializable().validate( {
				myDate : new Date()
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: Date Object, path: /myDate` );
			expect( new ValidateSerializable().validate( Date.now() ) ).toBe( null );
			expect( new ValidateSerializable().validate( {
				nowTs : Date.now()
			} ) ).toBe( null );

			expect( new ValidateSerializable().validate( new RegExp( `` ) ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: RegExp Object, path: /` );
			expect( new ValidateSerializable().validate( {
				myRegExp : new RegExp( `` )
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: RegExp Object, path: /myRegExp` );


			expect( new ValidateSerializable().validate( {
				valid: "This is fine",
				invalidMap: new Map(), // Map is not serializable
				nested: {
					valid: 123,
					invalid: undefined // Undefined is not serializable
				}
			} ) ).toBe( `ValidateSerializable.traverse :: unserializable value found: Map, path: /invalidMap` );

		}, 60 * 10e3 );

	} );
} );
