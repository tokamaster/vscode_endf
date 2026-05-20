const vscode = require('vscode');

const PAYLOAD_FIELDS = [
  {
    key: 'C1',
    start: 0,
    end: 11,
    meaning: 'First context-dependent floating/control field. In HEAD records this is often ZA, the projectile/material identifier 1000 * Z + A.'
  },
  {
    key: 'C2',
    start: 11,
    end: 22,
    meaning: 'Second context-dependent floating/control field. In HEAD records this is often AWR, the atomic weight ratio.'
  },
  {
    key: 'L1',
    start: 22,
    end: 33,
    meaning: 'First context-dependent integer flag.'
  },
  {
    key: 'L2',
    start: 33,
    end: 44,
    meaning: 'Second context-dependent integer flag.'
  },
  {
    key: 'N1',
    start: 44,
    end: 55,
    meaning: 'First context-dependent integer count or code.'
  },
  {
    key: 'N2',
    start: 55,
    end: 66,
    meaning: 'Second context-dependent integer count or code.'
  }
];

const TAIL_FIELDS = [
  { key: 'MAT', start: 66, end: 70 },
  { key: 'MF', start: 70, end: 72 },
  { key: 'MT', start: 72, end: 75 },
  { key: 'NS', start: 75, end: 80 }
];

const MF_DESCRIPTIONS = new Map([
  [0, 'End-record marker used with SEND, FEND, MEND, or TEND records.'],
  [1, 'General information.'],
  [2, 'Resonance parameter data.'],
  [3, 'Reaction cross sections.'],
  [4, 'Angular distributions of emitted particles.'],
  [5, 'Energy distributions of emitted particles.'],
  [6, 'Product energy-angle distributions.'],
  [7, 'Thermal neutron scattering law data.'],
  [8, 'Radioactive decay and fission product yield data.'],
  [9, 'Multiplicities for radioactive nuclide production.'],
  [10, 'Cross sections for radioactive nuclide production.'],
  [12, 'Photon production multiplicities and transition probabilities.'],
  [13, 'Photon production cross sections.'],
  [14, 'Photon angular distributions.'],
  [15, 'Continuous photon energy spectra.'],
  [23, 'Photon or electro-atomic interaction cross sections.'],
  [26, 'Electro-atomic angle and energy distributions.'],
  [27, 'Atomic form factors or scattering functions.'],
  [28, 'Atomic relaxation data.'],
  [30, 'Data covariances from parameter covariances and uncertainties.'],
  [31, 'Covariances of average neutron multiplicities.'],
  [32, 'Covariances of resonance parameters.'],
  [33, 'Covariances of neutron cross sections.'],
  [34, 'Covariances of angular distributions.'],
  [35, 'Covariances of energy distributions.'],
  [40, 'Covariances of radionuclide production cross sections.']
]);

const MT_DESCRIPTIONS = new Map([
  [0, 'End-record marker used with SEND, FEND, MEND, or TEND records.'],
  [1, 'Total cross section.'],
  [2, 'Elastic scattering.'],
  [3, 'Nonelastic cross section.'],
  [4, 'Total inelastic scattering.'],
  [5, 'Sum of reactions not otherwise represented by another MT number.'],
  [11, '2nd neutron production.'],
  [16, '(n,2n).'],
  [17, '(n,3n).'],
  [18, 'Fission.'],
  [19, 'First-chance fission.'],
  [20, 'Second-chance fission.'],
  [21, 'Third-chance fission.'],
  [22, '(n,n alpha).'],
  [24, '(n,2n alpha).'],
  [25, '(n,3n alpha).'],
  [28, '(n,np).'],
  [32, '(n,nd).'],
  [33, '(n,nt).'],
  [34, '(n,n He-3).'],
  [37, '(n,4n).'],
  [38, 'Fourth-chance fission.'],
  [41, '(n,2np).'],
  [42, '(n,3np).'],
  [44, '(n,n2p).'],
  [45, '(n,np alpha).'],
  [91, 'Continuum inelastic scattering.'],
  [101, 'Neutron disappearance.'],
  [102, 'Radiative capture, usually (n,gamma).'],
  [103, '(n,p).'],
  [104, '(n,d).'],
  [105, '(n,t).'],
  [106, '(n,He-3).'],
  [107, '(n,alpha).'],
  [108, '(n,2 alpha).'],
  [109, '(n,3 alpha).'],
  [111, '(n,2p).'],
  [112, '(n,p alpha).'],
  [151, 'Resolved and unresolved resonance parameters.'],
  [452, 'Total neutron multiplicity, nu-bar.'],
  [455, 'Delayed neutron multiplicity.'],
  [456, 'Prompt neutron multiplicity.'],
  [458, 'Energy release from fission.'],
  [459, 'Cumulative fission product yield.'],
  [460, 'Delayed photon data.'],
  [451, 'Descriptive data and directory.']
]);

const REFERENCE_PATTERN = /\b(MAT|MF|MT)\s*(=|-)?\s*(\d+)(?:\s*(-)\s*(\d+))?\b/g;
const NUMBER_PATTERN = /[+-]?(?:\d+\.\d*|\.\d+|\d+)(?:[EeDd][+-]?\d+|[+-]\d+)?/g;

