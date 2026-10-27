
const abilityDisplay = function ({trigger,attributes,sections,casc}) {
   //k.log(`Ability trigger: ${JSON.stringify(trigger)}`);
   const [section,rowID] = k.parseTriggerName(trigger.name);
   const row = `${section}_${rowID}_`;
   attributes[`${row}activation_display`] = attributes[`${row}activation`] == '' ? 0 : 1;
   attributes[`${row}range_display`] = attributes[`${row}range`] == '' ? 0 : 1;
   attributes[`${row}duration_display`] = attributes[`${row}duration`] == '' ? 0 : 1;
   attributes[`${row}effect_display`] = attributes[`${row}effect`] == '' ? 0 : 1;
   attributes[`${row}skill_display`] = attributes[`${row}skill`] == '' ? 0 : 1;
   attributes[`${row}roll_display`] = attributes[`${row}roll`] == '' ? 0 : 1;
   attributes[`${row}damage_display`] = attributes[`${row}damage`] == '' ? 0 : 1;
   attributes.set();
}
k.registerFuncs({abilityDisplay});
//k.registerFuncs({abilityDisplay},{type:['opener']});

const abilityDisplayOnload = function() {
   const setObj = {};
   getSectionIDs("abilities", function(idarray) {
      for(var i=0; i < idarray.length; i++) {
         //Do something with the IDs
      }
      _.each(idarray, (element) => {
         const row = 'repeating_abilities_'+element+'_'; 
         getAttrs([`${row}activation`,`${row}range`,`${row}duration`,`${row}effect`,`${row}skill`,`${row}roll`,`${row}damage`],
            (values) => {         
               setObj[`${row}activation_display`] = values[`${row}activation`] == '' ? 0 : 1;
               setObj[`${row}range_display`] = values[`${row}range`] == '' ? 0 : 1;
               setObj[`${row}duration_display`] = values[`${row}duration`] == '' ? 0 : 1;
               setObj[`${row}effect_display`] = values[`${row}effect`] == '' ? 0 : 1;
               setObj[`${row}skill_display`] = values[`${row}skill`] == '' ? 0 : 1;
               setObj[`${row}roll_display`] = values[`${row}roll`] == '' ? 0 : 1;
               setObj[`${row}damage_display`] = values[`${row}damage`] == '' ? 0 : 1;

               setAttrs(setObj,{silent:true});
            }
         )
      });
   });
}
k.registerFuncs({abilityDisplayOnload},{type:['opener']});

const resonanceToggle = async function() {
   //k.log(`Sections: ${JSON.stringify(sections)}`);
   var toggle = 0; 
   /* sections['repeating_abilities'].each( rowList, (element,index) => {
      toggle += attributes[`repeating_abilities_${element}_resonance`] == 1 ? 1 : 0;
   }); */
   await getSectionIDs("abilities", (idArray) => {
      //k.log(`Sections: ${JSON.stringify(idArray)}`);
      /* idArray.reduce( (toggle, curr) => {
         //k.log(`Curr is ${curr}`);
         //toggle += attributes[`repeating_abilities_${element}_resonance`] == 1 ? 1 : 0;
         getAttrs([`repeating_abilities_${curr}_resonance`], (values) => {
            //k.log(`Value is ${JSON.stringify(values)} and resonance ${parseInt(values[`repeating_abilities_${curr}_resonance`])}`);
            toggle = parseInt(values[`repeating_abilities_${curr}_resonance`]);
            //k.log(`Resonance totalled ${toggle}`);
            if ( toggle == 1 ) {               
               setAttrs({
                  resonance_toggle: 1,
               });
            }
         });
      }, 0); */
      idArray.forEach( (row,index) => {
         idArray[index] = `repeating_abilities_${row}_ability_resonance`;
         //k.log(`Ability row: ${idArray[index]}`);
      });
      getAttrs(idArray, (values) => {
         //k.log(`Values object is ${JSON.stringify(values)} and values ${Object.values(values)}`);
         const total = Object.values(values).reduce((a,n) => {
               //k.log(`Row has n = ${n} is ${(n == 'on' ? 1 : 0 )}`);
               //k.log(`a is ${a}`);
               return a + (n == 'on' ? 1 : 0 ); 
            }, 0);
         //k.log(`Total is ${total}`);
         if ( total > 0 ) {
            setAttrs({
               resonance_toggle: 1, 
            });
         } else {
            setAttrs({
               resonance_toggle: 0, 
            });
         }
      });
   });   
   //attributes.resonance_toggle = toggle > 0 ? 1 : 0; 
   //attributes.set();
}
k.registerFuncs({resonanceToggle},{type:['opener']});

const resetResonance = function() {
   getAttrs(['resonance'], (values) => {
      k.log(`Resetting resonance from ${values['resonance']}`);
      setAttrs({
         resonance: 0,
      });
   });
}
k.registerFuncs({resetResonance});

