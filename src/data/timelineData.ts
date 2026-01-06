import { BiblicalEra, KingsDatabase, Prophet, Empire } from '../types';

export const BIBLICAL_TIMELINE: BiblicalEra[] = [
  { id: 'creation', title: 'Criação', description: 'O Início de Tudo', startDay: '01/01', endDay: '04/01', color: 'emerald', icon: '🌱', year: '4000 a.C.', yearBC: 4000, dispensation: 'Inocência', bgColor: '#10b981' },
  { id: 'patriarchs', title: 'Patriarcas', description: 'Os Pais da Fé', startDay: '05/01', endDay: '30/01', color: 'amber', icon: '⛺', year: '2100 a.C.', yearBC: 2100, dispensation: 'Consciência', bgColor: '#f59e0b' },
  { id: 'exodus', title: 'Êxodo', description: 'Libertação e Josué', startDay: '31/01', endDay: '18/03', color: 'blue', icon: '🌊', year: '1446 a.C.', yearBC: 1446, dispensation: 'Governo Humano', bgColor: '#3b82f6' },
  { id: 'conquest', title: 'Conquista', description: 'Possuindo a Promessa', startDay: '19/03', endDay: '26/03', color: 'rose', icon: '⚔️', year: '1400 a.C.', yearBC: 1400, dispensation: 'Promessa', bgColor: '#f43f5e' },
  { id: 'judges', title: 'Juízes', description: 'Ciclos de Israel', startDay: '27/03', endDay: '03/04', color: 'purple', icon: '⚖️', year: '1375 a.C.', yearBC: 1375, dispensation: 'Lei', bgColor: '#a855f7' },
  { id: 'united_kingdom', title: 'Reino Unido', description: 'Saul, Davi e Salomão', startDay: '04/04', endDay: '15/05', color: 'yellow', icon: '👑', year: '1050 a.C.', yearBC: 1050, dispensation: 'Lei', bgColor: '#eab308' },
  { id: 'divided_kingdom', title: 'Reino Dividido', description: 'Israel e Judá', startDay: '16/05', endDay: '05/07', color: 'orange', icon: '💔', year: '930 a.C.', yearBC: 931, dispensation: 'Lei', bgColor: '#f97316' },
  { id: 'exile', title: 'Exílio', description: 'Cativeiro Babilônico', startDay: '06/07', endDay: '24/07', color: 'slate', icon: '⛓️', year: '586 a.C.', yearBC: 586, dispensation: 'Lei', bgColor: '#64748b' },
  { id: 'return', title: 'Retorno', description: 'Reconstrução dos Muros', startDay: '25/07', endDay: '06/08', color: 'cyan', icon: '🏗️', year: '538 a.C.', yearBC: 538, dispensation: 'Lei', bgColor: '#06b6d4' },
  { id: 'poetic_prophetic', title: 'Salmos e Profetas', description: 'Adoração e Esperança', startDay: '07/08', endDay: '06/09', color: 'indigo', icon: '🎶', year: '400 a.C.', yearBC: 400, dispensation: 'Lei', bgColor: '#6366f1' },
  { id: 'christ', title: 'Messias', description: 'A Vida de Jesus', startDay: '07/09', endDay: '18/10', color: 'sky', icon: '✝️', year: '4 a.C.', yearBC: 4, dispensation: 'Graça', bgColor: '#0ea5e9' },
  { id: 'church', title: 'A Igreja', description: 'Expansão do Evangelho', startDay: '19/10', endDay: '20/12', color: 'red', icon: '🕊️', year: '33 d.C.', yearBC: -33, dispensation: 'Graça', bgColor: '#ef4444' },
  { id: 'consummation', title: 'Consumação', description: 'Vitória Final', startDay: '21/12', endDay: '31/12', color: 'violet', icon: '🏙️', year: 'Futuro', yearBC: -100, dispensation: 'Reino', bgColor: '#8b5cf6' }
];

export const EMPIRES_DATA: Empire[] = [
  { id: 'egypt', name: 'Egito', ruler: 'Faraó', startYearBC: 2000, endYearBC: 1200 },
  { id: 'assyria', name: 'Assíria', ruler: 'Sargão II', startYearBC: 850, endYearBC: 612 },
  { id: 'babylonia', name: 'Babilônia', ruler: 'Nabucodonosor', startYearBC: 612, endYearBC: 539 },
  { id: 'persia', name: 'Pérsia', ruler: 'Ciro, o Grande', startYearBC: 539, endYearBC: 331 },
  { id: 'greece', name: 'Grécia', ruler: 'Alexandre, o Grande', startYearBC: 331, endYearBC: 146 },
  { id: 'rome', name: 'Roma', ruler: 'Augusto', startYearBC: 146, endYearBC: -476 }
];

