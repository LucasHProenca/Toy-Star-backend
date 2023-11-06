<img align="center" src="https://github.com/LucasHProenca/Labecommerce-back-end/assets/106993403/afe9406a-8a0c-4c9d-b46b-9a322abacfb0" width="100%;" alt="" />

---

<p align="center">
 <a href="#-sobre-o-projeto">Sobre</a> •
 <a href="#-funcionalidades">Funcionalidades</a> •
 <a href="#-como-executar-a-api">Como executar</a> • 
 <a href="#-testes-automatizados">Testes automatizados</a> • 
 <a href="#-tecnologias">Tecnologias</a> • 
 <a href="#-autor">Autor</a> • 
</p>

## 💻 Sobre o projeto

🛸 Toy Star - Essa API foi desenvolvida como um facilitador para cadastrar produtos e clientes para a loja Toy Star, que é um e-commerce personalizado de brinquedos da franquia Star Wars, com isso, oferecemos produtos em todas as faixas de preço e gosto, visando atender desde o pequeno fã até o colecionador fanático.

Porém, não é restrita a apenas o uso da nossa loja, uma vez que é possível cadastrar seus próprios produtos, permitir que clientes criem suas contas, assim como organizar e cancelar pedidos de quaisquer seguimentos.

Este projeto possui inúmeras funcionalidades, as quais detalharemos mais adiante.

---

## ⚙️ Funcionalidades

- [x] Empresas ou empreendedores individuais podem cadastrar seus produtos e compradores na API utilizando todas as requisições que temos a oferecer:
  - [x] getUsers
  - [x] signUp
  - [x] login
  - [x] editUser
  - [x] deleteUser
  - [x] getProducts
  - [x] getProductsLike
  - [x] createProduct  
  - [x] editProduct
  - [x] likeProduct
  - [x] deleteProduct
  - [x] getPurchaseById
  - [x] createPurchase
  - [x] deletePurchase

---

