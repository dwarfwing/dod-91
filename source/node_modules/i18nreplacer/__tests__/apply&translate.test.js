import { describe,expect, it } from 'vitest'
import { translate,apply18n } from '../index'

describe('Using apply18n with translate',() => {
  it('Should create the translation.json for returned html',()=>{
    const testHTML = '<div><span>Test Text</span></div>';
    const translated = apply18n(testHTML);
    const json = translate(translated);

    expect(json).toStrictEqual({'Test Text':'Test Text'});
  });
  it('Should use the original data-i18n keys if the html was partially translated',() => {
    const testHTML = '<div><span data-i18n="span-key" title="span title">Test Text</span></div>';
    const translated = apply18n(testHTML);
    const json = translate(translated);

    expect(json).toStrictEqual({
      'span-key':'Test Text',
      'span title': 'span title'
    });
  });
});