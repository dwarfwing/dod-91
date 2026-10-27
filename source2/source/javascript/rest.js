const resetExperience = async function({trigger,attributes,sections,casc}) {   

   const primSkills = Array.from(spine.primaryskills, (x) => x.attr);

   const profSkills = Array.from(sections['repeating_professionskills'], (x) => `repeating_professionskills_${x}`);
   const secSkills = Array.from(sections['repeating_secondaryskills'], (x) => `repeating_secondaryskills_${x}`);
   const weaponSkills = Array.from(sections['repeating_weaponskills'], (x) => `repeating_weaponskills_${x}`);
   const combatSkills = Array.from(sections['repeating_combatskills'], (x) => `repeating_combatskills_${x}`);
   const weaponTechniques = Array.from(sections['repeating_weapontechniques'], (x) => `repeating_weapontechniques_${x}`);
   const martialArts = ['martialart1','martialart2','martialart3'];
   const magicSkills = Array.from(sections['repeating_magicskills'], (x) => `repeating_magicskills_${x}`);
   const magicSpells = Array.from(sections['repeating_spells'], (x) => `repeating_spells_${x}`);

   const allArray = [...primSkills,...profSkills,...secSkills,...weaponSkills,...combatSkills,...weaponTechniques,...martialArts,...magicSkills,...magicSpells];
   //k.log(`All skills to be rested: ${JSON.stringify(allArray)}`);

   allArray.forEach( skill => {
      if ( attributes[`${skill}_improve`] != 0 ) {
         const name = attributes[`${skill}_name`];
         k.log(`Rested ${name}`);
      } 
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

   const primSkills = Array.from(spine.primaryskills, (x) => x.attr);

   const profSkills = Array.from(sections['repeating_professionskills'], (x) => `repeating_professionskills_${x}`);
   const secSkills = Array.from(sections['repeating_secondaryskills'], (x) => `repeating_secondaryskills_${x}`);
   const weaponSkills = Array.from(sections['repeating_weaponskills'], (x) => `repeating_weaponskills_${x}`);
   const combatSkills = Array.from(sections['repeating_combatskills'], (x) => `repeating_combatskills_${x}`);
   const weaponTechniques = Array.from(sections['repeating_weapontechniques'], (x) => `repeating_weapontechniques_${x}`);
   const martialArts = ['martialart1','martialart2','martialart3'];
   const magicSkills = Array.from(sections['repeating_magicskills'], (x) => `repeating_magicskills_${x}`);
   const magicSchools = Array.from(sections['repeating_magicschools'], (x) => `repeating_magicschools_${x}`);
   const magicSpells = Array.from(sections['repeating_spells'], (x) => `repeating_spells_${x}`);

   const allArray = [...primSkills,...profSkills,...secSkills,...weaponSkills,...combatSkills,...weaponTechniques,...martialArts,...magicSkills,...magicSchools,...magicSpells];

   allArray.forEach( skill => {
      attributes[`${skill}_improve`] = 0; 
      attributes[`${skill}_improve_perfect`] = 0, 
      houseRule = attributes.house_magic_costs,
      isSpell = skill.startsWith('repeating_spells'); 
      isSpellBelow = isSpell && houseRule != 0 && 
                   ( (houseRule == 1 && parseInt(attributes[`${skill}_sv`]) <= 10 ) ||
                   (houseRule == 2 && parseInt(attributes[`${skill}_s`]) <= 10 ) ); 
      var name = attributes[`${skill}_name`],
            fv = parseInt(attributes[`${skill}_fv`]) > 20 ? 20 : attributes[`${skill}_fv`],
            base = attributes[`${skill}_cost`],
            exp = attributes[`${skill}_erf`];

      //k.log(`Testing improvement for ${name} with fv ${fv}, cost ${improveCost[fv]*base} and xp ${exp}`);
      while( ( isSpellBelow && improveCost[fv] / 2 * base <= exp ) || ( !isSpellBelow && improveCost[fv] * base <= exp ) ) {
         const cost = isSpellBelow ? improveCost[fv] / 2 * base : improveCost[fv] * base;
         //k.log(`base cost is${base} and multiplier is ${improveCost[fv]}. Is spell ${isSpell}, houserules ${houseRule} and under 10: ${isSpellBelow}`);
         exp = attributes[`${skill}_erf`] = exp - cost; 
         fv = attributes[`${skill}_fv`] = ++fv;
         k.log(`increased ${name} from ${fv - 1} to ${fv} using ${cost} points leaving ${exp} points left.`);
      } 
   });
   setWeaponSkills({trigger,attributes,sections,casc});

   attributes.set();

   const roll = await startRoll(`${attributes['templatestartwhisper']} {{roll-name=${k.getTranslationByKey('resting')}}}`);
   finishRoll(roll.rollId);
   
}
k.registerFuncs({useExperience});

