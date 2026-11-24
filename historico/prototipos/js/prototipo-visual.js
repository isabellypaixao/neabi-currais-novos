/* =========================================================
   PROTÓTIPO VISUAL — comportamento (arquivo separado da Etapa 1)
   Vale para todas as páginas do protótipo. Controla:
     1. Menu do celular (☰ / ✕)
     2. Modo limpo (esconde o destaque amarelo dos placeholders)
     3. Interações de página:
          a) Sobre: abrir/fechar marcos da linha do tempo no celular
          b) Ações e agenda: filtro da agenda por categoria
          c) Materiais: filtro por tipo e "Ver mais" (mostra poucos itens de cada vez)
          d) Conheça: "Conhecer mais" expande o texto; "Ver todas as personalidades" mostra as demais
     4. Revelação de blocos na rolagem (IntersectionObserver) — só para blocos marcados
        com o atributo data-revela no HTML

   A entrada (animação de abertura) das páginas NÃO usa JavaScript: é só CSS.
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- 1. Menu do celular ---------- */
  var botao = document.getElementById("pv-botao-menu");
  var painel = document.getElementById("pv-menu");

  function definirMenu(abrir) {
    painel.classList.toggle("menu--aberto", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
    botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    botao.textContent = abrir ? "✕" : "☰";
  }

  if (botao && painel) {
    botao.addEventListener("click", function () {
      definirMenu(!painel.classList.contains("menu--aberto"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && painel.classList.contains("menu--aberto")) {
        definirMenu(false);
        botao.focus();
      }
    });
    painel.addEventListener("click", function (e) {
      if (e.target.closest("a")) definirMenu(false);   // tocar num link fecha o menu
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (e) {
      if (e.matches) definirMenu(false);               // ao ir para o desktop, o painel volta ao normal
    });
  }

  /* ---------- 2. Modo limpo (placeholders sem o amarelo) ---------- */
  var limpo = document.getElementById("pv-limpo");
  if (limpo) {
    limpo.addEventListener("click", function () {
      var ativo = document.body.classList.toggle("limpo");
      limpo.setAttribute("aria-pressed", String(ativo));
      limpo.textContent = ativo ? "Mostrar destaque dos placeholders" : "Ocultar destaque dos placeholders";
    });
  }

  /* ---------- 3a. Sobre: marcos da linha do tempo no celular ----------
     No computador todos os marcos ficam visíveis (o botão + / − fica oculto por CSS),
     então este código só age em telas estreitas. Sem JavaScript, tudo fica aberto.   */
  var celular = window.matchMedia("(max-width: 899px)");
  document.querySelectorAll(".marco-h__cabeca").forEach(function (cabeca) {
    cabeca.addEventListener("click", function () {
      if (!celular.matches) return;
      var marco = cabeca.closest(".marco-h");
      var aberto = marco.classList.toggle("aberto");
      cabeca.querySelector(".marco-h__toggle").setAttribute("aria-expanded", String(aberto));
    });
  });

  /* ---------- 3b. Ações e agenda: filtro por categoria ----------
     Cada item da agenda tem data-categoria; cada botão tem data-filtro ("todas" mostra tudo).
     O filtro só esconde/mostra itens (atributo hidden) — sem animação.
     Também aceita ?categoria=evento na URL (usado pelos links da home).               */
  var filtros = document.querySelectorAll("[data-filtro]");
  var itensAgenda = document.querySelectorAll(".agenda-item");
  var vazio = document.getElementById("ac-vazio");

  function aplicarFiltro(valor) {
    var visiveis = 0;
    filtros.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filtro") === valor)); });
    itensAgenda.forEach(function (item) {
      var mostrar = valor === "todas" || item.getAttribute("data-categoria") === valor;
      item.hidden = !mostrar;
      if (mostrar) visiveis++;
    });
    if (vazio) vazio.hidden = visiveis > 0;
  }

  filtros.forEach(function (b) {
    b.addEventListener("click", function () { aplicarFiltro(b.getAttribute("data-filtro")); });
  });
  if (filtros.length) {
    var pedido = new URLSearchParams(window.location.search).get("categoria");
    if (pedido && document.querySelector('[data-filtro="' + pedido + '"]')) aplicarFiltro(pedido);
    // links da home: ?categoria=evento leva às "Outras atividades"; ?categoria=grupo-de-estudos, ao calendário
    var destino = pedido && document.getElementById(pedido === "grupo-de-estudos" ? "calendario" : "outras");
    if (destino) destino.scrollIntoView();
  }

  /* ---------- 3c. Materiais: filtro por tipo + quantidade limitada ----------
     Estrutura no HTML: seções com data-tipo (textos, livros, filmes, outros); itens com data-item;
     destaques da categoria com data-destaque. Botões de filtro: data-filtro-material ("todos" mostra tudo).
     - "Todos": visão geral, só 2 itens por categoria, sem os destaques (a "Indicação do mês" já destaca um),
                e um link "Ver todos: ..." em cada categoria que tiver mais itens.
     - Uma categoria: o destaque da categoria + 6 itens, e o botão "Ver mais" libera mais 6 a cada clique.
     Itens escondidos continuam no HTML (nada é apagado). Aceita ?tipo=livros na URL.            */
  var botoesTipo = document.querySelectorAll("[data-filtro-material]");
  var secoesMaterial = document.querySelectorAll("[data-tipo]");
  var areaVerMais = document.getElementById("mat-mais");
  var botaoVerMais = document.getElementById("mat-ver-mais");
  var contagem = document.getElementById("mat-contagem");
  var ITENS_NA_VISAO_GERAL = 2, ITENS_POR_VEZ = 6;
  var tipoAtual = "todos", itensLiberados = ITENS_POR_VEZ;

  function desenharMateriais() {
    var geral = tipoAtual === "todos", total = 0, visiveis = 0;
    var limite = geral ? ITENS_NA_VISAO_GERAL : itensLiberados;
    secoesMaterial.forEach(function (secao) {
      var mostrar = geral || secao.getAttribute("data-tipo") === tipoAtual;
      secao.hidden = !mostrar;
      if (!mostrar) return;
      var itens = secao.querySelectorAll("[data-item]");
      itens.forEach(function (item, posicao) { item.hidden = posicao >= limite; });
      secao.querySelectorAll("[data-destaque]").forEach(function (d) { d.hidden = geral; });
      var verTodos = secao.querySelector(".mat-secao__todos");
      if (verTodos) verTodos.hidden = !(geral && itens.length > limite);
      total += itens.length;
      visiveis += Math.min(itens.length, limite);
    });
    if (areaVerMais) {
      areaVerMais.hidden = geral || visiveis >= total;
      if (contagem) contagem.textContent = "Mostrando " + visiveis + " de " + total;
    }
  }
  function aplicarTipo(valor) {
    tipoAtual = valor; itensLiberados = ITENS_POR_VEZ;
    botoesTipo.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filtro-material") === valor)); });
    desenharMateriais();
  }
  botoesTipo.forEach(function (b) {
    b.addEventListener("click", function () { aplicarTipo(b.getAttribute("data-filtro-material")); });
  });
  if (botaoVerMais) botaoVerMais.addEventListener("click", function () { itensLiberados += ITENS_POR_VEZ; desenharMateriais(); });
  // "Ver todos: livros" (na visão geral) = escolher aquela categoria
  document.querySelectorAll("[data-ir-para]").forEach(function (b) {
    b.addEventListener("click", function () {
      aplicarTipo(b.getAttribute("data-ir-para"));
      document.getElementById("lista-materiais").scrollIntoView();
    });
  });
  if (botoesTipo.length) {
    aplicarTipo("todos");
    var tipoPedido = new URLSearchParams(window.location.search).get("tipo");
    if (tipoPedido && document.querySelector('[data-filtro-material="' + tipoPedido + '"]')) aplicarTipo(tipoPedido);
  }

  /* ---------- 3d. Conheça: "Conhecer mais" expande o texto no próprio card ----------
     O texto começa escondido (atributo hidden, definido aqui); sem JavaScript ele já aparece. */
  document.querySelectorAll(".pessoa__botao").forEach(function (botaoPessoa) {
    var texto = document.getElementById(botaoPessoa.getAttribute("aria-controls"));
    texto.hidden = true;
    botaoPessoa.addEventListener("click", function () {
      var abrir = botaoPessoa.getAttribute("aria-expanded") !== "true";
      botaoPessoa.setAttribute("aria-expanded", String(abrir));
      botaoPessoa.textContent = abrir ? "Mostrar menos" : "Conhecer mais";
      texto.hidden = !abrir;
    });
  });

  // "Ver todas as personalidades": mostra/esconde o grupo extra (sem JavaScript, todas aparecem)
  var botaoTodasPessoas = document.getElementById("pessoas-todas");
  var pessoasExtras = document.getElementById("pessoas-extras");
  if (botaoTodasPessoas && pessoasExtras) {
    pessoasExtras.hidden = true;
    botaoTodasPessoas.addEventListener("click", function () {
      var abrir = botaoTodasPessoas.getAttribute("aria-expanded") !== "true";
      botaoTodasPessoas.setAttribute("aria-expanded", String(abrir));
      botaoTodasPessoas.textContent = abrir ? "Mostrar só os destaques" : "Ver todas as personalidades";
      pessoasExtras.hidden = !abrir;
    });
  }

  /* ---------- 4. Revelação de blocos na rolagem ----------
     Como funciona:
       a) No HTML, alguns poucos blocos importantes levam o atributo data-revela.
          O resto da página não anima: simplesmente está lá.
       b) O JavaScript marca esses blocos com a classe "revela". No CSS, "revela" =
          invisível e 16 px mais abaixo.
       c) Um IntersectionObserver avisa quando cada bloco entra na tela. Nesse momento
          adicionamos "visivel" e o CSS faz a transição (opacity + transform).
          Depois disso o bloco fica parado e deixa de ser observado.

     Regras de segurança:
       - Sem JavaScript, sem IntersectionObserver ou com "reduzir movimento" ativado,
         nenhuma classe "revela" é criada: todo o conteúdo já aparece normalmente.
       - Blocos que ficaram ACIMA da tela (pulo por âncora, rolagem rápida) são
         revelados na hora, para nunca ficarem invisíveis.                          */
  var ATRASO_INICIAL_MS = 1400;   // espera a entrada da página terminar
  var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduzirMovimento.matches || !("IntersectionObserver" in window)) return;

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      var jaPassou = entrada.boundingClientRect.top < 0;        // está acima da tela
      if (!entrada.isIntersecting && !jaPassou) return;         // ainda abaixo: espera

      var alvo = entrada.target;
      observador.unobserve(alvo);                               // cada bloco anima uma única vez

      var espera = jaPassou ? 0 : Math.max(0, ATRASO_INICIAL_MS - performance.now());
      window.setTimeout(function () { alvo.classList.add("visivel"); }, espera);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",  // só revela quando o topo do bloco passa de ~12% acima da base da tela
    threshold: 0
  });

  var pendentes = [];   // blocos que ainda não foram revelados

  document.querySelectorAll("[data-revela]").forEach(function (bloco) {
    bloco.classList.add("revela");
    pendentes.push(bloco);
    observador.observe(bloco);
  });

  /* Rede de segurança: o IntersectionObserver só avisa quando um bloco MUDA de estado.
     Se a pessoa pular por cima de um bloco (âncora, "ir ao fim da página"), ele nunca
     chega a "entrar" na tela. Este ouvinte leve (passivo, no máximo 1x por quadro)
     revela qualquer bloco pendente que já ficou totalmente acima da tela.            */
  var aguardando = false;
  window.addEventListener("scroll", function () {
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
  }, { passive: true });
})();
