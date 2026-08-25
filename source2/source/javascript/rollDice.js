const rollWeaponAttack = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID,] = k.parseTriggerName(trigger.name);
   const row =`${section}_${rowID}_`;
   
   rollObj.weaponRoll = true; 
   //k.log('Name is '+ attributes[`${row}name`]);
   rollObj.name = attributes[`${row}name`];

   rollObj.skillAttr = attributes[`${row}skill`];
   //k.log(`Weapon skill: ${rollObj.skillAttr}`);
   if ( rollObj.skillAttr == 'manual' ) {
      rollObj.rollSkill = attributes[`${row}skill_level`];
      rollObj.rollSkillMod = 0;
   } else {
      rollObj.rollSkill = attributes[`${rollObj.skillAttr}_fv`]||attributes[`${row}skill_level`];
      rollObj.rollSkillMod = attributes[`${rollObj.skillAttr}_mod`]||0;
   }
   //k.log(`Skill level is `+attributes[skillAttr]);
   rollObj.rollWeaponMod = attributes[`${row}weapon_mod`]||0;
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod + rollObj.rollWeaponMod;
   rollObj.damageButton = true;
   rollObj.damageDice = section ?
      attributes[`${row}damage`] :
      attributes[`${base.replace(/-/g,'_').replace(/_action/,'').toLowerCase()}_damage`];
   rollObj.damageDice = rollObj.damageDice.replaceAll(/[Tt]/g,'D');
   if ( attributes['use_sp'] == 1) {
      rollObj.painDice = section ?
         attributes[`${row}pain`] :
         attributes[`${base.replace(/-/g,'_').replace(/_action/,'').toLowerCase()}_pain`];
      rollObj.painDice = rollObj.painDice.replaceAll(/[Tt]/g,'D');
   }
   if (attributes[`${row}damagebonus`] == '1') {
      const damageBonus = attributes[`sakdebonus`],
            damageBonusMod = attributes[`skadebonus_mod`],
            bonus = damageBonusMod == '' || damageBonusMod == undefined ? damageBonus : damageBonusMod;
      //k.log(`Damage bonus ? ${damageBonusMod == '' || damageBonusMod == undefined}`)
      rollObj.damageBonus = /[Tt]/g.test(bonus) ? bonus.replaceAll(/[Tt]/g,'D') : bonus;
      //rollObj.damageBonus = rollObj.damageBonus.test(/Tt/g) ? rollObj.damageBonus.replace(/[Tt]/g,'D') : rollObj.damageBonus;
   }

   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}}`;
   rollObj.rollStr += ` {{roll1=[[1d20cs<1cf>20]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;
   rollObj.rollStr += ' {{damageRoll=[[0]]}} {{painRoll=[[0]]}} {{button-label=^{damage}}}';

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes,sections});
}
k.registerFuncs({rollWeaponAttack});