## 🚀 Como executar a api

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Postman](https://www.postman.com/downloads/), é possível também utilizar a API pela versão web do Postman, no entanto, utilizaremos a versão para desktop para minimizar quaisquer chances de problemas.
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

#### 🎲 Rodando a API

```bash

# Clone este repositório
$ git clone link-do-repositório-git

# Acesse a pasta do projeto no terminal/cmd
$ cd Toy-Start-backend

# Para abrir o vsCode
$ code .

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta:3003 

```

#### ATENÇÃO!

Caso seja a primeira vez que você está instalando essa extensão, talvez seja necessário instalar algumas dependências para o SQLite rodar em sua máquina. A própria extensão irá te avisar se for o caso e você precisará clicar no botão para instalá-las.
Se não aparecer nenhum aviso ou deu tudo certo, pode prosseguir!

##### Criando a conexão

1. Dê um nome para a conexão
2. Selecione o arquivo: **labeddit.db**
3. Salve a conexão

![image](https://github.com/LucasHProenca/Labook/assets/106993403/b0be9d2a-a2c3-4ede-9ba8-6f437ef6cf76)

#### Verificando se deu certo

Caso tenha dado tudo certo, irá aparecer no menu do banco de dados o nome de sua conexão junto com algumas informações.

![image](https://github.com/LucasHProenca/Labook/assets/106993403/f76ad74d-190a-4292-825d-40833f919b62)

#### Inserindo as tabelas no banco de dados

Para criar as tabelas, basta clicar em "execute" em cada uma após montar esse código abaixo:

```
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL
);

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
     ON UPDATE CASCADE
     ON DELETE CASCADE
);

CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE likes_dislikesProducts(
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

```

### 💾 Configurando o .env

Lembre-se de configurar o arquivo .env como está feito no exemplo em .env.example

```
PORT=3003

DB_FILE_PATH=./src/database/nome-do-arquivo.db

JWT_KEY=minha-senha-segura-bananinha
JWT_EXPIRES_IN=7d

BCRYPT_COST=12

```

Feito isso acesse a documentação da [API](https://documenter.getpostman.com/view/27682612/2s9YXfcPWr) e clique em "Run in Postman" localizado no canto superior direito para abrir dentro do app.

### Requisições

#### ATENÇÃO! Todos os exemplos são fictícios, pois não haveria sentido em disponibilizarmos os dados de nossos clientes, portanto use essa API para construir a sua própria loja online.

#### getUsers
A requisição getUsers tem a funcionalidade de mostrar a lista de usuários cadastrados no banco de dados, passando um token de autorização compátivel.

![getUsersReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/b116d34d-4a6c-4a24-b8d8-b2f9b7d44224)


![getUsersRes](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/0f3c4481-7d4d-4776-bcca-97bcfe62b333)


#### signUp
A requisição signUp tem a funcionalidade de cadastrar uma nova conta, porém alguns dados precisam ser inseridos no corpo da requisição, são esses:

"nickname",

"email",

"password".

Contudo, foram implementadas as seguintes restrições:

Caso o "nickname" já tenha sido cadastrado por outro usuário, não será possível concluir o cadastro;

Caso o "email" já tenha sido cadastrado por outro usuário, não será possível concluir o cadastro;

Caso o "email" não esteja com a formatação correta (@email.com), não será possível concluir o cadastro;

Caso a senha não atenda a um padrão mínimo pré-estabelecido, não será possível concluir o cadastro, no caso do Labeddit, é obrigatório que "password" tenha entre 8 e 12 caracteres, com letras maiúsculas e minúsculas, e no mínimo um caractere especial.

Todos os usuários cadastrados vem com a "role" como "NORMAL" impedindo seu acesso a recursos que são reservados à administradores.

Como resposta da requisição, o usuário recebe um token de autorização, lembre-se de guardá-lo pois será necessário para acessar as outras funcionalidades do sistema.

![signUpReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/17bc0fc7-5c18-47e5-9e64-a59cab75d373)


![signUpRes](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/b237977a-b552-40ca-957e-0b3d04b6032b)


#### login
A requisição login tem a funcionalidade de entrar na sua respectiva conta, porém alguns dados precisam ser inseridos no corpo da requisição, são esses:

"email",

"password".

Contudo, foram implementadas as seguintes restrições:

Caso o "email" e o "password" não correspondam com os utilizados no endpoint "signUp", não será possível acessar a conta.

Como resposta da requisição, o usuário recebe um token de autorização, lembre-se de guardá-lo pois será necessário para acessar as outras funcionalidades do sistema.

![loginReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/a2909252-d8e4-4e95-b225-1733e9979d0e)


![loginRes](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/373f5445-3804-4e34-9fe1-bcd3765c4b29)


##### editUser
A requisição editUser permite ao usuário editar suas informações pessoais como "nickname", "email" e "password", no entanto, algumas restrições foram implementadas para o uso dessa funcionalidade, são essas:

Apenas o dono da conta pode editar suas informações;

Será necessário passar o token gerado no login para comprovar que a pessoa é realmente quem ela diz ser;

Verificar qual é seu id na requisição getUsers;

Com o id em mãos, basta inseri-lo no campo "Path Variables" na aba "Params" junto ao token no campo "Authorization" na aba "Headers", e torna-se possível editar as informações de cadastro citadas acima.

![editUReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/bea92a62-9747-4aea-93bf-efa2faea23ff)


#### deleteUser
A requisição deleteUser permite ao usuário excluir sua conta, no entanto, algumas restrições foram implementadas para o uso dessa funcionalidade, são essas:

Apenas o dono da conta ou um administrador podem apagar um usuário;

Será necessário passar o token gerado no login para comprovar que a pessoa é realmente quem ela diz ser;

Caso o usuário queira apagar sua própria conta, será necessário verificar qual é seu id na requisição getUsers;

Com o id em mãos, basta inseri-lo no campo "Path Variables" na aba "Params" junto ao token no campo "Authorization" na aba "Headers", e torna-se possível apagar o cadastro do usuário.

![delUReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/a19c88c0-4254-4c7a-972a-01f806f5facb)


#### getProducts
A requisição getProducts permite ao usuário visualizar todos os produtos cadastrados no banco de dados, passando um token de autorização compátivel.

![getProdReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/e70a8e81-6cb9-4a4a-91b9-1b599bd010f9)


![getProdRes](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/606c9b47-c08d-473b-86c9-3971bb67a467)


#### getProductLikes
A requisição getProductLikes tem a função de retornar se o usuário favoritou aquele produto, caso tenha ocorrido, para isso é necessário:

Verificar qual é o id do produto na requisição getProducts;

Com o id em mãos, basta inseri-lo no campo "Path Variables" na aba "Params" junto ao token no campo "Authorization" na aba "Headers", e torna-se possível visualizar se houve interação.

![getProductLikesReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/a2c0fbc1-e5f9-488f-8254-21d52b6b755a)


![getProductLikesRes](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/9668bfdb-3bad-49e8-9a12-86d0777594e3)


#### createProduct
A requisição createProduct permite ao usuário criar um novo produto, porém alguns dados precisam ser inseridos no corpo da requisição, são esses:

"name",

"price",

"description",

"imageUrl".

Entretanto é necessário também informar um token válido no campo "Authorization" na aba "Headers".

![createProdReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/15f944ce-587d-48d0-a669-c0c53bbf500c)


#### editProduct
A requisição editProduct permite ao usuário editar todas as informações do seu produto, no entanto, algumas restrições foram implementadas para o uso dessa funcionalidade, são essas:

Apenas o dono do produto pode editá-lo;

Será necessário passar o token gerado no login para comprovar que a pessoa é realmente quem ela diz ser;

Também é requerido o "id" específico do produto, para ser inserido no campo "Path Variables" na aba "Params" junto ao token no campo "Authorization" na aba "Headers", e torna-se possível editar a seu produto.

![editProdReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/7233faa8-a606-4837-b025-7c5d220549aa)


#### likeProduct
A requisição likeProduct tem uma funcionalidade, permitem ao usuário favoritar o produto, no entanto, algumas restrições foram implementadas para o uso dessa funcionalidade, são essas:

Caso dê um like em um produto que já tenha dado like, o like é desfeito.

Será necessário passar o token gerado no login para comprovar que a pessoa é realmente quem ela diz ser;

Também é requerido o "id" específico do produto, para ser inserido no campo "Path Variables" na aba "Params" junto ao token no campo "Authorization" na aba "Headers", e torna-se possível favoritar o produto.

![likeProductReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/068830ea-33cb-47fa-8362-a1a4e799afaf)


#### deleteProduct
A requisição deleteProduct permite ao usuário excluir seu produto, no entanto, algumas restrições foram implementadas para o uso dessa funcionalidade, são essas:

Apenas o dono da produto ou um administrador podem apagá-lo;

Será necessário passar o token gerado no login para comprovar que a pessoa é realmente quem ela diz ser;

Também é requerido o "id" específico do produto, para ser inserido no campo "Path Variables" na aba "Params" junto ao token no campo "Authorization" na aba "Headers", e torna-se possível deletar a seu produto.

![delProdReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/435a019c-4718-41a8-9a36-3c1fea05be52)


#### getPurchaseById
A requisição getPurchaseById tem apenas a funcionalidade de verificar quais itens foram comprados em certo pedido, onde é necessário enviar um "id" do pedido junto ao caminho da requisição, contudo, caso o mesmo não esteja dentro do banco de dados, nada acontecerá e o usuário será informado da inconformidade.

![getPurReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/da0f25fc-d734-4d6e-bbcd-58d53976cb6e)


![getPurRes](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/32454d3c-6f21-413c-9ea3-5aa143b2cf99)


#### createPurchase
A requisição createPurchase tem apenas a funcionalidade de criar um novo pedido, porém alguns dados precisam ser inseridos no corpo da requisição, são esses:

"products" [

{

"id",

"quantity".

}

]

Entretanto é necessário também informar um token válido no campo "Authorization" na aba "Headers".

![createPurReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/98ac278f-5f57-4cbf-af4b-92fb0febbb5b)


#### deletePurchase
A requisição deletePurchase tem apenas a funcionalidade de cancelar um pedido, onde é necessário enviar um "id" de um pedido junto ao caminho da requisição, contudo, caso o mesmo não esteja dentro do banco de dados, a deleção não será realizada e o usuário será informado da inconformidade.

![delPurReq](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/11f1a932-8d87-44ce-82d1-eaa4a475da87)


---

## ✋ Testes automatizados

Testar código é importantíssimo, pois quando o testamos estamos garantindo seu funcionamento.

Por exemplo:

- quando usamos o Postman para consumir um endpoint de nossa API
- quando acessamos nosso app React e verificamos o funcionamento de um botão
- quando damos console.log em uma parte do código para checar o dado

Esses cenários demonstram o uso de testes manuais. Eles são rápidos de serem implementados, mas não carregam um processo automatizado de repetição, então sempre que for necessário testar novamente o mesmo código é preciso recriar todo o processo do zero pela pessoa.

E se fosse possível criar um processo automatizado que testa a aplicação? É aqui que entram os testes automatizados!

Nesse projeto o foco foi automatizar os testes da camada business, ao menos 70% dela, mas é claro, priorizando os pontos mais importantes, no entanto, como o código backend foi executado de forma clara e limpa, foi possível atingir a marca de 97,76% dos testes concluídos.

![srcBusinessTestes](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/503fe9a4-5266-428e-9efb-295abf098efa)

![testesBusiness](https://github.com/LucasHProenca/Toy-Star-backend/assets/106993403/99b0e4a0-3ee7-4fbd-8abc-2c32040b2c77)


E quanto aos 2,3% restantes? Vendo que essa não era a prioridade do projeto, foi decidido dar mais atenção a melhoria de outras funcionalidades.

---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

#### **API** ([NodeJS](https://nodejs.org/en/)  +  [TypeScript](https://www.typescriptlang.org/))

-   **[APIs & Express](https://expressjs.com/pt-br/)**
-   **[CORS](https://expressjs.com/en/resources/middleware/cors.html)**
-   **[SQLite](https://github.com/mapbox/node-sqlite3)**
-   **[Knex](https://knexjs.org/guide/query-builder.html)**
-   **[ts-node](https://github.com/TypeStrong/ts-node)**
-   **[POO](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming)**
-   **[Arquitetura em camadas](https://guia.dev/pt/pillars/software-architecture/layers.html)**
-   **[Geração de UUID](https://medium.com/trainingcenter/o-que-%C3%A9-uuid-porque-us%C3%A1-lo-ad7a66644a2b)**
-   **[Geração de hashes](https://www.voitto.com.br/blog/artigo/o-que-e-hash-e-como-funciona)**
-   **[Autenticação e autorização](https://auth0.com/blog/pt-complete-guide-to-nodejs-express-user-authentication/)**
-   **[Roteamento](https://dev.to/aryclenio/configurando-rotas-no-nodejs-com-typescript-la1)**
-   **[Postman](https://www.postman.com/)**
-   **[Testes Unitários](https://www.devmedia.com.br/teste-unitario-com-jest/41234)**
-   **[Jest](https://jestjs.io/pt-BR/)**

---

## 🦸 Autor

 <img style="border-radius: 50%;"  src="https://github.com/LucasHProenca/Labecommerce-back-end/assets/106993403/9abf8ee7-9527-42f8-9151-04ccd3db2d97" width="100px;" alt="" />
 <br />
 <sub><b>Lucas Henrique Proença</b></sub>
 <br />

[![Linkedin Badge](https://img.shields.io/badge/-Lucas-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/lucas-proen%C3%A7a-512650106/)](https://www.linkedin.com/in/lucas-proen%C3%A7a-512650106/) 
