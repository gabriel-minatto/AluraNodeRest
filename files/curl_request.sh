curl http://localhost:8080/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d '{
    "forma_de_pagamento":"payfast",
    "valor":10,
    "moeda":"BRL",
    "descricao":"Criando um pagamento"
}'; echo 

############

curl http://localhost:8080/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @../files/pagamento.json

############

curl -X PUT http://localhost:8080/pagamentos/pagamento/27