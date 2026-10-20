const v2x4 = function(trigger,attributes,sections,casc) {
   k.log(`Running a v2.4 upgre script, from ${k.version}`);
   k.log('Upgrading to version 2.4');
   
   attributes.sheet_version = '2.4'; 
   attributes.version = '2.4'; 
   k.version = '2.4';
   k.log(`Upgraded to ${k.version}`);
   attributes.set(); 
}
k.registerFuncs({'2.4':v2x4},{type:['updater','new']});