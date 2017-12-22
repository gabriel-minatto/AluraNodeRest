function PagamentosDao(connection){
    this._connection = connection;
}

PagamentosDao.prototype.salva = function(pagamento, callback){
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
}

PagamentosDao.prototype.atualiza = function(pagamento, callback){
    this._connection.query('UPDATE pagamentos SET status=? where id=?', [pagamento.status, pagamento.id], callback);
}

PagamentosDao.prototype.lista = function(callback){
    this._connection.query('select * from pagamentos', callback);
}

PagamentosDao.prototype.buscaPorId = function(id, callback){
    this._connection.query('select * from pagamentos id = ?', id, callback);
}

module.exports = function(){
    return PagamentosDao;
};