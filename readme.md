## Configurando Mongo DB
Para ter um banco de dados MongoDB rodando em um servidor local, é necessário executar os seguintes comandos (um por vez):
```bash 
$ docker-compose up # Subindo os containers
$ docker container exec -it mongodb bash # Entrando no container mongodb
$ mongo --port 27017 -u root -p secret # Conectando no banco de dados
> use test  # Selecionando o banco de dados
> db.createUser({ user: "admin", pwd: "secret", roles: [{role: "readWrite", db: "test"}] }) # Criando usuário admin
```
Após o processo você terá um banco MongoDB rodando em seu computador no endereço: ``mongodb://admin:secret@127.0.0.1:27017/test``