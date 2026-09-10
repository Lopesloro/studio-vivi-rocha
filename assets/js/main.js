/* Studio Vivi Rocha — comportamento
   Regra de ouro deste arquivo: nada aqui pode ser pré-requisito para o
   conteúdo aparecer. O tráfego vem do link da bio do Instagram, ou seja,
   webview — onde JS falha com mais frequência do que se imagina. */
(function () {
  'use strict';

  /* ---- 1. Reveal --------------------------------------------------------
     A classe entra AQUI, não no HTML. Sem JS, sem webview, sem
     IntersectionObserver: o CSS de opacity:0 nunca chega a existir e a
     página aparece inteira. Já custou 13 páginas em branco nesta casa. */
  var suportaObserver = 'IntersectionObserver' in window;
  var reduzMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (suportaObserver && !reduzMovimento) {
    document.documentElement.classList.add('js-reveal');

    var observador = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        if (entradas[i].isIntersecting) {
          entradas[i].target.classList.add('dentro');
          observador.unobserve(entradas[i].target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    var alvos = document.querySelectorAll('.rv');
    for (var j = 0; j < alvos.length; j++) observador.observe(alvos[j]);

    /* rede de segurança: se em 2,5s algo continuar escondido, mostra tudo */
    window.setTimeout(function () {
      var presos = document.querySelectorAll('.rv:not(.dentro)');
      for (var k = 0; k < presos.length; k++) {
        var r = presos[k].getBoundingClientRect();
        if (r.top < window.innerHeight) presos[k].classList.add('dentro');
      }
    }, 2500);
  }

  /* ---- 2. Header: transparente sobre o hero, sólido no scroll ---------- */
  var cabecalho = document.getElementById('cabecalho');
  var barra = document.getElementById('barra-acao');
  var temHero = document.body.classList.contains('tem-hero');

  function aoRolar() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (cabecalho) cabecalho.classList.toggle('solido', y > 40);
    /* a barra de ação só aparece depois que o hero saiu — no hero o CTA
       já está na tela, e duas chamadas iguais competem entre si */
    if (barra) barra.classList.toggle('visivel', temHero ? y > window.innerHeight * 0.55 : y > 120);
  }

  /* Throttle por tempo, NÃO por requestAnimationFrame: rAF não roda em aba
     oculta nem em webview em segundo plano, e ali o cabeçalho ficaria
     transparente e a barra de ação nunca apareceria. Já custou caro nesta
     casa com um número animado que congelava. 100ms é imperceptível. */
  var ultimo = 0;
  window.addEventListener('scroll', function () {
    var agora = Date.now();
    if (agora - ultimo < 100) return;
    ultimo = agora;
    aoRolar();
  }, { passive: true });
  window.addEventListener('resize', aoRolar, { passive: true });
  document.addEventListener('visibilitychange', aoRolar);
  aoRolar();

  /* ---- 3. Menu mobile --------------------------------------------------- */
  var botao = document.getElementById('hamburguer');
  var painel = document.getElementById('painel');

  if (botao && painel) {
    painel.hidden = false;

    var alternar = function (abrir) {
      botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
      painel.classList.toggle('aberto', abrir);
      document.body.style.overflow = abrir ? 'hidden' : '';
      if (abrir && cabecalho) cabecalho.classList.add('solido');
      else aoRolar();
    };

    botao.addEventListener('click', function () {
      alternar(botao.getAttribute('aria-expanded') !== 'true');
    });

    painel.addEventListener('click', function (e) {
      if (e.target.closest('a')) alternar(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && painel.classList.contains('aberto')) {
        alternar(false);
        botao.focus();
      }
    });
  }

  /* ---- 4. Antes e depois ------------------------------------------------
     Arrastar, tocar e teclado (as setas ← →, via input range invisível). */
  var comparadores = document.querySelectorAll('[data-antes-depois]');
  for (var c = 0; c < comparadores.length; c++) {
    (function (caixa) {
      var entrada = caixa.querySelector('.antes-depois__input');
      if (!entrada) return;

      var aplicar = function (v) { caixa.style.setProperty('--corte', v + '%'); };
      aplicar(entrada.value);
      entrada.addEventListener('input', function () { aplicar(entrada.value); });

      var arrastando = false;
      var mover = function (clienteX) {
        var r = caixa.getBoundingClientRect();
        var pct = ((clienteX - r.left) / r.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        entrada.value = pct;
        aplicar(pct);
      };

      caixa.addEventListener('pointerdown', function (e) {
        arrastando = true;
        caixa.setPointerCapture(e.pointerId);
        mover(e.clientX);
      });
      caixa.addEventListener('pointermove', function (e) {
        if (arrastando) mover(e.clientX);
      });
      caixa.addEventListener('pointerup', function () { arrastando = false; });
      caixa.addEventListener('pointercancel', function () { arrastando = false; });
    })(comparadores[c]);
  }

  /* ---- 5. Ano do rodapé -------------------------------------------------- */
  var anos = document.querySelectorAll('[data-ano]');
  for (var a = 0; a < anos.length; a++) anos[a].textContent = new Date().getFullYear();
})();
