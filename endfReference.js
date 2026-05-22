const MF_DESCRIPTIONS = new Map([
  [0, 'End-record marker used with SEND, FEND, MEND, or TEND records.'],
  [1, 'General information.'],
  [2, 'Resonance parameter data.'],
  [3, 'Reaction cross sections.'],
  [4, 'Angular distributions of emitted particles.'],
  [5, 'Energy distributions of emitted particles.'],
  [6, 'Product energy-angle distributions.'],
  [7, 'Thermal neutron scattering law data.'],
  [8, 'Radioactivity and fission-product yield data.'],
  [9, 'Multiplicities for radioactive nuclide production.'],
  [10, 'Cross sections for radioactive nuclide production.'],
  [12, 'Photon production multiplicities and transition probability arrays.'],
  [13, 'Photon production cross sections.'],
  [14, 'Photon angular distributions.'],
  [15, 'Continuous photon energy spectra.'],
  [23, 'Photo- or electro-atomic interaction cross sections.'],
  [26, 'Electro-atomic angle and energy distributions.'],
  [27, 'Atomic form factors or scattering functions.'],
  [28, 'Atomic relaxation data.'],
  [30, 'Data covariances from parameter covariances and sensitivities.'],
  [31, 'Covariances of average neutron multiplicities.'],
  [32, 'Covariances of resonance parameters.'],
  [33, 'Covariances of reaction cross sections.'],
  [34, 'Covariances of angular distributions.'],
  [35, 'Covariances of energy distributions.'],
  [39, 'Covariances of radionuclide production yields.'],
  [40, 'Covariances of radionuclide production cross sections.']
]);

const MT_DESCRIPTIONS = new Map([
  [0, 'End-record marker used with SEND, FEND, MEND, or TEND records.'],
  [1, 'Neutron total cross section.'],
  [2, 'Elastic scattering cross section.'],
  [3, 'Nonelastic cross section.'],
  [4, 'Production of one neutron; sum of discrete and continuum neutron-production sections.'],
  [5, 'Sum of reactions not otherwise represented by another MT number.'],
  [10, 'Total continuum reaction, used for derived files.'],
  [11, 'Production of two neutrons and a deuteron, plus a residual.'],
  [16, 'Production of two neutrons, usually written (n,2n).'],
  [17, 'Production of three neutrons, usually written (n,3n).'],
  [18, 'Particle-induced fission.'],
  [19, 'First-chance neutron-induced fission.'],
  [20, 'Second-chance neutron-induced fission.'],
  [21, 'Third-chance neutron-induced fission.'],
  [22, 'Production of a neutron and an alpha particle, plus a residual.'],
  [23, 'Production of a neutron and three alpha particles, plus a residual.'],
  [24, 'Production of two neutrons and an alpha particle, plus a residual.'],
  [25, 'Production of three neutrons and an alpha particle, plus a residual.'],
  [27, 'Absorption reaction sum; rarely used.'],
  [28, 'Production of a neutron and a proton, plus a residual.'],
  [29, 'Production of a neutron and two alpha particles, plus a residual.'],
  [30, 'Production of two neutrons and two alpha particles, plus a residual.'],
  [32, 'Production of a neutron and a deuteron, plus a residual.'],
  [33, 'Production of a neutron and a triton, plus a residual.'],
  [34, 'Production of a neutron and a He-3 particle, plus a residual.'],
  [35, 'Production of a neutron, a deuteron, and two alpha particles, plus a residual.'],
  [36, 'Production of a neutron, a triton, and two alpha particles, plus a residual.'],
  [37, 'Production of four neutrons, plus a residual.'],
  [38, 'Fourth-chance neutron-induced fission.'],
  [41, 'Production of two neutrons and a proton, plus a residual.'],
  [42, 'Production of three neutrons and a proton, plus a residual.'],
  [44, 'Production of a neutron and two protons, plus a residual.'],
  [45, 'Production of a neutron, a proton, and an alpha particle, plus a residual.'],
  [50, 'Production of a neutron leaving the residual nucleus in the ground state.'],
  [91, 'Continuum neutron production not included in the discrete representation.'],
  [101, 'Neutron disappearance reaction sum; rarely used.'],
  [102, 'Radiative capture.'],
  [103, 'Production of a proton, plus a residual.'],
  [104, 'Production of a deuteron, plus a residual.'],
  [105, 'Production of a triton, plus a residual.'],
  [106, 'Production of a He-3 particle, plus a residual.'],
  [107, 'Production of an alpha particle, plus a residual.'],
  [108, 'Production of two alpha particles, plus a residual.'],
  [109, 'Production of three alpha particles, plus a residual.'],
  [111, 'Production of two protons, plus a residual.'],
  [112, 'Production of a proton and an alpha particle, plus a residual.'],
  [113, 'Production of a triton and two alpha particles, plus a residual.'],
  [114, 'Production of a deuteron and two alpha particles, plus a residual.'],
  [115, 'Production of a proton and a deuteron, plus a residual.'],
  [116, 'Production of a proton and a triton, plus a residual.'],
  [117, 'Production of a deuteron and an alpha particle, plus a residual.'],
  [151, 'Resonance parameters used to calculate cross sections in resolved and unresolved energy regions.'],
  [451, 'Heading, title information, descriptive data, and directory information.'],
  [452, 'Average total number of neutrons released per fission event.'],
  [454, 'Independent fission product yield data.'],
  [455, 'Average number of delayed neutrons released per fission event.'],
  [456, 'Average number of prompt neutrons released per fission event.'],
  [457, 'Radioactive decay data.'],
  [458, 'Energy release in fission for incident neutrons.'],
  [459, 'Cumulative fission product yield data.'],
  [460, 'Delayed fission photons.'],
  [500, 'Total charged-particle stopping power.'],
  [501, 'Total photo- or electro-atomic interaction.'],
  [502, 'Photon coherent scattering.'],
  [504, 'Photon incoherent scattering.'],
  [505, 'Imaginary scattering factor.'],
  [506, 'Real scattering factor.'],
  [515, 'Pair production in the electron field.'],
  [516, 'Pair production sum of MT=515 and MT=517.'],
  [517, 'Pair production in the nuclear field.'],
  [522, 'Ionization, summed over all subshells.'],
  [523, 'Photo-excitation cross section.'],
  [525, 'Large angle scattering.'],
  [526, 'Total electro-atomic scattering.'],
  [527, 'Electro-atomic bremsstrahlung.'],
  [528, 'Electro-atomic excitation cross section.'],
  [533, 'Atomic relaxation data.']
]);

