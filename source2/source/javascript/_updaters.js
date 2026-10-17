
const v2x0 = function({trigger,attributes,sections,casc}) {
   k.log(`Identified upgrade to 2.0 version`);
   //k.log(attributes);

   attributes.whisper = '/w gm';
   attributes.set();

   // KP MAX, etc

   hp_fv = attributes.hjalte_poang_fv;
   hp_erf = attributes.hjalte_poang_erf; 
   attributes.hjaltepoang = hp_fv <= hp_erf ? hp_fv : hp_erf; 
   attributes.hjaltepoang_max = hp_fv <= hp_erf ? hp_erf : hp_fv;
   attributes.forflyttning = attributes.forflyttning_normal; 
   attributes.forflyttning_max = attributes.forflyttning_maximal; 
   attributes.barformaga = attributes.barformaga_normal;
   attributes.barformaga_max = attributes.barformaga_maximal;
   attributes.encumbrance_max = attributes.sty_fv;

   //APPEARANCE
   k.log(`Utseende: ${attributes.utseende1 + " " + attributes.utseende2}`);
   attributes.appearance = attributes.utseende1 + " " + attributes.utseende2; 
   attributes.set();

   // ABILITIES
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
   attributes.set();

   // PROFESSION SKILLS
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
   attributes.set();

   // SECONDARY SKILLS
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
   attributes.set();

   // LANGUAGES sprak_7_text
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
   attributes.set();

   // SPELLS besvarjelse_1_text
   [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].forEach( spell => {
      
      const spellName = attributes[`besvarjelse_${spell}_text`]; 
      //k.log(`Testing spell ${spell} with name ${spellName} `+ attributes[`besvarjelse_${spell}_text`]);
      if ( spellName != undefined && spellName != '') {
         k.log(`Found spell to upgrade: ${spellName}`);
         const rowID = k.generateRowID('repeating_spells',sections);
         //k.log(`Row ID = ${rowID}`);
         k.setAttrs({
            [`${rowID}_name`]: spellName,
            [`${rowID}_fv`]: attributes[`besvarjelse_${spell}_s`]||0,
            [`${rowID}_erf`]: attributes[`besvarjelse_${spell}_erf`]||0,
            [`${rowID}_e`]: 1,
            [`${rowID}_collapse`]: 1,
         })
      }
   });
   attributes.set();

   // WEAPONS vapen_7_text
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
   attributes.set();

   // UTRUSTNING
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
   attributes.set();

   // BODY AREA HITPOINTS
   ['head','chest','rarm','varm','mage','vben','hben'].forEach( part => {
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
   attributes.set();

   // KROPPSPOÄNG & PSYPOÄNG
   attributes.kroppspoang_max = attributes.total_kp;
   attributes.psypoang_max = attributes.total_psy;
   attributes.smartpoang_max = attributes.smartpoang = 2 * attributes.fys_fv;

   var kp = 0, psy = 0; 
   [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].forEach( id => {
      kp += attributes[`tot_kp${id}`] == 'on' ? 1 : 0;
      psy += attributes[`tot_psy${id}`] == 'on' ? 1 : 0; 
   });
   k.log(`Found ${kp} KP och ${psy} PSY poäng.`);
   attributes.kroppspoang = kp; 
   attributes.psypoang = psy; 

   attributes.set(); 

   calcHealthpoints({attributes}); 
   calcPainpoints({attributes}); 
   calcDamagebonus({attributes});


   attributes.whisper = '';
   attributes.version = 2.0; 
   attributes.set();

}
k.registerFuncs({'2.0':v2x0},{type:['updater','new']});

