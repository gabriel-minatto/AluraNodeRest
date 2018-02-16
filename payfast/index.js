var app = require('./config/express')();

//console.log(app.controllers.pagamentos.module(app));

/*app.listen(process.env.PORT, function(){
        console.log("Servidor rodando na porta "+process.env.PORT) 
});*/
app.listen(8082, function(){
        console.log("Servidor rodando na porta "+8082) 
});

