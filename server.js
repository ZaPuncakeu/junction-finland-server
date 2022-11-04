const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require(process.env.SERVICE_URL);
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const secret = process.env.SECRET;

const db = admin.firestore();

const port = process.env.PORT || 5000;

app.use(cors("*"));
app.use(bodyParser.json());

const hasher = require('password-hash');

app.post('/login', async (req, res) => {
    const snapshot = await db.collection('users').get();
    const docs = [];
    snapshot.forEach(doc => {
        docs.push(doc);
    });

    for(let doc of docs)
    {
        const { email, password } = doc.data();
        if(email === req.body.email)
        {
            if(hasher.verify(req.body.password, password))
            {
                res.status(200).json(jwt.sign({id: doc.id}, secret));
                return;
            }
        }
    }

    res.status(404).json('Username or password incorrect.');
});

app.post('/register', async (req, res) => {
    const id = addAccount(req.body);
    res.status(201).json({
        "status": 'success',
        "token": jwt.sign({id: id}, secret)
    })
});

async function verifyAccount(id)
{
    const doc = await db.collection('users').doc(id);
    return doc.exists;
}

async function addAccount(data)
{
    data = {...data, password: hasher.generate(data.password)}
    const res = await db.collection('users').add(data);
    return res.id;
}

app.listen(port, () => console.log(`Server opened on port ${port}`))