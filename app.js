const express = require('express');
const bodyParser = require('body-parser');
const bigInt = require('big-integer');
const crypto = require('crypto');
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

function gcd(a, b) {
    if (a < b) {
        return gcd(b, a);
    } else if (a % b === 0) {
        return b;
    } else {
        return gcd(b, a % b);
    }
}

// function genKey(q) {
//     let key = bigInt.randBetween(bigInt(2).pow(10), q);

//     while (gcd(q, key) !== 1) {
//         key = bigInt.randBetween(bigInt(2).pow(10), q);
//     }

//     return key;
// }

function modExp(a, b, m) {
    return bigInt(a).modPow(b, m);
}

function encrypt(plaintext, e1, e2, r, p) {
    const c1 = modExp(e1, r, p); // c1 = e1^r mod p
    const c2 = plaintext.multiply(modExp(e2, r, p)).mod(p); // c2 = (plaintext * e2^r) mod p
    return { c1, c2 };
}

// Function to perform ElGamal decryption
function decrypt(c1, c2, privateKey, p) {
    const s = modExp(c1, privateKey, p); // s = c1^privateKey mod p
    const sInverse = s.modInv(p); // Calculate the modular inverse of s
    const plaintext = c2.multiply(sInverse).mod(p); // plaintext = (c2 * s^(-1)) mod p
    return plaintext;
}

app.post('/encrypt', (req, res) => {
    const { message } = req.body;
    
    const q = crypto.randomInt(Math.pow(10, 2), Math.pow(10, 5));
    const g = crypto.randomInt(2, q);
    const key= 1237;
    // const key = genKey(q); // Private key for receiver
    const h = modExp(g, key, q);

    const r = bigInt.randBetween(2, 10); // Random r in the range [2, q-2]
    const e1 = modExp(g, r, q); // e1 = g^r mod q
    const e2 = modExp(h, r, q); // e2 = h^r mod q

    const { c1, c2 } = encrypt(bigInt(message), e1, e2, r, q);
    
    res.json({ c1: c1.toString(), c2: c2.toString(), p: q.toString() });
});

app.post('/decrypt', (req, res) => {
    const { c1, c2 } = req.body;
    console.log(c1,c2);
    const key= 1237;

    // const key = genKey(bigInt(p)); // Private key for receiver
    const decrypted = decrypt(bigInt(c1), bigInt(c2), key, 1451);
    
    res.json({ decrypted: decrypted.toString() });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
