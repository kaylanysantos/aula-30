const express = require("express");
const fsp = require("fs/promises");
const path = require("path");


const servidor = express();

servidor.use(express.json());

servidor.get("/dado/:nome", async (_req, res) => {
  try {
    const caminhoArquivo=path.join(__dirname,"textos", nome + ".txt");
    const arquivos = await fsp.readFile(caminhoArquivo);
    
    const arquivosTexto = arquivos.filter(arquivo => arquivo.endsWith(".txt"));

   res.status(200).json({ arquivodisponiveis: caminhoArquivo });
  } catch (erro) {
    if (erro.code === "ENOENT") {
      // Arquivo não encontrado
      res.status(404).json({ erro: "Arquivo não encontrado" });
    } else if (erro.code === "EACCES") {
      // Permissão negada
      res.status(403).json({ erro: "Permissão negada ao tentar acessar o arquivo" });
    } else {
      // Outros erros
      console.error("Erro ao ler o arquivo:", erro.message);
      res
        .status(500)
        .json({ erro: "Erro ao ler o arquivo", detalhes: erro.message });
    }
  }
});

servidor.put("/dados", async (req, res) => {
  try {
    const { nome } = req.query
    if (!nome) {
      return res
      .status(404)
      .json({erro: "Conteúdo inválido: deve ser uma string não vazia."})
    }
    let { conteudo } = req.body;
    if (!conteudo || typeof conteudo !== "string" || conteudo.trim() === "") {
      return res.status(400).json({ erro: "Conteúdo inválido: deve ser uma string não vazia." });
    }

    let dadosExistentes;
    try {
      dadosExistentes = await fsp.readFile(caminhoArquivo, "utf8");
    } catch (erro) {
      if (erro.code === "ENOENT") {
        // Arquivo não existe; cria o arquivo
        await fsp.writeFile(caminhoArquivo, conteudo);
        return res.status(201).json({ mensagem: "Arquivo criado com sucesso." });
      } else {
        throw erro;
      }
    }

    // Adiciona o novo conteúdo ao final do arquivo
    await fsp.writeFile(caminhoArquivo, `${dadosExistentes}\n${conteudo}`);

    res.json({ mensagem: "Conteúdo adicionado com sucesso." });
  } catch (erro) {
    if (erro.code === "EACCES") {
      // Permissão negada
      res.status(403).json({ erro: "Permissão negada ao tentar escrever no arquivo" });
    } else {
      console.error("Erro ao escrever no arquivo:", erro.message);
      res
        .status(500)
        .json({ erro: "Erro ao processar o arquivo", detalhes: erro.message });
    }
  }
});

servidor.post("dados", (req, res) =>{
 // nome do arquivo = body request

 //conteudo = body resquest

 // encontrar caminho da pasta aondeo conteudo vai sercriado

 //nome do arquivo = criar o arquivo() fsp()

 //nome do arquivo = insrir o conteudo

 //retorna a reposta 
})

servidor.listen(3000, () => console.log("Servidor está rodando... 🔥"));