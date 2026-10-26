import type { Row } from './types';

import dfoPoster from '../assets/projects/dfo-poster.jpg';
import dfoOntology from '../assets/projects/dfo-ontology.png';
import nowcastingCover from '../assets/projects/nowcasting-cover.png';
import dataVizGuidelines from '../assets/projects/data-viz-guidelines.png';
import voronoiTreemap from '../assets/projects/voronoi-treemap.jpg';
import healthFinancing1 from '../assets/projects/healthFinancing1.png';
import healthFinancing2 from '../assets/projects/healthFinancing2.png';
import healthFinancing3 from '../assets/projects/healthFinancing3.png';
import healthFinancing4 from '../assets/projects/healthFinancing4.png';
import unescoMcpPoster from '../assets/projects/unescoMcp.png';
import sovereignDebtPoster from '../assets/projects/sovereign-debt-poster.png';
import gfTracker from '../assets/projects/gfTracker.png';
import vaccines from '../assets/projects/vaccines.png';
import observable from '../assets/projects/observable.png';
import unesco from '../assets/projects/unesco.png';
import imfReader from '../assets/projects/imf-reader.png';
import bblocks from '../assets/projects/bblocks.png';
import climateFinance from '../assets/projects/image.png';
import vaccineEquity from '../assets/projects/vaccine_equity.png';

