const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require(process.env.SERVICE_URL);
const cors = require('cors');
const app = express();
const multer = require('multer');
app.use(express.static(`${__dirname}/public`))

const { login, register, init_auth } = require('./processing/authentication');
const { generateImage, generateReel, init_image } = require('./processing/media_service');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const secret = process.env.SECRET;

const port = process.env.PORT || 4001;

init_auth({
    secret,
    db
});

init_image({
    dirname: __dirname
});

app.use(cors("*"));
app.use(bodyParser.json());
const upload = multer({ dest: `${__dirname}/public/temp` });

app.post('/login', login);
app.post('/register', register);
app.post('/generate-image', upload.single('image'), generateImage);
app.post('/upload-video', upload.array('videos[]', 10), generateReel)

async function verifyAccount(id)
{
    const doc = await db.collection('users').doc(id);
    return doc.exists;
}



app.listen(port, () => console.log(`Server opened on port ${port}`))