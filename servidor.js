import express from 'express'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

// Conexion a la base de datos en Firebase 

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "crud-agaa.firebaseapp.com",
  projectId: "crud-agaa",
  storageBucket: "crud-agaa.appspot.com",
  messagingSenderId: "818938890240",
  appId: "1:818938890240:web:99a4e2bd324c841fc570e5"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore()
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Respuesta de Raiz')
})

app.post('/singup', (req, res) => {
    const { nombre, apaterno, amaterno, telefono, usuario, password } = req.body
    // console.log('@@ body =>',  req.body)
    if (nombre.length < 3){
        res.json({ 'alerta': 'El nombre debe tener minimo 3 letras'})
    } else if (!apaterno.length){
        res.json({ 'alerta': 'El usuario no puede ser vacio'})
    } else if (!usuario.length){
        res.json({ 'alerta': 'El apaterno no puede ser vacio'})
    } else if (!password || password.length < 6){
        res.json({ 'alerta': 'La contraseña requiere 6 caracteres'})
    } else {
        // Guardar en la base de datos
        const usuarios = collection(db, 'usuarios')
        getDoc(doc(usuarios, usuario)).then(user => {
            if (user.exists()) {
                res.json({ 'alerta': 'Usuario ya existe' })
            } else{
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash

                        setDoc(doc(usuarios, usuario), req.body)
                        .then (registered => {
                            res.json({
                                'alert': 'sucess',
                                registered
                            })

                        })
                    }) 
                })

            }

        })
    }
})

app.post('/login', (req, res) => {
    const { usuario, password } = req.body

    if (!usuario.length || !password.length) {
        return res.json({
            'alerta': 'Algunos campos estan vacios'
        })
    }
    const usuarios = collection(db, 'usuarios')
    getDoc(doc(usuarios, usuario))
       .then(user =>{
         if (!user.exists()) {
            res.json({
                'alerta': 'El usuario no existe'
            })
         } else {
            bcrypt.compare(password, user.data().password, (err, result) => {
                if (result) {
                    let userFound = user.data()
                    res.json({
                        'alert': 'success',
                        'usuario': {
                            'nombre': userFound.nombre,
                            'apaterno': userFound.apaterno,
                            'amaterno': userFound.amaterno,
                            'usuario': userFound.usuario,
                            'telefono': userFound.telefono 
                        }
                    })
                } else {
                    res.json({
                        'alerta': 'Contraseñas no coinciden'
                    })
                }
            })
         }
       })
})

const port = process.env.PORT || 6000

app.listen(port, () => {
    console.log('Servidor Escuchando: ', port)
    console.log(`Servidor Escuchando: ${port}`)
})

