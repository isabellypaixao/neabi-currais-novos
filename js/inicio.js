/* =========================================================
   HOME — destaque de material
   Mostra apenas um material em destaque para manter a página inicial enxuta.
   O próximo Grupo de Estudos é preenchido por js/proximo-grupo-estudos.js.
   ========================================================= */
(function () {
  "use strict";
  if (typeof indicacaoDoMes === "undefined") return;
  var U = NeabiUtil;

  function criarDestaque(rotulo, titulo, subtitulo, foto) {
    var figura = U.criarElemento("figure", "destaque-home");
    if (foto) figura.appendChild(foto);
    else figura.classList.add("destaque-home--sem-foto");
    var legenda = U.criarElemento("figcaption");
    legenda.appendChild(U.criarElemento("span", "destaque-home__rotulo", rotulo));
    var forte = U.criarElemento("strong");
    forte.appendChild(U.criarTextoComDestaque(titulo));
    legenda.appendChild(forte);
    legenda.appendChild(U.criarTextoComDestaque(subtitulo));
    figura.appendChild(legenda);
    return figura;
  }

  var area = document.querySelector("[data-previa-materiais]");
  if (!area) return;
  area.textContent = "";
  area.appendChild(
    criarDestaque(
      "Grupo de Estudos · 2026",
      indicacaoDoMes.titulo,
      indicacaoDoMes.autoria,
      indicacaoDoMes.imagem
        ? U.criarFoto({
            arquivo: indicacaoDoMes.imagem,
            alt: indicacaoDoMes.imagemAlt,
            reservado: "",
            classe: "foto--retrato",
          })
        : null,
    ),
  );
})();
