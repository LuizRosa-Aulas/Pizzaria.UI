# 🍕 Pizzaria.UI

Interface web para consumo da API da Pizzaria, permitindo visualizar, cadastrar e gerenciar pizzas, usuários e vendas de forma simples e intuitiva.

Desenvolvida utilizando **HTML**, **CSS**, **Bootstrap** e **jQuery**, com foco educacional para demonstrar o consumo de APIs REST no frontend.

---

## 🌐 Demo Online

A aplicação está disponível para testes em:

👉 http://pizzaria.viniciusguedes.cloud

---

## 🔗 Repositórios

- 🔙 Backend (API):  
👉 https://github.com/LuizRosa-Aulas/Pizzaria.API  

- 🎨 Frontend (UI):  
👉 https://github.com/LuizRosa-Aulas/Pizzaria.UI  

---

## 📋 Sobre o Projeto

Este projeto representa o frontend da aplicação de pizzaria, permitindo:

- Listar pizzas cadastradas  
- Cadastrar novas pizzas  
- Listar usuários  
- Realizar vendas  
- Consumir endpoints REST via AJAX  

Ideal para aprendizado de:

- Consumo de API com **jQuery (AJAX)**  
- Manipulação de DOM  
- Integração frontend + backend  
- Estruturação de interfaces web simples  

---

## 🏗️ Estrutura do Projeto

```bash
Pizzaria.UI/
│
├── css/                # Estilos customizados
│   └── styles.css
│
├── js/                 # Scripts JS (requisições AJAX)
│   ├── pizzas.js
│   ├── usuarios.js
│   └── vendas.js
│
├── pages/              # Páginas da aplicação
│   ├── pizzas.html
│   ├── usuarios.html
│   └── vendas.html
│
├── index.html          # Página inicial
└── README.md
```

---

## 🚀 Tecnologias Utilizadas

- HTML5  
- CSS3  
- Bootstrap 5  
- jQuery  
- AJAX  

---

## 🔧 Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/LuizRosa-Aulas/Pizzaria.UI.git
```

---

### 2. Abrir o projeto

Basta abrir o arquivo:

```bash
index.html
```

em qualquer navegador.

---

## 🔌 Exemplo de Consumo da API

```javascript
$.ajax({
    url: "http://aula-pizzaria-api.viniciusguedes.cloud/api/pizzas",
    method: "GET",
    success: function (data) {
        console.log(data);
    },
    error: function (err) {
        console.error(err);
    }
});
```

---

## 📌 Funcionalidades

- ✅ Listagem de pizzas  
- ✅ Cadastro de pizzas  
- ✅ Listagem de usuários  
- ✅ Registro de vendas  
- ✅ Integração com API REST  

---

## 🎯 Objetivo Educacional

Este projeto foi desenvolvido para:

- Ensinar consumo de APIs no frontend  
- Demonstrar uso de **jQuery com AJAX**  
- Trabalhar manipulação de DOM  
- Integrar com backend em .NET  
