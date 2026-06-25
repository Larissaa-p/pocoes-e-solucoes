# Poções e Soluções

Nesta atividade, foi desenvolvido um website para uma loja fictícia de poções. O site permite visualizar os produts disponíveis e adicioná-los ao carrinho, além de 
possuir uma página de administrador para cadastrar, listar e remover produtos.

## Instruções de Instalação
Para rodar o projeto localmente, é necessário instalar o SQLite. Rode o seguinte comando no terminal:

 ```npm install sequelize sqlite3```

 Depois, no diretório do projeto, rode o comando:

 ```node server.js```

 ## Contas de Teste e Níveis de Acesso

O sistema possui uma tabela de usuários integrada ao banco de dados com níveis de acesso distintos. Para testar as funcionalidades da loja e do painel administrativo, utilize as credenciais abaixo:

### Administrador
Dá acesso ao painel de gerenciamento (`admin.html`), permitindo cadastrar novas poções, editar preços e remover itens do estoque.
* **URL de Acesso:** `http://localhost:3000/login.html`
* **Usuário:** `admin`
* **Senha:** `pocao123`
