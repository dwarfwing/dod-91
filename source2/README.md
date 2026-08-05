# Mutant Undergångens Arvtagare

Inofficiellt karaktärsblad för Mutant Undergångens Arvtagare till Roll20. 

Detta karaktärsblad har inte blivit godkänt av ägarna av upphovsrätten för spelet, och kan därför inte publiceras på Roll20 som ett inbyggt val. 

## Hur man använder i ett spel

För att använda dessa filer måste Spelldaren (eller den som skapade spelet) ha Pro eller högre prenumeration hos Roll20, eftersom enbart de högre nivåerna har tillgång till "custom character sheet". 

För att använda kraltärsbladet går man först till Spelinställningarna på spelet i Roll20 och scrollar till botten. Där finns inställningar för vilket karaktärsblad man vill använda, välj "Custom". Detta ger möjligheten att klistra in innehållet i filerna dod91.html, dod91.css, och translation.json i respective textfält.

> Checkboxen för "Legacy Sanitization" ska INTE vara iklickad.

## Hur man använder som spelare

Spelledaren kommer att ge er rättigheter att ändra i era egna karaktärer, som hittas i Journal-tabben. Klicka för att öppna karaktärsbladet. 

Vissa fält eller sektioner har två olika lägen, ett redigerings-läge och ett spel-läge. Man kan byta mellan lägena med hjälp av den kugghjulsikonen som dyker upp till höger när man hovrar med musen över något som går att ändra läge på. När man är i redigeringsläge så har de flesta fält en pulserande effekt för att man ska se tydligt vilket läge man är i. De flesta knappar eller klickbara delar är bara aktiva i spel-läget. 

Formuläret är indelat i olika sektioner. Högst upp finns Grundegenskaper, övriga attribut, samt information om karaktären. Under det finns färdigheter, till vänster de generella och till höger de intränade färdigheterna. Under färdigheterna så finns vapensektionen, och under den finns utrustning och skydd till vänster och förmågor till höger. 

Det finns en liten T10-ikon som visar var det går att slå tärningar. Det sker då automatiskt enligt informationen i karaktärsbladet och resulatet dyker upp i chatten. 

### Grundegenskaper och generella attribut

Dessa skrivs in i respektive fält. Det finns några få automatiskt uträknade fält, dessa går inte att redigera men går ofta att lägga till modifikationer i närliggande fält. Vissa fält som t ex Hälsa och Förflyttning måste alltså räknas ut och skrivas i manuellt (för tillfället). 

Vissa värden har modifikationer, som kan skrivas i för att modifiera ett annat uträknat värde. Till exmepel så har färdigheterna en kolumn med modifikationer, här kan temporära ändringar i t ex FV åstadkommas genom att lägga till en modifikation. Mer permanenta modifikationer läggs med fördel till i själva FV värdet självt. 

Grundegenskaper har två olika typer av tärningsslag, svårighetsbaserade eller motståndsslag. Klickbara ikoner dyker upp när man hovrar över respektive grundegenskap. Den med "00" till vänster är svårighetsslag och den med "10" till höger är för motståndsslag. Svårighetsbaserade slag är som Färdighetsslag där FV är GEx7 för enkla saker, GEx5 för normala, GEx3 för svåra, och GE för mycket svåra. Resultatet i chatten när man slår visar en skala där grönt visar vilka av dessa nivåer man klarat. Motståndsslag slås med 1T10 + GE, och jämförs oftast med ett slag av motståndaren.   

Initiativbonus och Reaktionsvärde är klickbara fält, för att rulla repsektive tärningar. 

NOavsett stridsssytem, enkelt eller avancerat, så slår man Initiativbonus som vanligt i början av en strid, detta leder till ett Initiativvärde som inte ändras under stridens gång. Använder man anvancerade stridssystemet så används Initiativvärdet som grund under hela striden, och man kan genom att markera sin egen markör på spelplanen och klicka på antingen på Initiativvärdets knapp eller på Init i vapenlistan ändra sitt initiativ. Med modifikationer på initiativvärdet kan man också justera för negativa modifikationer som t ex flera handlingar. 

Vissa sekundära värden har modifikationer, så att du kan justera bas-värdet. 

Skadebonuns har inte en modifikation, utan snarare en override av det vanliga värdet. Detta kan användas när skadebonusen tillfälligt ändras. 

Kroppspoäng har både ett nuvarande och ett maximalt värde. När du tar skada så ändrar du enbart det nuvarande värdet. 

Bärförmågan under sekundära grundegenskaper styr hur stor bärförmåga som listas i den sektion under tränade färdigheter som även listar hur mycket bärförmåga som nyttjas. 

> NB: När du är överbelastad kommer modifikationer på Smidighets-baserade färdigheter ske automatiskt. När du slagit och ser resultatet i chatten så kan du hovra med musen över FV+siffran och se de modifikationer som använts.   

### Repeterande listor

