const express = require('express')
import { initializeApp } from "firebase/app";
const app = express()
const port = 5002

// Conexion a la base de datos en Firebase 

const firebaseConfig = {
  apiKey: "AIzaSyDAbD0voxIYeG4a71aYeDuO5s5QVeU5qnk",
  authDomain: "crud-agaa.firebaseapp.com",
  projectId: "crud-agaa",
  storageBucket: "crud-agaa.appspot.com",
  messagingSenderId: "818938890240",
  appId: "1:818938890240:web:99a4e2bd324c841fc570e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

app.get('/', (req, res) => {
    res.send('Respuesta de Raiz')
})

app.get('/contacto', (req, res) => {
    res.send('Respuesta desde Contacto')
})

app.listen(port, () => {
    console.log('Servidor Escuchando: ', port)
    console.log(`Servidor Escuchando: ${port}`)
})