const rollTrainedSkill = function ({trigger,attributes,sections,casc}) {
   k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   rollObj.skillAttr = trigger.name.replace(/-action/,'').replace(/-roll/,'').replace(/-/g,'_').toLowerCase();
   rollObj.name = attributes[`${rollObj.skillAttr}_text`];
   if ( rollObj.name == 'custom-skill' ) {
      rollObj.name = attributes[`${rollObj.skillAttr}_skill_name`];
   }
   k.log(`Skill attribute ${rollObj.skillAttr} is `+attributes[`${rollObj.skillAttr }_fv`]);
   rollObj.rollSkill = attributes[`${rollObj.skillAttr}_fv`];
   rollObj.rollSkillMod = attributes[`${rollObj.skillAttr}_mod`];
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod;

   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}}`;
   rollObj.rollStr += ` {{roll1=[[1d20cs<1cf>20]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollTrainedSkill});

const rollRepeatingSkill = function ({trigger,attributes,sections,casc}) {
   k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID] = k.parseTriggerName(trigger.name);
   
   k.log(`Section ${section} and id ${rowID}`);
   rollObj.skillAttr = section ? 
                        `${section}_${rowID}` : 
                        trigger.name.startsWith("repeating-besvarjelse") ?
                        trigger.name.replace(/-roll/,'').replaceAll(/-/g,'_').toLowerCase() : 
                        trigger.name.replace(/-action/,'').toLowerCase();
   k.log(`SPell attr: ${rollObj.skillAttr}`);
   rollObj.name = attributes[`${rollObj.skillAttr}_skill_name`] != undefined ? 
                  attributes[`${rollObj.skillAttr}_skill_name`] : 
                  ( attributes[`${rollObj.skillAttr}_name`] != undefined ?
                  attributes[`${rollObj.skillAttr}_name`] :
                  attributes[`${rollObj.skillAttr}_text`] );
   rollObj.rollSkill = attributes[`${rollObj.skillAttr}_fv`];
   k.log(`SPell S value: ${rollObj.rollSkill}`);
   rollObj.rollSkillMod = attributes[`${rollObj.skillAttr}_mod`];
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod;
   
   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} `;

   rollObj.rollStr += ` {{roll1=[[1d20cs<1cf>20]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollRepeatingSkill});

const rollRepeatingSpell = function ({trigger,attributes,sections,casc}) {
   k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID] = k.parseTriggerName(trigger.name);
   
   k.log(`Section ${section} and id ${rowID}`);
   rollObj.skillAttr = section ? 
                        `${section}_${rowID}` : 
                        trigger.name.startsWith("repeating-besvarjelse") ?
                        trigger.name.replace(/-roll/,'').replaceAll(/-/g,'_').toLowerCase() : 
                        trigger.name.replace(/-action/,'').toLowerCase();
   k.log(`SPell attr: ${rollObj.skillAttr}`);
   rollObj.name = attributes[`${rollObj.skillAttr}_skill_name`] != undefined ? 
                  attributes[`${rollObj.skillAttr}_skill_name`] : 
                  ( attributes[`${rollObj.skillAttr}_name`] != undefined ?
                  attributes[`${rollObj.skillAttr}_name`] :
                  attributes[`${rollObj.skillAttr}_text`] );
   rollObj.rollSkill = attributes[`${rollObj.skillAttr}_s`];
   k.log(`SPell S value: ${rollObj.rollSkill}`);
   rollObj.rollEffectMod = (parseInt(attributes[`${rollObj.skillAttr}_e`]||1) - 1) * 2;
   rollObj.rollSkillMod = attributes[`${rollObj.skillAttr}_mod`];
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod - rollObj.rollEffectMod;
   
   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} `;

   rollObj.rollStr += ` {{roll1=[[1d20cs<1cf>20]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollRepeatingSpell});


const rollSkill = function ({trigger,attributes,sections,casc}) {
   k.log(`Skill Roll trigger: ${JSON.stringify(trigger)}`);
   //k.log(`Spine for weapon types: ${JSON.stringify(spine.weaponskills)}`);
   const rollObj = {};
   //const [section,rowID,base] = k.parseTriggerName(trigger.name);
   const name = trigger.name.replace(/-action/,'').toLowerCase();
   //k.log(`Base is ${name}`);
   //k.log(`Base translated is ${getTranslationByKey(name)}`);
   //k.log('Name is '+base.replace(/-/g,'_').replace(/_action/,'').toLowerCase());
   rollObj.name = getTranslationByKey(name) ? getTranslationByKey(name) : name;
   rollObj.skillAttr = name.replace(/-/g,'_').replace(/_action/,'').replace(/_roll/,'').toLowerCase();
   //k.log(`Roll name is `+rollObj.name);
   k.log(`Roll attribute is `+rollObj.skillAttr);
   
   rollObj.rollSkill = attributes[`${rollObj.skillAttr}_fv`];
   rollObj.rollSkillMod = attributes[`${rollObj.skillAttr}_mod`]||0;
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod;

   rollObj.rollStr = attributes.templatestart + ` {{roll-name=${rollObj.name}}} `;
   
   rollObj.rollStr += ` {{roll1=[[1d20cs<1cf>20]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;

   k.log(`Roll object is: ${JSON.stringify(rollObj)}`);
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollSkill});

const rollAttribute = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID,base] = k.parseTriggerName(trigger.name);
   //k.log(`Base is ${base}`);
   //k.log('Name is '+base.replace(/-/g,'_').replace(/_action/,'').toLowerCase());
   const attr = base.replace(/attr-/,'').replace(/_action/,'').toLowerCase();
   rollObj.name = getTranslationByKey(attr.toLowerCase());
   //k.log(`Skill attribute is `+attr);
   //k.log(`Skill level is `+`${attributes[attr]}`);
   rollObj.attribute = attributes[attr];

   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} {{roll1=[[1d20cs<1cf>20]]}}`;
/*    rollObj.rollStr += ` {{easy=[[${Math.floor(parseInt(rollObj.attribute) * 7)}]]}}`;
   rollObj.rollStr += ` {{normal=[[${Math.floor(parseInt(rollObj.attribute) * 5)}]]}}`;
   rollObj.rollStr += ` {{difficult=[[${Math.floor(parseInt(rollObj.attribute) * 3)}]]}}`;
   rollObj.rollStr += ` {{absurd=[[${rollObj.attribute}]]}}`; */

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollAttribute});