Tränade färdigheter, Vapen, Rustning, Utrustning och Förmågor är alla så kallade repeterande listor som från början är tomma. Man kan lägga till nya rader i dessa genom att klicka på den lilla ikonen med en lista och ett plustecken i nedre högra hörnet av listan. Då läggs en ny rad till som blinkar sakta. Blinkandet innebär att den är i redigeringsläge, vilket stängs av eller på med den lilla kugghjulsikonen som dyker upp till höger när man hovrar med musen över ett fält. 

I redigeringsläge kan mycket av informationen uppdateras, och när man går ur det läget så låses de flesta val för raden och potentiella knappar (t ex för tärningsslag) aktiveras. 

Dessa listor kan också editeras genom att flytta runt rader eller ta bort rader, för att göra det börja med att klicka på ikonen med tre rader och en penna i det nedre högra hörnet av listan. Då ställs listan i editeringsläge, och du kan flytta rader upp och ner genom att "ta tag" i ikonen till vänster, medan soptunneikonen till höger gör att raden tas bort. 

> Notera att ingen fråga eller varning dyker upp när en rad tas bort, så var försiktig med den funktionen. 

### Färdigheter

Naturliga färdigheter har ett FV och en modifikation. Själva namnet är en knapp som kan användas för att slå för färdigheten. 

Man kan lägga till fler naturliga färdigheter i slutet på listan, t ex om en mutationer ger tillgång till ytterligare färdigheter. 

Tränade färdigheter är en s.k. repeterande lista (se ovan). De färdigheter som omnämns i regel- och spelar-boken finns med som en drop-down lista när man lägger till en ny rad. 

Om man råkar välja fel eller ändra i drop-down listan så kommer färdighetsvärdet finnas kvar och du kan lätt byta tillbaka till rätt färdighet igen. 

Man kan också välja att lägga till egna tränade fäardigheter genom att välja det sista valet i listan, "Lägg till manuellt". Man får då skriva i ett eget namn, men i övrigt funkar det som andra färdigheter. 

> Notera dock att dessa manuellt inlagda färdigheter inte kommer att dyka upp som val i vapenlistan, utan då får man använda den manuella typen där också. Det i sin tur innebär att förbättringsmarkeringar inte sker automatiskt för vapenattacker för såna manuellt tillagda färdigheter. 

#### Förbättringsslag

När man lyckas eller slår perfekt med en färdighet så markeras automatiskt detta med en liten diamant-ikon i högra kanten av färdighetens värde. Dessa markeringar syns bara då de är markerade eller när man hovrar över fältet. Det finns en för normala lyckade (den översta) och perfekta slag (den nedre).

I slutet av en session så kan man slå förbättringsslag genom att klicka på Erfanrehets-knappen. Då kommer man slå förbättringsslag för alla markerade färdigheter, viskat till SL, och resultatet kommer automatiskt uppdatera färdigheterna. 

### Egna tärningsslag

Under Naturliga färdigheterna så finns en sektion med Tärningsslag. Här kan man välja att slå vilka slag som helst med eget namn, antalt tärningar, egenvald storlek på tärningarna och eventuell modifikation. Det ger egentligen inte mer än att använda Roll20s inbyggda tärningar, förutom att detta använder karaktärsbladets egna mall för tärningsslag i chatten. 

### Vapen

Vapen är också en repeterande lista. Det viktiga är att välja rätt Typ, så att slagen med vapnet sker på rätt sätt och med rätt färdighet. Om det inte finns en passande färdighet, så välj det sista valet, "Manuellt". I det sistnämnda fallet så visas istället ett fält där man manuellt kan lägga in ett färdighetsvärde. 

Varje rad i vapenlistan har en checkbox som markerar om det vapnet är buret för tillfället eller inte. Ett vapen som inte är buret kanske är i förvar i basen eller tillfälligt tappat. Ett vapen som inte är buret räknas inte mot belastningen men samtidigt är också de olika knapparna för attacker, initiativ och skada inaktiverade. 

Speciellt för vapen är att det går att slå för vapnets träff genom att klicka på vapnets namn. Från resultet i chatten kan man sen slå för skadan, vilket räknar med kritiska träffar baserat på färdigheten man använder. När man slagit skada i chatten får man även möjlighet att slå träffområde. 

Det finns många orsaker till att chansen att lyckas modifieras när man strider, och det finns därför ett specifikt Modifikations+fält för vapnet som kan användas temporaärt när vapnet ska användas. 

Vapen har också betydelse för turordningen, och initiativet kan slås med värdet som lagts in under Init. Om man samtidigt markerar sin egen ikon på spelfältet, så kommer initiativet läggas in i Roll20 initiativ (Turn order). Se ovan gällande Initiativvärde och strid.

Skada kan slås via träffresulatet i chatten, men också direkt ifrån formuläret. När skadan slås direkt från formuläret så räknas inget extra skada ut pga potentiella perfekta slag, men det gör det om man först slår för vapnets attack (knappen vid vapnet namn).

