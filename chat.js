(function () { 
  // ============ PARTE PARA EDITAR ============ 
  const API = "https://agente-vendas.flaviomagnoli.workers.dev/"; 
  const TITULO = "Tire suas dúvidas"; 
  const SAUDACAO = "Olá! Como posso te ajudar com nossos serviços?"; 
  
  // Cada texto precisa contrastar bem com o fundo atrás dele 
  const CORES = { 
    principal: "#1e3a8a",           // botão redondo, botão Enviar e suas mensagens 
    textoSobrePrincipal: "#ffffff", // texto em cima da cor principal 
    fundo: "#ffffff",               // janela do chat e campo de digitação 
    texto: "#1a1a1a",               // respostas e o que o visitante digita 
    balaoResposta: "#eef1f6",       // fundo das respostas da IA 
    textoApagado: "#5b6475",        // texto de exemplo no campo 
    borda: "#d6dbe4", 
  }; 
  // ============ FIM DA PARTE PARA EDITAR ============ 
  
  const historico = []; 
  const C = CORES; 
  
  const css = document.createElement("style"); 
  css.textContent = ` 
    #cv-btn{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%; 
      border:2px solid ${C.textoSobrePrincipal};background:${C.principal};color:${C.textoSobrePrincipal}; 
      font-size:26px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35);z-index:9999} 
    #cv-box{position:fixed;bottom:90px;right:20px;width:340px;max-width:calc(100vw - 40px); 
      height:460px;max-height:calc(100vh - 110px);background:${C.fundo};color:${C.texto}; 
      border:1px solid ${C.borda};border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.3); 
      display:none;flex-direction:column;overflow:hidden;z-index:9999; 
      font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif} 
    #cv-box.aberto{display:flex} 
    #cv-topo{background:${C.principal};color:${C.textoSobrePrincipal};padding:12px 16px;font-weight:600} 
    #cv-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px} 
    .cv-m{padding:8px 12px;border-radius:10px;max-width:85%;line-height:1.45;font-size:14px;white-space:pre-wrap} 
    .cv-user{background:${C.principal};color:${C.textoSobrePrincipal};align-self:flex-end} 
    .cv-bot{background:${C.balaoResposta};color:${C.texto};align-self:flex-start} 
    #cv-form{display:flex;border-top:1px solid ${C.borda}} 
    #cv-input{flex:1;border:none;padding:12px;font:inherit;font-size:14px;outline:none; 
      background:${C.fundo};color:${C.texto}} 
    #cv-input::placeholder{color:${C.textoApagado};opacity:1} 
    #cv-input:focus{box-shadow:inset 0 0 0 2px ${C.principal}} 
    #cv-enviar{border:none;background:${C.principal};color:${C.textoSobrePrincipal};font:inherit; 
      font-size:14px;font-weight:600;padding:0 16px;cursor:pointer} 
    #cv-enviar:disabled{opacity:.6;cursor:wait} 
    `; 
  document.head.appendChild(css); 
  
  document.body.insertAdjacentHTML("beforeend", ` 
    <button id="cv-btn" aria-label="Abrir chat">💬</button> 
    <div id="cv-box"> 
      <div id="cv-topo"></div> 
      <div id="cv-msgs"></div> 
      <form id="cv-form"> 
        <input id="cv-input" placeholder="Digite sua pergunta..." maxlength="800" autocomplete="off"> 
        <button id="cv-enviar" type="submit">Enviar</button> 
      </form> 
    </div>`); 
  
  const box = document.getElementById("cv-box"); 
  const msgs = document.getElementById("cv-msgs"); 
  const input = document.getElementById("cv-input"); 
  const btnEnviar = document.getElementById("cv-enviar"); 
  document.getElementById("cv-topo").textContent = TITULO; 
  
  function adicionar(texto, classe) { 
    const div = document.createElement("div"); 
    div.className = "cv-m " + classe; 
    div.textContent = texto; // textContent impede que alguém injete HTML 
    msgs.appendChild(div); 
    msgs.scrollTop = msgs.scrollHeight; 
    return div; 
  } 
  
  document.getElementById("cv-btn").onclick = () => { 
    box.classList.toggle("aberto"); 
    if (!msgs.children.length) adicionar(SAUDACAO, "cv-bot"); 
    input.focus(); 
  }; 
  
  document.getElementById("cv-form").onsubmit = async (e) => { 
    e.preventDefault(); 
    const texto = input.value.trim(); 
    if (!texto || btnEnviar.disabled) return; 
  
    input.value = ""; 
    btnEnviar.disabled = true; 
    adicionar(texto, "cv-user"); 
    historico.push({ role: "user", content: texto }); 
    const aguardando = adicionar("Digitando...", "cv-bot"); 
  
    try { 
      const r = await fetch(API, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ messages: historico.slice(-20) }), 
      }); 
      const dados = await r.json(); 
      if (dados.resposta) { 
        aguardando.textContent = dados.resposta; 
        historico.push({ role: "assistant", content: dados.resposta }); 
      } else { 
        aguardando.textContent = dados.erro || "Não consegui responder agora."; 
        historico.pop(); 
      } 
    } catch { 
      aguardando.textContent = "Erro de conexão. Tente novamente."; 
      historico.pop(); 
    } finally { 
      btnEnviar.disabled = false; 
      input.focus(); 
    } 
  }; 
})();
