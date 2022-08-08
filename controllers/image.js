const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
//most api's require some sort of key
const app = new Clarifai.App({
    apiKey: '16a0809c6378469fa281853b2ef5bd21'
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data =>{
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to work with api'))

}

const handleImage = (req, res, db)=>{
    //update the entries based on how many images the user searched
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports ={
    handleImage,
    handleApiCall
}