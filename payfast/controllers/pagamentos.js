module.exports = function(app){
    
    app.get('/pagamentos', function(req, res){
        console.log("Recebida request");
        res.send('OK');
    });
    
    app.delete('/pagamentos/pagamento/:id', function(req, res){

        var pagamento = {
            id: req.params.id,
            status: "CANCELADO"
        };
        
        var connection = app.persistencia.connectionFactory();
        
        var pagamentoDao = new app.persistencia.PagamentosDao(connection);
        
        pagamentoDao.atualiza(pagamento, function(erro){
            if(!erro){
                res.status(204).json(pagamento)
                return
            }

            res.status(500).send(erro)
            console.log("Erro ao inserir no banco: "+erro)
        });
    });
    
    app.put('/pagamentos/pagamento/:id', function(req, res){

        var pagamento = {
            id: req.params.id,
            status: "CONFIRMADO"
        };
        
        var connection = app.persistencia.connectionFactory();
        
        var pagamentoDao = new app.persistencia.PagamentosDao(connection);
        
        pagamentoDao.atualiza(pagamento, function(erro){
            if(!erro){
                res.status(200).json(pagamento)
                return
            }

            res.status(500).send(erro)
            console.log("Erro ao inserir no banco: "+erro)
        });
    });
    
    app.post('/pagamentos/pagamento', function(req, res){
        
        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória").notEmpty();
        req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal").notEmpty().isFloat();
        req.assert("pagamento.moeda", "Moeda é obrigatória e deve conter 3 caracteres").notEmpty().len(3,3);
        
        var erros = req.validationErrors();
        
        if(erros){
            console.log("Erros de validação encontrados: "+ JSON.stringify(erros))
            res.status(400).send(erros)
            return
        }
        
        var pagamento = req.body['pagamento'];
        console.log("processando novo pagamento");

        pagamento.status = "Criado";
        pagamento.data = new Date();
        
        var connection = app.persistencia.connectionFactory();
        
        var pagamentoDao = new app.persistencia.PagamentosDao(connection);
        
        pagamentoDao.salva(pagamento, function(erro, resultado){
            if(erro){
                res.status(500).send(erro)
                console.log("Erro ao inserir no banco: "+erro)
                return
            }
            
            pagamento.id = resultado.insertId;
            
            res.location('/pagamentos/pagamento/'+pagamento.id)
            
            const response = {
                dados_do_pagamento: pagamento,
                links: [
                    {
                        href:"http://localhost:8080/pagamentos/pagamento/"+pagamento.id,
                        rel:"confirmar",
                        method:"PUT"
                    },
                    {
                        href:"http://localhost:8080/pagamentos/pagamento/"+pagamento.id,
                        rel:"cancelar",
                        method:"DELETE"
                    }
                ]
            };
                
            if(pagamento.forma_de_pagamento == 'cartao'){
                const cartao = req.body['cartao']
                
                const clienteCartoes = new app.servicos.clienteCartoes()
                clienteCartoes.autoriza(cartao, (exception, requestCard, responseCard, retorno) => {
                    if(exception){
                        console.log(exception)
                        res.status(400).send(exception)
                        return
                    }
                    
                    response.cartao = retorno
                    res.status(201).json(response)
                    
                })
                
                return
            }
            
            res.status(201).json(response)
        });

    });

}