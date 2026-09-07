const resetExperience = function({trigger,attributes,sections,casc}) {   

   //spine.primaryskills
   const primSkills = Array.from(spine.primaryskills, (x) => x.attr);
   
   //
   const profSkills = [];
   initNumberedArray(12).forEach( id => {
      profSkills.push('yrkes_'+id);
   });
   k.log(`Profession skill array : ${JSON.stringify(profSkills)}`);

   const secSkills = Array.from(sections['repeating_secondaryskills'], (x) => `repeating_secondaryskills_${x}`);

   const combatSkills = Array.from(sections['repeating_combatskills'], (x) => `repeating_combatskills_${x}`);

   const magicSkills = Array.from(sections['repeating_magicskills'], (x) => `repeating_magicskills_${x}`);
   const magicSpells = Array.from(sections['repeating_spells'], (x) => `repeating_spells_${x}`);

   const allArray = [...primSkills,...profSkills,...secSkills,...combatSkills,...magicSkills,...magicSpells];
   //k.log(`All skills to be rested: ${JSON.stringify(allArray)}`);

   allArray.forEach( skill => {
      attributes[`${skill}_improve`] = 0; 
      attributes[`${skill}_improve_perfect`] = 0; 
   });
   attributes.set(); 

}
k.registerFuncs({resetExperience});