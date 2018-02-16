const restify = require('restify-clients')

function cartoesClient(){
    
    this._client = restify.createJsonClient({
        url: 'http://localhost:8081'
    })
    
}

cartoesClient.prototype.autoriza = function(cartao, callback){
    this._client.post('/cartoes/autoriza', cartao, callback)
}

module.exports = function(){
    return cartoesClient
}