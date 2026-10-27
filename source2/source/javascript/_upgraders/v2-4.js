const v2x4 = function(trigger,attributes,sections,casc) { 
   
   //attributes.sheet_version = '2.4'; 
   //const ver = await attributes.version; 
   //attributes.version = '2.4'; 
   //k.version = '2.4';
   //k.log(`Version ${attributes.version}, sheet version ${attributes.sheet_version}, k version ${k.version}`);
   //k.log(`Upgraded to ${k.version}`);
   //attributes.set(); 

   //k.log(attributes);

   /* if( parseFloat(attributes.version) >= parseFloat(attributes.sheet_version) && parseFloat(attributes.version) < 2.2 ) {
      k.log(`Version ${parseFloat(attributes.version)}, sheet version ${parseFloat(attributes.sheet_version)}`)
      return; 
   } */
   //k.log(`Version ${attributes.version}, sheet version ${attributes.sheet_version}, k version ${k.version}`);
   //if( attributes.sheet_version == '2.3' ) { return; }


   k.getAllAttrs({
      callback:(attributes,sections,casc)=>{
         k.log(`Running a v2.4 upgrade script, from K version ${k.version}`);

         k.log(`Entered K all attributes section`);
         k.log(`Recorded version is ${attributes.version}`);

         if ( parseFloat(attributes.version) >= 2.4 ) {
            k.log(`WIill not upgrade version ${attributes.version}`);
            return; 
         } 

         k.log('Upgrading to version 2.4');
         
         k.log(`Identified upgrade to 2.0 version`);

         attributes.whisper = '/w gm';
         //attributes.set();

         // KP MAX, etc

         //attributes.forflyttning = attributes.forflyttning_normal; 
         //attributes.forflyttning_max = attributes.forflyttning_maximal; 
         attributes.barformaga = attributes.barformaga_normal;
         attributes.barformaga_max = attributes.barformaga_maximal;
         attributes.encumbrance_max = attributes.sty_fv;

         //APPEARANCE
         k.log(`Utseende: ${attributes.utseende1 + " " + attributes.utseende2}`);
         attributes.appearance = attributes.utseende1 + " " + attributes.utseende2; 
         //attributes.set();

         // ABILITIES
         k.log(`Abilities length ${sections.repeating_abilities.length}`);
         if ( sections.repeating_abilities.length == 0 ) {
            [1,2,3,4].forEach( ability => {
               const abilityName = attributes[`sars_fv${ability}`]; 
               if ( abilityName != undefined && abilityName != '') {
                  k.log(`Found ability to upgrade: ${abilityName}`);
                  const rowID = k.generateRowID('repeating_abilities',sections);
                  k.setAttrs({
                     [`${rowID}_name`]: abilityName,
                     [`${rowID}_effect`]: '',
                     [`${rowID}_description`]: '',
                     [`${rowID}_collapse`]: 1,
                  })
               }
            });  
         }
      
         //attributes.set();

         // PROFESSION SKILLS
         k.log(`Profession skills length ${sections.repeating_professionskills.length}`);
         if ( sections.repeating_professionskills.length == 0 ) {
            [1,2,3,4,5,6,7,8,9,10,11,12].forEach( skill => {
               const skillName = attributes[`yrkes_${skill}_text`]; 
               attributes[`yrkes_${skill}_name`] = skillName; 
               attributes[`yrkes_${skill}_type`] = 'a'; 
               if ( skillName != undefined && skillName != '') {
                  k.log(`Found profession skill to upgrade: ${skillName}`);
                  const rowID = k.generateRowID('repeating_professionskills',sections);
                  //k.log(`Row ID = ${rowID}`);
                  k.setAttrs({
                     [`${rowID}_name`]: skillName,
                     [`${rowID}_fv`]: attributes[`yrkes_${skill}_fv`]||0,
                     [`${rowID}_erf`]: attributes[`yrkes_${skill}_erf`]||0,
                     [`${rowID}_collapse`]: 1,
                  })
               }
            });
         }

         //attributes.set();

         // SECONDARY SKILLS
         k.log(`Secondary skills length ${sections.repeating_secondaryskills.length}`);
         if ( sections.repeating_secondaryskills.length == 0 ) {
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].forEach( skill => {
               const skillName = attributes[`sek_fard_${skill}_text`]; 
               //k.log(`Testing secondary skill ${skill} with name ${skillName} `+ attributes[`sek_fard_${skill}_text`]);
               if ( skillName != undefined && skillName != '') {
                  k.log(`Found secondary skill to upgrade: ${skillName}`);
                  const rowID = k.generateRowID('repeating_secondaryskills',sections);
                  //k.log(`Row ID = ${rowID}`);
                  k.setAttrs({
                     [`${rowID}_name`]: skillName,
                     [`${rowID}_fv`]: attributes[`sek_fard_${skill}_fv`]||0,
                     [`${rowID}_erf`]: attributes[`sek_fard_${skill}_erf`]||0,
                     [`${rowID}_collapse`]: 1,
                  })
               }
            });
         }
         //attributes.set();

         // LANGUAGES sprak_7_text
         k.log(`Languages length ${sections.repeating_languages.length}`);
         if ( sections.repeating_languages.length == 0 ) {
            [1,2,3,4,5,6].forEach( lang => {      
               const langName = attributes[`sprak_${lang}_text`]; attributes[`sprak_${lang}_text`]; 
               k.log(`Testing language ${lang} with name ${langName} `+ attributes[`sprak_${lang}_text`]);
               if ( langName != undefined && langName != '') {
                  k.log(`Found language to upgrade: ${langName}`);
                  const rowID = k.generateRowID('repeating_languages',sections);
                  //-k.log(`Row ID = ${rowID}`);
                  k.setAttrs({
                     [`${rowID}_name`]: langName,
                     [`${rowID}_fv`]: attributes[`sprak_${lang}_fv`]||0,
                     [`${rowID}_erf`]: attributes[`sprak_${lang}_erf`]||0,
                     [`${rowID}_collapse`]: 1, 
                  })
               }
            });
         }
         //attributes.set();

         // SpELLS besvarjelse_1_text
         k.log(`Spells length ${sections.repeating_spells.length}`);
         if ( sections.repeating_spells.length == 0 ) {
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].forEach( spell => {      
               const spellName = attributes[`besvarjelse_${spell}_text`]; 
               //k.log(`Testing spell ${spell} with name ${spellName} `+ attributes[`besvarjelse_${spell}_text`]);
               if ( spellName != undefined && spellName != '') {
                  k.log(`Found spell to upgrade: ${spellName} with S ${attributes[`besvarjelse_${spell}_s`]}`);
                  const rowID = k.generateRowID('repeating_spells',sections);
                  //k.log(`Row ID = ${rowID}`);
                  k.setAttrs({
                     [`${rowID}_name`]: spellName,
                     [`${rowID}_fv`]: attributes[`besvarjelse_${spell}_s`],
                     [`${rowID}_erf`]: attributes[`besvarjelse_${spell}_erf`]||0,
                     [`${rowID}_e`]: 1,
                     [`${rowID}_collapse`]: 1,
                  })
               }
            });
         }
         //attributes.set();

         // WEAPONS vapen_7_text
         k.log(`Weapons length ${sections.repeating_weapons.length}`);
         if ( sections.repeating_weapons.length == 0 ) {
            [1,2,3,4,5,6,7].forEach( weapon => {      
               const weaponName = attributes[`vapen_${weapon}_text`]||''; 
               k.log(`Testing weapon ${weapon} with name ${weaponName} `+ attributes[`vapen_${weapon}_text`]);
               if ( weaponName != '' ) {
                  k.log(`Found weapon to upgrade: ${weaponName}`);
                  const rowID = k.generateRowID('repeating_weapons',sections);
                  k.log(`Row ID = ${rowID}`);
                  k.setAttrs({
                     [`${rowID}_name`]: weaponName,
                     [`${rowID}_equipped`]: 1,
                     [`${rowID}_fv`]: attributes[`vapen_${weapon}_fv`]||0,
                     [`${rowID}_erf`]: attributes[`vapen_${weapon}_erf`]||0,
                     [`${rowID}_damage`]: attributes[`vapen_${weapon}_skada`]||0,
                     [`${rowID}_bv`]: attributes[`vapen_${weapon}_bv`]||0,
                     [`${rowID}_length`]: attributes[`vapen_${weapon}_langd`]||0,
                     [`${rowID}_range`]: attributes[`vapen_${weapon}_rakvd`]||0,
                     [`${rowID}_weight`]: attributes[`vapen_${weapon}_vikt`]||0,
                     [`${rowID}_collapse`]: 1,
                  })
               }
            });
         }
         //attributes.set();

         // UTRUSTNING
         k.log(`Gear length ${sections.repeating_gear.length}`);
         if ( sections.repeating_gear.length == 0 ) {
            [11,12,13,21,22,23,31,32,33,41,42,43,51,52,53,61,62,63,71,72,73].forEach( id => {
               const gearName = attributes[`utrustning_${id}_text`];
               if ( gearName != '' ) {
                  const rowID = k.generateRowID('repeating_gear',sections);
                  k.log(`Found gear ${gearName} to upgrade ro row ${rowID}`);
                  k.setAttrs({
                     [`${rowID}_equipped`] : 1,
                     [`${rowID}_name`] : gearName,
                     [`${rowID}_amount`] : 1,
                     [`${rowID}_weight`] : attributes[`utrustning_${id}`],
                  })
               }
            });
         }
         //attributes.set();

         // BODY AREA HITPOINTS
         /* ['head','chest','rarm','varm','mage','vben','hben'].forEach( part => {
            const area = part == 'head' ? 'huvud' :
                           part == 'chest' ? 'brostkorg' :
                           part == 'rarm' ? 'harm' :
                           part;
            var ticks = 0; 
            [1,2,3,4,5,6,7,8,9].forEach ( id => {
               ticks += attributes[`${part}${id}`] == 'on' ? 1 : 0; 
            });
            k.log(`KP för ${area} är ${ticks}`);
            attributes[`kp_${area}`] = ticks; 
         });
         attributes.set(); */

         // KROPPSPOÄNG & PSYPOÄNG
         /* attributes.kroppspoang_max = attributes.total_kp;
         attributes.psypoang_max = attributes.total_psy;
         attributes.smartpoang_max = attributes.smartpoang = 2 * attributes.fys_fv; */

         /* var kp = 0, psy = 0; 
         [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].forEach( id => {
            kp += attributes[`tot_kp${id}`] == 'on' ? 1 : 0;
            psy += attributes[`tot_psy${id}`] == 'on' ? 1 : 0; 
         });
         k.log(`Found ${kp} KP och ${psy} PSY poäng.`);
         attributes.kroppspoang = kp; 
         attributes.psypoang = psy;  */

         //attributes.set(); 

         calcHealthpoints({attributes}); 
         calcPainpoints({attributes}); 
         calcDamagebonus({attributes});


         attributes.whisper = '/w gm';
         //attributes.version = 2.0; 
         //attributes.set();

         k.log('Upgrading to version 2.1');
         // Spell S 
         /* sections.repeating_spells.forEach( id => {
            k.log(`Found spell id ${id} to upgrade: ${attributes[`repeating_spells_${id}_name`]} with S ${attributes[`repeating_spells_${id}_s`]} and FV ${attributes[`repeating_spells_${id}_fv`]}`);
            const fv = parseInt(attributes[`repeating_spells_${id}_fv`]),
                  s = parseInt(attributes[`repeating_spells_${id}_s`]);
            attributes[`repeating_spells_${id}_fv`] = s > fv ? s : fv;
         });
         attributes.set(); */

         // Need to change CSS to always show, then if not checked then hide it...  
         attributes['show_animal_tab'] = 0;
         attributes['show_magic_tab'] = 0;
         attributes['show_notes_tab'] = 0;
         attributes['show_weapon_techniques'] = 0;
         attributes['show_martial_arts'] = 0;
         attributes['house_magic_costs'] = 0; 
         attributes.set();  

         attributes['show_animal_tab'] = 1;
         attributes['show_magic_tab'] = 1;
         attributes['show_notes_tab'] = 1;
         attributes['show_weapon_techniques'] = 1;
         attributes['show_martial_arts'] = 1;
         attributes['house_magic_costs'] = 1;
         attributes['attributes_collapse'] = 1; 
         attributes.set(); 


         k.log('Upgrading to version 2.4');
         attributes.version = "2.4";
         
         //attributes.sheet_version = '2.3'; 
         //attributes.version = '2.3'; 
         //k.version = '2.3';
         attributes.set(); 

      }
   })

}
k.registerFuncs({'2.4':v2x4},{type:['updater','opener']});

