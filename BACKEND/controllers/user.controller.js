require('dotenv').config();
const db = require('../models')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

// create main Model
const User = db.user


// main work

// 1. create user

const registerUser = async (req, res) => {
    try {
        let email = await User.findOne({ where: { email: req.body.email }})
        if (email) {
            res.status(409).send({message: 'User already exist'})
        } else {
            const salt = await bcrypt.genSalt(10);

            let info = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, salt),
            } 
            const user = await User.create(info)
            const token = jwt.sign({ 
                id: user.id,
                name: user.name,
                email: user.email,
            },
            process.env.API_KEY, {expiresIn: "2h",});

            user.token = token
            res.status(200).send({token: token})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}





// 2. get single user

const getOneUser = async (req, res) => {
    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        if (err) {
            res.status(401).send('Unauthorizied')
        }else{
            res.status(200).send(data)
        }
    })
}



// 3. update User

const updateUser = async (req, res) => {

    let id = req.params.id
    const userData = {
        name: req.body.name,
        email: req.body.email,
    }

    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        let verify = await User.findOne({ where: { id: id }})
        let verifyEmail = await User.findOne({where: {email: req.body.email}})
        if (err) {
            res.status(401).send('Unauthorized')
        }else if (verify.email !== data.email) {
            res.status(401).send('Unauthorized')
        }else if ( verifyEmail && (verifyEmail?.id != id) ) {
            res.status(401).send({email: "Email already exist"})
        }
        else{
            await User.update(userData, { where: { id: id }})
            const user = await User.findOne({ where: { id: id }})
            const token = jwt.sign({ 
                id: user.id,
                name: user.name,
                email: user.email,
            },
            process.env.API_KEY,{expiresIn: "2h",});

            user.token = token
            res.status(200).send(user)
        }
    })

}





// 4. login

const loginUser = async(req, res) =>{
    let pass = req.body.password
    let email = req.body.email
    if (!email) {
        res.status(400).send({email: "email required"})
    }else if (!pass){
        res.status(400).send({password: "password required"})
    } else if(!await User.findOne({ where: { email: email}})) {
        res.status(400).send({email: "wrong email"})
    }
    else{
        let user = await User.findOne({ where: { email: email }})
        if(await bcrypt.compare(pass, user.password)){
            const token = jwt.sign({ 
                id: user.id,
                name: user.name,
                email: user.email,
            }, 
            process.env.API_KEY,{expiresIn: "2h",});
    
            user.token = token
            res.status(200).send({id: user.id, name: user.name, email: user.email, token: user.token})
        }else{
            res.status(400).send({password: "wrong password"})
        }
    }
}




// 5. update password 

const updatePassword = async(req, res) =>{
    let id = req.params.id

    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        if (err) {
            res.status(401).send('Unauthorized')
        }else{
            let verify = await User.findOne({ where: { id: id }})
            if (verify.email == data.email) {
                const salt = await bcrypt.genSalt(10);
                const userData = {
                    password: await bcrypt.hash(req.body.password, salt)
                }
                await User.update(userData, { where: { id: id }})
                const user = await User.findOne({ where: { id: id }})
                const token = jwt.sign({ 
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                process.env.API_KEY,{expiresIn: "24h",});
    
                user.token = token
                res.status(200).send(user)
            }else  res.status(401).send('Unauthorized')
        }
    })
}


// 6. Verify Token

const ensureToken = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    }else{
        res.sendStatus(403)
    }
}



module.exports ={
    registerUser,
    getOneUser,
    updateUser,
    ensureToken,
    loginUser,
    updatePassword,
}
