// ==========================================================
// AFLA Sistemas – SAV | Comportamentos do site
// ==========================================================

// [PREENCHER] Número do WhatsApp com DDI e DDD, só dígitos (ex.: 55 + DDD + número).
// Troque o valor abaixo: todos os botões de WhatsApp do site usam este número.
const WHATSAPP_NUMERO = '5500000000000';

document.addEventListener('DOMContentLoaded', () => {
  // Monta os links do WhatsApp a partir do atributo data-whatsapp (mensagem pronta)
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    const mensagem = encodeURIComponent(link.dataset.whatsapp);
    link.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });

  // Menu do celular: abre e fecha
  const botaoMenu = document.querySelector('.menu-botao');
  const menu = document.getElementById('menu-principal');

  const fecharMenu = () => {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  };

  botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
  });

  // Fecha o menu ao escolher uma seção ou apertar Esc
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', fecharMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharMenu();
  });

  // Ano atual no rodapé
  document.getElementById('ano-atual').textContent = new Date().getFullYear();
});
