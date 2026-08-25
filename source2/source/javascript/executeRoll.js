const executeRoll = async function ({rollObj,attributes,sections}) {
   //k.log(`Executing roll object: ${JSON.stringify(rollObj)}`);
   let char_id = '';
   const computeObj = {};
   computeObj.perfectRoll = 0; 
   const dmgBonusStr = rollObj.damageBonus && rollObj.damageBonus != '' ? `+${rollObj.damageBonus}[${getTranslationByKey('damagebonus')}]` : '';
   if ( !rollObj.rollStr ) {
      rollObj.rollStr = `&{template:dod91} {{character_name=@{character_name}}} {{character_id=@{character_id}}} {{roll-name=${rollObj.name}}}`;
      if (rollObj.abilityDice && rollObj.abilityDice != '') {
         //k.log(`Ability roll ${rollObj.abilityDice}`)
         rollObj.rollStr += ` {{roll1=[[${rollObj.abilityDice}]]}}`;
      /* } else if (rollObj.target) {
         const rollCrit = Math.floor(rollObj.target / 10)||0;
         const climit = rollObj.carryLimit ? rollObj.carryLimit : '';
         rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${rollObj.target}${climit}]]}}`; */
      } else if (rollObj.hitAreaDie) {
         rollObj.rollStr += ` {{hitarearoll=[[1D${rollObj.hitAreaDie}]]}} {{hitarea=[[0]]}} {{hitareadetails=[[0]]}}`;
         if ( rollObj.damage ) {
            rollObj.rollStr += ` {{damage=${rollObj.damage}}}`;
         } 
      }
      if (rollObj.damageDice && !rollObj.damageButton ) {      
         rollObj.rollStr += ` {{damage=[[${rollObj.damageDice}[${getTranslationByKey('damage')}]${dmgBonusStr}]]}} {{target-area=[[1D6]]}} {{calcdamage=[[0]]}} {{damageTotal=[[0]]}}`;
         if (rollObj.painDice && !rollObj.damageButton ) {      
            rollObj.rollStr += ` {{pain=[[${rollObj.painDice}[${getTranslationByKey('pain')}]]]}} {{calcpain=[[0]]}} {{painTotal=[[0]]}}`;
         }
      } 
      else if (rollObj.damageRoll) {
         rollObj.rollStr = rollObj.damageRoll;
      }
      else if (rollObj.painRoll) {
         rollObj.rollStr = rollObj.painRoll;
      } else if (rollObj.damageButton) {
         rollObj.rollStr += ' {{damageRoll=[[0]]}} {{button-label=^{damage}}} {{totals=[0]}}';
      }
      /*  else {
         rollObj.rollStr += ` {{roll1=[[1d100cs<1cf100]]}}`;
      } */
      if (rollObj.hitareas) { 
         rollObj.rollStr += ' {{hitareas=true}}';
      }

   }   
   k.log(`RollObject pre-roll: ${JSON.stringify(rollObj)}`)
   k.log(`Executing roll string: ${rollObj.rollStr}`);

   const roll = await startRoll(rollObj.rollStr);

   k.log(`Executed roll : ${JSON.stringify(roll)}`);

   // Success, Perfect and Improvement
   let perfectStr = '';
   if ( rollObj.target && rollObj.target != '') {
      //k.log(`Perfect roll!`)
      success = roll.results.roll1.result <= parseInt(rollObj.target);
      perfect = roll.results.roll1.result < (rollObj.target / 10)||0; 
      k.log(`Roll success ${success} and roll perfect ${perfect}`);
      perfectStr = perfect && !rollObj.abilitySkillRoll ? `+1D6[${getTranslationByKey('perfect-roll')}]` : '';
      computeObj.perfectRoll = perfect ? 1 : 0; 
      const trainedWeaponSkills = ['bodybombing','energy_weapons','knifefighting','sabrefencing','explosives','martial_arts','heavy_weapons','rapierfencing']; 
      k.log(`Is ${rollObj.skillAttr} weapon skillimprovement? ${ trainedWeaponSkills.includes(rollObj.skillAttr) }`);
      if ( success && !perfect ) {
         k.log(`${rollObj.skillAttr}_improve`);
         if ( trainedWeaponSkills.includes(rollObj.skillAttr) ){
            weaponTrainedSkillImprove({rollObj,attributes,sections,perfect:false});
         } else {
            attributes[`${rollObj.skillAttr}_improve`] = 1; 
         }
      } else if ( perfect ) {
         k.log(`${rollObj.skillAttr}_improve_perfect`);
         if ( trainedWeaponSkills.includes(rollObj.skillAttr) ){
            weaponTrainedSkillImprove({rollObj,attributes,sections,perfect:true});
         } else {
            attributes[`${rollObj.skillAttr}_improve_perfect`] = 1; 
         }
      }
      attributes.set();
   }

   if ( roll?.results?.roll1?.result ) {
      //k.log(`Roll result is ${roll.results.roll1.result}`);
      rollObj.result = roll.results.roll1.result; 
   }

   /* if (rollObj.damageDice && roll?.results?.damage?.result) {      
      //k.log(`Damage result: ${roll.results.damage.result}`);
      computeObj.calcdamage = roll.results.damage.result < 1 ? 1 : 0;
      //k.log(`Calculated Damage: ${computeObj.calcdamage}`);
   } */ 
   if ( rollObj.damageRoll || ( rollObj.damageDice && !rollObj.damageButton  ) ) { 
      computeObj.calcdamage = roll.results.damage.result < 0 ? 1 : 0;     
      computeObj.damageTotal = computeObj.calcdamage == 0 ? roll?.results?.damage?.result : 0;
      console.log(`Damage total: ${computeObj.damageTotal}`);
   }
   k.log(`Roll object before adding pain: ${JSON.stringify(rollObj)}`);
   if ( rollObj.damageRoll || ( rollObj.painDice && !rollObj.damageButton ) ) { 
      k.log(`Pain result: ${roll.results.pain.result}`)
      computeObj.calcpain = roll.results.pain.result < 0 ? 1 : 0;     
      computeObj.painTotal = computeObj.calcpain == 0 ? roll?.results?.pain?.result : 0;
      console.log(`Pain total: ${computeObj.painTotal}, calcpain = ${computeObj.calcpain}, painTotal = ${computeObj.painTotal}`);
   }
   computeObj.totals = `damage: ${computeObj.damageTotal||0}, pain: ${computeObj.painTotal||0}`;
   computeObj.totals = k.escape(computeObj.totals);
   if ( rollObj.damageButton ) {
      computeObj.damageRoll = `&{template:dod91} {{character_name=${attributes.character_name}}} {{character_id=@{character_id}}} {{roll-name=${rollObj.name}}} {{target-area=[[1D6]]}} {{hitareas=true}} {{calcdamage=[[0]]}} {{damageTotal=[[0]]}} {{calcpain=[[0]]}} {{painTotal=[[0]]}}`;
      //k.log(`REsult ${roll.results.roll1.result} with ttarget ${rollObj.target} is perfect ${roll.results.roll1.result < (Math.floor(rollObj.target / 10)||0)}`)
      
      computeObj.damageRoll += ` {{damage=[[${rollObj.damageDice}[${getTranslationByKey('damage')}]${dmgBonusStr}${perfectStr}]]}} {{totals=[0]}}`;
      if ( rollObj.painDice && attributes[`use_sp`] == 1 ){
         computeObj.damageRoll += ` {{pain=[[${rollObj.painDice}[${getTranslationByKey('pain')}]${dmgBonusStr}${perfectStr}]]}}`;
      }
      k.log(`Damage compute Obj pre-escape: ${JSON.stringify(computeObj)}`);
      computeObj.damageRoll = k.escape(computeObj.damageRoll);
   }

   if ( rollObj.resonance == 1 ) {
      //k.log(`Result higher than target ${rollObj.target < rollObj.result}`);
      computeObj.abilityfail = rollObj.target < rollObj.result ? 1 : 0 ;
      computeObj.abilityfail = rollObj.result == 100 ? 2 : computeObj.abilityfail;  
      if ( computeObj.abilityfail > 0 ) {
         //k.log(`Ability roll with resonance. Resonance increase ${parseInt(rollObj.result) > parseInt(rollObj.target)}`);
         attributes[`resonance`] += 1;
         attributes.set();  
      }
   } 

   computeObj.hitareadetails = 0; 
   if ( rollObj.hitAreaDie && rollObj.hitAreaDie == '6' && !rollObj.vehicleHitarea ) {
      //k.log(`Hit area is ${JSON.stringify(roll.results.hitarearoll.result)}`);
      computeObj.hitareadetails = 1; 
      switch (roll.results.hitarearoll.result) {
         case 1 : { computeObj.hitarea = getTranslationByKey('right-leg'); break; }
         case 2 : { computeObj.hitarea = getTranslationByKey('left-leg'); break; }
         case 3 : { computeObj.hitarea = getTranslationByKey('torso'); break; }
         case 4 : { computeObj.hitarea = getTranslationByKey('right-arm'); break; }
         case 5 : { computeObj.hitarea = getTranslationByKey('left-arm'); break; }
         case 6 : { computeObj.hitarea = getTranslationByKey('head'); break; }
      }
   }
   if ( rollObj.hitAreaDie && rollObj.hitAreaDie == '12' && !rollObj.vehicleHitarea ) {
      //k.log(`Hit area is ${JSON.stringify(roll.results.hitarearoll.result)}`);
      computeObj.hitareadetails = 1; 
      switch (roll.results.hitarearoll.result) {
         case 1 : { computeObj.hitarea = getTranslationByKey('head'); break; }
         case 2 : { computeObj.hitarea = getTranslationByKey('right-arm'); break; }
         case 3 : { computeObj.hitarea = getTranslationByKey('right-arm'); break; }
         case 4 : { computeObj.hitarea = getTranslationByKey('left-arm'); break; }
         case 5 : { computeObj.hitarea = getTranslationByKey('left-arm'); break; }
         case 6 : { computeObj.hitarea = getTranslationByKey('torso'); break; }
         case 7 : { computeObj.hitarea = getTranslationByKey('torso'); break; }
         case 8 : { computeObj.hitarea = getTranslationByKey('torso'); break; }
         case 9 : { computeObj.hitarea = getTranslationByKey('right-leg'); break; }
         case 10 : { computeObj.hitarea = getTranslationByKey('right-leg'); break; }
         case 11 : { computeObj.hitarea = getTranslationByKey('left-leg'); break; }
         case 12 : { computeObj.hitarea = getTranslationByKey('left-leg'); break; }
      }
   }
   if ( rollObj.vehicleHitarea ) {
     // k.log(`Vehicle hit area ${roll?.results?.hitarearoll?.result}`);
      //k.log(`Vehicle hit area sections ${JSON.stringify(sections.repeating_vehiclehitareas)}`);
      const area = roll?.results?.hitarearoll?.result;
      computeObj.hitareadetails = 1;
      computeObj.hitarea = area != undefined ? attributes[`hitarea_${area}`] : '';
   }
   //k.log(`Roll: ${JSON.stringify(roll)}`); 
   k.log(`Compute Object: ${JSON.stringify(computeObj)}`); 
   finishRoll(roll.rollId,computeObj);
}
