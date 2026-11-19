const v2x5 = function(trigger,attributes,sections,casc) { 
   
   k.log('Upgrading to version 2.5');
   attributes.version = "2.5";
   
   //attributes.sheet_version = '2.3'; 
   //attributes.version = '2.3'; 
   //k.version = '2.3';
   attributes.set(); 


}
k.registerFuncs({'2.5':v2x5},{type:['updater','opener']});

