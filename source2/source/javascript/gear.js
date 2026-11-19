
const moveToGearlist = async function({trigger,attributes,sections,casc}) {
   k.log(`Move to Storage trigger: ${trigger}`);
   const [section,rowID,base] = k.parseTriggerName(trigger.name)
         row = `${section}_${rowID}`,
         list = base.replace(/move-/,'');
   k.log(`Trigger parsed, section ${section} and rowID ${rowID} with base ${base} for ${list} list`);
   attributes[`repeating_${list}`].create({
      name: attributes[`${row}_name`],
      equipped: attributes[`${row}_equipped`],
      amount: attributes[`${row}_amount`],
      weight: attributes[`${row}_weight`],
   });
   k.removeRepeatingRow(row,attributes,sections);
   k.log(`MoveD to Storage, SETTING ENCUMBRANCE`);
   setAllEncumbrance({trigger,attributes,sections});
   /*k.getAllAttrs({
      callback:(attributes,sections,casc)=>{
         attributes.set();
      }
   })*/ 
   //setAllEncumbrance({trigger,attributes,sections,casc});
}
k.registerFuncs({moveToGearlist});


const gearEncumbrance = function({trigger,attributes,sections}) {
   setAllEncumbrance({trigger,attributes,sections});
}
k.registerFuncs({gearEncumbrance})

const setAllEncumbrance = async function({trigger,attributes,sections,casc}) {
   k.log(`++++ Trigger for encumbrance config: ${JSON.stringify(trigger)}`);
   // ARMOR
   ['huvud','harm','varm','brostkorg','mage','hben','vben'].forEach( part => {
      ['vikt','abs','spabs'].forEach( attr => {
         //k.log(`Equipped ${part} ${attr} is ${parseInt(attributes[`rustning_${part}_equipped`])}`);
         attributes[`rustning_${part}_${attr}_total`] = attributes[`rustning_${part}_${attr}`]*parseInt(attributes[`rustning_${part}_equipped`]) + 
                                                         attributes[`rustning_${part}_${attr}2`]*parseInt(attributes[`rustning_${part}2_equipped`]) +
                                                         attributes[`rustning_${part}_${attr}3`]*parseInt(attributes[`rustning_${part}3_equipped`]);
      });      
   });
   var armorTot = 0;
   ['huvud','harm','varm','brostkorg','mage','hben','vben'].forEach( (part) => {
      //k.log(`Armor ${part} weight is ${attributes[`rustning_${part}_vikt_total`]} added to subtotal of ${armorTot}`);
      armorTot += parseInt(attributes[`rustning_${part}_vikt_total`]||0);
   },0);  
   k.log(`Armor weight: ${armorTot}`);
   
   //WEAPONS
   var weaponTot = 0; 
   sections.repeating_weapons.forEach( (id) => {
      const row = `repeating_weapons_${id}`;
      //k.log(`Weapon ${attributes[`${row}_name`]} weight is ${attributes[`${row}_weight`]||0} and equipped ${attributes[`${row}_equipped`]||0} for total of ${parseInt(attributes[`${row}_equipped`]||0) * parseFloat(attributes[`${row}_weight`]||0)}`);
      weaponTot += parseInt(attributes[`${row}_equipped`]||0) * parseFloat(attributes[`${row}_weight`]||0); 
   }); 
   k.log(`Weapon weight: ${weaponTot}`);  

   //GEAR
   var gearTot = 0; 
   sections.repeating_gear.forEach( (id) => {
      const row = `repeating_gear_${id}`;
      //k.log(`Gear ${attributes[`${row}_name`]} x ${attributes[`${row}_amount`]} weight is ${attributes[`${row}_weight`]} and equipped ${attributes[`${row}_equipped`]} for total of ${parseInt(attributes[`${row}_equipped`]||0) * parseInt(attributes[`${row}_amount`]) * parseFloat(attributes[`${row}_weight`])}`);
      gearTot += parseInt(attributes[`${row}_equipped`]||0) * parseInt(attributes[`${row}_amount`]) * parseFloat(attributes[`${row}_weight`])
   });
   sections.repeating_herbsndrugs.forEach( (id) => {
      const row = `repeating_herbsndrugs_${id}`;
      //k.log(`Gear ${attributes[`${row}_name`]} x ${attributes[`${row}_amount`]} weight is ${attributes[`${row}_weight`]} and equipped ${attributes[`${row}_equipped`]} for total of ${parseInt(attributes[`${row}_equipped`]||0) * parseInt(attributes[`${row}_amount`]) * parseFloat(attributes[`${row}_weight`])}`);
      gearTot += parseInt(attributes[`${row}_equipped`]||0) * parseInt(attributes[`${row}_amount`]) * parseFloat(attributes[`${row}_weight`])
   });
   k.log(`Gear weight: ${gearTot}`); 

   const enc = attributes['encumbrance'] = parseFloat(armorTot + weaponTot + gearTot); 

   const max = parseInt(attributes[`encumbrance_max`]);
   k.log(`Encumbrance is ${enc}, or ${armorTot + weaponTot + gearTot}, with carrycap ${max}`);
   var mod = "0", multi = ""; 
   if ( enc <= max ) { mod = "0"; multi = ""; }
   else if ( enc <= (max * 2) ) { mod = "-1"; multi = "x2"; }
   else if ( enc <= (max * 3) ) { mod = "-2"; multi = "x3"; }
   else if ( enc <= (max * 4) ) { mod = "-4"; multi = "x4"; }
   else if ( enc <= (max * 5) ) { mod = "-6"; multi = "x5"; }
   else { mod = "-8"; multi = "x6+"; }
   attributes['encumbrance_mod'] = mod; 
   attributes['encumbrance_multi'] = multi; 

   attributes['smi_encumb_mod'] = mod != "0" ? parseInt(mod) : '';
   attributes.set(); 

   setSkillsEncumbranceMod({attributes,sections});


   calcMovement({attributes});
}
k.registerFuncs({setAllEncumbrance},{type:['opener']});

