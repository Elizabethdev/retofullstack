const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {
  const errores = validationResult(req);

  if( !errores.isEmpty() ) {
    return res.status(400).json({errores:errores.array()})
	}

	const {email, password} = req.body;

	try {
		let usuario = await Usuario.findOne({email});
		if(!usuario) {
      return res.status(400).json({msg: 'El usuario no existe'});
		}
		
		const passCorrecto = await bcryptjs.compare(password, usuario.password);
		if(!passCorrecto) {
      return res.status(400).json({msg: 'Password incorrecto'});
		}

		//crear y firmar jwt, si todo es correcto
    const payload = {
      usuario:{
        id: usuario.id
      }
    };

    jwt.sign(payload, process.env.FIRMA, {
      expiresIn: 36000 //duracion del token en seg.
    }, (error, token) => {
      if(error) throw error;

      res.json({ token });
    });

	} catch (error) {
    res.status(500).json({msg: 'Hubo un error'});
	}
}

exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({usuario});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: 'Hubo un error'});
  }
}