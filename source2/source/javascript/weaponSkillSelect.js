/**
 * Adds the custom skills to the selects for selecting which magic skill to use. Runs when an ability is created, when a secondary skill name is updated, or when a secondary skill is removed.
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const weaponSkillSelect = function({trigger,attributes,sections,casc}){
  // assemble the options.
  const optionsArray = sections['repeating_weapon-skills']
    .filter(id => id)
    .reduce((arr,id) => {
      arr.push({value:id.toLowerCase(),label:attributes[`repeating_weapon-skills_${id}_name`] || getTranslationByKey('New Skill')});
      return arr;
    },[spine.weapontypes]);
  populateListOptions({elemSelector:'.weapon-skill-select',optionsArray});
  // iterate over all abilities and either leave them as they are or reset them to the default if their selected skill is no longer present.
  sections.repeating_abilities
    .filter(id => id)
    .forEach(id => {
      const row = `repeating_weapons_${id}`;
      attributes[`${row}_skill`] = optionsArray.some(obj => obj.value === attributes[`${row}_skill`]) ?
        attributes[`${row}_skill`] :
        'custom';
    });
};
k.registerFuncs({weaponSkillSelect},{type:['opener']});