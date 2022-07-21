const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'sarahtweneboah',
      password : '',
      database : 'face-recognition'
    }
});

const app = express();

app.use(express.json());
app.use(cors())

app.get('/', (req, res)=>{
    res.send('Success');
})

app.post('/signin', (req,res)=>{
    //check if the users info on the frontend side matches what is in the backend (database)
    db.select('email','hash').from('login')
        .where('email', '=', req.body.email)
        .then(data =>{
            //if this returns true then the user has entered the correct password
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
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
});

app.post('/register', (req, res)=>{
    //want to use the users input in order to make another instance of users
    const { email, name, password } =  req.body;
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
})

app.get('/profile/:id',(req, res)=>{
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
})

app.put('/image',(req, res)=>{
    //update the entries based on how many images the user searched
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, ()=>{
    console.log('here i am')
})