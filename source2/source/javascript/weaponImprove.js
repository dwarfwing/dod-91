const weaponTrainedSkillImprove = function({rollObj,attributes,sections,perfect}) {
   k.log(`Updating Improvement for weapon skill`);
   const attr = rollObj.skillAttr;
   k.log(`Weapon skill is ${attr}`);
   var rowID = "";
   sections[`repeating_trainedskills`].forEach( (cv) => {
      let name = attributes[`repeating_trainedskills_${cv}_name`];
      k.log(`Current row: ${cv} and name ${name}`);
      if ( name == attr ) {
         rowID = cv;
      }
   });
   k.log(`Row ID to mark imrpovement ${rowID}`);
   if ( !perfect ) {
      const prev = attributes[`repeating_trainedskills_${rowID}_improve`];
      k.log(`Previous value ${prev}`);
      attributes[`repeating_trainedskills_${rowID}_improve`] = 1; 
   } else {
      attributes[`repeating_trainedskills_${rowID}_improve_perfect`] = 1; 
   }
   attributes.set();
}

