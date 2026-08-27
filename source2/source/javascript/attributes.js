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

const calcSmartpoang = function({attributes}) {
   var high = 0; 
   switch( attributes.fys_fv ) {
      case 3 : { high = 4; break; }
      case 4 : 
      case 5 : { high = 5; break; }
      case 6 : 
      case 7 : { high = 6; break; }
      case 8 : 
      case 9 : 
      case 10 : { high = 7; break; }
      case 11 : 
      case 12 : { high = 8; break; }
      case 13 : 
      case 14 : 
      case 15 : { high = 9; break; }
      case 16 : 
      case 17 : { high = 10; break; }
      case 18 : 
      case 19 : 
      case 20 : { high = 11; break; }
      case 21 : 
      case 22 : { high = 12; break; }
      case 23 : 
      case 24 : 
      case 25 : { high = 13; break; }
   }
   attributes.sp_brostkorg_tot = attributes.sp_brostkorg = high; 
   attributes.sp_huvud_tot = attributes.sp_huvud = high - 1; 
   attributes.sp_hben_tot = attributes.sp_hben = high - 1; 
   attributes.sp_vben_tot = attributes.sp_vben = high - 1; 
   attributes.sp_mage_tot = attributes.sp_mage = high - 1; 
   attributes.sp_harm_tot = attributes.sp_harm = high - 2; 
   attributes.sp_varm_tot = attributes.sp_varm = high - 2; 

   attributes.set(); 
}
k.registerFuncs({calcSmartpoang});
