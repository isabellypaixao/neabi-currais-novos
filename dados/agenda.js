/*
  AGENDA PÚBLICA DO NEABI — eventos, projetos e campanhas
  ------------------------------------------------------------------
  Aparece na página "Ações e Agenda", na seção "Outras atividades públicas".
  Lida por: js/agenda-publica.js (e js/inicio.js, para o resumo da Home).

  ATENÇÃO — o que NÃO entra aqui:
    - Encontros do Grupo de Estudos  -> cadastre em dados/grupo-estudos.js
    - Ações que já aconteceram       -> cadastre em dados/acoes-realizadas.js
    - Reuniões internas, planejamento de bolsistas, assuntos administrativos
      -> NÃO fazem parte do site público. Não cadastre em nenhum arquivo.

  CATEGORIAS PERMITIDAS (escreva exatamente assim):
    "Evento"   "Projeto"   "Campanha"
  Qualquer outra categoria é ignorada e o console do navegador (F12) avisa.

  CAMPOS
    Obrigatórios:
      titulo     -> nome da atividade
      data       -> "AAAA-MM-DD"  (ex.: "2026-11-20")
      categoria  -> "Evento", "Projeto" ou "Campanha"
    Opcionais (use "" se não houver):
      horario    -> como deve aparecer na tela (ex.: "14h30")
      local      -> ex.: "Auditório"
      descricao  -> uma ou duas frases

  COMO ADICIONAR: copie um bloco { ... }, cole depois de uma vírgula e edite os campos.
  COMO EDITAR:    altere o texto entre aspas.
  COMO REMOVER:   apague o bloco inteiro (das chaves { } até a vírgula).
  Atividades com data passada deixam de aparecer sozinhas; não precisa apagá-las.
  A ordem dos blocos não importa: o site ordena pelas datas.

  Exemplo de bloco completo:
    {
      titulo: "Roda de conversa sobre história indígena",
      data: "2026-11-20",
      horario: "14h30",
      local: "Auditório",
      categoria: "Evento",
      descricao: "Conversa aberta à comunidade."
    },

  Atenção: mantenha as aspas, as vírgulas entre os campos e o ponto e vírgula final.
*/
const agendaDoNeabi = [
  // Nenhuma atividade pública confirmada por enquanto. Adicione os blocos aqui, seguindo o exemplo acima.
];
