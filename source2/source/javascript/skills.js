const magicSchoolAdd = function({trigger,attributes,sections,casc}) {
   k.log(`Adding a magic school!`);
}
k.registerFuncs({magicSchoolAdd})

const magicSchoolRemove = function({trigger,attributes,sections,casc}) {
   k.log(`REmoving a magic school!`);
}
k.registerFuncs({magicSchoolRemove})

const setSkill = function ({trigger,attributes,sections,casc}) {
   ////k.log(`Skill name trigger: ${JSON.stringify(trigger)}`);
   const [section,rowID] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}_`;

   if ( section == 'repeating_weapons') {
      if ( attributes[`${row}skill`] == 'manual' ) {
         attributes[`${row}skill_name`] = 'manual';
         attributes[`${row}skill_manual_toggle`] = 1;
         attributes.set();
         return; 
      } 
      //k.log(`trigger new value: ${trigger.newValue}`);
      if ( trigger.newValue == 'shotgun_rifles' || trigger.newValue == 'shotgun_pistols' ) {
         //k.log(`Setting shotgun toggle to 1`)
         attributes[`${row}shotguntoggle`] = 1;
         attributes.set(); 
      } else {
         //k.log(`Setting shotgun toggle to 0`)
         attributes[`${row}shotguntoggle`] = 0;
         attributes.set();
      }
      //k.log(`Skill attr : `+attributes[`${row}skill`]);
      //k.log(`Skill translation : `+getTranslationByKey(attributes[`${row}skill`].replace(/_/,'-')));
      const skillName = attributes[`${row}skill`] == 'rapierfencing' ?
                           'rapier' : 
                           (attributes[`${row}skill`] == 'sabrefencing' ?
                           'sabre' : 
                           ( attributes[`${row}skill`] == 'throwing' ? 
                           'throwing-weapon' : attributes[`${row}skill`].replace(/_/,'-')));
      //k.log(`Skill translation 2 : `+getTranslationByKey(skillName));
      attributes[`${row}skill_name`] = getTranslationByKey(skillName);
      attributes[`${row}skill_manual_toggle`] = 0;

   } else if ( section == 'repeating_trainedskills' ) {
      const attr = attributes[`${row}name`],
            i18n = attr.replace(/_/,'-');
      if ( attr == 'custom-skill' ) {
         //k.log(`Custom skill trigger: ${JSON.stringify(trigger)}`);
         //attributes[`${row}skill_name`] = attributes[`${row}custom_name`]; /
         attributes[`${row}custom_name_display`] = 1;       
         //k.log(`Custom skill name: ${attributes[`${row}custom_name`]}`);
         attributes[`${row}skill_name`] = attributes[`${row}custom_name`]
      } else {
         attributes[`${row}custom_name_display`] = 0;          
         attributes[`${row}skill_name`] = getTranslationByKey(i18n);
         attributes[`${row}skill`] = attributes[attr];
         attributes[`${row}skill_mod`] = attributes[`${attr}_mod`];  
      }          
   }   
   attributes.set();
}
k.registerFuncs({setSkill});

const updateTrainedSkill = function({trigger,attributes,sections,casc}) {
   //k.log(`Slill value trigger: ${JSON.stringify(trigger)}`);
   const [section,rowID] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}_`,
         attr = attributes[`${row}name`],
         newVal = trigger.newValue,
         srcAttr = trigger.sourceAttribute;
   //k.log(`SKill attribute is ${attr}, new value is ${newVal} from source attr ${srcAttr}`);
   //k.log(`Energy eapons: ${attributes['energy_weapons']}`)
   //k.log(`Trained skill attributes: `)
   if ( srcAttr.endsWith("skill")) {
      attributes[`${attr}`] = newVal;
   } else if ( srcAttr.endsWith("skill_mod")) {
      attributes[`${attr}_mod`] = newVal;      
   }
   attributes.set();
   //k.log(`Energy eapons: ${attributes['energy_weapons']}`)
}
k.registerFuncs({updateTrainedSkill});

const setTrainedImprove = function({trigger,attributes,sections,casc}) {
   k.log(`Skill trained improvement trigger: ${JSON.stringify(trigger)}`);
   k.log(`Sections: ${JSON.stringify(sections)}`);

}
k.registerFuncs({setTrainedImprove});

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
            const skillName = attributes[`${trainedSkills[i]}_skill_name`];
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
            const skillName = attributes[`${repeatingSkillIds[i]}_skill_name`];
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

