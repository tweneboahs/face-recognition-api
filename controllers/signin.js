const handleSignin = (req, res, db, bcrypt) =>{
    //check if any of the fields on register are empty. if they are, do not allow user to register
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json('Incorrect form submission');
    }
    //check if the users info on the frontend side matches what is in the backend (database)
    db.select('email','hash').from('login')
        .where('email', '=', email)
        .then(data =>{
            //if this returns true then the user has entered the correct password
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user=>{
                        console.log(user);
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin: handleSignin
}