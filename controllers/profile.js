const handleProfileGet = (req, res, db)=>{
    //want to grab the id property
    //if id matches what is in the database we want to return with the user info
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user=>{
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('Not found')
        }
    })
    .catch(err=> res.status(400).json('error getting user'))
}

module.exports = {
    //ES6 shorthand
    handleProfileGet
}