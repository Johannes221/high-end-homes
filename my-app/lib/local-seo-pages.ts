export type LocalSeoPage = {
  slug: string
  title: string
  service: string
  location: string
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroDescription: string
  introTitle: string
  introText: string
  serviceHighlights: string[]
  reasonsTitle: string
  reasons: string[]
  processTitle: string
  processSteps: string[]
  faqTitle: string
  faqs: Array<{
    question: string
    answer: string
  }>
  nearbyAreas: string[]
  relatedLinks: Array<{
    href: string
    label: string
  }>
}

export const localSeoPages: LocalSeoPage[] = [
  {
    slug: "entruempelung-heidelberg",
    title: "Entrümpelung Heidelberg",
    service: "Entrümpelung",
    location: "Heidelberg",
    metaTitle: "Entrümpelung Heidelberg | Wohnung, Haus, Keller & Gewerbe",
    metaDescription:
      "Professionelle Entrümpelung in Heidelberg für Wohnungen, Häuser, Keller, Garagen und Gewerbeflächen. Schnell vor Ort, transparent kalkuliert und fachgerecht entsorgt.",
    heroTitle: "Entrümpelung in Heidelberg mit schneller Terminvergabe",
    heroDescription:
      "Wir übernehmen Entrümpelungen in Heidelberg für private und gewerbliche Objekte. Ob Wohnung, Haus, Keller, Garage oder Büro: High-End Homes plant die Räumung effizient, sauber und termingerecht.",
    introTitle: "Fachgerechte Entrümpelung in Heidelberg und Umgebung",
    introText:
      "Eine Entrümpelung ist oft mehr als nur das Entfernen alter Gegenstände. In Heidelberg unterstützen wir Eigentümer, Mieter, Angehörige und Unternehmen bei Räumungen jeder Größenordnung. Wir sortieren, transportieren ab und führen die fachgerechte Entsorgung strukturiert durch.",
    serviceHighlights: [
      "Wohnungsentrümpelung in Heidelberg",
      "Hausentrümpelung inklusive Keller, Dachboden und Garage",
      "Entrümpelung von Büros, Praxen und Gewerbeflächen",
      "Besenreine Übergabe nach Abschluss der Räumung",
    ],
    reasonsTitle: "Darum lohnt sich unsere Entrümpelung in Heidelberg",
    reasons: [
      "Kurze Wege und schnelle Vor-Ort-Termine in Heidelberg",
      "Transparente Kalkulation statt unklarer Pauschalen",
      "Saubere Ausführung mit fachgerechter Entsorgung",
      "Entlastung bei Umzug, Nachlass oder Neuvermietung",
    ],
    processTitle: "So läuft eine Entrümpelung in Heidelberg ab",
    processSteps: [
      "Sie senden uns die Eckdaten zu Objekt, Größe und Material.",
      "Wir schätzen Aufwand und Terminrahmen ein.",
      "Falls nötig, erfolgt eine kurze Besichtigung vor Ort.",
      "Unser Team räumt strukturiert, transportiert ab und hinterlässt die Flächen besenrein.",
    ],
    faqTitle: "Häufige Fragen zur Entrümpelung in Heidelberg",
    faqs: [
      {
        question: "Welche Objekte entrümpeln Sie in Heidelberg?",
        answer:
          "Wir entrümpeln Wohnungen, Häuser, Keller, Garagen, Dachgeschosse, Büros und kleinere Gewerbeeinheiten in Heidelberg und Umgebung.",
      },
      {
        question: "Wie schnell ist ein Termin für eine Entrümpelung in Heidelberg möglich?",
        answer:
          "Je nach Umfang sind kurzfristige Termine möglich. Nach Ihrer Anfrage melden wir uns zeitnah mit einer realistischen Einschätzung zu Start und Dauer.",
      },
      {
        question: "Übernehmen Sie auch die Entsorgung?",
        answer:
          "Ja. Wir übernehmen den Abtransport und die fachgerechte Entsorgung der anfallenden Materialien im Rahmen der Entrümpelung.",
      },
    ],
    nearbyAreas: ["Dossenheim", "Schriesheim", "Leimen", "Eppelheim", "Ladenburg"],
    relatedLinks: [
      { href: "/entkernung-heidelberg", label: "Entkernung Heidelberg" },
      { href: "/hausaufloesung-mannheim", label: "Hausauflösung Mannheim" },
    ],
  },
  {
    slug: "hausaufloesung-mannheim",
    title: "Hausauflösung Mannheim",
    service: "Hausauflösung",
    location: "Mannheim",
    metaTitle: "Hausauflösung Mannheim | Diskret, schnell und besenrein",
    metaDescription:
      "Professionelle Hausauflösung in Mannheim für Häuser, Wohnungen und Nachlässe. Diskrete Abwicklung, strukturierter Abtransport und besenreine Übergabe.",
    heroTitle: "Hausauflösung in Mannheim professionell organisiert",
    heroDescription:
      "Wir unterstützen Sie bei Hausauflösungen in Mannheim, wenn Objekte vollständig geräumt und zuverlässig übergeben werden sollen. Von der Planung bis zum Abtransport erhalten Sie eine strukturierte und diskrete Abwicklung.",
    introTitle: "Hausauflösung in Mannheim bei Umzug, Verkauf oder Nachlass",
    introText:
      "Eine Hausauflösung in Mannheim ist oft mit Zeitdruck und organisatorischem Aufwand verbunden. Wir helfen bei kompletten Räumungen von Häusern und Wohnungen, übernehmen Demontage und Abtransport und sorgen für eine besenreine Übergabe.",
    serviceHighlights: [
      "Komplette Hausauflösung in Mannheim",
      "Wohnungsauflösung bei Eigentümerwechsel oder Nachlass",
      "Sortierte Räumung mit strukturierter Abwicklung",
      "Besenreine Übergabe für Verkauf oder Neuvermietung",
    ],
    reasonsTitle: "Warum unsere Hausauflösung in Mannheim gefragt ist",
    reasons: [
      "Diskrete und respektvolle Vorgehensweise",
      "Klare Abläufe bei sensiblen Projekten",
      "Schnelle Reaktion bei kurzfristigem Bedarf in Mannheim",
      "Saubere Übergabe für Eigentümer, Familien und Verwaltungen",
    ],
    processTitle: "Ablauf einer Hausauflösung in Mannheim",
    processSteps: [
      "Sie schildern uns Größe, Lage und Besonderheiten des Objekts.",
      "Wir bewerten den Aufwand und planen die passende Umsetzung.",
      "Das Objekt wird vollständig geräumt, sortiert und abtransportiert.",
      "Zum Abschluss erfolgt die besenreine Übergabe der Flächen.",
    ],
    faqTitle: "Häufige Fragen zur Hausauflösung in Mannheim",
    faqs: [
      {
        question: "Wann ist eine Hausauflösung in Mannheim sinnvoll?",
        answer:
          "Typische Anlässe sind Umzüge, Nachlässe, Verkäufe, Vermieterwechsel oder wenn Immobilien kurzfristig freigemacht werden müssen.",
      },
      {
        question: "Führen Sie auch Wohnungsauflösungen in Mannheim durch?",
        answer:
          "Ja. Neben Hausauflösungen übernehmen wir auch Wohnungsauflösungen in Mannheim und Umgebung inklusive Abtransport und besenreiner Übergabe.",
      },
      {
        question: "Arbeiten Sie auch für Verwaltungen oder Eigentümergemeinschaften?",
        answer:
          "Ja. Wir unterstützen auch Hausverwaltungen, Eigentümer und gewerbliche Auftraggeber bei strukturierten Auflösungen und Räumungen.",
      },
    ],
    nearbyAreas: ["Ludwigshafen", "Ilvesheim", "Edingen-Neckarhausen", "Schwetzingen", "Heidelberg"],
    relatedLinks: [
      { href: "/entruempelung-heidelberg", label: "Entrümpelung Heidelberg" },
      { href: "/entkernung-heidelberg", label: "Entkernung Heidelberg" },
    ],
  },
  {
    slug: "entkernung-heidelberg",
    title: "Entkernung Heidelberg",
    service: "Entkernung",
    location: "Heidelberg",
    metaTitle: "Entkernung Heidelberg | Rückbau vor Sanierung und Umbau",
    metaDescription:
      "Fachgerechte Entkernung in Heidelberg für Wohnungen, Häuser, Büros und Gewerbe. Rückbau vor Sanierung, Modernisierung oder Neuaufteilung mit klarer Planung.",
    heroTitle: "Entkernung in Heidelberg für Sanierung, Umbau und Modernisierung",
    heroDescription:
      "Wir übernehmen Entkernungen in Heidelberg für private und gewerbliche Objekte. Wenn vor einer Sanierung alte Bauteile, Böden, Decken oder Einbauten entfernt werden müssen, arbeiten wir strukturiert und terminsicher.",
    introTitle: "Entkernung Heidelberg für Wohnungen, Häuser und Gewerbe",
    introText:
      "Vor vielen Umbau- und Sanierungsmaßnahmen ist eine professionelle Entkernung entscheidend. In Heidelberg entfernen wir nicht tragende Bauteile, Bodenbeläge, Verkleidungen und Altinstallationen, damit Ihr Objekt sauber für die nächsten Gewerke vorbereitet ist.",
    serviceHighlights: [
      "Entkernung von Wohnungen und Häusern in Heidelberg",
      "Rückbau von Böden, Decken und Wandverkleidungen",
      "Vorbereitung von Objekten für Sanierung und Modernisierung",
      "Saubere, planbare und termintreue Durchführung",
    ],
    reasonsTitle: "Ihre Vorteile bei einer Entkernung in Heidelberg",
    reasons: [
      "Strukturierter Rückbau vor Folgegewerken",
      "Schnelle Koordination für Sanierungsprojekte",
      "Klare Planung bei Wohnungen, Häusern und Gewerbeobjekten",
      "Fachgerechte Ausführung mit Blick auf Zeit und Sauberkeit",
    ],
    processTitle: "So läuft eine Entkernung in Heidelberg ab",
    processSteps: [
      "Sie beschreiben uns den Zustand des Objekts und den gewünschten Rückbau.",
      "Wir definieren Umfang, zeitlichen Rahmen und besondere Anforderungen.",
      "Unser Team entfernt die vorgesehenen Bauteile und Materialien strukturiert.",
      "Das Objekt wird sauber für die anschließende Sanierung oder Modernisierung übergeben.",
    ],
    faqTitle: "Häufige Fragen zur Entkernung in Heidelberg",
    faqs: [
      {
        question: "Welche Arbeiten umfasst eine Entkernung in Heidelberg?",
        answer:
          "Typisch sind der Rückbau von Böden, Decken, Wandverkleidungen, Einbauten, Sanitärbereichen oder anderen nicht tragenden Bestandteilen.",
      },
      {
        question: "Für welche Objekte bieten Sie Entkernungen an?",
        answer:
          "Wir übernehmen Entkernungen für Wohnungen, Häuser, Büros und kleinere Gewerbeobjekte in Heidelberg und Umgebung.",
      },
      {
        question: "Ist eine Entkernung auch vor einer Komplettsanierung sinnvoll?",
        answer:
          "Ja. Eine saubere Entkernung schafft die Grundlage für eine geordnete Sanierung, Modernisierung oder Neuaufteilung von Flächen.",
      },
    ],
    nearbyAreas: ["Dossenheim", "Schriesheim", "Leimen", "Eppelheim", "Mannheim"],
    relatedLinks: [
      { href: "/entruempelung-heidelberg", label: "Entrümpelung Heidelberg" },
      { href: "/hausaufloesung-mannheim", label: "Hausauflösung Mannheim" },
    ],
  },
]

export const localSeoPagesBySlug = Object.fromEntries(localSeoPages.map((page) => [page.slug, page])) as Record<string, LocalSeoPage>
