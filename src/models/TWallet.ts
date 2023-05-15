/**
 * 	https://github.com/jakearchibald/idb
 */
export interface TWalletBaseItem
{
	/**
	 * 	HD wallet?
	 */
	isHD : boolean;

	/**
	 * 	mnemonic phrase, a word list
	 */
	mnemonic ?: string;

	/**
	 * 	The password of the wallet, used to encrypt mnemonic and privateKey.
	 * 	If password is not empty, mnemonic and privateKey should be ciphertext
	 */
	password : string;

	/**
	 * 	address of wallet. this, wallet address is the globally unique stored key for storage
	 */
	address : string;

	/**
	 * 	private key and public key
	 */
	privateKey : string;
	publicKey : string;

	/**
	 * 	The index of the generated wall