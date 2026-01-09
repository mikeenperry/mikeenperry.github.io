# Template propedeuse-opdracht 2023-2024

<img src="hbo-ict-logo.png" width="175" height="175" alt="HBO-ICT-LOGO">


## Hoe is deze repository aangemaakt 🔠

- 📄 In de folder `docs` zet je technische documentatie in een `.md`(Markdown) bestandje.
- In dit bestand(`readme.md`) vind je algemene informatie over de repository, zoals hoe je deze kunt gebruiken. Daaronder is informatie gerelateerd tot techniek te vinden 🛠.
- Onder de pagina `Plan` en daaronder vind je dan de optie  `Issue Boards` (te vinden via de balk links 👈🏽) vind je verschillende boards: 
    - Learning stories;
    - Product backlog;
    - Sprint 1 backlog(4 - 17 september);
    - Sprint 2 backlog(18 september - 18 oktober);
    - Sprint 3 backlog(9 oktober - 5 november);
    
Probeer de boards goed bij te houden!

Deze boards zijn terug te vinden in de lijst bij de learning stories, deze dient hiervoor opengeklapt te worden om alles te zien. Binnen de boards zijn verschillende overzichten/lijsten gemaakt, zodat je deze kunt gebruiken voor de taken die je nog dient te doen, mee bezig bent of al afgerond hebt. Mocht je scherm te klein zijn, dan kun je naar rechts scrollen om de overige overzichten te zien.

- Op de wiki (ook te vinden via de balk links, `Plan > Wiki`👈🏽) vind je de opdrachtomschrijving.

## Techniek

### Installatie

1. Installeer Visual Studio Code, deze kun je downloaden via  deze  https://code.visualstudio.com/
2. Maak een SSH Key aan voor Gitlab, deze heb je nodig voor de beveiliging van Gitlab.
3. Clone dit project naar je computer en open het als map in Visual Studio Code.
Dit kun je doen vanuit Gitlab via de knop “Clone” --> "Visual studio code (SSH)", die op de homepagina staat. Hierdoor wordt de applicatie in Visual Studio Code geopend.
4. In Visual studio Code staat in de linker menubalk `Extension`, klik op Extensions(blokjes-icoon). Installeer de plugin `Live Server`.
5. Klik nu op de knop Go Live, rechtsonderin het Visual Studio Code scherm. Via de tool `Live Server` wordt er een lokale server opgestart. Als je de URL in de terminal opent in de browser (http://127.0.0.1:5000) zie je de webapplicatie. Wijzigingen in code worden realtime (direct) herladen! Je moet nog wel even naar `game` navigeren.

## Highscore

De score van een speler wordt in een database opgeslagen, zodat hij kan zien hoe goed hij het doet ten opzichte van andere spelers. Deze database hoef je in blok 1 nog niet zelf te maken, maar moet je wel al vanuit je game benaderen, zodat je gegevens kan opslaan en uitlezen. 

### Technieken & tools 🛠

- HTML/CSS/JavaScript (ES6)
- P5 (Javasscript framework voor het maken van games)
