//Aqui verificará se o usuário está autenticado e se ele é admin
module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash("error_msg", "Você precisa ser um Admin!")
        res.redirect("/")
    }
}