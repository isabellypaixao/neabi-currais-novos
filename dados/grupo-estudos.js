/*
  ENCONTROS DO GRUPO DE ESTUDOS DO NEABI
  ------------------------------------------------------------------
  Alimenta, a partir de UM único cadastro:
    - o "Calendário do Grupo de Estudos" (página Ações e Agenda)  -> js/calendario-grupo-estudos.js
    - o bloco "Próximo Grupo de Estudos" (Home e Ações e Agenda)  -> js/proximo-grupo-estudos.js

  Aqui ficam SOMENTE encontros públicos do Grupo de Estudos. Reuniões internas do NEABI
  (bolsistas, planejamento, assuntos administrativos) NÃO entram neste arquivo nem no site.

  CAMPOS
    Obrigatório:
      data       -> "AAAA-MM-DD" (ex.: "2026-10-14"). É o que define o dia no calendário.
    Recomendados (se ainda não souber, escreva entre colchetes, ex.: "[LOCAL]"):
      horario    -> como deve aparecer na tela (ex.: "10:30 / 13:00")
      local      -> ex.: "Sala 5"
      tema       -> tema geral do encontro
      texto      -> texto ou capítulo que será (ou foi) discutido
      autor      -> autor(a) do texto
    Opcionais:
      observacao -> ex.: "Traga o texto impresso"; use "" se não houver
      status     -> "realizado" ou "proximo". RECOMENDADO: apagar este campo, assim o site
                    decide pela data (hoje em diante = próximo; antes de hoje = realizado) e
                    ninguém precisa atualizar depois do encontro.

  COMO ADICIONAR: copie um bloco { ... }, cole depois de uma vírgula e altere os campos.
  COMO EDITAR:    altere o texto entre aspas.
  COMO REMOVER:   apague o bloco inteiro (das chaves { } até a vírgula).
  A ordem dos blocos não importa: o site ordena pelas datas.
  SEM ENCONTRO FUTURO: nada precisa ser feito. O site mostra "Nenhum encontro marcado por enquanto."

  Exemplo de bloco completo:
    {
      data: "2026-11-11",
      horario: "10:30 / 13:00",
      local: "Sala 5",
      tema: "Tema do encontro",
      texto: "Título do texto ou capítulo",
      autor: "Nome da autora",
      observacao: ""
    },

  Texto ainda não definido: escreva entre colchetes, como "[TEXTO A SER DEFINIDO]".
  Ele aparece destacado no site para ninguém esquecer de preencher.

  Atenção: mantenha as aspas, as vírgulas entre os campos e o ponto e vírgula no final.
  Se a data estiver no formato errado, o encontro não aparece e o console do navegador (F12) avisa qual é.
*/
const encontrosDoGrupoDeEstudos = [
  {
    data: "2026-09-30",
    horario: "Manhã: 8h50 às 10h20 · Tarde: 13h às 14h30",
    local: "Sala do NEABI, próxima à Sala Temática do Mel, no CTQ",
    tema: "Racismo e sexismo",
    texto: "Racismo e sexismo na cultura brasileira",
    autor: "Lélia Gonzalez",
    observacao: "",
    status: "realizado"
  }
  // Próximos encontros: adicione um bloco aqui (depois de uma vírgula) quando a data for confirmada oficialmente.
];
