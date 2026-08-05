const rollWeaponAttack = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID,] = k.parseTriggerName(trigger.name);
   const row =`${section}_${rowID}_`;
   const weaponSkill = attributes[`${row}skill`];
   console.log(`Weapon skill : ${weaponSkill}`);
   rollObj.weaponRoll = true; 
   //k.log('Name is '+ attributes[`${row}name`]);
   rollObj.name = attributes[`${row}name`];
   //k.log(`Skill attribute is `+attributes[`${row}skill`]);
   rollObj.shotgun = weaponSkill == 'shotgun_rifles' ? 'rifles' : 
                     ( weaponSkill == 'shotgun_pistols' ) ? 'pistols' : false; 

   rollObj.skillAttr = section != 'repeating_vehicleweapons' ? attributes[`${row}skill`] : 'vehicle';
   rollObj.skillAttr = rollObj.skillAttr.replace(/^shotgun_/,'');
   //k.log(`Weapon skill: ${rollObj.skillAttr}`);
   if ( rollObj.skillAttr == 'manual' || rollObj.skillAttr == 'vehicle' ) {
      rollObj.rollSkill = attributes[`${row}skill_manual`];
      rollObj.rollSkillMod = 0;
   } else {
      rollObj.rollSkill = rollObj.shotgun ? attributes[rollObj.shotgun] : attributes[rollObj.skillAttr]||0;
      rollObj.rollSkillMod = rollObj.shotgun ? attributes[rollObj.shotgun+'_mod'] : attributes[`${rollObj.skillAttr}_mod`]||0;
   }
   //k.log(`Skill level is `+attributes[skillAttr]);
   rollObj.rollWeaponMod = attributes[`${row}weapon_mod`]||0;
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod + rollObj.rollWeaponMod;
   rollObj.damageButton = true;
   rollObj.damageDice = section ?
      attributes[`${row}damage`] :
      attributes[`${base.replace(/-/g,'_').replace(/_action/,'').toLowerCase()}_damage`];
      /* if ( weaponSkill == 'melee' || 
            weaponSkill == 'martial_arts'  || 
            weaponSkill == 'sabrefencing' || 
            weaponSkill == 'bodybombing' || 
            weaponSkill == 'knifefighting' ) { */
      if (attributes[`${row}damagebonus`] == '1') {
         const damageBonus = attributes[`damagebonus`],
               damageBonusMod = attributes[`damagebonus_mod`],
               bonus = damageBonusMod == '' || damageBonusMod == undefined ? damageBonus : damageBonusMod;
         //k.log(`Damage bonus ? ${damageBonusMod == '' || damageBonusMod == undefined}`)
         rollObj.damageBonus = /[Tt]/g.test(bonus) ? bonus.replaceAll(/[Tt]/g,'D') : bonus;
      //rollObj.damageBonus = rollObj.damageBonus.test(/Tt/g) ? rollObj.damageBonus.replace(/[Tt]/g,'D') : rollObj.damageBonus;
   }
   rollObj.damageDice = rollObj.damageDice.replaceAll(/[Tt]/g,'D');
   
   if ( rollObj.shotgun ) {
      //k.log(`Weapon is Shotgun`);
      rollObj.shotgun_olden = attributes[`${row}olden`]||0,
      rollObj.shotgun_slug = attributes[`${row}slug`]||0,
      rollObj.shotgun_sawedoff = attributes[`${row}sawedoff`]||0; 
      rollObj.damageDice = undefined;
      rollObj.damageButton = false;
      rollObj.hitAreas = true;
   }

   const carry = parseInt(attributes.encumbrance_max) - parseInt(attributes.encumbrance);
   const carrylimit = carry < 0 ? ` ${carry} [${getTranslationByKey('overloaded')}]` : ``;     

   switch ( rollObj.skillAttr ) {
      case 'bows' :
      case 'rifles' :
      case 'throwing' :
      case 'pistols' :
      case 'martial_arts' :
      case 'heavy_weapons' :
      case 'rapierfencing' :
      case 'sabrefencing' :
      case 'knifefighting' : {
         rollObj.carryLimit = carrylimit;
         break;
      }
      default : {
         break; 
      }
   }

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes,sections});
}
k.registerFuncs({rollWeaponAttack});

