// Estruturação do sistema de autenticação
const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => { //qual será o campo a ser analisado?

        Usuario.findOne({email: email}).lean().then((usuario) => {
            if(!usuario){ //"se ele não achar o usuário"
                return done(null, false, {message: "Esta conta não existe"})//null = nenhuma conta foi autenticada; false = para quando a autenticação não ocorreu com sucesso
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => { //comparando a senha com a senha do usuário que for achado (comparando dois valores encriptados)

                if(batem){
                    return done(null, usuario) //se as senhas batem
                }else{
                    return done(null, false, {message: "Senha incorreta"}) //se as senhas não batem
                }
            }) 
        })
    }))

    passport.serializeUser((usuario, done) => { //serve para salvar os dados do usuário em uma sessão
        done(null, usuario._id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).lean().then((usuario) => { //findById procura um usuário pelo Id dele
            done(null, usuario)
        }).catch((err)=>{
            done (null,false,{message:'algo deu errado'})
    })

})

}