const calcEncumbrance = async function({trigger,attributes,sections,casc}) {
   k.log(`++++ Trigger for encumbrance calculation: ${JSON.stringify(trigger)}`);
   // ARMOR
   ['huvud','harm','varm','brostkorg','mage','hben','vben'].forEach( part => {
      ['vikt','abs','spabs'].forEach( attr => {
         //k.log(`Equipped ${part} ${attr} is ${parseInt(attributes[`rustning_${part}_equipped`])}`);
         attributes[`rustning_${part}_${attr}_total`] = attributes[`rustning_${part}_${attr}`]*parseInt(attributes[`rustning_${part}_equipped`]) + 
                                                         attributes[`rustning_${part}_${attr}2`]*parseInt(attributes[`rustning_${part}2_equipped`]) +
                                                         attributes[`rustning_${part}_${attr}3`]*parseInt(attributes[`rustning_${part}3_equipped`]);
      });      
   });
   var armorTot = 0;
   ['huvud','harm','varm','brostkorg','mage','hben','vben'].forEach( (part) => {
      //k.log(`Armor ${part} weight is ${attributes[`rustning_${part}_vikt_total`]} added to subtotal of ${armorTot}`);
      armorTot += parseInt(attributes[`rustning_${part}_vikt_total`]||0);
   },0);  
   k.log(`Armor weight: ${armorTot}`);
   
   //WEAPONS
   var weaponTot = 0; 
   sections.repeating_weapons.forEach( (id) => {
      const row = `repeating_weapons_${id}`;
      //k.log(`Weapon ${attributes[`${row}_name`]} weight is ${attributes[`${row}_weight`]||0} and equipped ${attributes[`${row}_equipped`]||0} for total of ${parseInt(attributes[`${row}_equipped`]||0) * parseFloat(attributes[`${row}_weight`]||0)}`);
      weaponTot += parseInt(attributes[`${row}_equipped`]||0) * parseFloat(attributes[`${row}_weight`]||0); 
   }); 
   k.log(`Weapon weight: ${weaponTot}`);  

   //GEAR
   var gearTot = 0; 
   sections.repeating_gear.forEach( (id) => {
      const row = `repeating_gear_${id}`;
      //k.log(`Gear ${attributes[`${row}_name`]} x ${attributes[`${row}_amount`]} weight is ${attributes[`${row}_weight`]} and equipped ${attributes[`${row}_equipped`]} for total of ${parseInt(attributes[`${row}_equipped`]||0) * parseInt(attributes[`${row}_amount`]) * parseFloat(attributes[`${row}_weight`])}`);
      gearTot += parseInt(attributes[`${row}_equipped`]||0) * parseInt(attributes[`${row}_amount`]) * parseFloat(attributes[`${row}_weight`])
   });
   k.log(`Gear weight: ${gearTot}`); 

   const enc = parseFloat(armorTot + weaponTot + gearTot); 

   /* const max = parseInt(attributes[`encumbrance_max`]);
   k.log(`Encumbrance is ${enc}, or ${armorTot + weaponTot + gearTot}, with carrycap ${max}`);
   var mod = "0", multi = ""; 
   if ( enc <= max ) { mod = "0"; multi = ""; }
   else if ( enc <= (max * 2) ) { mod = "-1"; multi = "x2"; }
   else if ( enc <= (max * 3) ) { mod = "-2"; multi = "x3"; }
   else if ( enc <= (max * 4) ) { mod = "-4"; multi = "x4"; }
   else if ( enc <= (max * 5) ) { mod = "-6"; multi = "x5"; }
   else { mod = "-8"; multi = "x6+"; }
   attributes['encumbrance_mod'] = mod; 
   attributes['encumbrance_multi'] = multi; 

   attributes['smi_encumb_mod'] = mod != "0" ? parseInt(mod) : '';
   attributes.set(); */ 

   //setSkillsEncumbranceMod({attributes,sections});
   //calcMovement({attributes});
   return enc;
}
k.registerFuncs({calcEncumbrance});

