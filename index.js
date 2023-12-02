import { Keypair, Connection, PublicKey, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import { keypairIdentity, Metaplex, token } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import dotenv from "dotenv"
dotenv.config()

const secret = process.env.PRIVATE_KEY;

// connect wallet
const secretKey = bs58.decode(secret);
const wallet = Keypair.fromSecretKey(secretKey);
console.log("PublicKey:", wallet.publicKey.toBase58())

const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
const metaplex = new Metaplex(connection);
metaplex.use(keypairIdentity(wallet));

if (!metaplex) {
    console.log('connection error')
}
console.log('get metaplex connection')

async function sendNft() {
    // const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey('B9n63fnyBQtRauTFrZEkMFFKDbTaUJ1RKBiRRhhJTgjq') });
    // if (!nft) {
    //     console.log("didn't find the nft")
    // }
    // console.log('find nft successful')

    const txBuilder = metaplex.nfts().builders().transfer({
        nftOrSft: {address: new PublicKey('9S5RqgVP1PKoaFRjcx9mX4MP2dnoPxKVoicuuZqdmdFx'), tokenStandard: 4}, //nft,
        fromOwner: new PublicKey('NFT OWNER'),
        toOwner: new PublicKey('DESTINATION'),
        amount: token(1),
        authority: wallet 
    });
    if (!txBuilder) {
        console.log("didn't get txBuilder")
    }
    console.log('txBuilder get')

    const blockhash = await connection.getLatestBlockhash();
    if (!blockhash) {
        console.log("didn't get blockhash")
    }
    console.log('get blockhash', blockhash)

    try {
        const transaction = txBuilder.toTransaction(blockhash);

        const send = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet]
        );
        console.log('Transaction complete.', transaction);
    } catch (error) {
        console.error('Error:', error);
    }
    // return;
}

await sendNft()