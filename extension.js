const vscode = require('vscode');
const {
  describeRecordKey,
  describeReferenceRange,
  getCompletionEntries,
  getNumericCompletionContext,
  getRecordTypeInfo,
  parseEndfNumber
} = require('./endfReference');

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

const REFERENCE_PATTERN = /\b(MAT|MF|MT|NS|NSUB|NLIB|INT|LR)\s*(=|-)?\s*(\d+)(?:\s*(-)\s*(\d+))?\b/gi;
const RECORD_TYPE_PATTERN = /\b(TPID|TEXT|CONT|DIR|HEAD|END|SEND|FEND|MEND|TEND|LIST|TAB1|TAB2|INTG)\b/gi;
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

  context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'endf' }, {
    provideCompletionItems(document, position) {
      return provideReferenceCompletions(document, position);
    }
  }, '=', ' '));

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

function provideReferenceCompletions(document, position) {
  const linePrefix = document.lineAt(position.line).text.slice(0, position.character);
  const context = getNumericCompletionContext(linePrefix);
  if (!context) {
    return undefined;
  }

  const entries = getCompletionEntries(context.key)
    .filter((entry) => !context.valuePrefix || entry.label.startsWith(context.valuePrefix) || entry.insertText.startsWith(context.valuePrefix));
  if (!entries.length) {
    return undefined;
  }

  const replacementRange = new vscode.Range(
    position.line,
    position.character - context.valuePrefix.length,
    position.line,
    position.character
  );

  return entries.map((entry) => {
    const item = new vscode.CompletionItem(entry.label, vscode.CompletionItemKind.Value);
    item.insertText = entry.insertText;
    item.detail = entry.detail;
    item.documentation = new vscode.MarkdownString(entry.documentation);
    item.range = replacementRange;
    item.sortText = entry.sortText;
    return item;
  });
}

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
    || describeRecordTypeReference(line, position.line, column)
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

    const key = match[1].toUpperCase();
    const firstValue = match[3];
    const secondValue = match[5];
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

function describeRecordTypeReference(line, lineNumber, column) {
  RECORD_TYPE_PATTERN.lastIndex = 0;
  for (const match of line.matchAll(RECORD_TYPE_PATTERN)) {
    const start = match.index;
    const end = start + match[0].length;
    if (column < start || column >= end) {
      continue;
    }

    const info = getRecordTypeInfo(match[1]);
    if (!info) {
      continue;
    }

    const markdown = [
      `**ENDF ${info.key} record**`,
      '',
      `Raw: \`${match[0]}\``,
      `Meaning: ${info.description}`,
      info.format ? `Format: \`${info.format}\`` : undefined
    ].filter(Boolean).join('\n\n');

    return {
      range: new vscode.Range(lineNumber, start, lineNumber, end),
      markdown,
      statusText: `${info.key}: ${info.description}`
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

function describeRecordContext(tail) {
  if (tail.mat === undefined && tail.mf === undefined && tail.mt === undefined) {
    return undefined;
  }

  const parts = [];
  if (tail.mat !== undefined) {
    parts.push(`MAT ${tail.mat}`);
  }

  if (tail.mf !== undefined) {
    parts.push(`MF ${tail.mf} (${describeRecordKey('MF', tail.mf)})`);
  }

  if (tail.mt !== undefined) {
    parts.push(`MT ${tail.mt} (${describeRecordKey('MT', tail.mt)})`);
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
