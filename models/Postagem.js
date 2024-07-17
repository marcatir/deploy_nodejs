const mongoose = require ("mongoose")
const Schema = mongoose.Schema

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId, //vai armazenar o ID de uma categoria
        ref: "categorias", //qual tipo de objeto (nome da categoria)
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", Postagem) //criando uma collection para esse model chamada 'postagens', que será feita com base no model 'Postagem'