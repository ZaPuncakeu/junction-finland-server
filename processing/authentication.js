const jwt = require('jsonwebtoken');
const hasher = require('password-hash');

let db;
let secret;

const init_auth = (initial) => 
{
    db = initial.db;
    secret = initial.secret;
}

const login = async (req, res) => {
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
}

const register = async (req, res) => {
    const id = addAccount(req.body);
    res.status(201).json({
        "status": 'success',
        "token": jwt.sign({id: id}, secret)
    })
}

async function addAccount(data)
{
    data = {...data, password: hasher.generate(data.password)}
    const res = await db.collection('users').add(data);
    return res.id;
}

module.exports = {
    register,
    login,
    init_auth
}