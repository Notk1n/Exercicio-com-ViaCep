const form = document.getElementById("formCadastro");
const campoCep = document.getElementById("cep");
const mensagem = document.getElementById("mensagem");
const CHAVE = "dadosCadastro";

// Preenche os campos do formulário 
function preencherFormulario(dados) {
  for (const [campo, valor] of Object.entries(dados)) {
    const elemento = document.getElementById(campo);
    if (elemento) elemento.value = valor;
  }
}

// Salva todos os campos (que têm "name") no localStorage
function salvarDados() {
  const dados = Object.fromEntries(new FormData(form));
  localStorage.setItem(CHAVE, JSON.stringify(dados));
}

// Lê o localStorage e restaura o formulário
function restaurarDados() {
  const texto = localStorage.getItem(CHAVE);
  if (!texto) return;

  try {
    preencherFormulario(JSON.parse(texto));
  } catch (erro) {
    localStorage.removeItem(CHAVE);
  }
}

// Busca o endereço no ViaCEP
async function buscarEndereco() {
  const cep = campoCep.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    mensagem.textContent = "Digite um CEP com 8 dígitos.";
    return;
  }

  mensagem.textContent = "Buscando...";

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      mensagem.textContent = "CEP não encontrado.";
      preencherFormulario({ rua: "", bairro: "", cidade: "", uf: "" });
    } else {
      mensagem.textContent = "";
      preencherFormulario({
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        uf: dados.uf
      });
    }
  } catch (erro) {
    mensagem.textContent = "Erro ao buscar o CEP. Tente novamente.";
  }
  
  salvarDados();
}

campoCep.addEventListener("blur", buscarEndereco);
form.addEventListener("input", salvarDados);
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  salvarDados();
  mensagem.textContent = "Cadastro salvo com sucesso!";
});

restaurarDados();