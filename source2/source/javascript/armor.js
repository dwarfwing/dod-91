const armorCalc = function({trigger,attributes,sections,casc}) {
   k.log(`Armor calculation trigger: ${JSON.stringify(trigger)}`);
   const sect = trigger.name.replace(/\d$/,'');
   k.log(`Armor section affected: ${sect}`);
   attributes[`${sect}_total`] = attributes[`${sect}`]*attributes[`${sect}_equipped`]||0 + attributes[`${sect}2`]*attributes[`${sect}2_equipped`]||0 + attributes[`${sect}3`]*attributes[`${sect}3_equipped`]||0; 
   attributes.set();
}
k.registerFuncs({armorCalc})

const armorCalcAll = function({trigger,attributes,sections,casc}) {
   ['huvud','harm','varm','brostkorg','mage','hben','vben'].forEach( part => {
      ['vikt','abs','spabs'].forEach( attr => {
         //k.log(`Equipped ${part} ${attr} is ${parseInt(attributes[`rustning_${part}_equipped`])}`);
         attributes[`rustning_${part}_${attr}_total`] = attributes[`rustning_${part}_${attr}`]*parseInt(attributes[`rustning_${part}_equipped`]) + 
                                                         attributes[`rustning_${part}_${attr}2`]*parseInt(attributes[`rustning_${part}2_equipped`]) +
                                                         attributes[`rustning_${part}_${attr}3`]*parseInt(attributes[`rustning_${part}3_equipped`]);
      });      
   });
   attributes.set();
}
k.registerFuncs({armorCalcAll},{type:['opener']});

/*
DoD 91 log| Armor calculation trigger: {"name":"rustning_huvud_abs","type":"number",
"triggeredFuncs":["armorCalc"],"affects":[],"addFuncs":[],"listener":"change:rustning_huvud_abs",
"listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"",
"sourceAttribute":"rustning_huvud_abs","sourceType":"player","triggerName":"rustning_huvud_abs","previousValue":"8","newValue":"7"}

DoD 91 log| Armor calculation trigger: {"name":"rustning_huvud_vikt2","type":"number",
"triggeredFuncs":["armorCalc"],"affects":[],"addFuncs":[],"listener":"change:rustning_huvud_vikt2",
"listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"",
"sourceAttribute":"rustning_huvud_vikt2","sourceType":"player","triggerName":"rustning_huvud_vikt2","newValue":"1"}

DoD 91 log| Armor calculation trigger: {"name":"rustning_huvud_vikt3","type":"number",
"triggeredFuncs":["armorCalc"],"affects":[],"addFuncs":[],"listener":"change:rustning_huvud_vikt3",
"listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"",
"sourceAttribute":"rustning_huvud_vikt3","sourceType":"player","triggerName":"rustning_huvud_vikt3","newValue":"1"}

*/