const rollTrainedSkill = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}_`;
   rollObj.skillAttr = `${section}_${rowID}`;
   //k.log('Name is '+ attributes[`${row}skill_name`]);
   const attrName = attributes[`${row}name`];
   rollObj.name = getTranslationByKey(attributes[`${row}name`].replace(/_/,'-')) ?
                  getTranslationByKey(attributes[`${row}name`].replace(/_/,'-')) :
                  attributes[`${row}name`];
   if ( attributes[`${row}name`] == 'custom-skill' ) {
      rollObj.name = attributes[`${row}skill_name`];
   }
   //k.log(`Skill attribute is `+attributes[`${row}skill`]);
   rollObj.rollSkill = attributes[`${row}skill`];
   rollObj.rollSkillMod = attributes[`${row}skill_mod`];
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod;

   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} `;
   const rollCrit = Math.floor(rollObj.target / 10)||0;
   var limit = 0;
   limit += parseInt(attributes[`armor_limit`])+parseInt(attributes['shield_limit']);
   const limitStr = limit > 0 ? ` -${limit} [${getTranslationByKey('armor')}]` : '';

   rollObj.rollStr += attrName == 'evade' ? 
                     ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}${limitStr}]]}}` :
                     ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollTrainedSkill});

const rollNaturalSkill = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}_`;
   //k.log('Name is '+ attributes[`${row}skill_name`]);
   //rollObj.name = getTranslationByKey(attributes[`${row}name`].replace(/_/,'-')) ?
   //               getTranslationByKey(attributes[`${row}name`].replace(/_/,'-')) :
   //               attributes[`${row}name`];
   rollObj.name = attributes[`${row}skill_name`];
   //k.log(`Skill attribute is `+attributes[`${row}skill`]);
   rollObj.skillAttr = `${section}_${rowID}`;
   rollObj.rollSkill = attributes[`${row}skill`];
   rollObj.rollSkillMod = attributes[`${row}skill_mod`];
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod;
   
   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} `;
   const rollCrit = Math.floor(rollObj.target / 10)||0;

   rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollNaturalSkill});


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

const rollResonance = async function({trigger,attributes,sections,casc,critfail=false}) {
   const currResonance = parseInt(attributes.resonance),
         will = parseInt(attributes.willpower),
         rollObj = {};
   rollObj.name = getTranslationByKey('resonance-roll');
   rollObj.roll = critfail ? `[[2D6 + ${currResonance} [${getTranslationByKey('resonance')}] + 5 [${getTranslationByKey('critfail')}] - ${will} [${getTranslationByKey('willpower')}] ]]` : `[[2D6 + ${currResonance} [${getTranslationByKey('resonance')}] - ${will} [${getTranslationByKey('willpower')}] ]]`;
   
   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} {{roll1=${rollObj.roll}}} {{resonanceeffect=[[0]]}}`;

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   //executeRoll({rollObj,attributes});

   const roll = await startRoll(rollObj.rollStr);
   //k.log(`Roll results: ${JSON.stringify(roll)}`)
   rollObj.result = parseInt(roll.results.roll1.result);
   //const computeObj = {};
   //computeObj.resonanceeffect = parseInt(rollObj.result) - will;

   finishRoll(roll.rollId);
}
k.registerFuncs({rollResonance});

const rollResonanceCrit = function({trigger,attributes,sections,casc}) {
   rollResonance({trigger,attributes,sections,casc,critfail:true});
} 
k.registerFuncs({rollResonanceCrit});

