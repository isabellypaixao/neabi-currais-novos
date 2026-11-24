/* =========================================================
   CONTATOS — página Contato
   Lê dados/contatos.js.
   ========================================================= */
(function () {
  "use strict";
  if (typeof contatosDoNeabi === "undefined") return;
  var U = NeabiUtil;

  function criarEmail(email) {
    if (!email || U.ehProvisorio(email)) return U.criarTextoComDestaque(email);
    var link = U.criarElemento("a", "", email);
    link.href = "mailto:" + email;
    return link;
  }

  document.querySelectorAll("[data-contato]").forEach(function (campo) {
    var chave = campo.getAttribute("data-contato");
    var valor = contatosDoNeabi[chave];
    campo.textContent = "";
    if (chave === "email") campo.appendChild(criarEmail(valor));
    else U.preencherComTexto(campo, valor);
  });

  var lista = document.querySelector("[data-contatos-institucionais]");
  if (lista) {
    lista.textContent = "";
    (contatosDoNeabi.contatosInstitucionais || []).forEach(function (item) {
      var linha = document.createElement("div");
      linha.className = "dados__linha";
      var dt = document.createElement("dt");
      dt.textContent = item.nome;
      var dd = document.createElement("dd");
      dd.appendChild(criarEmail(item.email));
      linha.appendChild(dt);
      linha.appendChild(dd);
      lista.appendChild(linha);
    });
  }
})();