export const KINGS_DATA: KingsDatabase = {
  united: [
    { id: 'saul', name: 'Saul', reignYears: '1050-1010 a.C.', startYearBC: 1050, endYearBC: 1010, kingdom: 'United' },
    { id: 'david', name: 'Davi', reignYears: '1010-970 a.C.', startYearBC: 1010, endYearBC: 970, kingdom: 'United' },
    { id: 'solomon', name: 'Salomão', reignYears: '970-930 a.C.', startYearBC: 970, endYearBC: 930, kingdom: 'United' }
  ],
  north: [ // Israel (Top)
    { id: 'jeroboam1', name: 'Jeroboão I', reignYears: '930-910 a.C.', startYearBC: 930, endYearBC: 910, kingdom: 'North' },
    { id: 'acabe', name: 'Acabe', reignYears: '874-853 a.C.', startYearBC: 874, endYearBC: 853, kingdom: 'North' },
    { id: 'jehu', name: 'Jeú', reignYears: '841-814 a.C.', startYearBC: 841, endYearBC: 814, kingdom: 'North' },
    { id: 'jeroboam2', name: 'Jeroboão II', reignYears: '793-753 a.C.', startYearBC: 793, endYearBC: 753, kingdom: 'North' },
    { id: 'hoshea', name: 'Oséias', reignYears: '732-722 a.C.', startYearBC: 732, endYearBC: 722, kingdom: 'North' }
  ],
  south: [ // Judah (Bottom)
    { id: 'rehoboam', name: 'Roboão', reignYears: '930-913 a.C.', startYearBC: 930, endYearBC: 913, kingdom: 'South' },
    { id: 'asa', name: 'Asa', reignYears: '911-870 a.C.', startYearBC: 911, endYearBC: 870, kingdom: 'South' },
    { id: 'jehoshaphat', name: 'Josafá', reignYears: '870-848 a.C.', startYearBC: 870, endYearBC: 848, kingdom: 'South' },
    { id: 'hezekiah', name: 'Ezequias', reignYears: '715-686 a.C.', startYearBC: 715, endYearBC: 686, kingdom: 'South' },
    { id: 'josiah', name: 'Josias', reignYears: '640-609 a.C.', startYearBC: 640, endYearBC: 609, kingdom: 'South' },
    { id: 'zedekiah', name: 'Sedequias', reignYears: '597-586 a.C.', startYearBC: 597, endYearBC: 586, kingdom: 'South' }
  ]
};

export const PROPHETS_DATA: Prophet[] = [
  { id: 'elijah', name: 'Elias', location: 'North', period: 'Acabe', years: '875-850 a.C.', born: 'c. 900 a.C.', died: 'c. 849 a.C.', startYearBC: 875, endYearBC: 850, summary: 'Prega contra a idolatria a BAAL. Desafiou Acabe no Monte Carmelo.' },
  { id: 'elisha', name: 'Eliseu', location: 'North', period: 'Jorão a Jeoás', years: '850-800 a.C.', born: 'c. 870 a.C.', died: 'c. 790 a.C.', startYearBC: 850, endYearBC: 800, summary: 'Discípulo de ELIAS, continua a luta contra BAAL. Realizou muitos milagres.' },
  { id: 'amos', name: 'Amós', location: 'North', period: 'Jeroboão II', years: '760 a.C.', born: 'c. 800 a.C.', died: 'c. 745 a.C.', startYearBC: 765, endYearBC: 755, summary: 'Prega contra a idolatria e a injustiça social no Reino do Norte.' },
  { id: 'hosea', name: 'Oséias', location: 'North', period: 'Jeroboão II a Oséias', years: '750-725 a.C.', born: 'c. 780 a.C.', died: 'c. 720 a.C.', startYearBC: 755, endYearBC: 725, summary: 'Usa seu casamento como metáfora do amor e infidelidade de Israel.' },
  { id: 'isaiah', name: 'Isaías', location: 'South', period: 'Uzias a Ezequias', years: '740-680 a.C.', born: 'c. 765 a.C.', died: 'c. 680 a.C.', startYearBC: 745, endYearBC: 685, summary: 'Traz mensagens de julgamento e a promessa da vinda do Messias.' },
  { id: 'micah', name: 'Miquéias', location: 'South', period: 'Jotão a Ezequias', years: '735-700 a.C.', born: 'c. 750 a.C.', died: 'c. 695 a.C.', startYearBC: 740, endYearBC: 700, summary: 'Anuncia que o Messias nasceria em Belém. Denuncia a opressão.' },
  { id: 'jeremiah', name: 'Jeremias', location: 'South', period: 'Josias a Sedequias', years: '627-580 a.C.', born: 'c. 650 a.C.', died: 'c. 570 a.C.', startYearBC: 630, endYearBC: 580, summary: 'O profeta chorão. Prega o arrependimento diante da queda de Jerusalém.' },
  { id: 'ezekiel', name: 'Ezekiel', location: 'Both', period: 'Cativeiro', years: '593-570 a.C.', born: 'c. 622 a.C.', died: 'c. 570 a.C.', startYearBC: 595, endYearBC: 570, summary: 'Prega no exílio. Teve visões da glória de Deus e do novo Templo.' },
  { id: 'daniel', name: 'Daniel', location: 'Both', period: 'Cativeiro/Persa', years: '605-530 a.C.', born: 'c. 620 a.C.', died: 'c. 535 a.C.', startYearBC: 610, endYearBC: 535, summary: 'Profetiza sobre os impérios mundiais e a vitória final do Reino de Deus.' },
  { id: 'haggai', name: 'Ageu', location: 'South', period: 'Retorno/Reconstrução', years: '520 a.C.', born: 'c. 550 a.C.', died: 'c. 510 a.C.', startYearBC: 525, endYearBC: 515, summary: 'Exorta o povo para a reconstrução do Templo após o retorno do exílio.' },
  { id: 'zechariah', name: 'Zacarias', location: 'South', period: 'Retorno/Reconstrução', years: '520-518 a.C.', born: 'c. 550 a.C.', died: 'c. 500 a.C.', startYearBC: 525, endYearBC: 510, summary: 'Traz esperança na vinda do Messias e visões do futuro de Jerusalém.' },
  { id: 'malachi', name: 'Malaquias', location: 'South', period: 'Pós-Exílio', years: '450 a.C.', born: 'c. 480 a.C.', died: 'c. 420 a.C.', startYearBC: 460, endYearBC: 440, summary: 'Último profeta do AT. Exorta à fidelidade e anuncia o Mensageiro.' }
];
