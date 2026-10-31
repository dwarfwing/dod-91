

const gearEncumbrance = function({trigger,attributes,sections}) {
   calcAllEncumbrance({trigger,attributes,sections});
}
k.registerFuncs({gearEncumbrance})

const calcAllEncumbrance = function({trigger,attributes,sections,casc}) {
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

   const enc = attributes['encumbrance'] = parseInt(armorTot + weaponTot + gearTot); 

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
   setSkillsEncumbranceMod({attributes,sections});

   attributes.set(); 

   calcMovement({attributes});
}
k.registerFuncs({calcAllEncumbrance},{type:['opener']});

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


const calcPsypoints = function({trigger,attributes,sections,casc}) {
   attributes.psypoang_max = parseInt(attributes.psy_fv) + parseInt(attributes.psypoang_mod)||0; 
   attributes.set();
}
k.registerFuncs({calcPsypoints},{type:['opener']})

const calcMovement = function({attributes}) {
   const tot = parseInt(attributes.sto_fv) + parseInt(attributes.fys_fv) + parseInt(attributes.smi_fv);
   k.log(`Movement calculation is ${tot}`);
   var forfl = 0; 
   if ( tot <= 11 ) { forfl = 7; }
   else if ( tot <= 20) { forfl = 8; }
   else if ( tot <= 29) { forfl = 9; }
   else if ( tot <= 38) { forfl = 10; }
   else if ( tot <= 47) { forfl = 11; }
   else if ( tot <= 56) { forfl = 12; }
   else if ( tot <= 65) { forfl = 13; }
   else if ( tot <= 74) { forfl = 14; }
   else if ( tot <= 83) { forfl = 15; }
   else if ( tot <= 92) { forfl = 16; }
   else if ( tot <= 101) { forfl = 17; }
   else if ( tot <= 109) { forfl = 18; }
   else if ( tot <= 117) { forfl = 19; }
   else if ( tot <= 125) { forfl = 20; }
   else if ( tot <= 133) { forfl = 21; }
   else if ( tot <= 141) { forfl = 22; }
   else if ( tot <= 149) { forfl = 23; }
   else if ( tot <= 157) { forfl = 24; }
   k.log(`Movement is ${forfl} plus move mod ${parseInt(attributes.movement_mod)} and encumbrance mod ${parseInt(attributes.encumbrance_mod)} `);

   attributes.forflyttning = forfl + parseInt(attributes.movement_mod) + parseInt(attributes.encumbrance_mod); 
   attributes.forflyttning_max = (forfl + parseInt(attributes.movement_mod) + parseInt(attributes.encumbrance_mod)) * 2; 
   attributes.set(); 
}
k.registerFuncs({calcMovement},{type:['opener']});

const calcHealthpoints = function({attributes}) {
   const kp = Math.ceil( ( attributes.sto_fv + attributes.fys_fv ) / 2 ),
         kp_mod = parseInt(attributes.kp_mod)||0;
   attributes['kroppspoang_max'] = kp + kp_mod;

   k.log(`Health points is ${kp} calculated from STO ${attributes.sto_fv} and FYS ${attributes.fys_fv}, KP modifier is ${kp_mod} `);

   var high = 0; 
   if ( kp <= 7 ) { high = 4; }
   else if ( kp <= 11 ) { high = 5; }
   else { high = ( Math.ceil(kp / 5 )) + 3; } 

   attributes.kp_brostkorg_tot = high; 
   attributes.kp_huvud_tot = high - 1; 
   attributes.kp_hben_tot = high - 1; 
   attributes.kp_vben_tot = high - 1; 
   attributes.kp_mage_tot = high - 1; 
   attributes.kp_harm_tot = high - 2; 
   attributes.kp_varm_tot = high - 2; 

   attributes.set();

}
k.registerFuncs({calcHealthpoints},{type:['opener']})

const calcPainpoints = function({attributes}) {
   const sp = attributes.fys_fv + attributes.fys_fv + attributes.sp_mod;
   attributes.smartpoang_max = sp;

   var high = 0;
   if ( sp <= 7 ) { high = 4; }
   else if ( sp <= 11 ) { high = 5; }
   else { high = ( Math.ceil(sp / 5 )) + 3; } 

   attributes.sp_brostkorg_tot = high; 
   attributes.sp_huvud_tot = high - 1; 
   attributes.sp_hben_tot = high - 1; 
   attributes.sp_vben_tot = high - 1; 
   attributes.sp_mage_tot = high - 1; 
   attributes.sp_harm_tot = high - 2; 
   attributes.sp_varm_tot = high - 2; 

   attributes.set(); 
}
k.registerFuncs({calcPainpoints},{type:['opener']});

const calcDamagebonus = function({attributes}) {
   k.log(`Calculating damage bonus`);
   const sb_num = attributes.sto_fv + attributes.sty_fv;

   if ( attributes.sb_mod != '' ) {
      attributes.sb = attributes.sb_mod; 
      attributes.set();
      return; 
   } 

   k.log(`Damage bonus value is ${sb_num} and modifier is ${attributes.sb_mod != ''} (${attributes.sb_mod})`);

   if ( sb_num <= 26 ) {
      attributes.sb = '0';
   } else if ( sb_num <= 29 ) {
      attributes.sb = '1';
   } else if ( sb_num <= 32 ) {
      attributes.sb = '1T2';
   } else if ( sb_num <= 40 ) {
      attributes.sb = '1T4';      
   } else if ( sb_num <= 50 ) {
      attributes.sb = '1T6';      
   } else if ( sb_num <= 60 ) {
      attributes.sb = '1T10';      
   } else if ( sb_num <= 80 ) {
      attributes.sb= '2T6';     
   } else if ( sb_num <= 100 ) {
      attributes.sb = '3T6';      
   } else if ( sb_num <= 140 ) {
      attributes.sb = '4T6';      
   } else if ( sb_num <= 180 ) {
      attributes.sb = '5T6';     
   }  

   attributes.set(); 
}
k.registerFuncs({calcDamagebonus},{type:['opener']});

const calcAnimalHealth = function({trigger,attributes,sections,casc}) {
   const type = trigger.name.match(/^([a-z]*)/)[1];
   //k.log(`Animal KP trigger: ${JSON.stringify(trigger)}`);
   //k.log(`Animal type: ${type}`);
   const kp_max = Math.ceil(( attributes[`${type}_sto_fv`] + attributes[`${type}_fys_fv`] ) / 2); 
   k.log(`triggered a recalc of Animal KP: ${kp_max}`);
   attributes[`${type}_kroppspoang_max`] = kp_max; 
   attributes.set();
}
k.registerFuncs({calcAnimalHealth});

const calcAnimalPainpoints = function({trigger,attributes,sections,casc}) {
   const type = trigger.name.match(/^([a-z]*)/)[1];
   //k.log(`Animal SP trigger: ${JSON.stringify(trigger)}`);
   //k.log(`Animal type: ${type}`);
   const sp_max = attributes[`${type}_fys_fv`] * 2; 
   k.log(`triggered a recalc of Animal SP: ${sp_max}`);
   attributes[`${type}_smartpoang_max`] = sp_max; 
   attributes.set();
}
k.registerFuncs({calcAnimalPainpoints});

