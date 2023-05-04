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
	mnemonic ?: str