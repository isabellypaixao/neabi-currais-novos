/* =========================================================
   REVELAÇÃO DE BLOCOS NA ROLAGEM — todas as páginas
   Só os blocos marcados com o atributo data-revela no HTML são animados (poucos, escolhidos).
   A animação de ABERTURA de cada página é só CSS (css/movimento.css), sem JavaScript.

   Como funciona:
     a) O JavaScript marca os blocos com data-revela com a classe "revela" (CSS: invisível e 16px abaixo).
     b) Um IntersectionObserver avisa quando o bloco entra na tela; então entra a classe "visivel"
        e o CSS faz a transição (opacity + transform). Cada bloco anima uma única vez.
   Segurança:
     - Com "reduzir movimento" ativado, ou sem IntersectionObserver, nada é escondido.
     - Blocos que ficaram ACIMA da tela (pulo por âncora, rolagem rápida) são revelados na hora.
   ========================================================= */
(function () {
  "use strict";

  var ATRASO_INICIAL_MS = 1400; // espera a animação de abertura da página terminar
  var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduzirMovimento.matches || !("IntersectionObserver" in window)) return;

  var observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        var jaPassou = entrada.boundingClientRect.top < 0; // está acima da tela
        if (!entrada.isIntersecting && !jaPassou) return; // ainda abaixo: espera

        var alvo = entrada.target;
        observador.unobserve(alvo);
        var espera = jaPassou
          ? 0
          : Math.max(0, ATRASO_INICIAL_MS - performance.now());
        window.setTimeout(function () {
          alvo.classList.add("visivel");
        }, espera);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0 },
  );

  var pendentes = [];
  document.querySelectorAll("[data-revela]").forEach(function (bloco) {
    bloco.classList.add("revela");
    pendentes.push(bloco);
    observador.observe(bloco);
  });

  // Rede de segurança: revela qualquer bloco pendente que já ficou totalmente acima da tela.
  var aguardando = false;
  window.addEventListener(
    "scroll",
    function () {
      if (aguardando) return;
      aguardando = true;
      window.requestAnimationFrame(function () {
        aguardando = false;
        pendentes = pendentes.filter(function (bloco) {
          if (bloco.classList.contains("visivel")) return false;
          if (bloco.getBoundingClientRect().bottom < 0) {
            observador.unobserve(bloco);
            bloco.classList.add("visivel");
            return false;
          }
          return true;
        });
      });
    },
    { passive: true },
  );
})();
