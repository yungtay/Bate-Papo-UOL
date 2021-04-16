const siderBar = document.querySelector(".sidebar");
const cortina = document.querySelector(".cortina");
const telaNome= document.querySelector(".telaEntrada")
const mensagens = document.querySelector(".conteudo")
const nome = document.querySelector(".telaEntrada input")
const msg = document.querySelector(".fundo textarea")
const contatos = document.querySelector(".escolha-contato")
const enviar = document.querySelector(".fundo ion-icon")

let destinatario = "Todos";
let tipoMensagem = "message";

function mandaNome(url = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants" ){
    const promessa = axios.post(url, {name:nome.value});
    return promessa;
}

function entrarNaSala(promessa){
    promessa.then(autorizarAcesso)
    promessa.catch(negarAcesso)
}

function negarAcesso(erro){
    alert(`Nome sendo utilizado, por favor escolha outro`)
}

function autorizarAcesso(resposta){
    telaNome.classList.add("escondido")
    presente()
    requisitarConversas()
    setInterval(requisitarConversas, 3000)
    buscarParticipantes()
    setInterval(buscarParticipantes, 10000)
}

function presente(){
    setInterval(mandaNome, 5000, "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status");
}

function requisitarConversas(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promessa.then(popularMensagens)
    promessa.catch(tratarErro)
}

function popularMensagens(resposta){
    const dados = resposta.data
    mensagens.innerHTML = ""
    for(key in dados){
        if(dados[key].type === "status"){
            mensagens.innerHTML += `<div class="caixa-texto ${dados[key].type}"><span><span class="tempo">(${dados[key].time})</span><strong>${dados[key].from}</strong> ${dados[key].text}</span></div>`
        } else if(dados[key].type === "message") {
            mensagens.innerHTML += `<div class="caixa-texto ${dados[key].type}"><span><span class="tempo">(${dados[key].time})</span><strong>${dados[key].from}</strong> para <strong>${dados[key].to}:</strong> ${dados[key].text}</span>
            </div>`
        } else if(dados[key].type === "private_message" && dados[key].to === document.querySelector(".telaEntrada input").value){
            mensagens.innerHTML += `<div class="caixa-texto ${dados[key].type}"><span><span class="tempo">(${dados[key].time})</span><strong>${dados[key].from}</strong> reservadamente para <strong>${dados[key].to}:</strong> ${dados[key].text}</span>
            </div>`
        }
    };

    const ultimaMensagem = document.querySelector('.caixa-texto:last-child');
    ultimaMensagem.scrollIntoView()
}

function tratarErro(resposta){
    alert(`O erro ${resposta.response.status} ocorreu, não foi possível obter as mensagens, falar com o Pedrão`)
    window.location.reload()
}

function mandarMensagem(){
    if(msg.value !== ""){
        let dados = {
            from: nome.value,
            to: destinatario,
            text: msg.value,
            type: tipoMensagem
        }
        const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", dados)
        promessa.then(requisitarConversas)
        promessa.catch(foiDesconectado)
        msg.value = ""
    }
}

function foiDesconectado(resposta){
    alert("Você foi desconectado por inatividade")
    window.location.reload()
}

function buscarParticipantes(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promessa.then(popularSiderbar)
}

function popularSiderbar(resposta){
    let destinatarioPresente = false;
    const dados = resposta.data
    contatos.innerHTML = `
    <div class="contato-sidebar">
        <ion-icon name="people"></ion-icon>
        <div class="contato-indiv" onclick="selecionarContato(this)">
            <span>Todos</span>
            <ion-icon name="checkmark-sharp" id="todosIon"></ion-icon>
        </div>
    </div>`

    for(key in dados) {

        if(destinatario === dados[key].name){
            contatos.innerHTML +=
            `<div class="contato-sidebar">
            <ion-icon name="people"></ion-icon>
            <div class="contato-indiv" onclick="selecionarContato(this)">
                <span>${dados[key].name}</span>
                <ion-icon name="checkmark-sharp"></ion-icon>
            </div>
            </div>`
            document.querySelector("#todosIon").classList.add("escondido")
            destinatarioPresente = true;


        } else{
            contatos.innerHTML +=
            `<div class="contato-sidebar" >
            <ion-icon name="people"></ion-icon>
            <div class="contato-indiv" onclick="selecionarContato(this)">
                <span>${dados[key].name}</span>
                <ion-icon name="checkmark-sharp" class="escondido"></ion-icon>
            </div>
            </div>`
        }
    };  
    if(destinatarioPresente === false && tipoMensagem === "private_message"){
        destinatario = "Todos"
        mensagemPrivada()
    }   else if (destinatarioPresente === false) {
        destinatario = "Todos"
    }
}

function abrirMenu(){
    siderBar.classList.remove("escondido")
    cortina.classList.remove("escondido")
}

function selecionarContato(el){
    const classe= el.className
    destinatario = el.firstElementChild.innerHTML
    if(tipoMensagem === "private_message"){
        mensagemPrivada()
    }
    const contatoSelecionado = document.querySelectorAll(`.contato-indiv > ion-icon`)
    contatoSelecionado.forEach(element => {
    element.classList.add("escondido")
    });
    el.lastElementChild.classList.remove("escondido")
}

function selecionarVisibilidade(el){
    if(el.firstElementChild.innerHTML === "Público"){
        tipoMensagem = "message"
        mensagemPublica()
    } else{
        tipoMensagem = "private_message"
        mensagemPrivada()
    }
    const visibilidadeSelecionada = document.querySelectorAll(`.visibilidade-indiv > ion-icon`)
    visibilidadeSelecionada.forEach(element => {
    element.classList.add("escondido")
    });
    el.lastElementChild.classList.remove("escondido")
}

function telaInicial(){
    siderBar.classList.add("escondido")
    cortina.classList.add("escondido")
}

function mensagemPublica(){
    msg.setAttribute("placeholder", 
    "Escreva aqui...")  
}

function mensagemPrivada(){
    msg.setAttribute("placeholder", 
    `Escreva aqui...
Enviando para ${destinatario} (reservadamente)`)  
}

msg.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        enviar.click();
    }
});







