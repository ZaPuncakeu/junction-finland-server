const { v4 } = require('uuid');
const axios = require('axios');
const { removeBackgroundFromImageFile } = require("remove.bg");
const fs = require('fs');

let dirname;
const init_image = (initial) => 
{
    dirname = initial.dirname;
}

const generateImage = (req, res) => 
{
    const id = v4();
    const dir = `${dirname}/public/images/${id}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    console.log(req.body.context);
    const localFile = req.file.path;
    const outputFile = `${dir}/${id}.png`;

    removeBackgroundFromImageFile({
        path: localFile,
        apiKey: process.env.RBG_API_KEY,
        size: "regular",
        type: "auto",
        scale: "100%",
        outputFile 
    }).then((result) => {
        try {
            fs.unlinkSync(localFile);
            console.log("File deleted successfully.");
        } catch (error) {
            console.log(error);
        }
        const result_image = `http://127.0.0.1:4001/images/${id}/${id}.png`;
        axios.post(`http://localhost:5000/generate-image`, {
            ...req.body,
            path: outputFile
        })
        .then(ressult2 => {
            const result_arr = fs.readdirSync(dir).filter(f => f.includes('sample') ).map(p => `http://localhost:4001/images/${id}/${p}`)
            console.log(result_arr);
            res.status(201).json(result_arr)
        })
        .catch(console.log);
    }).catch((errors) => {
        console.log(JSON.stringify(errors));
    });
}

const generateReel = (req, res) => 
{
    const id = v4();
    const files = req.files.map(f => f.path);
    axios.post(
        'http://127.0.0.1:5000/generate',
        {
            files,
            id
        }
    )
    .then(resp => 
    {
        res.status(201).json(resp.data);
    })
    .catch(err => 
    {
        res.status(500).json(err);
    });
}

module.exports = {
    generateImage,
    generateReel,
    init_image
}