const rollSkill = function ({trigger,attributes,sections,casc}) {
   //k.log(`Skill Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   //const [section,rowID,base] = k.parseTriggerName(trigger.name);
   const name = trigger.name.replace(/-action/,'').toLowerCase();
   //k.log(`Base is ${name}`);
   //k.log(`Base translated is ${getTranslationByKey(name)}`);
   //k.log('Name is '+base.replace(/-/g,'_').replace(/_action/,'').toLowerCase());
   rollObj.name = getTranslationByKey(name);
   const attr = name.replace(/-/g,'_').replace(/_action/,'');
   //k.log(`Roll name is `+rollObj.name);
   k.log(`Roll attribute is `+attr);
   //k.log(`Roll level is `+`${attributes[attr]}`);
   rollObj.skillAttr = attr; 
   rollObj.rollSkill = attributes[attr];
   rollObj.rollSkillMod = attributes[`${attr}_mod`]||0;
   rollObj.target = rollObj.rollSkill + rollObj.rollSkillMod;
   const rollCrit = Math.floor(rollObj.target / 10)||0;

   var alimit = 0, hlimit = 0;
   alimit += parseInt(attributes[`armor_limit`])+parseInt(attributes['shield_limit']);
   hlimit += parseInt(attributes['helmet_limit']);

   const alimitStr = alimit > 0 ? ` -${alimit} [${getTranslationByKey('armor')}]` : '';
   const hlimitStr = hlimit > 0 ? ` -${hlimit} [${getTranslationByKey('helmet')}]` : '';
   const carry = parseInt(attributes.encumbrance_max) - parseInt(attributes.encumbrance);
   const carrylimit = carry < 0 ? ` ${carry} [${getTranslationByKey('overloaded')}]` : ``;     

   rollObj.rollStr = attributes.templatestart + ` {{roll-name=${rollObj.name}}} `;
   switch ( attr ) {
      case 'acrobatics' :
      case 'sneak_hide' :
      case 'evade' : {
         rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}${alimitStr}${carrylimit}]]}}`;
         break;
      }
      case 'perception' : {
         rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}${hlimitStr}]]}}`;
         break;
      }
      case 'bows' :
      case 'rifles' :
      case 'throwing' :
      case 'pistols' :
      case 'dexterity' :
      case 'vehicles' :
      case 'lockpicking' :
      case 'riding' :
      case 'martial_arts' :
      case 'heavy_weapons' :
      case 'carts' : 
      case 'rapierfencing' :
      case 'sabrefencing' :
      case 'knifefighting' :  {
         rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}${carrylimit}]]}}`;
         break;
      }
      default : {
         rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}]]}}`;
      }
   }
/*    rollObj.rollStr += attr == 'acrobatics' || attr == 'sneak_hide' ? 
                     ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}${alimitStr}]]}}` :
                     ( attr == 'perception' ? 
                     ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}${hlimitStr}]]}}` :
                     ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${parseInt(rollObj.target)}]]}}`); */

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);
   //const rollCrit = Math.ceil(rollSkill / 10) != 0 ? Math.ceil(rollSkill / 10) : 1;
   executeRoll({rollObj,attributes});
}
k.registerFuncs({rollSkill});

const rollAttribute = function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {};
   const [section,rowID,base] = k.parseTriggerName(trigger.name);
   //k.log(`Base is ${base}`);
   //k.log('Name is '+base.replace(/-/g,'_').replace(/_action/,'').toLowerCase());
   const attr = base.replace(/attr-/,'').replace(/_action/,'');
   rollObj.name = getTranslationByKey(attr.toLowerCase());
   //k.log(`Skill attribute is `+attr);
   //k.log(`Skill level is `+`${attributes[attr]}`);
   rollObj.attribute = attributes[attr];

   rollObj.rollStr = attributes['templatestart'] + ` {{roll-name=${rollObj.name}}} {{roll1=[[1d100cf100]]}}`;
   rollObj.rollStr += ` {{easy=[[${Math.floor(parseInt(rollObj.attribute) * 7)}]]}}`;
   rollObj.rollStr += ` {{normal=[[${Math.floor(parseInt(rollObj.attribute) * 5)}]]}}`;
   rollObj.rollStr += ` {{difficult=[[${Math.floor(parseInt(rollObj.attribute) * 3)}]]}}`;
   rollObj.rollStr += ` {{absurd=[[${rollObj.attribute}]]}}`;

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

