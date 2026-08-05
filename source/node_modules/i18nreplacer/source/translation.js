const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * 
 * @param {string|HTMLDocument} document - HTML either as a string or as already parsed into a document by JSDOM.
 * @returns {object} - The generated translation.json object.
 */
module.exports = function(document){
  if(typeof document === 'string'){
    const dom = new JSDOM(document);
    const { window } = dom;
    const { document:doc } = window;
    document = doc;
  }
  const elements = [...document.querySelectorAll('*')];
  const translations = elements.reduce((obj,elem) => {
    [...elem.attributes].forEach(({name:attr,nodeValue:key}) => {
      const [,isI18n,i18nType] = attr.match(/(i18n)(?:-(.+))?$/) || [];
      if(!isI18n || i18nType === 'list-item') return;

      if(i18nType === 'list'){
        obj[key] = [...elem.querySelectorAll('[data-list-item]')]
          .map(child => child.dataset['i18nListItem'])
          .filter(s => s && s.trim())
          .join(',');
      }else{
        obj[key] = (i18nType ?
          elem.getAttribute(i18nType) :
          elem.textContent.trim()) || key;
      }
    });
    return obj;
  },{});
  const retTranslations = Object.keys(translations)
    .sort((a,b) => a.localeCompare(b))
    .reduce((obj,key) => {
      obj[key] = translations[key];
      return obj;
    },{});
  return retTranslations;
}