const MT_RANGES = [
  {
    start: 51,
    end: 90,
    label: '51-90',
    description: (value) => `Production of a neutron with the residual nucleus in excited level ${value - 50}.`
  },
  {
    start: 152,
    end: 181,
    label: '152-181',
    description: 'Additional open reaction channels for higher incident energies.'
  },
  {
    start: 191,
    end: 193,
    label: '191-193',
    description: 'Additional charged-particle production reaction channels.'
  },
  {
    start: 203,
    end: 207,
    label: '203-207',
    description: 'Total gas-production reactions in derived files.'
  },
  {
    start: 209,
    end: 218,
    label: '209-218',
    description: 'High-energy total particle-production reactions.'
  },
  {
    start: 251,
    end: 253,
    label: '251-253',
    description: 'Derived elastic-scattering quantities for neutron data.'
  },
  {
    start: 301,
    end: 450,
    label: '301-450',
    description: (value) => `Energy-release parameter for reaction MT=${value - 300}; used in derived files.`
  },
  {
    start: 534,
    end: 572,
    label: '534-572',
    description: 'Photoelectric or electro-atomic subshell cross section.'
  },
  {
    start: 600,
    end: 648,
    label: '600-648',
    description: (value) => `Production of a proton leaving the residual nucleus in level ${value - 600}.`
  },
  {
    start: 649,
    end: 649,
    label: '649',
    description: 'Production of a proton in the continuum.'
  },
  {
    start: 650,
    end: 698,
    label: '650-698',
    description: (value) => `Production of a deuteron leaving the residual nucleus in level ${value - 650}.`
  },
  {
    start: 699,
    end: 699,
    label: '699',
    description: 'Production of a deuteron in the continuum.'
  },
  {
    start: 700,
    end: 748,
    label: '700-748',
    description: (value) => `Production of a triton leaving the residual nucleus in level ${value - 700}.`
  },
  {
    start: 749,
    end: 749,
    label: '749',
    description: 'Production of a triton in the continuum.'
  },
  {
    start: 750,
    end: 798,
    label: '750-798',
    description: (value) => `Production of a He-3 particle leaving the residual nucleus in level ${value - 750}.`
  },
  {
    start: 799,
    end: 799,
    label: '799',
    description: 'Production of a He-3 particle in the continuum.'
  },
  {
    start: 800,
    end: 848,
    label: '800-848',
    description: (value) => `Production of an alpha particle leaving the residual nucleus in level ${value - 800}.`
  },
  {
    start: 849,
    end: 849,
    label: '849',
    description: 'Production of an alpha particle in the continuum.'
  },
  {
    start: 851,
    end: 870,
    label: '851-870',
    description: 'Lumped reaction covariance or derived reaction grouping.'
  },
  {
    start: 875,
    end: 890,
    label: '875-890',
    description: (value) => `Production of two neutrons with the residual nucleus in level ${value - 875}.`
  },
  {
    start: 891,
    end: 891,
    label: '891',
    description: 'Production of two neutrons in the continuum.'
  }
];

