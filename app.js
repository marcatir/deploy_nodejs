//Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require("body-parser")
    const app = express() //criando const que vai receber a função que vem do express
    const admin = require("./routes/admin")
    const path = require ("path") //serve para manipular pastas/diretórios
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    const { error } = require('console')
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)
//Configurações
    //Sessão
        app.use(session({ //app.use serve para criação e configuração de middlewares
            secret: "cursodenode", //chave para gerar uma sessão pra você, pode ser qualquer coisa
            resave: true,
            saveUninitialized: true,
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash()) //sempre nessa ordem, 1 - session, 2 - passport, 3 - flash
    //Middleware
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash("success_msg") //serve para criar variáveis globais, que se acessa de qualquer parte/arquivo
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null //variavel "user" vai armazenar o dados do usuário autenticado
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise //para evitar erros
        mongoose.connect("mongodb://localhost/blogapp").then(() => {
            console.log("Conectado ao mongo")
        }).catch((err) => {
            console.log("Erro ao se conectar: "+err)
        })
    //Public
        app.use(express.static(path.join(__dirname,"public"))) //aqui você diz que a pasta que tá guardando todos os arquivos estáticos é a pastas public

        //app.use((req,res,next) => { //criando um middleware aqui
            //console.log("OI EU SOU UM MIDDLEWARE!")
            //next() //passa a requisição, para não travar a navegação
        //})
//Rotas
    app.get('/', (req, res) => { //criando uma rota sem prefixo
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens}) 
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)  => {
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch(() => {
            req.flash("error_msg", "Houve um erro interno ao listas as categorias")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req,res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                
                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

                }).catch(() => {
                    req.flash("error_msg", "Houve um erro interno ao listar os posts")
                    res.redirect("/")
                })

            }else{
                req.flash("error_msg", "Essa categoria não existe")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
            res.redirect("/")
            console.log(err)
        })
    })

    app.get("/404", (req, res) => {
        res.send('Erro 404!')
    })
    
    app.use('/admin', admin) //falando para o express que existe o arquivo de rotas, e o '/admin' define a primeira rota
    app.use("/usuarios", usuarios)
//Outros
const PORT = process.env.PORT || 8081 //process.env.PORT faz com que o Heroku gere uma variável de ambiente para definir a porta aleatória
app.listen(PORT,() => {
    console.log("Servidor rodando!!!")
})