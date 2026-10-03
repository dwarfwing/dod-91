const resetExperience = async function({trigger,attributes,sections,casc}) {   

   //spine.primaryskills
   const primSkills = Array.from(spine.primaryskills, (x) => x.attr);
   
   //
   const profSkills = [];
   initNumberedArray(12).forEach( id => {
      profSkills.push('yrkes_'+id);
   });
   k.log(`Profession skill array : ${JSON.stringify(profSkills)}`);

   const secSkills = Array.from(sections['repeating_secondaryskills'], (x) => `repeating_secondaryskills_${x}`);

   const weaponSkills = Array.from(sections['repeating_weaponskills'], (x) => `repeating_weaponskills_${x}`);
   const combatSkills = Array.from(sections['repeating_combatskills'], (x) => `repeating_combatskills_${x}`);

   const magicSkills = Array.from(sections['repeating_magicskills'], (x) => `repeating_magicskills_${x}`);
   const magicSpells = Array.from(sections['repeating_spells'], (x) => `repeating_spells_${x}`);

   const allArray = [...primSkills,...profSkills,...secSkills,...weaponSkills,...combatSkills,...magicSkills,...magicSpells];
   //k.log(`All skills to be rested: ${JSON.stringify(allArray)}`);

   allArray.forEach( skill => {
      attributes[`${skill}_improve`] = 0; 
      attributes[`${skill}_improve_perfect`] = 0; 
   });
   attributes.set(); 

   const roll = await startRoll(`${attributes['templatestartwhisper']} {{roll-name=${k.getTranslationByKey('sleeping')}}}`);
   finishRoll(roll.rollId);

}
k.registerFuncs({resetExperience});

const useExperience = async function({trigger,attributes,sections,casc}) {
   // Multiplier to increase one step FROM the FV of the key
   const improveCost = {
      1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 
      10: 2, 11: 2, 12: 2, 13: 2, 14: 3, 15: 3, 16: 3, 17: 4, 18: 4, 19: 4, 20: 5,
   }; 

   //spine.primaryskills
   const primSkills = Array.from(spine.primaryskills, (x) => x.attr);
   k.log(`Primary skill array : ${JSON.stringify(primSkills)}`);

   const profSkills = [];
   initNumberedArray(12).forEach( id => {
      profSkills.push('yrkes_'+id);
   });
   k.log(`Profession skill array : ${JSON.stringify(profSkills)}`);

   const secSkills = Array.from(sections['repeating_secondaryskills'], (x) => `repeating_secondaryskills_${x}`);
   const weaponSkills = Array.from(sections['repeating_weaponskills'], (x) => `repeating_weaponskills_${x}`);
   const combatSkills = Array.from(sections['repeating_combatskills'], (x) => `repeating_combatskills_${x}`);
   const magicSkills = Array.from(sections['repeating_magicskills'], (x) => `repeating_magicskills_${x}`);
   const magicSchools = Array.from(sections['repeating_magicschools'], (x) => `repeating_magicschools_${x}`);
   const magicSpells = Array.from(sections['repeating_spells'], (x) => `repeating_spells_${x}`);

   const allArray = [...primSkills,...profSkills,...secSkills,...weaponSkills,...combatSkills,...magicSkills,...magicSchools,...magicSpells];

   allArray.forEach( skill => {
      attributes[`${skill}_improve`] = 0; 
      attributes[`${skill}_improve_perfect`] = 0, 
      isHouseRules = attributes.house_magic_costs == 1 ? true : false,
      isSpellSv10 = isHouseRules && attributes[`${skill}_sv`] && parseInt(attributes[`${skill}_sv`]) <= 10 ? true : false; 
      var name = attributes[`${skill}_name`],
            fv = parseInt(attributes[`${skill}_fv`]) > 20 ? 20 : attributes[`${skill}_fv`],
            base = attributes[`${skill}_cost`],
            exp = attributes[`${skill}_erf`];

      k.log(`Testing improvement for ${name} with fv ${fv}, cost ${improveCost[fv]*base} and xp ${exp}`);
      while( ( isSpellSv10 && improveCost[fv] / 2 * base <= exp ) || ( !isSpellSv10 && improveCost[fv] * base <= exp ) ) {
         const cost = isSpellSv10 ? improveCost[fv] / 2 * base : improveCost[fv] * base;
         k.log(`Is spell and SV under 10: ${true}, base cost is${base} and multiplier is ${improveCost[fv]}`);
         exp = attributes[`${skill}_erf`] = exp - cost; 
         fv = attributes[`${skill}_fv`] = ++fv;
         k.log(`increased ${name} from ${fv - 1} to ${fv} using ${cost} points leaving ${exp} points left.`);
      } 
   });

   attributes.set();

   const roll = await startRoll(`${attributes['templatestartwhisper']} {{roll-name=${k.getTranslationByKey('resting')}}}`);
   finishRoll(roll.rollId);
   
}
k.registerFuncs({useExperience});