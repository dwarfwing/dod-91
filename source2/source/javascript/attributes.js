const calcEncumbranceMax = function ({trigger,attributes,sections,casc}) {
   //k.log(`Encumbrance max trigger: ${JSON.stringify(trigger)}`);
   const carrycap = attributes.carrycap,
         carrycapMod = attributes.carrycap_mod||0;

   attributes.encumbrance_max = parseInt(carrycap) + parseInt(carrycapMod); 
   attributes.set();
}
k.registerFuncs({calcEncumbranceMax});
//k.registerFuncs({abilityDisplay},{type:['opener']});

const calcEncumbranceMaxOnload = function() {
   const setObj = {};
   getAttrs(['carrycap','carrycap_mod','encumbrance_max'],
      (values) => {         
         setObj.encumbrance_max = parseInt(values[`carrycap`]) + parseInt(values[`carrycap_mod`]);
         setAttrs(setObj,{silent:true});
   });
}
k.registerFuncs({calcEncumbranceMaxOnload},{type:['opener']});