const NSUB_DESCRIPTIONS = new Map([
  [0, 'Photo-nuclear data.'],
  [1, 'Photo-induced fission product yields.'],
  [3, 'Photo-atomic interaction data.'],
  [4, 'Radioactive decay data.'],
  [5, 'Spontaneous fission product yields.'],
  [6, 'Atomic relaxation data.'],
  [10, 'Incident-neutron data.'],
  [11, 'Neutron-induced fission product yields.'],
  [12, 'Thermal neutron scattering data.'],
  [19, 'Neutron standards data.'],
  [113, 'Electro-atomic interaction data.'],
  [10010, 'Incident-proton data.'],
  [10011, 'Proton-induced fission product yields.'],
  [10020, 'Incident-deuteron data.'],
  [10030, 'Incident-triton data.'],
  [20030, 'Incident-helion data.'],
  [20040, 'Incident-alpha data.']
]);

const NLIB_DESCRIPTIONS = new Map([
  [0, 'ENDF/B, United States Evaluated Nuclear Data File.'],
  [1, 'ENDF/A, United States Evaluated Nuclear Data File.'],
  [2, 'JEFF, NEA Joint Evaluated Fission and Fusion File.'],
  [3, 'EFF, European Fusion File.'],
  [4, 'ENDF/B High Energy File.'],
  [5, 'CENDL, China Evaluated Nuclear Data Library.'],
  [6, 'JENDL, Japan Evaluated Nuclear Data Library.'],
  [17, 'TENDL, TALYS Evaluated Nuclear Data Library.'],
  [18, 'ROSFOND, Russian evaluated neutron data library.'],
  [21, 'WPEC-SG23 fission product library.'],
  [31, 'INDL/V, IAEA Evaluated Neutron Data Library.'],
  [32, 'INDL/A, IAEA Nuclear Data Activation Library.'],
  [33, 'FENDL, IAEA Fusion Evaluated Nuclear Data Library.'],
  [34, 'IRDF, IAEA International Reactor Dosimetry File.'],
  [35, 'BROND, Russian Evaluated Nuclear Data File, IAEA version.'],
  [36, 'INGDB-90 geophysics data.'],
  [37, 'FENDL/A, FENDL activation evaluations.'],
  [41, 'BROND, original Russian Evaluated Nuclear Data File.']
]);

const INT_DESCRIPTIONS = new Map([
  [1, 'Constant interpolation in x, also called histogram interpolation.'],
  [2, 'Linear interpolation in x and y, also called linear-linear interpolation.'],
  [3, 'Linear interpolation in ln(x), also called linear-log interpolation.'],
  [4, 'Linear interpolation in ln(y), also called log-linear interpolation.'],
  [5, 'Linear interpolation in ln(x) and ln(y), also called log-log interpolation.'],
  [6, 'Special one-dimensional charged-particle cross-section interpolation law.'],
  [11, 'Method of corresponding points using constant interpolation.'],
  [12, 'Method of corresponding points using linear-linear interpolation.'],
  [13, 'Method of corresponding points using linear-log interpolation.'],
  [14, 'Method of corresponding points using log-linear interpolation.'],
  [15, 'Method of corresponding points using log-log interpolation.'],
  [21, 'Unit-base interpolation using constant interpolation.'],
  [22, 'Unit-base interpolation using linear-linear interpolation.'],
  [23, 'Unit-base interpolation using linear-log interpolation.'],
  [24, 'Unit-base interpolation using log-linear interpolation.'],
  [25, 'Unit-base interpolation using log-log interpolation.']
]);

const LR_DESCRIPTIONS = new Map([
  [0, 'Simple reaction; product identity is implicit in MT and only gamma rays may be emitted additionally.'],
  [1, 'Complex or breakup reaction; product identities and multiplicities are given explicitly in File 6.'],
  [22, 'Residual breakup flag: alpha emitted, plus residual if any.'],
  [23, 'Residual breakup flag: three alpha particles emitted, plus residual if any.'],
  [24, 'Residual breakup flag: neutron and alpha emitted, plus residual if any.'],
  [25, 'Residual breakup flag: two neutrons and alpha emitted, plus residual if any.'],
  [28, 'Residual breakup flag: proton emitted, plus residual if any.'],
  [29, 'Residual breakup flag: two alpha particles emitted, plus residual if any.']
]);

