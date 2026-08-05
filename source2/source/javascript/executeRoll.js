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
      } else if (rollObj.target) {
         const rollCrit = Math.floor(rollObj.target / 10)||0;
         const climit = rollObj.carryLimit ? rollObj.carryLimit : '';
         rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${rollObj.target}${climit}]]}}`;
      } else if (rollObj.hitAreaDie) {
         rollObj.rollStr += ` {{hitarearoll=[[1D${rollObj.hitAreaDie}]]}} {{hitarea=[[0]]}} {{hitareadetails=[[0]]}}`;
         if ( rollObj.damage ) {
            rollObj.rollStr += ` {{damage=${rollObj.damage}}}`;
         } 
      }
      if (rollObj.damageDice && !rollObj.damageButton ) {      
         rollObj.rollStr += ` {{damage=[[${rollObj.damageDice}[${getTranslationByKey('damage')}]${dmgBonusStr}]]}} {{target-area=[[1D6]]}} {{calcdamage=[[0]]}} {{damageTotal=[[0]]}}`;
      } else if (rollObj.damageRoll) {
         rollObj.rollStr = rollObj.damageRoll;
      } else if (rollObj.damageButton) {
         rollObj.rollStr += ' {{damageRoll=[[0]]}} {{button-label=^{damage}}}';
      }
      /*  else {
         rollObj.rollStr += ` {{roll1=[[1d100cs<1cf100]]}}`;
      } */
      if (rollObj.hitareas) { 
         rollObj.rollStr += ' {{hitareas=true}}';
      }
      if ( rollObj.shotgun ) {
         //k.log(`Executing shotgun attack`);
         rollObj.damageButton = undefined;
         rollObj.rollStr += ' {{shotgun=[[0]]}} {{damage1=[[0]]}} {{damage2=[[0]]}} {{damage3=[[0]]}} {{damage4=[[0]]}} {{damage5=[[0]]}} {{damage6=[[0]]}} '
      }
      /* if ( rollObj.vehicleHitarea ) {
         rollObj.rollStr += ' {{hitareadetails=[[1]]}} {{hitarea=[[0]]}}';
      } */
   }   
   
   k.log(`Executing roll string: ${rollObj.rollStr}`);

   const roll = await startRoll(rollObj.rollStr);

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
      computeObj.calcdamage = roll.results.damage.result < 1 ? 1 : 0;     
      computeObj.damageTotal = roll?.results?.damage?.result;
      //console.log(`Damage total: ${computeObj.damageTotal}`);
   }
   if ( rollObj.damageButton && !rollObj.shotgun ) {
      computeObj.damageRoll = `&{template:dod91} {{character_name=${attributes.character_name}}} {{character_id=@{character_id}}} {{roll-name=${rollObj.name}}} {{target-area=[[1D6]]}} {{hitareas=true}} {{calcdamage=[[0]]}} {{damageTotal=[[0]]}}`;
      //k.log(`REsult ${roll.results.roll1.result} with ttarget ${rollObj.target} is perfect ${roll.results.roll1.result < (Math.floor(rollObj.target / 10)||0)}`)
      
      computeObj.damageRoll += ` {{damage=[[${rollObj.damageDice}[${getTranslationByKey('damage')}]${dmgBonusStr}${perfectStr}]]}}`;
      
      //k.log(`Damage compute Obj pre-escape: ${JSON.stringify(computeObj)}`);
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
   /*
   rollObj.shotgun = shotgun;
         rollObj.shotgun_olden = age;
         rollObj.shotgun_type = type;
         rollObj.shotgun_sawedoff = barrel;

         x 0 0 0 
         x 0 1 0 
         x 0 0 1
         x 0 1 1
         x 1 0 0 
         x 1 1 0
         x 1 0 1
         x 1 1 1

      [{{button-label}}](~{{character_name}}|rolldamage||{{computed::damageRoll}})
   */
   if ( rollObj.shotgun && rollObj.shotgun != '' ) {
      //k.log(` Dealing with shotgun damage: ${rollObj.shotgun} ${rollObj.shotgun_olden} ${rollObj.shotgun_slug} ${rollObj.shotgun_sawedoff}`);
      const olden = rollObj.shotgun_olden,
            slug = rollObj.shotgun_slug,
            sawedoff = rollObj.shotgun_sawedoff; 
      if ( ( olden == 0 && slug == 1 && sawedoff == 0 ) || ( olden == 1 && slug == 1 && sawedoff == 1 ) ) {
         //k.log(`Shotgun test`);
         computeObj.shotgun = 5;
         computeObj.damage1 = `${parseInt(computeObj.perfectRoll)+4}D6`;
         computeObj.damage2 = `${parseInt(computeObj.perfectRoll)+4}D6`;
         computeObj.damage3 = `${parseInt(computeObj.perfectRoll)+3}D6`;
         computeObj.damage4 = `${parseInt(computeObj.perfectRoll)+2}D6`;
         computeObj.damage5 = `${parseInt(computeObj.perfectRoll)+1}D6`;
      } else if ( ( olden == 0 && slug == 0 && sawedoff == 0 ) || ( olden == 1 && slug == 0 && sawedoff == 1 ) ) {
         computeObj.shotgun = 4;
         computeObj.damage1 = `${parseInt(computeObj.perfectRoll)+5}D6`;
         computeObj.damage2 = `${parseInt(computeObj.perfectRoll)+4}D6`;
         computeObj.damage3 = `${parseInt(computeObj.perfectRoll)+3}D6`;
         computeObj.damage4 = `${parseInt(computeObj.perfectRoll)+1}D6`;
      } else if ( olden == 0 && slug == 0 && sawedoff == 1 ) {
         computeObj.shotgun = 3;
         computeObj.damage1 = `${parseInt(computeObj.perfectRoll)+4}D6`;
         computeObj.damage2 = `${parseInt(computeObj.perfectRoll)+3}D6`;
         computeObj.damage3 = `${parseInt(computeObj.perfectRoll)+1}D6`;
      } else if ( olden == 0 && slug == 1 && sawedoff == 1 ) {
         //k.log(`Example shotgun data: ${parseInt(computeObj.perfectRoll)+3} with perfect roll ${computeObj.perfectRoll}.`)
         computeObj.shotgun = 4;
         computeObj.damage1 = `${parseInt(computeObj.perfectRoll)+3}D6`;
         computeObj.damage2 = `${parseInt(computeObj.perfectRoll)+3}D6`;
         computeObj.damage3 = `${parseInt(computeObj.perfectRoll)+2}D6`;
         computeObj.damage4 = `${parseInt(computeObj.perfectRoll)+1}D6`;
      } else if ( olden == 1 && slug == 0 && sawedoff == 0 ) {
         computeObj.shotgun = 5;
         computeObj.damage1 = `${parseInt(computeObj.perfectRoll)+6}D6`;
         computeObj.damage2 = `${parseInt(computeObj.perfectRoll)+5}D6`;
         computeObj.damage3 = `${parseInt(computeObj.perfectRoll)+4}D6`;
         computeObj.damage4 = `${parseInt(computeObj.perfectRoll)+2}D6`;
         computeObj.damage5 = `${parseInt(computeObj.perfectRoll)+1}D6`;
      } else if ( olden == 1 && slug == 1 && sawedoff == 0 ) {
         computeObj.shotgun = 6;
         computeObj.damage1 = `${parseInt(computeObj.perfectRoll)+5}D6`;
         computeObj.damage2 = `${parseInt(computeObj.perfectRoll)+5}D6`;
         computeObj.damage3 = `${parseInt(computeObj.perfectRoll)+4}D6`;
         computeObj.damage4 = `${parseInt(computeObj.perfectRoll)+3}D6`;
         computeObj.damage5 = `${parseInt(computeObj.perfectRoll)+2}D6`;
         computeObj.damage6 = `${parseInt(computeObj.perfectRoll)+1}D6`;
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
   //k.log(`Compute Object: ${JSON.stringify(computeObj)}`); 
   finishRoll(roll.rollId,computeObj);
}
