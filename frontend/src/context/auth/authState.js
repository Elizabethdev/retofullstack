import React, { useReducer } from 'react';
import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/tokenAuth';

import AuthContext from './authContext';
import AuthReducer from './authReducer';
import {
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  OBTENER_USUARIO,
  LOGIN_EXITOSO,
  LOGIN_ERROR,
  CERRAR_SESSION
} from '../../types';

const AuthState = props => {
  
  const initialState = {
    token : localStorage.getItem('token'),
    autenticado: null,
    usuario: null,
    mensaje: null,
    cargando: true
  }

  const [state, dispatch] = useReducer(AuthReducer, initialState)

  const registrarUsuario = async datos => {
    try {
      const respuesta = await clienteAxios.post('/api/usuarios', datos)
      dispatch({
        type: REGISTRO_EXITOSO,
        payload: respuesta.data
      })

      usuarioAutenticado();

    } catch (error) {
      const alerta = {
        msg: error.response.data.msg,
        categoria: 'alert-error'
      }
      dispatch({
        type: REGISTRO_ERROR,
        payload: alerta
      })
    }
  }

  const usuarioAutenticado = async () => {
    const token = localStorage.getItem('token');
    if(token) {
      tokenAuth(token);
    }

    try {
      const respuesta = await clienteAxios.get('/api/auth');
      dispatch({
        type: OBTENER_USUARIO,
        payload: respuesta.data.usuario
      })
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
      })
    }
    //aqui se puede obtener datos del usuario
  }

  const iniciarSesion = async datos => {
    try {
      const respuesta = await clienteAxios.post('/api/auth', datos)
      dispatch({
        type: LOGIN_EXITOSO,
        payload: respuesta.data
      })

      usuarioAutenticado();
      
    } catch (error) {
      console.log(error.response)
      const alerta = {
        msg: error.response.data.msg,
        categoria: 'alert-error'
      }
      dispatch({
        type: LOGIN_ERROR,
        payload: alerta
      })
    }
  }

  const cerrarSession = () => {
    dispatch({
      type: CERRAR_SESSION,
    })
  }

  return(
    <AuthContext.Provider
      value={{
        token: state.token,
        autenticado: state.autenticado,
        usuario: state.usuario,
        mensaje: state.mensaje,
        cargando: state.cargando,
        registrarUsuario,
        iniciarSesion,
        usuarioAutenticado,
        cerrarSession
      }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState;