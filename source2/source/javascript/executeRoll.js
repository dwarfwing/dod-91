const executeRoll = async function ({rollObj,attributes,sections}) {
   //k.log(`Executing roll object: ${JSON.stringify(rollObj)}`);
   let char_id = '';
   const computeObj = {};
   rollObj.perfect = 0; 
   computeObj.name = rollObj.name;
   k.log(`???? Roll Object name : ${rollObj.name}`);
   rollObj.secretRoll = attributes.whisper == '/sr' ? 1 : 0; 
   //const dmgBonusStr = rollObj.damageBonus && rollObj.damageBonus != '' ? `+${rollObj.damageBonus}[${getTranslationByKey('damagebonus')}]` : '';
   //k.log(`Damage bonus in Execute Roll: ${rollObj.damageBonus} and string: ${rollObj.damageBonusStr}`);   
   if ( rollObj?.skillAttr ) {
      rollObj.gainExp = rollObj?.skillAttr.startsWith('repeating_languages') || rollObj.skillAttr.startsWith('repeating_magicschools') ? false : true; 
   }   

   if ( !rollObj.rollStr ) {
      rollObj.rollStr = `&{template:dod91} {{character_name=@{character_name}}} {{character_id=@{character_id}}} {{roll-name=${rollObj.name}}}`;
      if (rollObj.abilityDice && rollObj.abilityDice != '') {
         //k.log(`Ability roll ${rollObj.abilityDice}`)
         const target2 = rollObj?.skillAttr ? attributes[`${rollObj.skillAttr}_fv`] : 1; 
         rollObj.rollStr += ` {{roll1=[[${rollObj.abilityDice}]]}} {{roll2=[[1d20cs<${target2}cf>20]]}}`;
      /* } else if (rollObj.target) {
         const rollCrit = Math.floor(rollObj.target / 10)||0;
         const climit = rollObj.carryLimit ? rollObj.carryLimit : '';
         rollObj.rollStr += ` {{roll1=[[1d100cs<${rollCrit}cf100]]}} {{target=[[${rollObj.target}${climit}]]}}`; */
      } else if (rollObj.hitAreaDie) {
         rollObj.rollStr += ` {{hitarearoll=[[1D${rollObj.hitAreaDie}]]}} {{hitarea=[[0]]}} {{hitareadetails=[[0]]}}`;
         if ( rollObj.damage ) {
            rollObj.rollStr += ` {{damage=${rollObj.damage}}} {{calcdamage=[[0]]}}`;
         } 
         if ( rollObj.pain ) {
            rollObj.rolLStr += ` {{pain=${rollObj.pain}}} {{calcpain=[[0]]}}`
         }
      }
      if (rollObj.damageDice && !rollObj.damageButton ) {      
         rollObj.rollStr += ` {{damage=[[${rollObj.damageDice} [${getTranslationByKey('damage')}] ${rollObj.damageBonusStr}]]}} {{target-area=[[1D6]]}} {{calcdamage=[[0]]}} {{damageTotal=[[0]]}}`;
         rollObj.rollStr += `  {{damageperfect=[[${rollObj.damageDicePerf} [${getTranslationByKey('damage-perfect')}] ${rollObj.damageBonusPerfStr}]]}}`
         if (rollObj.painDice && !rollObj.damageButton ) {      
            rollObj.rollStr += ` {{pain=[[${rollObj.painDice}[${getTranslationByKey('pain')}] ${rollObj.damageBonusStr}]]}} {{pain=[[${rollObj.painDice}[${getTranslationByKey('pain')}]]]}} {{calcpain=[[0]]}} {{painTotal=[[0]]}}`;
            rollObj.rollStr += ` {{painperfect=[[${rollObj.painDicePerf}[${getTranslationByKey('pain-perfect')}] ${rollObj.damageBonusPerfStr}]]}}`
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
   } else if ( rollObj.rollStr && !rollObj.name ) {
      console.log(`------ Roll String name match was ${JSON.stringify(rollObj.rollStr.match(/(?:\{\{roll-name=)([A-Za-zåäöÅÄÖ0-9+,_\-\\" ]*)(?:\}\})/u))}`);
      rollObj.name = rollObj.rollStr.match(/(?:\{\{roll-name=)([A-Za-zåäöÅÄÖ0-9+,_\-\\" ]*)(?:\}\})/u) != null ?
         rollObj.rollStr.match(/(?:\{\{roll-name=)([A-Za-zåäöÅÄÖ0-9+,_\-\\" ]*)(?:\}\})/u)[1] : '';        
      console.log(`------ Captured roll name: ${rollObj.name}`);
   } 
   
   //rollObj.rollStr += ` {{perfect=[[0]]}} {{flounder=[[0]]}}`; 

   if ( attributes.roll_contest == 1 ) {
      rollObj.contestRoll = true; 
      //rollObj.contestResult = rollObj.contestResult == -1 ? 'fail' : ( rollObj.contestResult == 0 ? '' :  )
      rollObj.rollStr += ` {{contest=[[1]]}} {{contestresult=[[0]]}}`
   }
   //rollObj.rollStr = rollObj.rollStr + rollObj.contestStr||''; 

   k.log(`RollObject pre-roll: ${JSON.stringify(rollObj)}`)
   k.log(`Executing roll string: ${rollObj.rollStr}`);

   const roll = await startRoll(rollObj.rollStr);

   k.log(`Executed roll : ${JSON.stringify(roll)}`);

   if ( roll?.results?.roll1?.result ) {
      //k.log(`Roll result is ${roll.results.roll1.result}`);
      rollObj.result = parseInt(roll.results.roll1.result); 
   }
   if ( roll?.results?.roll2?.result ) {
      //k.log(`Roll result is ${roll.results.roll1.result}`);
      rollObj.result2 = parseInt(roll.results.roll2.result); 
   }
   computeObj.contestresult = getContestOutcome(rollObj.result,rollObj.rollSkill+(rollObj.skillAttrMod||0)+(rollObj.rollSkillMod||0));
   
   // Success, Perfect, Flounder, Diff and Improvement
   var success = 0, flounder = 0;
   rollObj.perfect = 0;
   if ( rollObj.result ) {
      rollObj.diff = rollObj.target - rollObj.result;
      k.log(` --- Rolled ${rollObj.result} and ${rollObj.result2} for skill {${rollObj.skillAttr}} with CL ${rollObj.target}. D3 rolled ${roll.results.rolld3.result}`); 
      if ( rollObj.target && rollObj.target != '' && rollObj.result2  ) {
         //k.log(`Perfect roll!`)
         if ( rollObj.result <= rollObj.target ) { success = 1; k.log(`Success!`); } 
         else if ( rollObj.rollSkill > 0 && rollObj.result == 1 ) { success = 1; k.log(`Success by rolling 1 and FV is 1 or over!`); } 
         else if ( rollObj.target < 1 || rollObj.rollSKill == 0 && rollObj.result == 1 && rollObj.result2 == 1 ) { success = 1; k.log(`Success by rolling 2x 1 and FV is 0 and target <= 0!`); }
         
         if ( rollObj.target < 1 ) {
            if ( rollObj.result == 20 ) { flounder = 1; success = 0, rollObj.perfect = 0; k.log(`Floundered roll!`); }          
         }
         else if ( rollObj.target >= 1 && rollObj.target < 20 ) {
            if ( rollObj.result == 1 && rollObj.result2 <= rollObj.rollSkill ) { perfect = 1; rollObj.perfect = 1; k.log(`Perfect roll (rolled 1 and ${rollObj.result2}!`); }
            if ( rollObj.result == 20 && rollObj.result2 > rollObj.rollSkill ) { flounder = 1; success = 0, rollObj.perfect = 0; computeObj.flounder = 1; k.log(`Floundered roll!`); }

         } else if ( rollObj.target >= 20 ) {
            if ( rollObj.result == 1 || ( rollObj.result == 2 && rollObj.result2 <= rollObj.rollSkill ) ) { rollObj.perfect = 1; computeObj.perfect = 1; k.log(`Perfect roll!`); }
            if ( rollObj.result == 20 && rollObj.result2 == 20 ) { flounder = 1; success = 0, rollObj.perfect = 0; computeObj.flounder = 1; k.log(`Floundered roll!`); }
         }
         
         k.log(`Roll success ${!!success}, roll perfect ${!!rollObj.perfect}, floundered ${!!flounder}`);

         if ( rollObj.gainExp) {
            const impr = attributes[`${rollObj.skillAttr}_improve`],
                  impr_perf = attributes[`${rollObj.skillAttr}_improve_perfect`],   
                  erf = attributes[`${rollObj.skillAttr}_erf`];
            k.log(`Improved = ${impr} (${impr != '1'}), improved perfect = ${impr_perf} (${impr_perf != '1'})`);
            if ( success && !rollObj.perfect && impr != '1' && rollObj.gainExp ) {
               k.log(`Normal success and erf increase by 1`);
               //k.log(`${rollObj.skillAttr}_improve`);
               attributes[`${rollObj.skillAttr}_improve`] = 1; 
               attributes[`${rollObj.skillAttr}_erf`] = erf + 1; 

            } else if ( success && rollObj.perfect && impr_perf != '1' && rollObj.gainExp ) {
               k.log(`Perfect roll and erf increase by ${1 + roll.results.rolld3.result}`);
               attributes[`${rollObj.skillAttr}_improve_perfect`] = 1; 
               attributes[`${rollObj.skillAttr}_erf`] = erf + 1 + roll.results.rolld3.result;
            }
         }
         
      }
   } else if ( rollObj.rollStr ) {
      rollObj.perfect = rollObj.rollStr.toString().match(/{{perfect=\[\[1\]\]}}/) ? 1 : 0; 
   }

   if ( rollObj.spellLevel ) {
      var reduce = parseInt(rollObj.spellLevel)
      if ( rollObj.perfect == 1 && reduce != 1 ) {
         reduce = Math.floor(reduce / 2);
      } else if ( !success ) {
         reduce = 1; 
      }
      attributes['psypoang'] = parseInt(attributes.psypoang) - reduce;
   }
   attributes.set();
    
   if ( rollObj.damageRoll || ( rollObj.damageDice && !rollObj.damageButton ) ) {
      console.log(`PerfectRoll = ${rollObj.perfect} and normal damage = ${roll?.results?.damage?.result}, perfect = ${roll?.results?.damageperfect?.result}`);
      if( rollObj.perfect == 1) {
         computeObj.calcDamage = 0;
         computeObj.damageTotal = roll?.results?.damageperfect?.result
      } else {
         computeObj.calcDamage = roll.results.damage.result < 0 ? 1 : 0;     
         computeObj.damageTotal = computeObj.calcDamage == 0 ? roll?.results?.damage?.result : 0;
      }
      console.log(`Damage total: ${computeObj.damageTotal}`);
   }
   k.log(`Roll object before adding pain: ${JSON.stringify(rollObj)}`);
   var calcPainStr = '';
   if ( rollObj.damageRoll && roll?.results?.pain?.result || ( rollObj.painDice && !rollObj.damageButton) ) { 
      k.log(`Pain result: ${roll?.results?.pain?.result}`);
      if( rollObj.perfect == 1 ) {
         computeObj.calcPain = 0;
         computeObj.painTotal = roll?.results?.painperfect?.result
      } else {
         computeObj.calcPain = roll.results.pain.result < 0 ? 1 : 0;     
         computeObj.painTotal = computeObj.calcPain == 0 ? roll?.results?.pain?.result : 0;
      }
      k.log(`Pain total: ${computeObj.painTotal}, calcpain = ${computeObj.calcPain}`);
      calcPainStr = ` {{pain=${computeObj.painTotal}}} {{painperfect=${computeObj.painTotal}}} {{calcpain=[[${computeObj.calcPain}]]}}`;
   }

   if ( rollObj.damageButton ) {
      
      computeObj.damageRoll = rollObj.secretRoll ? attributes['templatestartsecret'] + ` {{roll-name=${rollObj.name}}}` : attributes['templatestart'] + ` {{roll-name=${rollObj.name}}}`;

      computeObj.damageRoll += ` {{target-area=[[1D6]]}} {{hitareas=true}} {{hitareaRoll=[[0]]}} {{calcdamage=[[0]]}} {{damageTotal=[[0]]}} {{calcpain=[[0]]}} {{painTotal=[[0]]}} {{perfect=[[${rollObj.perfect}]]}}`;
      //k.log(`REsult ${roll.results.roll1.result} with ttarget ${rollObj.target} is perfect ${roll.results.roll1.result < (Math.floor(rollObj.target / 10)||0)}`)
      
      computeObj.damageRoll += ` {{damage=[[${rollObj.damageDice} [${getTranslationByKey('damage')}] ${rollObj.damageBonusStr}]]}} {{totals=[0]}}`;
      computeObj.damageRoll += ` {{damageperfect=[[${rollObj.damageDicePerf} [${getTranslationByKey('damage')}] ${rollObj.damageBonusPerfStr}]]}}`;
      if ( rollObj.painDice && attributes[`use_sp`] == 1 ){
         computeObj.damageRoll += ` {{pain=[[${rollObj.painDice} [${getTranslationByKey('pain')}]${rollObj.damageBonusStr}]]}}`;
         computeObj.damageRoll += ` {{painperfect=[[${rollObj.painDicePerf} [${getTranslationByKey('pain')}]${rollObj.damageBonusPerfStr}]]}}`;
      }
      k.log(`Damage compute Obj pre-escape: ${JSON.stringify(computeObj)}`);
      computeObj.damageRoll = k.escape(computeObj.damageRoll);
   }

   //computeObj.hitareaRoll = `&{template:dod91} {{character_name=@{character_name}}} {{character_id=@{character_id}}} {{roll-name=^{hitarea}}}`;
   computeObj.hitareaRoll = rollObj.secretRoll ? attributes['templatestartsecret'] + ` {{roll-name=${rollObj.name}}}` : attributes['templatestart'] + ` {{roll-name=${rollObj.name}}}`;
   computeObj.hitareaRoll += ` {{hitarea=[[0]]}} {{hitareadetails=[[0]]}} {{perfect=[[${rollObj.perfect}]]}}`;
   computeObj.hitareaRoll += ` {{damage=${computeObj.damageTotal}}} {{damageperfect=${computeObj.damageTotal}}} {{calcdamage=[[${computeObj.calcDamage}]]}} ${calcPainStr}`; 
   k.log(`Hit area roll string: ${computeObj.hitareaRoll}`);
   computeObj.hitareaRoll = k.escape(computeObj.hitareaRoll);

   computeObj.hitareadetails = 0; 
   /* if ( rollObj.hitAreaDie && rollObj.hitAreaDie == '6' && !rollObj.vehicleHitarea ) {
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
   } */
   if ( rollObj.hitAreaDie && rollObj.hitAreaDie == '20' && !rollObj.vehicleHitarea ) {
      //k.log(`Hit area is ${JSON.stringify(roll.results.hitarearoll.result)}`);
      computeObj.hitareadetails = 1; 
      switch (roll.results.hitarearoll.result) {
         case 1 : { computeObj.hitarea = "Vänster ben"; break; }
         case 2 : { computeObj.hitarea = "Vänster ben"; break; }
         case 3 : { computeObj.hitarea = "Närstrid: Höger ben, Avstånd: Vänster ben"; break; }
         case 4 : { computeObj.hitarea = "Höger ben"; break; }
         case 5 : { computeObj.hitarea = "Närstrid: Mage, Avstånd: Höger ben"; break; }
         case 6 : { computeObj.hitarea = "Närstrid: Mage, Avstånd: Höger ben"; break; }
         case 7 : { computeObj.hitarea = "Mage"; break; }
         case 8 : { computeObj.hitarea = "Mage"; break; }
         case 9 : { computeObj.hitarea = "Närstrid: Vänster arm, Avstånd: Mage"; break; }
         case 10 : { computeObj.hitarea = "Vänster arm"; break; }
         case 11 : { computeObj.hitarea = "Vänster arm"; break; }
         case 12 : { computeObj.hitarea = "Höger arm"; break; }
         case 13 : { computeObj.hitarea = "Höger arm"; break; }
         case 14 : { computeObj.hitarea = "Närstrid: Höger arm, Avstånd: Bröstkorg"; break; }
         case 15 : { computeObj.hitarea = "Bröstkorg"; break; }
         case 16 : { computeObj.hitarea = "Bröstkorg"; break; }
         case 17 : { computeObj.hitarea = "Närstrid: Huvud, Avstånd: Bröstkorg"; break; }
         case 18 : { computeObj.hitarea = "Närstrid: Huvud, Avstånd: Bröstkorg"; break; }
         case 19 : { computeObj.hitarea = "Huvud"; break; }
         case 20 : { computeObj.hitarea = "Huvud"; break; }
      }
   }
   /* if ( rollObj.vehicleHitarea ) {
   // k.log(`Vehicle hit area ${roll?.results?.hitarearoll?.result}`);
      //k.log(`Vehicle hit area sections ${JSON.stringify(sections.repeating_vehiclehitareas)}`);
      const area = roll?.results?.hitarearoll?.result;
      computeObj.hitareadetails = 1;
      computeObj.hitarea = area != undefined ? attributes[`hitarea_${area}`] : '';
   } */
   //await attributes.set();

   

   //k.log(`Roll: ${JSON.stringify(roll)}`); 
   k.log(`Compute Object: ${JSON.stringify(computeObj)}`); 
   finishRoll(roll.rollId,computeObj);

   /* if ( rollObj.secretRoll ) {
      const rollSecret = await startRoll(`&{template:dod91} /ssr {{character_name=@{character_name}}} {{roll-name=${rollObj.name} : ${rollObj.result}}}`);
      k.log(`Secret roll: ${JSON.stringify(rollSecret)}`);
      finishRoll(rollSecret.rollId);
   } */

}