const RECORD_TYPE_DESCRIPTIONS = new Map([
  ['TPID', {
    description: 'Tape identifier record at the beginning of an ENDF tape.',
    format: 'A 66-column text field followed by MAT, MF, MT, and optional NS.'
  }],
  ['TEXT', {
    description: '66-column Hollerith text record, usually for File 1 comments.',
    format: '[MAT,MF,MT/ HL] TEXT'
  }],
  ['CONT', {
    description: 'Control record with two floating fields and four integer/control fields.',
    format: '[MAT,MF,MT/ C1,C2,L1,L2,N1,N2] CONT'
  }],
  ['HEAD', {
    description: 'Section-opening CONT record whose C1 and C2 fields contain ZA and AWR.',
    format: '[MAT,MF,MT/ ZA,AWR,L1,L2,N1,N2] HEAD'
  }],
  ['DIR', {
    description: 'Directory record; a CONT-like record with the first two fields blank in character mode.',
    format: 'CONT-shaped directory entry in MF=1, MT=451.'
  }],
  ['END', {
    description: 'Generic term for SEND, FEND, MEND, and TEND structural end records.',
    format: 'Zeroed payload fields with tail fields identifying the end level.'
  }],
  ['SEND', {
    description: 'End of section.',
    format: '[MAT,MF,0/ 0.0,0.0,0,0,0,0] SEND'
  }],
  ['FEND', {
    description: 'End of file within a material.',
    format: '[MAT,0,0/ 0.0,0.0,0,0,0,0] FEND'
  }],
  ['MEND', {
    description: 'End of material.',
    format: '[0,0,0/ 0.0,0.0,0,0,0,0] MEND'
  }],
  ['TEND', {
    description: 'End of tape.',
    format: '[-1,0,0/ 0.0,0.0,0,0,0,0] TEND'
  }],
  ['LIST', {
    description: 'Record for a list of NPL numbers following a CONT-shaped header.',
    format: '[MAT,MF,MT/ C1,C2,L1,L2,NPL,N2/ B(n)] LIST'
  }],
  ['TAB1', {
    description: 'One-dimensional tabulated function record with interpolation regions and x,y pairs.',
    format: '[MAT,MF,MT/ C1,C2,L1,L2,NR,NP/ x-int / y(x)] TAB1'
  }],
  ['TAB2', {
    description: 'Control record for tabulating a two-dimensional function over successive z values.',
    format: '[MAT,MF,MT/ C1,C2,L1,L2,NR,NZ/ z-int] TAB2'
  }],
  ['INTG', {
    description: 'Integer-format record used to store correlation matrix data.',
    format: '[MAT,MF,MT/ II,JJ,KIJ] INTG'
  }]
]);

const COMPLETION_TABLES = new Map([
  ['MF', mapToCompletionEntries('MF', MF_DESCRIPTIONS)],
  ['MT', [
    ...mapToCompletionEntries('MT', MT_DESCRIPTIONS),
    ...MT_RANGES.map((range) => ({
      label: range.label,
      insertText: String(range.start),
      detail: `MT ${range.label}`,
      documentation: rangeDocumentation(range),
      sortText: paddedSort(range.start)
    }))
  ].sort(compareCompletionEntries)],
  ['NSUB', mapToCompletionEntries('NSUB', NSUB_DESCRIPTIONS)],
  ['NLIB', mapToCompletionEntries('NLIB', NLIB_DESCRIPTIONS)],
  ['INT', mapToCompletionEntries('INT', INT_DESCRIPTIONS)],
  ['LR', mapToCompletionEntries('LR', LR_DESCRIPTIONS)]
]);

function describeRecordKey(key, value, tail) {
  const normalizedKey = normalizeKey(key);
  if (normalizedKey === 'MAT') {
    return describeMat(value, tail);
  }

  if (normalizedKey === 'MF') {
    return describeFromMap(MF_DESCRIPTIONS, value, 'ENDF file number. This identifies the broad data category for the record.');
  }

  if (normalizedKey === 'MT') {
    return describeMt(value);
  }

  if (normalizedKey === 'NS') {
    return 'Sequence number for the physical record. It is optional in some ENDF-style files.';
  }

  if (normalizedKey === 'NSUB') {
    return describeFromMap(NSUB_DESCRIPTIONS, value, 'ENDF sublibrary number, defined as 10 * IPART + ITYPE.');
  }

  if (normalizedKey === 'NLIB') {
    return describeFromMap(NLIB_DESCRIPTIONS, value, 'ENDF library identifier.');
  }

  if (normalizedKey === 'INT') {
    return describeFromMap(INT_DESCRIPTIONS, value, 'ENDF interpolation law code.');
  }

  if (normalizedKey === 'LR') {
    return describeFromMap(LR_DESCRIPTIONS, value, 'Residual breakup flag for sequential or complex reactions.');
  }

  return 'ENDF fixed-column control value.';
}

