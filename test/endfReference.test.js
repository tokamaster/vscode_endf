const assert = require('node:assert/strict');
const test = require('node:test');
const {
  describeRecordKey,
  describeReferenceRange,
  getCompletionEntries,
  getNumericCompletionContext,
  getRecordTypeInfo,
  parseEndfNumber
} = require('../endfReference');

test('describes core MF codes from the manual table', () => {
  assert.equal(describeRecordKey('MF', 3), 'Reaction cross sections.');
});

test('describes common and ranged MT codes', () => {
  assert.equal(describeRecordKey('MT', 51), 'Production of a neutron with the residual nucleus in excited level 1.');
  assert.equal(describeRecordKey('MT', 102), 'Radiative capture.');
  assert.equal(describeRecordKey('MT', 600), 'Production of a proton leaving the residual nucleus in level 0.');
  assert.equal(describeRecordKey('MT', 875), 'Production of two neutrons with the residual nucleus in level 0.');
});

test('describes NSUB, INT, and LR codes', () => {
  assert.equal(describeRecordKey('NSUB', 10), 'Incident-neutron data.');
  assert.equal(describeRecordKey('INT', 6), 'Special one-dimensional charged-particle cross-section interpolation law.');
  assert.equal(describeRecordKey('LR', 24), 'Residual breakup flag: neutron and alpha emitted, plus residual if any.');
});

test('describes record types', () => {
  assert.equal(getRecordTypeInfo('TAB1').description, 'One-dimensional tabulated function record with interpolation regions and x,y pairs.');
});

test('falls back for unknown numeric references', () => {
  assert.equal(describeRecordKey('MT', 999), 'ENDF reaction or section number. Check the ENDF-6 manual for this specific MT code.');
  assert.equal(describeRecordKey('NSUB', 999), 'ENDF sublibrary number, defined as 10 * IPART + ITYPE.');
});

test('describes ranges with selected endpoint meanings', () => {
  assert.match(describeReferenceRange('MT', '52', '82'), /MT range 52-82/);
  assert.match(describeReferenceRange('MT', '52', '82'), /excited level 2/);
});

test('parses ENDF implicit-exponent numbers', () => {
  assert.equal(parseEndfNumber('3.007000+3'), '3007');
  assert.equal(parseEndfNumber('6.955732+0'), '6.955732');
  assert.equal(parseEndfNumber('1.250000-2'), '0.0125');
});

test('finds numeric completion contexts', () => {
  assert.deepEqual(getNumericCompletionContext('MT='), { key: 'MT', valuePrefix: '' });
  assert.deepEqual(getNumericCompletionContext('some text NSUB=1'), { key: 'NSUB', valuePrefix: '1' });
});

test('provides completion entries for lookup keys', () => {
  const mfEntries = getCompletionEntries('MF');
  assert.ok(mfEntries.some((entry) => entry.label === '3' && entry.documentation === 'Reaction cross sections.'));

  const mtEntries = getCompletionEntries('MT');
  assert.ok(mtEntries.some((entry) => entry.label === '102' && entry.documentation === 'Radiative capture.'));
  assert.ok(mtEntries.some((entry) => entry.label === '875-890'));
});
