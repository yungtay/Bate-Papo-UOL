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

function mandarMensagem(){
    let dados = {
        from: document.querySelector(".telaEntrada input").value,
        to: destinatario,
        text: document.querySelector(".fundo input").value,
        type: tipoMensagem
    }
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", dados)
    console.log(dados)
    promessa.then(requisitarConversas)
    promessa.catch()
}

function buscarParticipantes(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promessa.then(popularSiderbar)
    
}

function popularSiderbar(respota){
    const resposta = respota.data
    console.log(resposta)
    const sidebar = document.querySelector(".escolha-contato")
    sidebar.innerHTML = `
    <div class="contato-sidebar" >
        <ion-icon name="people"></ion-icon>
        <div class="contato-indiv" onclick="selecionarContato(this)">
            <span>Todos</span>
            <ion-icon name="checkmark-sharp" class="escondido"></ion-icon>
        </div>
    </div>`
    Object.entries(resposta).forEach(([key]) => {
        sidebar.innerHTML +=
        `<div class="contato-sidebar" >
        <ion-icon name="people"></ion-icon>
        <div class="contato-indiv" onclick="selecionarContato(this)">
            <span>${resposta[key].name}</span>
            <ion-icon name="checkmark-sharp" class="escondido"></ion-icon>
        </div>
        </div>`
    });    
}

function abrirMenu(){
    siderBar.classList.remove("escondido")
    cortina.classList.remove("escondido")
}

function selecionarContato(el){
    const classe= el.className
    if(classe === "contato-indiv"){
        destinatario = el.firstElementChild.innerHTML
    } else if(el.firstElementChild.innerHTML === "Público"){
        tipoMensagem = "message"
    } else{
        tipoMensagem = "private_message"
    }
    let contatoSelecionado = document.querySelectorAll(`.${classe} > ion-icon`)
    contatoSelecionado.forEach(element => {
    element.classList.add("escondido")
    });
    el.lastElementChild.classList.remove("escondido")
}

function telaInicial(){
    siderBar.classList.add("escondido")
    cortina.classList.add("escondido")
}







