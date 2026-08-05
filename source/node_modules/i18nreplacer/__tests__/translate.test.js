import { describe,expect, it, test } from 'vitest'
import { translate } from '../index'

describe('translate',() => {
  it('should return an empty object if no text content and no translatable attributes.',() => {
    const testHTML = '<div><input type="text" name="attr_test"></div>';
    const json = translate(testHTML);

    expect(json).toStrictEqual({});
  });
  it('Should return an object with text content as the value for data-i18n and attribute values as the value for data-i18n-keys',()=>{
    const testHTML = '<div><span name="attr_test" type="text" data-i18n-title="title-key" title="title key" data-i18n="content-key">Span Content</span></div>';
    const json = translate(testHTML);

    expect(json).toStrictEqual({
      'title-key':'title key',
      'content-key': 'Span Content'
    });
  });
  it('Should use the i18n value if no text content or value for a matching attribute is present',() => {
    const testHTML = '<div><span name="attr_test" type="text" data-i18n-title="title-key" data-i18n="content-key"></span></div>';
    const json = translate(testHTML);

    expect(json).toStrictEqual({
      'title-key': 'title-key',
      'content-key': 'content-key'
    });
  })
});