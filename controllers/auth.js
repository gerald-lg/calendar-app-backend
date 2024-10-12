const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if( user ){
            return res.status(400).json({
                ok: false,
                message: 'El usuario ya existe',
            });
        }

        user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //JWT generate
        const token = await generateJWT(user._id, user.name);
        
        res.status(201).json({
            ok: true,
            message: 'Se ha registrado correctamente',
            uid: user._id,
            name: user.name,
            token: token
        })
    } catch (error) {
        console.error('Error el auth@CreateUser: ' + error)
        res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error'
        });
    }
}

const loginUser = async (req, res = response) => {
    
    
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
    
        if( !user ){
            return res.status(400).json({
                ok: false,
                message: 'Las credenciales no son correctas',
            });
        }
    
        // Validate password
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false, 
                message: 'Password incorrecto'
            })
        }

        //Generar JWT JSON WEB TOKEN
        const token = await generateJWT(user._id, user.name);

        res.json({
            ok: true,
            message: 'Login ok',
            uid: user._id,
            name: user.name, 
            token
        });
        
    } catch (error) {
        console.error('Error el auth@loginUser: ' + error);

        res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error'
        });
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const newToken = await generateJWT(uid, name);

    res.json({
        ok: true,
        message: 'Token actualizado',
        token: newToken,
        uid, name
    });
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}