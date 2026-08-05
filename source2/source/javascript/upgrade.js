/**
 * Updates to version 1.1. Converts ability name attribute to skill_name.
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const updatev1dot1 = function({trigger,attributes,sections,casc}) {
   k.log(`Updating from v1 to v1.1`);
   sections.repeating_abilities.forEach( (rowId) => {
      const row = `repeating_abilities_${rowId}`;
      k.log(`Updating name for ability row ${row}`);
      const name = attributes[`${row}_name`],
            skill_name = attributes[`${row}_skill_name`];
      k.log(`Name ${name} to skill name ${skill_name}`);
      if( (skill_name == undefined || skill_name == '') && (name != undefined || name != '') ) {
         k.log(`Setting name ${name} to skill name ${skill_name}`);
         attributes[`${row}_skill_name`] = name; 
      }
   });
   attributes.version = '1.1';
   attributes.set();
}
k.registerFuncs({'1.1':updatev1dot1},{type:['updater']});

/**
 * Updates to version 1.1. Converts ability name attribute to skill_name.
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const updatev1dot2 = function({trigger,attributes,sections,casc}) {
   k.log(`Updating to v1.2`);
   sections.repeating_weapons.forEach( (rowId) => {
      const row = `repeating_weapons_${rowId}`;
      k.debug(`Updating weapon ${row}`);
      const weaponSkill = attributes[`${row}_skill`];
      const weaponName = attributes[`${row}_name`];
      k.debug(`Updating weapon ${weaponName} with skill ${weaponSkill}`);

      if ( weaponSkill == 'melee' || 
         weaponSkill == 'martial_arts'  || 
         weaponSkill == 'sabrefencing' || 
         weaponSkill == 'bodybombing' || 
         weaponSkill == 'knifefighting' ) {
            attributes[`${row}_damagebonus`] = 1;
            k.log(`Updating weapon ${weaponName} with skill ${weaponSkill} to have SB`);
      }
   });
   attributes.version = '1.2';
   attributes.set();
}
k.registerFuncs({'1.2':updatev1dot2},{type:['updater']});