const rollAttributeContest = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID,base] = k.parseTriggerName(trigger.name);
   //k.log(`Base is ${base}`);
   //k.log('Name is '+base.replace(/-/g,'_').replace(/_action/,'').toLowerCase());
   const attr = base.replace(/attr-contest-/,'').replace(/_action/,'');
   rollObj.name = getTranslationByKey('contested-roll') + ": " +  getTranslationByKey(attr.toLowerCase());
   //k.log(`Skill attribute is `+attr);
   //k.log(`Skill level is `+`${attributes[attr]}`);
   rollObj.attribute = attributes[attr];

   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} {{roll1=[[1d10+${rollObj.attribute}]]}}`;

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollAttributeContest});

// Rolled when clicked Initiativv'rde or Init field in weapon list
const rollInit = async function({trigger,attributes,sections,casc}) {
   k.log(`Roll Init trigger: ${JSON.stringify(trigger)}`);
   const [section,rowID,base] = k.parseTriggerName(trigger.name);
   //k.log(`Base is ${base}`);
   const row = section ?
      `${section}_${rowID}_` :
      '';
   const rollObj = {
      name : getTranslationByKey('initiative-value'),
      initBonus: attributes['initiativebonus'],
      initBonusMod: attributes['initiativebonus_mod'],
      init : attributes['initiative'],
      initStr: '',
      initMod : attributes[`initiative_mod`]||0,
      weaponInit: 0,
   };
   //rollObj.rollInit = rollObj.init + rollObj.initMod;
   if ( rollObj.init == undefined || rollObj.init == 0 || rollObj.init == '' ) {
      rollObj.initStr = `1D10 + ${rollObj.initBonus} + ${rollObj.initBonusMod} [${getTranslationByKey('modifier-abbr')}]`;
   } else {
      rollObj.initStr = `${rollObj.init} [${getTranslationByKey('init-abbr')}}]`;
   }   
   if ( rollObj.initMod != 0 ) {
      rollObj.initStr += ` + ${rollObj.initMod} [${getTranslationByKey('modifier-abbr')}]`;
   } 
   if ( section && section == 'repeating_weapons') {
      //k.log(`Weapon initiative!`)
      rollObj.weaponInit = attributes[`${row}init`]||0;
      rollObj.initStr += ` + ${rollObj.weaponInit} [${getTranslationByKey('weapon')}]`;
   }
   //k.log('Name is '+base.replace(/-/g,'_').replace(/_action/,'').toLowerCase());
   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //executeRoll({rollObj});
   rollObj.rollStr = attributes.templatestart + ` {{roll-name=${rollObj.name}}}`;
   rollObj.rollStr += ` {{roll1=[[${rollObj.initStr} &{tracker} ]]}}`;
   //k.log(`Executing roll string: ${rollObj.rollStr}`);
   const roll = await startRoll(rollObj.rollStr);
   attributes.initiative = parseInt(roll.results.roll1.result) - rollObj.initMod - rollObj.weaponInit;
   //k.log(`Roll: ${JSON.stringify(roll)}`);
   finishRoll(roll.rollId);
   attributes.set();
}
k.registerFuncs({rollInit});

// Rolled when clicking Initiativbonus field
const setInit = async function({trigger,attributes,sections,casc}) {
   k.log(`Set Init trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {
      name : getTranslationByKey('initiative-set'),
      initBonus : attributes['initiativebonus'],
      initBonusMod : attributes[`initiativebonus_mod`]||0,
   }; 
   rollObj.initStr = `1d10 + ${rollObj.initBonus} [${getTranslationByKey('init-bonus-abbr')}]`;
   if ( rollObj.initBonusMod != 0 ) {
      rollObj.initStr += ` + ${rollObj.initBonusMod} [${getTranslationByKey('modifier-abbr')}]`;
   }
   rollObj.rollStr = attributes.templatestart + ` {{roll-name=${rollObj.name}}}`;
   rollObj.rollStr += ` {{roll1=[[${rollObj.initStr} &{tracker} ]]}}`;
   console.log(`INit roll string: ${rollObj.rollStr}`);
   k.log(`Executing init roll string: ${rollObj.rollStr}`);
   const roll = await startRoll(rollObj.rollStr);
   k.log(`Init roll: ${JSON.stringify(roll)}`);
   k.log(`Init roll result: ${roll.results.roll1.result}`);
   attributes.initiative = roll.results.roll1.result; 
   finishRoll(roll.rollId); 
   attributes.set(); 
}
k.registerFuncs({setInit});

