/* 
    Rutas de usuarios Auth
    host + /api/auth

*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

// login
router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
    ],
    loginUser
);

// register
router.post(
    '/new',
    // middlewares 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
    ], 
    createUser
);

// renew token
router.get('/renew', validateJWT, renewToken);

module.exports = router;