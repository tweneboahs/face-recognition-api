const express = require('express');

const app = express();

app.use(express.json());

const database = {
    users:[
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res)=>{
    res.send(database.users);
})

app.post('/signin', (req,res)=>{
    //check if the users info on the frontend side matches what is in the backend (database)
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('sucess');
    } else{
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res)=>{
    //want to use the users input in order to make another instance of users
    const { email, name, password } =  req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    //always remember to respond
    //display the user we just input
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req, res)=>{
    //want to grab the id property
    //if id matches what is in the database we want to return with the user info
    const { id } = req.params;
    let found = false;
    database.users.forEach(user =>{
        if (user.id === id){
            found = true;
            return res.json(user);
        } 
    })
    if (!found){
        res.status(400).json('not found');
    }
})

app.listen(3000, ()=>{
    console.log('here i am')
})