const abilityDice = async function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID,base] = k.parseTriggerName(trigger.name);
   const row = section ?
      `${section}_${rowID}_` :
      '';
   rollObj.name = base.replace(/-/g,' ').replace(/ action/,'');
   rollObj.name = getTranslationByKey(base.replace(/-action/,'')) != false ? getTranslationByKey(base.replace(/-action/,'')) : rollObj.name;
   //k.log(`Roll name after translation: ${rollObj.name}`);
   rollObj.rollSkill = attributes[`${base.replace(/-/g,'_').replace(/_action/,'').toLowerCase()}`];
   rollObj.rollSkillMod = attributes[`${base.replace(/-/g,'_').replace(/_action/,'').toLowerCase()}_mod`]||0;
   
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod;
   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;

   executeRoll({rollObj,attributes});

}
k.registerFuncs({abilityDice});


const rollAbility = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}_`;
   //k.log('Name is '+ attributes[`${row}skill_name`]);
   if ( attributes[`${row}roll`] == '' && attributes[`${row}damage`] == '' ) { return; }
   rollObj.name = attributes[`${row}skill_name`];
   rollObj.abilityDice = attributes[`${row}roll`].replaceAll(/[Tt]/g,'D');

   //k.log(`Skill attribute is `+attributes[`${row}skill`]);
   if ( attributes[`${row}damage`] && attributes[`${row}damage`] != '' ) {
      rollObj.damageButton = true;
      rollObj.damageDice = attributes[`${row}damage`].replaceAll(/[Tt]/g,'D');
   }

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollAbility});

const rollAbilitySkill = async function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}_`;
   //k.log('Name is '+ attributes[`${row}skill_name`]);
   rollObj.skillAttr = `${section}_${rowID}`;
   rollObj.name = attributes[`${row}skill_name`];
   rollObj.abilitySkillRoll = true; 
   rollObj.target = attributes[`${row}skill`] + (attributes[`${row}skill_mod`]||0);
   const rollCrit = Math.ceil(rollObj.target / 10) != 0 ? Math.ceil(rollObj.target / 10) : 1;

   rollObj.rollStr = attributes['templatestart'] + 
                     ` {{roll-name=${rollObj.name}}}` +
                     ` {{roll1=[[1d100cs<${rollCrit}cf100]]}}` + 
                     ` {{target=[[${rollObj.target}]]}}`;

   //k.log(`Skill attribute is `+attributes[`${row}skill`]);
   if ( attributes[`${row}damage`] && attributes[`${row}damage`] != '' ) {
      rollObj.damageButton = true;
      rollObj.damageDice = attributes[`${row}damage`].replaceAll(/[Tt]/g,'D');
      rollObj.rollStr += ' {{damageRoll=[[0]]}} {{button-label=^{damage}}} {{damageTotal=[[0]]';
   }
   if ( attributes[`${row}ability_resonance`] == '1' || attributes[`${row}ability_resonance`] == 'on' ) {
      //k.log(`Ability with resonance`);
      rollObj.rollStr += ` {{abilityfail=[[0]]}} {{resonance-label=^{resonance}}}`;
      rollObj.resonance = 1; 
   }

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});

}
k.registerFuncs({rollAbilitySkill});

const rollCustomDice = function({trigger,attributes,sections,casc}) {
   attributes.set();
   const modStr = !attributes.custom_dice_modifier || attributes.custom_dice_modifier == '' ? '' : `+${attributes.custom_dice_modifier}`;
   const rollName = attributes.custom_dice_name == '' ?
                     `${attributes.custom_dice_count}D${attributes.custom_dice_size}${modStr}` : 
                     attributes.custom_dice_name; 
   const rollObj = {
      rollStr: attributes.templatestart + ` {{roll-name=${rollName}}}`,
   };
   rollObj.rollStr += ` {{roll1=[[${attributes.custom_dice_count}D${attributes.custom_dice_size}${modStr}]]}}`;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollCustomDice});