function activate(context) {
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.name = 'ENDF selection meaning';
  context.subscriptions.push(statusBar);

  context.subscriptions.push(vscode.languages.registerHoverProvider({ language: 'endf' }, {
    provideHover(document, position) {
      const info = getEndfInfoAt(document, position);
      if (!info) {
        return undefined;
      }

      const markdown = new vscode.MarkdownString(info.markdown);
      markdown.supportThemeIcons = true;
      return new vscode.Hover(markdown, info.range);
    }
  }));

  const updateStatusBar = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'endf') {
      statusBar.hide();
      return;
    }

    const position = getStatusPosition(editor);
    const info = getEndfInfoAt(editor.document, position);
    if (!info) {
      statusBar.hide();
      return;
    }

    statusBar.text = `$(info) ${info.statusText}`;
    statusBar.tooltip = stripMarkdown(info.markdown);
    statusBar.show();
  };

  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
  context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBar));
  updateStatusBar();
}

function deactivate() {}

function getStatusPosition(editor) {
  const selection = editor.selection;
  if (!selection.isEmpty && selection.start.line === selection.end.line) {
    const lineText = editor.document.lineAt(selection.start.line).text;
    const selectedText = lineText.slice(selection.start.character, selection.end.character);
    const firstNonWhitespace = selectedText.search(/\S/);
    if (firstNonWhitespace >= 0) {
      return new vscode.Position(selection.start.line, selection.start.character + firstNonWhitespace);
    }
  }

  return selection.active;
}

function getEndfInfoAt(document, position) {
  if (position.line >= document.lineCount) {
    return undefined;
  }

  const line = document.lineAt(position.line).text;
  const column = position.character;
  return describeTextReference(line, position.line, column)
    || describeTailField(line, position.line, column)
    || describePayloadField(line, position.line, column);
}

function describeTextReference(line, lineNumber, column) {
  REFERENCE_PATTERN.lastIndex = 0;
  for (const match of line.matchAll(REFERENCE_PATTERN)) {
    const start = match.index;
    const end = start + match[0].length;
    if (column < start || column >= end) {
      continue;
    }

    const key = match[1];
    const firstValue = match[3];
    const secondValue = match[5];
    const firstStart = start + match[0].indexOf(firstValue);
    const firstEnd = firstStart + firstValue.length;
    const secondStart = secondValue ? start + match[0].lastIndexOf(secondValue) : undefined;
    const secondEnd = secondStart !== undefined ? secondStart + secondValue.length : undefined;
    const selectedRaw = secondStart !== undefined && column >= secondStart && column < secondEnd
      ? secondValue
      : firstValue;
    const value = Number(selectedRaw);
    const meaning = secondValue
      ? describeReferenceRange(key, firstValue, secondValue)
      : describeRecordKey(key, value);
    const range = new vscode.Range(lineNumber, start, lineNumber, end);
    const markdown = [
      `**ENDF ${key} reference**`,
      '',
      `Raw: \`${match[0]}\``,
      secondValue ? `Range: \`${firstValue}-${secondValue}\`` : `Value: \`${selectedRaw}\``,
      secondValue ? `Selected value: \`${selectedRaw}\`` : undefined,
      `Meaning: ${meaning}`
    ].filter(Boolean).join('\n\n');

    return {
      range,
      markdown,
      statusText: `${key} ${selectedRaw}: ${secondValue ? describeRecordKey(key, value) : meaning}`
    };
  }

  return undefined;
}

function describeTailField(line, lineNumber, column) {
  const tailField = TAIL_FIELDS.find((field) => column >= field.start && column < field.end);
  if (!tailField) {
    return undefined;
  }

  const raw = line.slice(tailField.start, tailField.end);
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return undefined;
  }

  const tail = parseTail(line);
  const meaning = describeRecordKey(tailField.key, value, tail);
  const valueRange = rangeForTrimmedText(lineNumber, tailField.start, raw);
  const context = describeRecordContext(tail);
  const markdown = [
    `**ENDF ${tailField.key} field**`,
    '',
    `Columns: ${tailField.start + 1}-${tailField.end}`,
    `Raw: \`${raw}\``,
    `Value: \`${trimmed}\``,
    `Meaning: ${meaning}`,
    context ? `Record context: ${context}` : undefined
  ].filter(Boolean).join('\n\n');

  return {
    range: valueRange,
    markdown,
    statusText: `${tailField.key} ${trimmed}: ${meaning}`
  };
}

