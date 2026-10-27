const rollVehicleHitarea = function({trigger,attributes,sections,casc}) {
   //k.log(`Hit area roll trigger: ${JSON.stringify(trigger)}`);
   const rollObj = {name: getTranslationByKey('hitarea')};
   rollObj.vehicleHitarea = true;
   rollObj.hitAreaDie = attributes.hitarea_display;
   //rollObj.hitAreaDie = trigger.name.replace(/hitarea-/,'');

   //k.log(`Roll object before execute: ${JSON.stringify(rollObj)}`);

   executeRoll({rollObj,attributes,sections});
}
k.registerFuncs({rollVehicleHitarea});

