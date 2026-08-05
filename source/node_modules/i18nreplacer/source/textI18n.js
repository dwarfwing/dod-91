const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * 
 * @param {string|HTMLDocument} document - HTML either as a string or as already parsed into a document by JSDOM.
 * @returns {string} - serialized version of the manipulated html as string.
 */
module.exports = function(document) {
  if(typeof document === 'string'){
    const dom = new JSDOM(document);
    const { window } = dom;
    const { document:doc } = window;
    document = doc;
  }
  [...document.querySelectorAll(':not(script,style)')].forEach(elem => {
    if(
      !elem.firstElementChild &&
      !elem.hasAttribute('data-i18n') &&
      elem.textContent.trim()
    ){
      elem.setAttribute('data-i18n',elem.textContent);
    }
    ['title','placeholder','label','aria-label','alt'].forEach(prop => {
      const value = elem.getAttribute(prop);
      if(
        value &&
        !elem.hasAttribute(`data-i18n-${prop}`)
      ){
        elem.setAttribute(`data-i18n-${prop}`,value);
      }
    });
  });
  return document.body.innerHTML;
}