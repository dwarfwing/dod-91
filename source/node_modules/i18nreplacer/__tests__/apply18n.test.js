import { describe,expect, it } from 'vitest'
import { apply18n } from '../index'

describe('apply18n',() => {
  it('Should not add data-i18n for elements that already have data-i18n',() => {
    const testHTML = '<span data-i18n="test-key">Test Text</span>';
    const withI18n = apply18n(testHTML);

    console.log('expected',testHTML);
    console.log('received',withI18n);

    expect(withI18n).toBe(testHTML);
  });
  it('Should add data-i18n to elements that immediately contain text content',() => {
    const testHTML = '<div><span>Test Text</span></div>';
    const withI18n = apply18n(testHTML);

    expect(withI18n).toMatchInlineSnapshot(`"<div><span data-i18n="Test Text">Test Text</span></div>"`);
  });
  const keyText = [['title'],['placeholder'],['label'],['aria-label'],['alt']];
  it.each(keyText)('Should add data-i18n-%s if the key is present', (key) => {
    const testHTML = `<div ${key}="${key} content"></div>`;
    const expected = testHTML.replace(/></,` data-i18n-${key}="${key} content"><`);
    const withI18n = apply18n(testHTML);

    expect(withI18n).toBe(expected);
  });
})