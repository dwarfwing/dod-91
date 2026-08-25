const rollDamage = async function ({trigger,attributes,sections,casc}) {
   //k.log(`Roll trigger: ${JSON.stringify(trigger)}`);
   rollObj = {};
   if (trigger.originalRollId) {  
      rollObj.damageRoll = k.unescape(trigger.originalRollId);
      console.log(`Recorded damage data: ${JSON.stringify(rollObj.damageRoll)}`);     
   
   } else if ( /6$/.test(trigger.name) ) {
      rollObj.name = getTranslationByKey('shotgun-damage');
      rollObj.damageDice = trigger.name.match(/(\d[dD]6)$/)[0];
      rollObj.hitareas = true; 
   // If triggered in any other way, do nothing
   } else {
      const [section,rowID,base] = k.parseTriggerName(trigger.name);
      const row = section ?
         `${section}_${rowID}_` :
         '';
      const weaponSkill = attributes[`${row}skill`];
      console.log(`Weapon skill : ${weaponSkill}`);
      const name = section ?
         (attributes[`${row}skill_name`] ? 
         attributes[`${row}skill_name`] :
         attributes[`${row}name`]):
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
         rollObj.damageBonus = /[Tt]/g.test(bonus) ? bonus.replaceAll(/[Tt]/g,'D') : bonus;
         //rollObj.damageBonus = rollObj.damageBonus.test(/Tt/g) ? rollObj.damageBonus.replace(/[Tt]/g,'D') : rollObj.damageBonus;
      }
      rollObj.damageDice = rollObj.damageDice.replaceAll(/[Tt]/g,'D');

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
      rollObj.painDice = rollObj.painDice.replaceAll(/[Tt]/g,'D');

      k.log(`Damage dice ${rollObj.damageDice} and pain dice ${rollObj.painDice}`);

      rollObj.hitareas = true; 
    
   }

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);

   executeRoll({rollObj});

}
k.registerFuncs({rollDamage});

const rollHitArea = function({trigger,attributes,sections,casc}) {
   rollObj = {};
   console.log(`Hitarea trigger: ${JSON.stringify(trigger)}`); 
   console.log(`Hitarea trigger OriginalRollID: ${JSON.stringify(k.unescape(trigger.originalRollId))}`); 
   if (trigger.originalRollId) { 
      const totals = k.unescape(trigger.originalRollId);
      rollObj.damage = totals.damage; 
      rollObj.pain = totals.pain; 
      console.log(`Previous roll data: ${JSON.stringify(rollObj.damage)}`);   
   } 
   //k.log(`Hit area roll trigger: ${JSON.stringify(trigger)}`);
   rollObj.name = getTranslationByKey('hitarea');
   rollObj.hitAreaDie = trigger.name.replace(/hitarea-/,'');

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);

   executeRoll({rollObj});
}
k.registerFuncs({rollHitArea});