const setEncumbranceMod = function({trigger,attributes}) {
   const enc = parseFloat(attributes['encumbrance']); 

   const max = parseInt(attributes[`encumbrance_max`]);
   k.log(`Encumbrance is ${enc}, or ${armorTot + weaponTot + gearTot}, with carrycap ${max}`);
   var mod = "0", multi = ""; 
   if ( enc <= max ) { mod = "0"; multi = ""; }
   else if ( enc <= (max * 2) ) { mod = "-1"; multi = "x2"; }
   else if ( enc <= (max * 3) ) { mod = "-2"; multi = "x3"; }
   else if ( enc <= (max * 4) ) { mod = "-4"; multi = "x4"; }
   else if ( enc <= (max * 5) ) { mod = "-6"; multi = "x5"; }
   else { mod = "-8"; multi = "x6+"; }
   attributes['encumbrance_mod'] = mod; 
   attributes['encumbrance_multi'] = multi; 

   attributes['smi_encumb_mod'] = mod != "0" ? parseInt(mod) : '';
   attributes.set(); 
}
k.registerFuncs({setEncumbranceMod});

const setSkillsEncumbranceMod = function({attributes,sections}) {
   //k.log(`++++ Sections for encumbrance: ${JSON.stringify(sections)}`);
   ['professionskills','secondaryskills','weaponskills','combatskills','weapontechniques'].forEach( sect => {
      sections[`repeating_${sect}`].forEach( skill => {
         const row = `repeating_${sect}_${skill}`;
         //k.log(`Skill ${skill} ${attributes[`${row}_name`]} with attr ${attributes[`${row}_attr`]} gets mod ${attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '0'}`)
         attributes[`${row}_encumb_mod`] = attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '';
      });   
      /* sections.repeating_professionskills.forEach( skill => {
         const row = `repeating_professionskills_${skill}`;
         //k.log(`Skill ${skill} ${attributes[`${row}_name`]} with attr ${attributes[`${row}_attr`]} gets mod ${attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '0'}`)
         attributes[`${row}_encumb_mod`] = attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '';
      });   
      sections.repeating_secondaryskills.forEach( skill => {
         const row = `repeating_secondaryskills_${skill}`;
         attributes[`${row}_encumb_mod`] = attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '';
      });  
      sections.repeating_weaponskills.forEach( skill => {
         const row = `repeating_weaponskills_${skill}`;
         attributes[`${row}_encumb_mod`] = attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '';
      }); 
      sections.repeating_combatskills.forEach( skill => {
         const row = `repeating_combatskills_${skill}`;
         attributes[`${row}_encumb_mod`] = attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '';
      });
      sections.repeating_weapontechniques.forEach( skill => {
         const row = `repeating_weapontechniques_${skill}`;
         attributes[`${row}_encumb_mod`] = attributes[`${row}_attr`] == 'smi' ? attributes['smi_encumb_mod'] : '';
      }); */
   });
   sections.repeating_weapons.forEach( id => {
      const row = `repeating_weapons_${id}`,
            skillRow = attributes[`${row}_skill`];
      k.log(`Weapons ${row} with skill ${skillRow} and encumb ${attributes[`${skillRow}_encumb_mod`]}`);
      attributes[`${row}_encumb_mod`] = skillRow && skillRow != undefined ? attributes[`${skillRow}_encumb_mod`] : '';
   });
   ['1','2','3'].forEach( id => {
      attributes[`martialart${id}_encumb_mod`] = attributes['smi_encumb_mod'];
   }); 
   attributes.set(); 
}
k.registerFuncs({setSkillsEncumbranceMod},{type:['opener']});

const calcEncumbranceMax = function ({trigger,attributes,sections,casc}) {
   //k.log(`Encumbrance max trigger: ${JSON.stringify(trigger)}`);
   const carrycap = attributes.sty_fv,
         carrycapMod = attributes.barformaga_mod||0;

   attributes.barformaga = parseInt(carrycap) + parseInt(carrycapMod); 
   attributes.barformaga_max = (parseInt(carrycap) + parseInt(carrycapMod)) * 6; 
   attributes.encumbrance_max = parseInt(carrycap) + parseInt(carrycapMod); 
   attributes.set();
}
k.registerFuncs({calcEncumbranceMax},{type:['opener']});
//k.registerFuncs({abilityDisplay},{type:['opener']});

const calcEncumbranceMaxOnload = function() {
   const setObj = {};
   getAttrs(['carrycap','carrycap_mod','encumbrance_max'],
      (values) => {         
         setObj.encumbrance_max = parseInt(values[`carrycap`]) + parseInt(values[`carrycap_mod`]);
         setAttrs(setObj,{silent:true});
   });
}
k.registerFuncs({calcEncumbranceMaxOnload},{type:['opener']});

