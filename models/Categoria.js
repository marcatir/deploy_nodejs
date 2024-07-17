const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Categoria = new Schema({
    nome: {
        type: String,
        required: true 
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now() //se o usuário nao passar nenhum valor, por padrão será passado o valor inserido aqui; Date.now insere a data do momento em foi enviado os dados 
    }
})

mongoose.model("categorias", Categoria)