function describePayloadField(line, lineNumber, column) {
  const payloadField = PAYLOAD_FIELDS.find((field) => column >= field.start && column < field.end);
  if (!payloadField) {
    return undefined;
  }

  const raw = line.slice(payloadField.start, payloadField.end);
  if (!isNumericPayloadField(raw)) {
    return undefined;
  }

  const token = findNumberInField(raw, payloadField.start, column);
  if (!token) {
    return undefined;
  }

  const parsed = parseEndfNumber(token.raw);
  const tail = parseTail(line);
  const context = describeRecordContext(tail);
  const markdown = [
    `**ENDF payload field ${payloadField.key}**`,
    '',
    `Columns: ${payloadField.start + 1}-${payloadField.end}`,
    `Raw: \`${token.raw}\``,
    parsed ? `Parsed value: \`${parsed}\`` : undefined,
    `Meaning: ${payloadField.meaning}`,
    'Note: Payload field semantics are record-specific; this extension reports the fixed ENDF field role unless a more specific rule is known.',
    context ? `Record context: ${context}` : undefined
  ].filter(Boolean).join('\n\n');

  return {
    range: new vscode.Range(lineNumber, token.start, lineNumber, token.end),
    markdown,
    statusText: `${payloadField.key} ${token.raw.trim()}${parsed ? ` = ${parsed}` : ''}`
  };
}

function isNumericPayloadField(raw) {
  return /\d/.test(raw) && /^[\s+\-.0-9EeDd]+$/.test(raw);
}

function findNumberInField(raw, fieldStart, column) {
  NUMBER_PATTERN.lastIndex = 0;
  for (const match of raw.matchAll(NUMBER_PATTERN)) {
    const start = fieldStart + match.index;
    const end = start + match[0].length;
    if (column >= start && column < end) {
      return { raw: match[0], start, end };
    }
  }

  return undefined;
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

function formatNumber(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return Number(value.toPrecision(12)).toString();
}

function parseTail(line) {
  return {
    mat: toNumber(line.slice(66, 70)),
    mf: toNumber(line.slice(70, 72)),
    mt: toNumber(line.slice(72, 75)),
    ns: toNumber(line.slice(75, 80))
  };
}

function toNumber(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }

  const value = Number(trimmed);
  return Number.isFinite(value) ? value : undefined;
}

function describeRecordKey(key, value, tail) {
  if (key === 'MAT') {
    return describeMat(value, tail);
  }

  if (key === 'MF') {
    return MF_DESCRIPTIONS.get(value) || 'ENDF file number. This identifies the broad data category for the record.';
  }

  if (key === 'MT') {
    return describeMt(value);
  }

  if (key === 'NS') {
    return 'Sequence number for the physical record. It is optional in some ENDF-style files.';
  }

  return 'ENDF fixed-column control value.';
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

  if (value >= 51 && value <= 90) {
    return `Discrete inelastic scattering level ${value - 50}.`;
  }

  if (value >= 600 && value <= 649) {
    return 'Proton production reaction, level, or continuum subsection.';
  }

  if (value >= 650 && value <= 699) {
    return 'Deuteron production reaction, level, or continuum subsection.';
  }

  if (value >= 700 && value <= 749) {
    return 'Triton production reaction, level, or continuum subsection.';
  }

  if (value >= 750 && value <= 799) {
    return 'Helium-3 production reaction, level, or continuum subsection.';
  }

  if (value >= 800 && value <= 849) {
    return 'Alpha production reaction, level, or continuum subsection.';
  }

  if (value >= 851 && value <= 870) {
    return 'Lumped reaction covariance or derived reaction grouping.';
  }

  return 'ENDF reaction or section number. Check the ENDF-6 manual for this specific MT code.';
}

function describeReferenceRange(key, firstValue, secondValue) {
  const first = Number(firstValue);
  const second = Number(secondValue);
  if (key === 'MT' && first >= 51 && second <= 90) {
    return `MT range ${firstValue}-${secondValue}: discrete inelastic scattering levels ${first - 50}-${second - 50}.`;
  }

  return `${key} range ${firstValue}-${secondValue}. First value: ${describeRecordKey(key, first)} Last value: ${describeRecordKey(key, second)}`;
}

function describeRecordContext(tail) {
  if (tail.mat === undefined && tail.mf === undefined && tail.mt === undefined) {
    return undefined;
  }

  const parts = [];
  if (tail.mat !== undefined) {
    parts.push(`MAT ${tail.mat}`);
  }

  if (tail.mf !== undefined) {
    parts.push(`MF ${tail.mf}${MF_DESCRIPTIONS.has(tail.mf) ? ` (${MF_DESCRIPTIONS.get(tail.mf)})` : ''}`);
  }

  if (tail.mt !== undefined) {
    parts.push(`MT ${tail.mt}${describeMt(tail.mt) ? ` (${describeMt(tail.mt)})` : ''}`);
  }

  if (tail.ns !== undefined) {
    parts.push(`NS ${tail.ns}`);
  }

  return parts.join(', ');
}

function rangeForTrimmedText(lineNumber, fieldStart, raw) {
  const leading = raw.search(/\S/);
  const start = leading >= 0 ? fieldStart + leading : fieldStart;
  const trailing = raw.match(/\s*$/)[0].length;
  const end = fieldStart + raw.length - trailing;
  return new vscode.Range(lineNumber, start, lineNumber, Math.max(start, end));
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\n{2,}/g, '\n');
}

module.exports = {
  activate,
  deactivate,
  getEndfInfoAt,
  parseEndfNumber
};