Hagelvapen behandlas särskilt, eftersom det finns flera saker som påverkar skadan. Efter att ha valt en vapentyp som är hagel så får man välja om det är avsågat eller inte, om det är hagel/flechette eller slug, och om det är forn eller svartkrut. Detta sker genom att klicka på de ikoner som visas, vilka då byter typ. Eftersom detta gör att det blir trångt i det fältet så får man vara försiktigt när man slår skadan med D10-tärningsikonen i det fältet.

### Rustning

Rustning har värden både för Begränsning och Vikt. Vikten adderas ihop och läggs till belastningsvärdet mot bärförmågan, men bara om den inte är påtagen (knappen till vänster är ett V). Om rustningen är avtagen så klickar man bort det V:et (och visar då istället ingenting), och rustningen påverkar då belastningen gentemot Bärförmågan.

Automatiska avdrag görs för rustningar och hjälmars Begränsning på när de är burna (checkboxen iklickad), detta återspeglar sig när man slår för de påverkade färdigheterna. I resultatet i chatten kan man hovra över FV-sifran och se avdrag för rustningen. Detta gör det viktigt att markera att det är en rustning eller hjälm i redigeringsläget. När de inte är burna så räknas de däremot med i belastningen.

Detsamma som reustning ovan gäller också för sköldar. 

### Utrustning

Utrustningslistan och dess antal och vikt läggs samman gentemot den utnyttjade bärförmågan. Notera att om en sak avmarkeras så räknas den inte som buren och därför inte heller gentemot bärförmågan. 

### Förmågor

Denna lista visar de förmågor, dvs, mutationer, optioner eller talanger som är relevanta för typen av karaktär. När en förmåga inte är i redigeringsläge så kommer den att visa de fält som har fyllts i. Vill man inte se detta så kan den informationen istället läggas till i beskrivningsfältet. 

Det finns ett fält för Färdighetsslag där ett färdighetvärde kan läggas in. Detta dyker sen upp som ett klickbart val för förmågan, och slås som ett vanligt färdighetsslag. När förmågan inte är i redigeringsläge så visas färdighetsvärdet förkortat till FV och följs av en fält för att lägga till en modifiering (Mod.). Dessa färdigheter omfattas av förbättringar likadant som naturliga och tränade. Det går även bra att använda Tränade färdigheter med manuell inställning för dessa om det är att föredra, men kommer då inte ha funktioner som skada eller resonans. 

Notera att Tärningsslaget inte är ett färdighetsslag, utan används för andra slag som t ex 2T10+1/10 av ett färdighetsvärde. I dessa specifika fall får man räkna ut 1/10 och lägga in som t ex 2T10+3. 

Om tärningsslag för Skada har lagt in så kan det slås direkt från normalläget för förmågan, men kommer också dyka upp som en knapp i resultatet av Färdighetsslaget eller Tärningsslaget i chatten.  

Förmågor har ett val kallat Resonans i redigeringsläget, denna bör enbart klickas i för PSI-mutationer och gör att en Resonans-sektion visas ovanför Förmågorna. När en sådan mutation misslyckas så läggs 1 till den nuvarande Resonansen för karaktären, och resultatet i chatten kommer att ha en Resonans-knapp man kan använda för att slå ett Resoans-test med 2T6 + Resonansvärdet - VIL. Det går även att slå direkt från Resonans-fältet, men slår man från resultatet i chatten så tas även fummel (+5 på slaget) med i beräkning. När resonansen återställs till 0 så kan man enkelt klicka på nollställningsknappen (cirkel med kryss i mitten).

## Fordon

TBA

## Rolltemplate och Macron

Notera att i rollformuläret kan man skriva tärningar på det svenska viset med T, ex 1T10, men när man använder rolltemplate direkt måste man använda D.  

I exemplen behöver man byta ut texten som börjar med __ och slutar med __. 

### Vanliga färdighetsslag

```
   &{template:dod91} {{character_name=__karaktärsnamn__}} {{roll-name=__namn på slaget__}} {{roll1=[[1d100cs<__perfekt__cf100]]}} {{target=[[__FV__]]}}
```

Exempel:

```
   &{template:dod91} {{character_name=Jerry}} {{roll-name=SKJUTA}} {{roll1=[[1d100cs<5cf100]]}} {{target=[[55]]}}
```

### Skada

Notera att {{calcdamage=[[0]]}} på slutet måste vara med för att det ska funka

```
   &{template:dod91} {{character_name=__karaktärsnamn__}} {{roll-name=__namn på slaget__}}  {{damage=[[__skadetärningar__[Skada]__+skadebonus__[Skadebonus]__+annan bonus__[bonus]]]}} {{target-area=[[1D6]]}} {{calcdamage=[[0]]}}
```

Exempel:

```
   &{template:dod91} {{character_name=Jerry}} {{roll-name=ELDSKADA}}  {{damage=[[1T6+2[Eld]+1T4[Hetta] ]]}} {{target-area=[[1D6]]}} {{calcdamage=[[0]]}}
```