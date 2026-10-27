/**
 * Adds the custom skills to the selects for selecting which magic skill to use. Runs when an ability is created, when a secondary skill name is updated, or when a secondary skill is removed.
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const weaponSkillSelect = function({trigger,attributes,sections,casc}){
  // assemble the options.
  const optionsArray = sections['repeating_weaponskills']
    .filter(id => id)
    .reduce((arr,id) => {
      arr.push({value:'repeating_weaponskills_'+id.toLowerCase(),label:attributes[`repeating_weaponskills_${id}_name`] || ' '});
      k.log(`Weapon skill update array: ${JSON.stringify(arr)}`);
      return arr;
    },[{label:'Slagsmål',value:'prim_slagsmal'}]);
    // REMoved teh init array [spine.weap
    // ontypes] since only weapon skills can be used
  optionsArray.push({label:'Manuellt',value:'custom'});
  k.log(`Weapon skill update array done: ${JSON.stringify(optionsArray)}`);
  populateListOptions({elemSelector:'.weapon-skill-select',optionsArray});
  // iterate over all weapons and either leave them as they are or reset them to the default if their selected skill is no longer present.
  sections.repeating_weapons
    .filter(id => id)
    .forEach(id => {
      const row = `repeating_weapons_${id}`;
      attributes[`${row}_skill`] = optionsArray.some(obj => obj.value === attributes[`${row}_skill`]) ?
        attributes[`${row}_skill`] :
        'custom';
    });
  attributes.set(); 
  setWeaponSkills({trigger,attributes,sections,casc});
};
k.registerFuncs({weaponSkillSelect},{type:['opener']});


const weaponskillsAdd = async function({trigger,attributes,sections,casc}) {
   k.log(`Add weapon skill trigger: ${JSON.stringify(trigger)}`);
   //await attributes.repeating_weaponskills.create({name:' '}); 
   weaponSkillSelect({attributes,sections});
}
k.registerFuncs({weaponskillsAdd});