function describeReferenceRange(key, firstValue, secondValue) {
  const normalizedKey = normalizeKey(key);
  const first = Number(firstValue);
  const second = Number(secondValue);
  const firstDescription = describeRecordKey(normalizedKey, first);
  const secondDescription = describeRecordKey(normalizedKey, second);

  if (normalizedKey === 'MT') {
    const coveringRange = MT_RANGES.find((range) => first >= range.start && second <= range.end);
    if (coveringRange) {
      return `${normalizedKey} range ${firstValue}-${secondValue}: ${describeRange(coveringRange, first)} through ${describeRange(coveringRange, second)}`;
    }
  }

  return `${normalizedKey} range ${firstValue}-${secondValue}. First value: ${firstDescription} Last value: ${secondDescription}`;
}

function getRecordTypeInfo(raw) {
  const key = normalizeKey(raw);
  const info = RECORD_TYPE_DESCRIPTIONS.get(key);
  if (!info) {
    return undefined;
  }

  return { key, ...info };
}

function getCompletionEntries(key) {
  const entries = COMPLETION_TABLES.get(normalizeKey(key));
  return entries ? entries.map((entry) => ({ ...entry })) : [];
}

function getNumericCompletionContext(linePrefix) {
  const match = linePrefix.match(/(?:^|[^A-Za-z0-9_])(?<key>MF|MT|NSUB|NLIB|INT|LR)\s*(?:=|-)?\s*(?<valuePrefix>\d*)$/i);
  if (!match?.groups) {
    return undefined;
  }

  return {
    key: normalizeKey(match.groups.key),
    valuePrefix: match.groups.valuePrefix || ''
  };
}

function parseEndfNumber(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }

  let normalized = trimmed.replace(/[Dd]/g, 'E');
  if (!/[Ee]/.test(normalized)) {
    normalized = normalized.replace(/^([+-]?(?:\d+\.\d*|\.\d+|\d+))([+-]\d+)$/, '$1E$2');
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return undefined;
  }

  return formatNumber(value);
}

function describeMat(value, tail) {
  if (tail?.mat === -1 && tail?.mf === 0 && tail?.mt === 0) {
    return 'TEND marker: end of tape.';
  }

  if (tail?.mat === 0 && tail?.mf === 0 && tail?.mt === 0) {
    return 'MEND marker: end of material.';
  }

  if (value === 0) {
    return 'End-of-material marker when MF and MT are also zero.';
  }

  return 'Material identifier assigned by the ENDF library.';
}

function describeMt(value) {
  if (MT_DESCRIPTIONS.has(value)) {
    return MT_DESCRIPTIONS.get(value);
  }

  const range = MT_RANGES.find((candidate) => value >= candidate.start && value <= candidate.end);
  if (range) {
    return describeRange(range, value);
  }

  return 'ENDF reaction or section number. Check the ENDF-6 manual for this specific MT code.';
}

function describeFromMap(map, value, fallback) {
  return map.get(value) || fallback;
}

function describeRange(range, value) {
  return typeof range.description === 'function' ? range.description(value) : range.description;
}

function rangeDocumentation(range) {
  if (typeof range.description === 'function') {
    return `${range.label}: ${range.description(range.start)}`;
  }

  return `${range.label}: ${range.description}`;
}

function mapToCompletionEntries(key, map) {
  return [...map.entries()].map(([value, description]) => ({
    label: String(value),
    insertText: String(value),
    detail: `${key} ${value}`,
    documentation: description,
    sortText: paddedSort(value)
  })).sort(compareCompletionEntries);
}

function compareCompletionEntries(left, right) {
  return left.sortText.localeCompare(right.sortText) || left.label.localeCompare(right.label);
}

function paddedSort(value) {
  return String(value).padStart(6, '0');
}

function normalizeKey(key) {
  return String(key).toUpperCase();
}

function formatNumber(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return Number(value.toPrecision(12)).toString();
}

module.exports = {
  describeRecordKey,
  describeReferenceRange,
  getCompletionEntries,
  getNumericCompletionContext,
  getRecordTypeInfo,
  parseEndfNumber
};
