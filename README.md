# ENDF Syntax Highlighting

Syntax highlighting for ENDF and ENDF-6 evaluated nuclear data files in VS Code.

This extension helps inspect fixed-width ENDF records by contributing a
language id, a TextMate grammar, and a small runtime hover provider. It is
intentionally lightweight: there is no parser, diagnostics engine, language
server, or network dependency.

## Supported Files

VS Code recognizes these extensions as ENDF by default:

- `.endf`
- `.endf6`
- `.pendf`
- `.gendf`
- `.tape`

It also recognizes ENDF-like `.dat` files through ENDF-specific filename
patterns such as `*endf*.dat`, `*pendf*.dat`, and `*gendf*.dat`. Generic `.dat`
files are not claimed by extension alone; files with no specific extension can
still be detected when the first line has an ENDF-like fixed-column tail.

## Highlighting Model

ENDF records are fixed-width cards. The grammar treats each line as:

- columns 1-66: payload fields
- columns 67-70: `MAT`
- columns 71-72: `MF`
- columns 73-75: `MT`
- columns 76-80: optional sequence number (`NS`)

Both 75-column records, where the sequence number is omitted, and standard
80-column records are supported.

The grammar highlights:

- fixed-width numeric payload fields, including ENDF implicit-exponent values
  such as `3.007000+3`
- integer control fields
- `MAT`, `MF`, `MT`, and optional `NS` tail columns
- `SEND`, `FEND`, `MEND`, and `TEND` structural end records
- `MF ...`, `MT ...`, `MF=...`, and `MT=...` references in descriptive text

## Number Meanings

When the cursor, selection, or hover is on a recognized ENDF number, the
extension explains the fixed-column meaning. Selection and cursor movement update
the status bar; hover shows the fuller explanation.

- payload fields in columns 1-66 are identified as `C1`, `C2`, `L1`, `L2`,
  `N1`, or `N2`, with parsed ENDF implicit-exponent values
- tail fields in columns 67-80 are identified as `MAT`, `MF`, `MT`, and `NS`
- common `MF` and `MT` numbers are expanded to their ENDF-6 descriptions
- textual references such as `MF=3`, `MF3`, `MF 12`, `MT=102`, `MT1`, and
  `MT=52-82` are also explained
- manual-backed references for `NSUB`, `NLIB`, `INT`, `LR`, and ENDF record
  types such as `TEXT`, `CONT`, `HEAD`, `LIST`, `TAB1`, `TAB2`, `INTG`,
  `SEND`, `FEND`, `MEND`, and `TEND` are explained in hovers

## Reference Completions

The extension provides lightweight completions for common ENDF manual lookup
codes. In ENDF documents, type a supported key followed by `=` or a space to see
curated suggestions:

- `MF=` for file-type numbers
- `MT=` for common reaction type numbers and important ranges
- `NSUB=` for sublibrary numbers
- `NLIB=` for library identifiers
- `INT=` for interpolation laws
- `LR=` for residual breakup flags

Payload field meanings are often record-specific, so the hover reports the
reliable fixed-field role unless a standard `MF`/`MT` code description applies.

## Local Testing

Open this folder in VS Code and press `F5`, or run **Run Extension** from the
Run and Debug view. In the Extension Development Host, open a local ENDF test
file; VS Code should select the `ENDF` language mode automatically for supported
extensions and ENDF-like fixed-column first lines.

Useful sample checks:

- line 2: ENDF numeric `HEAD`-style fields and `MAT/MF/MT` tail
- lines 18-19: descriptive `MF 12` / `MT 102` text
- lines 456-457: `SEND` and `FEND`
- lines 5505-5506: `MEND` and `TEND`

Use **Developer: Inspect Editor Tokens and Scopes** in VS Code to inspect the
actual TextMate scopes assigned to a token.

## Install From Source

Clone the repository and package the extension locally:

```shell
npx @vscode/vsce package --no-dependencies
code --install-extension endf-syntax-0.0.1.vsix
```

Local sample ENDF files used for development checks are ignored by git and are
not included in the packaged extension.

## Development

The extension entry point is `extension.js`, the manual-backed reference data is
curated in `endfReference.js`, the language contribution is declared in
`package.json`, and the TextMate grammar is in `syntaxes/endf.tmLanguage.json`.

Run the lightweight unit tests with:

```shell
npm test
```

To test changes, open the repository in VS Code and use the provided
`.vscode/launch.json` configuration. Reload the Extension Development Host
after grammar or runtime edits.

## Issues

Please report bugs and syntax highlighting gaps at
https://github.com/tokamaster/vscode_endf/issues.

## License

This project is released under the MIT License. See `LICENSE` for details.

## References

- [IAEA ENDF-6 format overview](https://www-nds.iaea.org/public/endf/)
- [ENDF-6 Formats Manual, ENDF-102 PDF](https://www-nds.iaea.org/nrdc/nrdc_doc/bnl-90365-2009-rev2.pdf)
