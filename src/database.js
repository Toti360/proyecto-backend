import mongoose from "mongoose";

mongoose.connect("mongodb+srv://aburoxana:917325@cluster0.wvf05f6.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then( () => console.log("Conexión exitosa a la Base de Datos!!"))
    .catch( (error) => console.log("Ups!! ha ocurrido un error", error))