/** The Projects section, row by row, in display order. */
export const rows: Row[] = [
  {
    kind: 'large',
    project: {
      id: 'dfo',
      title: 'Development Finance Observatory',
      link: { href: 'https://developmentfinance.org', type: 'external' },
      builtFor: { org: 'one', role: { en: 'Ontology and AI', it: 'Ontologia e IA' } },
      time: null,
      description: {
        en: 'One place for aid, debt, climate and health finance data, with every number traceable to its source.',
        it: 'Un unico punto di accesso ai dati su aiuti, debito e finanziamenti per il clima e la salute, con ogni cifra riconducibile alla fonte.',
      },
      tools: { en: 'Google Data Commons · Python · Wikibase', it: 'Google Data Commons · Python · Wikibase' },
      media: { kind: 'video', src: '/media/dfo.mp4', poster: dfoPoster },
    },
  },
  {
    kind: 'pair',
    projects: [
      {
        id: 'dfo-ontology',
        title: 'DFO ontology',
        link: { href: 'https://developmentfinance.wikibase.cloud', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Design and build', it: 'Progettazione e sviluppo' } },
        time: null,
        description: {
          en: 'A shared model of development finance that makes figures from different publishers comparable.',
          it: 'Un modello condiviso della finanza per lo sviluppo, che rende confrontabili le cifre pubblicate da enti diversi.',
        },
        tools: { en: 'Wikibase · SPARQL · Python', it: 'Wikibase · SPARQL · Python' },
        media: { kind: 'image', src: dfoOntology, fit: 'cover' },
      },
      {
        id: 'voronoi-treemap',
        title: 'Voronoi treemap',
        link: { href: 'https://app.flourish.studio/@lpicci96/voronoi-treemap', type: 'external' },
        builtFor: { org: 'personal' },
        time: { year: 2026 },
        description: {
          en: 'A Flourish template for building interactive Voronoi treemaps from your own data.',
          it: 'Un template Flourish per creare treemap di Voronoi interattive con i tuoi dati.',
        },
        tools: { en: 'Flourish · D3 · JavaScript', it: 'Flourish · D3 · JavaScript' },
        media: { kind: 'image', src: voronoiTreemap, fit: 'contain' },
      },
    ],
  },
  {
    kind: 'large',
    project: {
      id: 'oda-nowcasting',
      title: 'Nowcasting for Official Development Assistance',
      link: { href: 'https://data.one.org/resources/whitepaper/toward-oda-nowcasting', type: 'external' },
      builtFor: { org: 'one', role: { en: 'Lead author', it: 'Primo autore' } },
      time: { year: 2026 },
      description: {
        en: 'How aid could be estimated as it happens, rather than nearly two years late.',
        it: 'Come si potrebbero stimare gli aiuti allo sviluppo in tempo reale, anziché con quasi due anni di ritardo.',
      },
      tools: { en: 'Time series modelling · State-space models · Bayesian methods', it: 'Modellazione di serie storiche · Modelli state-space · Metodi bayesiani' },
      media: { kind: 'image', src: nowcastingCover, fit: 'cover' },
    },
  },
  {
    kind: 'group',
    group: {
      id: 'health-financing-stories',
      title: 'Health financing data stories',
      builtFor: { org: 'one', role: { en: 'Author', it: 'Autore' } },
      year: 2025,
      description: {
        en: 'Four short stories on how health is paid for, and where the money falls short.',
        it: 'Quattro brevi analisi su come si finanzia la sanità e su dove i fondi non bastano.',
      },
      tools: { en: 'Python · Flourish', it: 'Python · Flourish' },
      stories: [
        {
          id: 'health-spending-off-track',
          title: 'Africa falls short on health spending',
          link: { href: 'https://data.one.org/analysis/african_gov_health-spending-off-track', type: 'external' },
          image: healthFinancing1,
        },
        {
          id: 'prevention-spending-fragility',
          title: 'The hidden fragility of preventive health spending',
          link: { href: 'https://data.one.org/analysis/hidden-fragility-of-prevention-spending', type: 'external' },
          image: healthFinancing2,
        },
        {
          id: 'out-of-pocket-burden',
          title: 'Out-of-pocket health burden remains high',
          link: { href: 'https://data.one.org/analysis/out-of-pocket-health-burden', type: 'external' },
          image: healthFinancing3,
        },
        {
          id: 'health-financing-turning-point',
          title: 'A turning point in health financing',
          link: { href: 'https://data.one.org/analysis/turning-point-in-health-financing', type: 'external' },
          image: healthFinancing4,
        },
      ],
    },
  },
  {
    kind: 'pair',
    projects: [
      {
        id: 'unesco-mcp',
        title: 'unesco-mcp',
        link: { href: 'https://pypi.org/project/unesco-mcp/', type: 'external' },
        builtFor: { org: 'personal' },
        time: null,
        description: {
          en: 'Lets AI assistants search, compare and explore UNESCO education and science data.',
          it: 'Consente agli assistenti IA di cercare, confrontare ed esplorare i dati UNESCO su istruzione e scienza.',
        },
        tools: { en: 'Python · FastMCP · UNESCO UIS API', it: 'Python · FastMCP · UNESCO UIS API' },
        media: { kind: 'video', src: '/media/unescoMcp.mp4', poster: unescoMcpPoster },
      },
      {
        id: 'data-viz-guidelines',
        title: 'Data visualisation guidelines',
        link: { href: 'https://docs.one.org/guidelines/data-visualisation-guidelines/', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Author', it: 'Autore' } },
        time: { year: 2025 },
        description: {
          en: "ONE's guide to clear, accessible charts: principles, chart choice, style and a publishing checklist.",
          it: 'La guida di ONE per grafici chiari e accessibili: principi, scelta del grafico, stile e una checklist per la pubblicazione.',
        },
        tools: { en: 'Flourish · MkDocs', it: 'Flourish · MkDocs' },
        media: { kind: 'image', src: dataVizGuidelines, fit: 'cover' },
      },
    ],
  },
  // Below here: newest first, by publication or first release, paired in that order.
  {
    kind: 'pair',
    projects: [
      {
        id: 'sovereign-debt',
        title: 'Sovereign debt',
        link: { href: 'https://data.one.org/analysis/sovereign-debt', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Co-author', it: 'Coautore' } },
        time: { year: 2025 },
        description: {
          en: 'The latest sovereign debt data, explored through interactive charts.',
          it: 'I dati più recenti sul debito sovrano, da esplorare con grafici interattivi.',
        },
        tools: { en: 'Python · Flourish · D3', it: 'Python · Flourish · D3' },
        media: { kind: 'video', src: '/media/sovereign-debt.mp4', poster: sovereignDebtPoster },
      },
      {
        id: 'global-fund-tracker',
        title: 'Global Fund tracker',
        link: { href: 'https://data.one.org/analysis/global-fund-8th-replenishment-tracker', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Co-author and visualisation', it: 'Coautore e visualizzazione' } },
        time: { year: 2025 },
        description: {
          en: "Tracks pledges to the Global Fund's eighth replenishment as donors announce them.",
          it: "Monitora gli impegni per l'ottava ricostituzione del Fondo globale, man mano che i donatori li annunciano.",
        },
        tools: { en: 'D3 · Flourish', it: 'D3 · Flourish' },
        media: { kind: 'image', src: gfTracker, fit: 'contain' },
      },
    ],
  },
  {
    kind: 'pair',
    projects: [
      {
        id: 'bblocks-data-importers',
        title: 'bblocks-data-importers',
        link: { href: 'https://pypi.org/project/bblocks-data-importers/', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Maintainer', it: 'Maintainer' } },
        time: null,
        description: {
          en: 'One Python interface for World Bank, IMF, WHO and UN data, ready for analysis.',
          it: "Un'unica interfaccia Python per i dati di Banca Mondiale, FMI, Organizzazione Mondiale della Sanità e ONU, pronti per l'analisi.",
        },
        tools: { en: 'Python · pandas', it: 'Python · pandas' },
        media: { kind: 'image', src: bblocks, fit: 'contain' },
      },
      {
        id: 'vaccine-manufacturing',
        title: 'Vaccine manufacturing',
        link: { href: 'https://data.one.org/analysis/manufacturing', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Data visualisation', it: 'Visualizzazione dati' } },
        time: { year: 2024 },
        description: {
          en: 'Why Africa needs to build its own vaccine manufacturing capacity.',
          it: "Perché l'Africa deve dotarsi di una propria capacità di produzione di vaccini.",
        },
        tools: { en: 'Python · Flourish · D3', it: 'Python · Flourish · D3' },
        media: { kind: 'image', src: vaccines, fit: 'contain' },
      },
    ],
  },
  {
    kind: 'pair',
    projects: [
      {
        id: 'imf-reader',
        title: 'imf-reader',
        link: { href: 'https://pypi.org/project/imf-reader/', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Maintainer', it: 'Maintainer' } },
        time: null,
        description: {
          en: 'IMF World Economic Outlook and SDR data in Python, as tidy tables.',
          it: "I dati del World Economic Outlook e sui DSP dell'FMI, in Python e sotto forma di tabelle ordinate.",
        },
        tools: { en: 'Python · pandas', it: 'Python · pandas' },
        media: { kind: 'image', src: imfReader, fit: 'contain' },
      },
      {
        id: 'duboisian-poverty',
        title: 'A DuBoisian exploration of global poverty',
        link: { href: 'https://observablehq.com/d/38bd95681cf4c0df', type: 'external' },
        builtFor: { org: 'personal' },
        time: { year: 2024 },
        description: {
          en: "Global poverty trends, charted in the style of W.E.B. Du Bois's data portraits.",
          it: "L'andamento della povertà nel mondo, rappresentato nello stile dei ritratti di dati di W.E.B. Du Bois.",
        },
        tools: { en: 'Observable Plot · D3 · JavaScript', it: 'Observable Plot · D3 · JavaScript' },
        media: { kind: 'image', src: observable, fit: 'contain' },
      },
    ],
  },
  {
    kind: 'pair',
    projects: [
      {
        id: 'climate-finance',
        title: 'The Climate Finance Files',
        link: { href: 'https://datacommons.one.org/climate-finance-files', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Data analysis', it: 'Analisi dati' } },
        time: { year: 2023 },
        description: {
          en: 'How much is really spent on climate, and why reporting methods make it hard to tell.',
          it: 'Quanto si spende davvero per il clima e perché i metodi di rendicontazione rendono difficile capirlo.',
        },
        tools: { en: 'Python', it: 'Python' },
        media: { kind: 'image', src: climateFinance, fit: 'contain' },
      },
      {
        id: 'vaccine-inequity',
        title: 'Addressing vaccine inequity',
        link: { href: 'https://public.tableau.com/app/profile/luca.picci/viz/AddressingVaccineInequitySurvey/AddressingVaccineInequitySurvey', type: 'external' },
        builtFor: { org: 'one', role: { en: 'Data visualisation', it: 'Visualizzazione dati' } },
        time: { year: 2023 },
        description: {
          en: 'Ipsos survey results on vaccine inequity, in an interactive Tableau dashboard.',
          it: "I risultati di un sondaggio Ipsos sulle disuguaglianze nell'accesso ai vaccini, in una dashboard interattiva su Tableau.",
        },
        tools: { en: 'Tableau', it: 'Tableau' },
        media: { kind: 'image', src: vaccineEquity, fit: 'contain' },
      },
    ],
  },
  {
    kind: 'pair',
    projects: [
      {
        id: 'unesco-reader',
        title: 'unesco-reader',
        link: { href: 'https://pypi.org/project/unesco-reader/', type: 'external' },
        builtFor: { org: 'personal' },
        time: null,
        description: {
          en: 'A Python package that makes UNESCO data easy to get and work with.',
          it: 'Un pacchetto Python che rende semplice accedere ai dati UNESCO e lavorarci.',
        },
        tools: { en: 'Python · pandas', it: 'Python · pandas' },
        media: { kind: 'image', src: unesco, fit: 'contain' },
      },
    ],
  },
];
