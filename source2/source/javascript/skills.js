const magicSchoolAdd = function({trigger,attributes,sections,casc}) {
   k.log(`Adding a magic school!`);
}
k.registerFuncs({magicSchoolAdd})

const magicSchoolRemove = function({trigger,attributes,sections,casc}) {
   k.log(`REmoving a magic school!`);
}
k.registerFuncs({magicSchoolRemove})

const setWeaponSkills = function({trigger,attributes,sections,casc}) {
   sections.repeating_weapons.forEach( id => {
      const row = `repeating_weapons_${id}_`;
      if ( attributes[`${row}skill`] == 'custom' ) {
         attributes[`${row}skill_name`] = getTranslationByKey('manual')||'manual';
         attributes[`${row}skill_manual_toggle`] = 1;
      } else if ( attributes[`${row}skill`] == 'prim_slagsmal' ) {
         const skillName = attributes[`${row}skill_name`] = getTranslationByKey('slagsmål')||'slagsmål';
         const fv = attributes[`${row}fv`] = attributes['prim_slagsmal_fv'];
         attributes[`${row}skill_manual_toggle`] = 0;
         k.log(`Weapon skill attribute: prim_slagsmal and name ${skillName} (översatt ${getTranslationByKey(skillName)}) med fv ${fv}`);
      } else {
         //k.log(`trigger new value: ${trigger.newValue}`);
         //k.log(`Skill attr : `+attributes[`${row}skill`]);
         //k.log(`Skill translation : `+getTranslationByKey(attributes[`${row}skill`].replace(/_/,'-')));
         const skillAttr = attributes[`${row}skill`],
               skillName = attributes[`${skillAttr}_name`]
               fv = attributes[`${skillAttr}_fv`];;
         k.log(`Weapon skill attribute: ${skillAttr} and name ${skillName} (översatt ${getTranslationByKey(skillName)}) med fv ${fv}`);
         //k.log(`Skill translation 2 : `+getTranslationByKey(skillName));
         attributes[`${row}skill_name`] = getTranslationByKey(skillName)||skillName;
         attributes[`${row}fv`] = fv;
         attributes[`${row}skill_manual_toggle`] = 0;
      }
      attributes.set();
   });
}
k.registerFuncs({setWeaponSkills},{type:['opener']});

const setSkillB = function ({trigger,attributes,sections,casc}) {
   //k.log(`Skill name trigger: ${JSON.stringify(trigger)}`);
   const [section,rowID,base] = k.parseTriggerName(trigger.name),
       skillAttr = section ? `${section}_${rowID}` : base.replace(/_fv/,''),
       skillName = attributes[`${skillAttr}_name`],
       skillLevel = attributes[`${skillAttr}_fv`];
   //k.log(`Skill section ${section} and base ${base}, attr ${skillAttr} with name ${skillName}`);
   const bLevel = {
      0: 0, 1: 1, 2: 2, 3: 1, 4: 1, 
      5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2,
      11: 3, 12: 3, 13: 3, 14: 3, 15: 3,
      16: 4, 17: 4, 18: 4, 19: 4, 20: 5,    
   };
   attributes[`${skillAttr}_b`] = ( skillLevel < 21 ) ? bLevel[skillLevel] : 5;
  
   attributes.set();
}
k.registerFuncs({setSkillB});

const setTrainedImprove = function({trigger,attributes,sections,casc}) {
   k.log(`Skill trained improvement trigger: ${JSON.stringify(trigger)}`);
   k.log(`Sections: ${JSON.stringify(sections)}`);

}
k.registerFuncs({setTrainedImprove});

const setSpellCosts = function({trigger,attributes,sections,cost}) {
   k.log(`Spells: ${JSON.stringify(sections.repeating_spells)}`);
   sections.repeating_spells.forEach( spellId => {
      let spell = 'repeating_spells_'+spellId; 
      const sv = attributes[`${spell}_sv`],
            cost = Math.ceil( parseInt(sv) / 3 ) * 2,
            name = attributes[`${spell}_name`];
      if ( isNaN(cost) ) { return; }
      attributes[`${spell}_cost`] = cost; 
      k.log(`Set magic spell ${name} with sv ${sv} to cost ${cost}`);
   });
   attributes.set(); 
}
k.registerFuncs({setSpellCosts},{type:['opener']});

