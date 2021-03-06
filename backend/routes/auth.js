const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//api/auth
router.post('/', 
  [
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty()
	],
	authController.authUser
);

router.get('/', 
  auth,
	authController.usuarioAutenticado
);

module.exports = router;