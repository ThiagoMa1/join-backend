<h1 align="center">
   Aplicação
</h1>
<br>

<br>

## Sobre

Projeto feito utilizando NodeJs + Typescript, Express, Sequelize. Projeto dado como teste e cumprido.

<hr>

## Como rodar o projeto

1. Clone o projeto com

```sh
git clone https://github.com/ThiagoMa1/join-backend.git

```

2. Entre na pasta do projeto e instale as dependências com:

```sh
npm install
```

3. Em seguida, você deve criar seu banco de dados do mysql (ou outro se desejar) e preencher seus próprios campos no arquivo /config/config.json

Agora, você precisa criar o schema com o comando:

```sh
npx sequelize db:create
```

4. Após a configuração do banco de dados, você pode iniciar o servidor com:

```sh
npm run dev
```

## Funcionalidades

###### Criação:

Pode-se criar Cliente com ou sem Endereço com os respectivos campos(cnpj, razão, nome, telefone, endereço, logradouro, número, complemento, bairro, cidade, estado, cep).

Pode-se adicionar endereços a algum Cliente já existente, ao criar um endereço, longitude e latitude são obtidas através de uma API.

###### Leitura

Pode-se ver todos os Clientes(apenas nome e id) no caminho "/".

Pode-se ver a lista completa dos Clientes(Clientes e seus endereços) no caminho "/clientes".

Pode-se buscar por um Cliente especifico e ver suas informações e endereços no caminho "/clientes/:clienteId".

###### Alteração

Pode-se editar um cliente passando seu id no caminho "/edit-cliente/:clienteId" e os dados a serem mudados no corpo da requisição.

Pode-se editar o endereço de um cliente passando os ids(cliente, endereço) no caminho "/add-endereço/:clienteId/:endereçoId" e o que será mudado no corpo da requisição.

###### Remoção

Pode-se remover um cliente passando sua id no caminho "/delete-cliente/:clienteId".

Pode-se remover um endereço de um cliente passando os ids(cliente, endereço) no caminho "/delete-endereço/:clienteId/:endereçoId".
<br>

## Endpoints

```sh
Criação = {
	POST: "/add-cliente",
	POST: "/add-endereço/clienteId"
},
Leitura = {
	GET: "/",
	GET: "/clientes",
	GET: "/clientes/:clienteId",
},
Update = {
	POST: "/edit-cliente/:clienteId",
	POST: "/add-endereço/:clienteId/:endereçoId"
},
Remoção(Clientes + Endereço) = {
	POST: "/delete-cliente/:clienteId"
	POST: "/delete-endereço/:clienteId/:endereçoId"
}
```

## 📷Demonstração

<div style="text-align: center;">
	<video width="900" height="" controls>
		<source src="./github/video_demonstracao.mp4" type="video/mp4">
	</video>
	<br/>
	<a href="https://screenrec.com/share/10sqB9Iumj">Assista no link</a>
</div>
<br>

## Opções

Utilizei Hoppscotch para fazer as requisições, porém há outras opções como Postman, Imnsonia

<br> [![LinkedIn Badge](https://img.shields.io/badge/-Thiago_Martins-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/thiagoma/)](https://www.linkedin.com/in/thiagoma/)
