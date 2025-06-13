const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const router = require('./Routers/index');
const conexao = require('./Database/conexao');
const tabelas = require('./Database/criar_tabelas');
const dados = require('./Database/migrar_dados');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(cors({origin: '*'}));

tabelas.init(conexao);
dados.init(conexao);

router(app, express );

app.listen(port, (error) => {
  if(error) {
    console.error(`Error starting server: ${error}`);
  } else {
    console.log(`Server is running on http://localhost:${port}`);   
  }});