const chatSpellDescription = async function({trigger,attributes,sections, casc}) {
   const [section,rowID,base] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}`;
   const rollObj = {
      name: attributes[`${row}_name`],
      description: attributes[`${row}_description`],
      quick: attributes[`${row}_k`] == '1' ? 'K ' : '',
      physical: attributes[`${row}_f`] == '1' ? 'F ' : '',
      ritual: attributes[`${row}_r`] == '1' ? 'R ' : '',
      range: attributes[`${row}_range`]||'',
      duration: attributes[`${row}_duration`]||'',
   }
   rollObj.showType = ( rollObj.quick == '' && rollObj.physical == '' && rollObj.ritual == '' ) ? '' : ' {{showtype=[[1]]}}';

   rollObj.secretRoll = attributes.whisper == '/sr' ? 1 : 0;
   rollObj.secretRoll = attributes[`${rollObj.skillAttr}_type`] == 'asecret' ? 1 : rollObj.secretRoll; 

   rollObj.rollStr = rollObj.secretRoll ? attributes['templatestartsecret'] + ` {{roll-name=${rollObj.name}}}` : attributes['templatestart'] + ` {{roll-name=${rollObj.name}}}`;
   rollObj.rollStr += ` {{description=${rollObj.description}}} {{k=${rollObj.quick}}} {{f=${rollObj.physical}}} {{r=${rollObj.ritual}}}`;
   rollObj.rollStr += ` {{range=${rollObj.range}}} {{duration=${rollObj.duration}}} {{is-spell=[[1]]}} ${rollObj.showType}`;

   //executeRoll(rollObj,attributes);

   const roll = await startRoll(rollObj.rollStr);
   finishRoll(roll.rollId);

}

k.registerFuncs({chatSpellDescription});

const setMartialartsCost = function({trigger,attributes,sections,casc}) {
   ['martialart1','martialart2','martialart3'].forEach( art => {
      const section = 'repeating_'+art; 
      // const [section,rowID,base] = k.parseTriggerName(trigger.name);
      // const baseAttr = section.replace(/repeating_/,'');
      k.log(`martial arts ${section} (base ${art}) cost update}`);
      const cost = sections[`${section}`].reduce( (acc,curr) => attributes[`${section}_${curr}_cost`] + acc, 0 ) + parseInt(attributes[`${art}_basecost`]);

      k.log(`Calculated cost = ${cost}`);
      attributes[`${section.replace(/repeating_/,'')}_cost`] = cost; 
   });
   attributes.set();

}
k.registerFuncs({setMartialartsCost},{type:['opener']});

const rollImprovements = async function({trigger,attributes,sections,casc}) {
   //k.log(`Skill improvement trigger: ${JSON.stringify(trigger)}`);
   //k.log(`Skill improvement trigger: ${JSON.stringify(sections)}`);
   const skills = ['acrobatics','bows','first_aid','rifles','perception','throwing','bartering','melee','pistols','sneak_hide']
   const naturalSkills = sections.repeating_naturalskills.map( (id) => `repeating_naturalskills_${id}` ) || [];
   const trainedSkills = sections.repeating_trainedskills.map( (id) => `repeating_trainedskills_${id}`) || [];
   const abilitySkills = sections.repeating_abilities.map( (id) => `repeating_abilities_${id}`) || [];
   
   //k.log(`Skills: ${JSON.stringify(skills)}`);
   //k.log(`Natural Skills: ${JSON.stringify(naturalSkills)}`);
   k.log(`Trained Skills: ${JSON.stringify(trainedSkills)}`);
   //k.log(`Ability Skills: ${JSON.stringify(abilitySkills)}`);
   
   const repeatingSkillIds = [...naturalSkills, ...abilitySkills];
   //k.log(`Repeating Skills: ${JSON.stringify(repeatingSkillIds)}`);
   const improv = ['improve','improve_perfect'];
   
   for(i = 0; i < skills.length; i++) {
      for(n = 0; n < improv.length; n++) {
         //k.log(`Skill: ${skills[i]} ${improv[n]}`);
         if (attributes[`${skills[i]}_${improv[n]}`] == 1 || attributes[`${skills[i]}_${improv[n]}`] == '1') {
            const skillAttr = skills[i]; 
            //var skillName = /repeating_/.test(skill) ? getTranslationByKey(skill+'_name');
            const skillName = getTranslationByKey(skills[i].replace(/_/,'-'));
            const improvAttr = `${skills[i]}_${improv[n]}`;
            await rollImprovement({attributes,skillAttr,skillName,improvAttr})
         }
      };      
   };
   // TO TEST
   for(i = 0; i < trainedSkills.length; i++ ) {      
      for(n = 0; n < improv.length; n++) {
         //k.log(`Skill: ${trainedSkills[i]} ${improv[n]}`)
         if (attributes[`${trainedSkills[i]}_${improv[n]}`] == 1 || attributes[`${trainedSkills[i]}_${improv[n]}`] == '1') {
            const skillAttr = trainedSkills[i]+'_skill'; 
            //var skillName = /repeating_/.test(skill) ? getTranslationByKey(skill+'_name');
            const skillName = attributes[`${trainedSkills[i]}_name`];
            const improvAttr = `${trainedSkills[i]}_${improv[n]}`;
            const additionalAttr = attributes[`${trainedSkills[i]}_name`];
            await rollImprovement({attributes,skillAttr,skillName,improvAttr,additionalAttr})
         }
      }; 
   }
   /**/
   // TO FIX
   for(i = 0; i < repeatingSkillIds.length; i++ ) {      
      for(n = 0; n < improv.length; n++) {
         //k.log(`Skill: ${repeatingSkillIds[i]} ${improv[n]}`)
         if (attributes[`${repeatingSkillIds[i]}_${improv[n]}`] == 1 || attributes[`${repeatingSkillIds[i]}_${improv[n]}`] == '1') {
            const skillAttr = repeatingSkillIds[i]+'_skill'; 
            //var skillName = /repeating_/.test(skill) ? getTranslationByKey(skill+'_name');
            const skillName = attributes[`${repeatingSkillIds[i]}_name`];
            const improvAttr = `${repeatingSkillIds[i]}_${improv[n]}`;
            await rollImprovement({attributes,skillAttr,skillName,improvAttr})
         }
      }; 
   }
   /**/
   
}
k.registerFuncs({rollImprovements});

const rollImprovement = async function({attributes,skillAttr,skillName,improvAttr,additionalAttr}) {
   //k.log(`Attributes: ${JSON.stringify(attributes)}`);
   k.log(`Skill attr: ${skillAttr}, skill name: ${skillName}, improv attr: ${improvAttr}`);
   rollObj = {};
   rollObj.name = getTranslationByKey('improvement') + ': ' + skillName;
   //k.log(`Skill level: ` + attributes[`${skillAttr}`]);
   rollObj.target = attributes[skillAttr];
   rollObj.rollStr = attributes.templatestartwhisper + ` {{roll-name=${rollObj.name}}} `;
   rollObj.rollStr += ` {{roll1=[[1d100cs<0cf>100]]}} {{target=[[${rollObj.target}]]}} {{rollImprov=[[1d6]]}} {{improvement=[[0]]}} {{improvementsuccess=[[0]]}}`;

   k.log(`Roll object: ${JSON.stringify(rollObj)}`);
   const roll = await startRoll(rollObj.rollStr);
   const computeObj = {};
   computeObj.improvement = 1;
   computeObj.improvementsuccess = 0;
   k.log(`Roll result object: ${JSON.stringify(roll)}`);
   const rollResult = parseInt(roll.results.roll1.result);
   //k.log(`Roll result ${rollResult} over ${rollObj.target}`);
   k.log(`Improvement : ${rollResult > rollObj.target} with ${roll.results.rollImprov.result}`);
   if ( ( rollObj.target >= 100 && rollResult == 100 ) || (rollObj.target < 100 && rollResult >= rollObj.target ) ) {
      computeObj.improvement = roll.results.rollImprov.result;
      computeObj.improvementsuccess = 1;
      //computeObj.improvement = 1;
   }
   k.log(`Skill improvement compute Object: ${JSON.stringify(computeObj)}`);
   attributes[skillAttr] = parseInt(attributes[skillAttr]) + parseInt(computeObj.improvement);
   if ( /^repeating_trainedskill/.test(skillAttr) ) {
      //k.log(`Additional attr for improvement: ${`${skillAttr}_name`}`);
      //const skillName = attributes[`${skillAttr}_name`];
      k.log(`Trained skill improvement: ${additionalAttr}`);
      attributes[additionalAttr] = parseInt(attributes[additionalAttr]) + parseInt(computeObj.improvement);
   }
   attributes[improvAttr] = 0;
   k.log(`compute Object: ${JSON.stringify(computeObj)}`);
   finishRoll(roll.rollId,computeObj);
   attributes.set();
}

