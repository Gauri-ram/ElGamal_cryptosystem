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

function genKey(q) {
    let key = crypto.randomBytes(32); // Generate a 32-byte buffer
    key = bigInt(key.toString('hex'), 16); // Convert buffer to BigInt
    while (gcd(q, key) !== 1) {
        key = crypto.randomBytes(32); // Regenerate buffer if needed
        key = bigInt(key.toString('hex'), 16);
    }
    return key;
}

function power(a, b, c) {
    let x = 1;
    let y = a;

    while (b > 0) {
        if (b % 2 !== 0) {
            x = (x * y) % c;
        }
        y = (y * y) % c;
        b = Math.floor(b / 2);
    }

    return x % c;
}

function encrypt(msg, q, h, g) {
    const enMsg = [];
    const k = genKey(q); // Private key for sender
    const s = power(h, k, q);
    const p = power(g, k, q);

    console.log("g^k used: ", p);
    console.log("g^ak used: ", s);

    for (let i = 0; i < msg.length; i++) {
        enMsg.push(msg[i]);
    }

    for (let i = 0; i < enMsg.length; i++) {
        enMsg[i] = s * enMsg[i].charCodeAt(0);
    }

    console.log(enMsg ,p, s);
    return { s, p };
}

function decrypt(enMsg, p, key, q) {
    const drMsg = [];
    const h = power(p, key, q);

    for (let i = 0; i < enMsg.length; i++) {
        drMsg.push(String.fromCharCode(Math.floor(enMsg[i] / h)));
    }

    return drMsg.join('');
}

app.post('/encrypt', (req, res) => {
    const { message } = req.body;
    
    const q = crypto.randomInt(Math.pow(10, 2), Math.pow(10, 5));
    const g = crypto.randomInt(2, q);

    const key = genKey(q); // Private key for receiver
    const h = power(g, key, q);

    const { enMsg, p } = encrypt(message, q, h, g);
    res.json({ enMsg, p });
});

app.post('/decrypt', (req, res) => {
    const { enMsg, p } = req.body;
    
    const key = genKey(p); // Private key for receiver
    const decrypted = decrypt(enMsg, p, key, p);
    
    res.json({ decrypted });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
