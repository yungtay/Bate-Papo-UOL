const siderBar = document.querySelector(".sidebar");
const cortina = document.querySelector(".cortina");
let penultimaMensagem = "";
let destinatario;
let tipoMensagem;
let presenca;

function mandaNome(url = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants" ){
    const nome = document.querySelector(".telaEntrada input").value;
    const promessa = axios.post(url, {name:nome});
    return promessa;
}

function entrarNaSala(promessa){
    promessa.then(autorizarAcesso)
    promessa.catch(negarAcesso)
}

function autorizarAcesso(resposta){
    const telaNome= document.querySelector(".telaEntrada")
    telaNome.classList.add("escondido")
    presente()
    buscarParticipantes()
    setInterval(requisitarConversas, 3000)
}

function negarAcesso(erro){
    alert(`O erro ${erro.response.status} ocorreu, por favor escolha outro nome`)
}

function presente(){
    presenca = setInterval(mandaNome, 5000, "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status");
}

function requisitarConversas(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promessa.then(popularMensagens)
    promessa.catch(tratarErro)
}

function popularMensagens(reposta){
    const mensagens = document.querySelector(".conteudo")
    const resposta = reposta.data
    typeof(resposta)
    mensagens.innerHTML = ""
    Object.entries(resposta).forEach(([key]) => {
        if(resposta[key].type === "status"){
            mensagens.innerHTML += `<div class="caixa-texto ${resposta[key].type}"><span><span class="tempo">(${resposta[key].time})</span><strong>${resposta[key].from}</strong> ${resposta[key].text}</span></div>`
        } else if(resposta[key].type === "message") {
            mensagens.innerHTML += `<div class="caixa-texto ${resposta[key].type}"><span><span class="tempo">(${resposta[key].time})</span><strong>${resposta[key].from}</strong> para <strong>${resposta[key].to}:</strong> ${resposta[key].text}</span>
            </div>`
        } else if(resposta[key].type === "private_message" && resposta[key].to === document.querySelector(".telaEntrada input").value){
            mensagens.innerHTML += `<div class="caixa-texto ${resposta[key].type}"><span><span class="tempo">(${resposta[key].time})</span><strong>${resposta[key].from}</strong> reservadamente para <strong>${resposta[key].to}:</strong> ${resposta[key].text}</span>
            </div>`
        }
    });
    mensagemFinal()

}

function mensagemFinal(){
    const ultimaMensagem = document.querySelector('.caixa-texto:last-child');
    ultimaMensagem.scrollIntoView()
}

function tratarErro(resposta){
    console.log(resposta.response.status)
}









