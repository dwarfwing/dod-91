const v2x1 = function({trigger,attributes,sections,casc}) {
   k.log('Upgrading to version 2.1');
   // Spell S 
   sections.repeating_spells.forEach( id => {
      k.log(`Found spell id ${id} to upgrade: ${attributes[`repeating_spells_${id}_name`]} with S ${attributes[`repeating_spells_${id}_s`]} and FV ${attributes[`repeating_spells_${id}_fv`]}`);
      const fv = parseInt(attributes[`repeating_spells_${id}_fv`]),
            s = parseInt(attributes[`repeating_spells_${id}_s`]);
      attributes[`repeating_spells_${id}_fv`] = s > fv ? s : fv;
   });
   attributes.set();

   // Need to change CSS to always show, then if not checked then hide it...  
   attributes['show_animal_tab'] = 1;
   attributes['show_magic_tab'] = 1;
   attributes['show_notes_tab'] = 1;
   attributes['show_weapon_techniques'] = 1;
   attributes['show_martial_arts'] = 1;
   attributes['house_magic_costs'] = 1; 

   attributes.version = 2.1; 
   attributes.set(); 

}
k.registerFuncs({'2.1':v2x1},{type:['updater']});