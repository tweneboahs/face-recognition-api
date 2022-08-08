const handleRegister = (req, res, db, bcrypt) => {
    //want to use the users input in order to make another instance of users
    const { email, name, password } =  req.body;

    //check if any of the fields on register are empty. if they are, do not allow user to register
    if(!email || !name || !password){
        return res.status(400).json('Incorrect form submission');
    }
    
    const hash = bcrypt.hashSync(password);
    //create a transaction to make sure both register and login have the same credentials(if one fails  -> then they both fail)
    db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            //always remember to respond
            //display the user we just input from the .returning call in knex
            .then(user =>{
                res.json(user[0]);
            })
        })
        //if everything above passes -> commit
        .then(trx.commit)
        .catch(trx.rollback)
    })    
    //remember to not give the user too much info on why they cld not register
    .catch(err => res.status(400).json('Unable to Register'))
}


module.exports = {
    handleRegister: handleRegister
};