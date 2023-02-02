
Instructions:
1. Download the Java source codes 
2. Store these codes into a local folder and open this folder
3. Click the right key of mouse and click ‘Open in Terminal’
4. Input command as ‘javac *.java’ to compiler all Java source codes to get the Java class files
5. Input command as ‘java Compiler FolderName’ (FolderName indicates the name of folder which contains the Jack source codes)

For the step 5, if user wants to compile the folder which is not in the ‘src’ folder, the entire path of the folder should be added in front of the folder name. 

Jack programming language is a kind of tutorial object-oriented programming language. I have already uploaded several samples with documentation for Jack programming language. After generating the .vm files, users can download virtual machine from www.nand2tetris.org to run the machine codes.
# debeem-id
The `debeem-id` is a simple and easy-to-use Web3 software development toolkit developed by the `DeBeem` open-source organization.

Based on Ethereum wallet technology, `debeem-id` is an infrastructure component of the `DeBeem` ecosystem, offering features such as strict validation of data to be signed, data signing, signature verification, and identity authentication.


## Table of contents
- [Key features](#key-features)
- [How it works](#how-it-works)
- [Create a signer](#create-a-signer)
- [Sign Data](#sign-data)
- [Validate Signature](#validate-signature)
- [Object that cannot be signed](#object-that-cannot-be-signed)


## Key features

- **EtherWallet** 

    Core functionality component of the Ethereum wallet, including wallet creation, import, recovery, wallet address validation, wallet derivation, and other features.


- **Web3Digester** 

    Provides hash digest and result format validation functionality for a JSON Object.


- **Web3Encoder** 

    Provides encoding and decoding functionality for a JSON Object.


- **Web3Signer** 

    Provides signing and result format validation functionality for a JSON Object.


- **Web3Validator** 

    Used to verify if the signature of a JSON Object is correct.


- **ValidateSerializable** 

    Used to strictly validate whether a JSON Object can be signed.


## How it works
- Sign the data with the wallet's private key, and you will get a signature string.
- The wallet address will be included in the data packet. When verifying the signature, you need to enter the wallet address and signature. `debeem-id` will verify whether the signature of the data package is signed by the private key of the owner of the wallet address.
- Therefore, it is verified that the packet belongs to the specified user (wallet address).


## Create a signer

The signer is based on the wallet, so creating a signer is equivalent to creating a wallet. Subsequently, we can sign the data using the `wallet's private key`.

1. Create a random HD wallet object
```typescript
const walletObj = EtherWallet.createWalletFromMnemonic();
```

```typescript
{
    isHD: true,
    mnemonic: 'million butter obtain fuel address truck grunt recall gain rotate debris flee',
    password: '',
    address: '0x03a06e86556C819199E602851e4453a89718cB36',