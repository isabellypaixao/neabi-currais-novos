/* =========================================================
   GALERIA — Acervo em imagens
   ========================================================= */
(function () {
  "use strict";

  function criarFigura(item, classe) {
    var figura = document.createElement("figure");
    figura.className = classe;

    var img = document.createElement("img");
    img.src = item.arquivo;
    img.alt = item.alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    figura.appendChild(img);

    var texto = item.nome || item.legenda;
    if (texto) {
      var legenda = document.createElement("figcaption");
      legenda.textContent = texto;
      figura.appendChild(legenda);
    }
    return figura;
  }

  var acervo = document.getElementById("acervo-galeria");
  if (acervo && typeof acervoEmImagens !== "undefined") {
    acervo.textContent = "";
    acervoEmImagens.forEach(function (item) {
      acervo.appendChild(criarFigura(item, "galeria__item"));
    });
  }

})();
