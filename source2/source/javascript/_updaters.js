
const v2x0 = function({trigger,attributes,sections,casc}) {
   k.log(`Identified upgrade to 2.0 version`);
   //k.log(attributes);

   // KP MAX, etc

   hp_fv = attributes.hjaltepoang_fv;
   hp_erf = attributes.hjaltepoang_erf; 
   attributes.hjaltepoang = hp_fv <= hp_erf ? hp_fv : hp_erf; 
   attributes.hjaltepoang_max = hp_fv <= hp_erf ? hp_erf : hp_fv;

   //APPEARANCE
   k.log(`Utseende: ${attributes.utseende1 + " " + attributes.utseende2}`);
   attributes.appearance = attributes.utseende1 + " " + attributes.utseende2; 

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

   // SECONDARY SKILLS
   [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].forEach( skill => {
      const skillName = attributes[`sek_fard_${skill}_text`]; 
      //k.log(`Testing secondary skill ${skill} with name ${skillName} `+ attributes[`sek_fard_${skill}_text`]);
      if ( skillName != undefined && skillName != '') {
         k.log(`Found secondary skill to upgrade: ${skillName}`);
         const rowID = k.generateRowID('repeating_secondaryskills',sections);
         //k.log(`Row ID = ${rowID}`);
         k.setAttrs({
            [`${rowID}_skill_name`]: skillName,
            [`${rowID}_fv`]: attributes[`sek_fard_${skill}_fv`]||0,
            [`${rowID}_erf`]: attributes[`sek_fard_${skill}_erf`]||0,
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
            [`${rowID}_s`]: attributes[`besvarjelse_${spell}_s`]||0,
            [`${rowID}_erf`]: attributes[`besvarjelse_${spell}_erf`]||0,
            [`${rowID}_e`]: 1,
            [`${rowID}_collapse`]: 1,
         })
      }
   });
   
   attributes.set();

   // WEAPONS vapen_7_text
   [1,2,3,4,5,6,7].forEach( weapon => {
      
      const weaponName = attributes[`vapen_${weapon}_text`]; 
      k.log(`Testing weapon ${weapon} with name ${weaponName} `+ attributes[`vapen_${weapon}_text`]);
      if ( weaponName != undefined && weaponName != '') {
         k.log(`Found weapon to upgrade: ${weaponName}`);
         const rowID = k.generateRowID('repeating_weapons',sections);
         k.log(`Row ID = ${rowID}`);
         k.setAttrs({
            [`${rowID}_name`]: weaponName,
            [`${rowID}_equipped`]: 1,
            [`${rowID}_skill_level`]: attributes[`vapen_${weapon}_fv`]||0,
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

   // LANGUAGES vapen_7_text
   [1,2,3,4,5,6].forEach( lang => {
      
      const langName = attributes[`sprak_${lang}_text`]; 
      k.log(`Testing language ${lang} with name ${langName} `+ attributes[`sprak_${lang}_text`]);
      if ( langName != undefined && langName != '') {
         k.log(`Found language to upgrade: ${langName}`);
         const rowID = k.generateRowID('repeating_languages',sections);
         //-k.log(`Row ID = ${rowID}`);
         k.setAttrs({
            [`${rowID}_text`]: langName,
            [`${rowID}_fv`]: attributes[`sprak_${lang}_fv`]||0,
            [`${rowID}_erf`]: attributes[`sprak_${lang}_erf`]||0,
         })
      }
   });





   attributes.version = 2.0; 
   attributes.set();

}
k.registerFuncs({'2.0':v2x0},{type:['updater','new']});

