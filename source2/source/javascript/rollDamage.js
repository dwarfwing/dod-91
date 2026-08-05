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
      rollObj.shotgun = weaponSkill == 'shotgun_rifles' ? 'rifles' : 
                     ( weaponSkill == 'shotgun_pistols' ) ? 'pistols' : false; 
      if ( rollObj.shotgun ) {
         //k.log(`Weapon is Shotgun`);
         rollObj.shotgun_olden = attributes[`${row}olden`]||0,
         rollObj.shotgun_slug = attributes[`${row}slug`]||0,
         rollObj.shotgun_sawedoff = attributes[`${row}sawedoff`]||0; 
         rollObj.hitareas = true; 
      } else {
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
         rollObj.hitareas = true; 
      }      
   }

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);

   executeRoll({rollObj});

}
k.registerFuncs({rollDamage});

const rollHitArea = function({trigger,attributes,sections,casc}) {
   rollObj = {};
   //console.log(`Hitarea trigger: ${JSON.stringify(trigger)}`); 
   if (trigger.originalRollId) { 
      rollObj.damage = k.unescape(trigger.originalRollId);
      console.log(`Previous roll data: ${JSON.stringify(rollObj.damage)}`);   
   } 
   //k.log(`Hit area roll trigger: ${JSON.stringify(trigger)}`);
   rollObj.name = getTranslationByKey('hitarea');
   rollObj.hitAreaDie = trigger.name.replace(/hitarea-/,'');

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);

   executeRoll({rollObj});
}
k.registerFuncs({rollHitArea});

