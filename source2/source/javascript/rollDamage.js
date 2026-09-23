const rollDamage = async function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   rollObj = {};
   if (trigger.originalRollId) {  
      rollObj.damageRoll = k.unescape(trigger.originalRollId);
      console.log(`Recorded damage data: ${JSON.stringify(rollObj.damageRoll)}`);     
   } else {
      const [section,rowID,base] = k.parseTriggerName(trigger.name);
      const row = section ?
         `${section}_${rowID}_` :
         '';
      const weaponSkill = attributes[`${row}skill`];
      console.log(`Weapon skill : ${weaponSkill}`);
      const name = section ?
         (attributes[`${row}name`] ? 
         attributes[`${row}name`] :
         attributes[`${row}name`]) :
         base.replace(/-/g,' ').replace(/ action/,'');
      const i18nKey = base.replace(/-action/,'');
      //k.log(`Roll name before translation: ${name}, base ${i18nKey} with translation ${getTranslationByKey(i18nKey)}`);
      rollObj.name = getTranslationByKey(i18nKey) != false ? getTranslationByKey(i18nKey) : name;   
      //k.log(`Roll name after translation: ${rollObj.name}`);

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
         rollObj.damageBonus = /[Tt]/g.test(bonus) ? bonus.toString().replaceAll(/[Tt]/g,'D') : bonus;
         //rollObj.damageBonus = rollObj.damageBonus.test(/Tt/g) ? rollObj.damageBonus.replace(/[Tt]/g,'D') : rollObj.damageBonus;
      }
      rollObj.damageDice = rollObj.damageDice.toString().replaceAll(/[Tt]/g,'D');

      rollObj.painDice = section && attributes['use_sp'].toString() == "1" ?
         attributes[`${row}pain`] :
         attributes[`${base.replace(/-/g,'_').replace(/_action/,'').toLowerCase()}_pain`];
      /* if ( weaponSkill == 'melee' || 
            weaponSkill == 'martial_arts'  || 
            weaponSkill == 'sabrefencing' || 
            weaponSkill == 'bodybombing' || 
            weaponSkill == 'knifefighting' ) { */
      /* if (attributes[`${row}damagebonus`] == '1') {
         const painBonus = attributes[`damagebonus`],
               painBonusMod = attributes[`damagebonus_mod`],
               bonus = painBonusMod == '' || painBonusMod == undefined ? painBonus : painBonusMod;
         //k.log(`pain bonus ? ${painBonusMod == '' || painBonusMod == undefined}`)
         rollObj.painBonus = /[Tt]/g.test(bonus) ? bonus.replaceAll(/[Tt]/g,'D') : bonus;
         //rollObj.painBonus = rollObj.painBonus.test(/Tt/g) ? rollObj.painBonus.replace(/[Tt]/g,'D') : rollObj.painBonus;
      } */
      rollObj.painDice = rollObj.painDice.toString().replaceAll(/[Tt]/g,'D');

      k.log(`Damage dice ${rollObj.damageDice} and pain dice ${rollObj.painDice}`);

      rollObj.hitareas = true; 
    
   }

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);

   executeRoll({rollObj});

}
k.registerFuncs({rollDamage});

const rollHitArea = function({trigger,attributes,sections,casc}) {
   rollObj = {};
   rollObj.charname = attributes.character_name; 
   console.log(`Hitarea trigger: ${JSON.stringify(trigger)}`); 
   console.log(`Hitarea trigger OriginalRollID: ${JSON.stringify(k.unescape(trigger.originalRollId))}`); 
   rollObj.rollStr = k.unescape(trigger.originalRollId); 
   console.log(`Previous roll hitarea roll string: ${JSON.stringify(rollObj.rollStr)}`);   

   //k.log(`Hit area roll trigger: ${JSON.stringify(trigger)}`);
   //rollObj.name = getTranslationByKey('hitarea');
   rollObj.hitAreaDie = trigger.name.replace(/hitarea-/,'');
   rollObj.rollStr += ` {{hitarearoll=[[1D${rollObj.hitAreaDie}]]}}`;
   k.log(`Complete hitarea roll string: ${JSON.stringify(rollObj.rollStr)}`); 

   k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);

   executeRoll({rollObj});
}
k.registerFuncs({rollHitArea});

