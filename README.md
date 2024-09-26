# Om dette prosjektet

Dette er kilden til nettstedet https://skjermfribarndom.no. Det inneholder all tekst, bilder og styling.

Nettstedet blir bygget fra innholdet her til statiske filer som blir tilgjengelig for brukerne via nettleser. Innholdet som vises til brukerne blir generert med (det norske) verktøyet [Hugo](https://gohugo.io). Fordi alt innholdet genereres ferdig krever det veldig lite ytelse både fra servere og klienter og kan skalere til svært mange brukere uten kostnad. Sidene vil også oppleves raske av brukerne.

Det finnes alternativer som gjør sidene mer dynamiske. Noen av disse kan være trege, koste penger eller kreve oppsett, mens andre kan være billige og bra. Jeg valgte Hugo fordi det var et gratis og ytelseseffektivt verktøy som jeg har kunnskap til. Om andre skal 

## Innholdet

Innholdet ligger i directory [content](https://github.com/skjermfribarndom-no/skjermfribarndom-no.github.io/tree/main/content). Filene her er laget i et formatet [Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) som er ren tekst, men med mulighet for å utheve skrift og legge på lenker. Det gjør at det er minimal sjanse for å lage innhold som ødelegger nettsidene.

Johannes kan gi tilgang til å redigere filene direkte på GitHub:

1. Opprett en [GitHub bruker](https://github.com/signup)
2. Be Johannes gi deg tilgang
3. Gå til [fila du vil redigere](https://github.com/skjermfribarndom-no/skjermfribarndom-no.github.io/tree/main/content)
4. Trykk på "Edit" (blyant øverst til høyre)
5. Oppdater teksten
6. Trykk "Commit changes..." når du er fornøyd med endringene
7. Det vil ta opp til et minutt og så vil sidene være oppdatert automatisk

## Bilder

Bilder ligger i [static/images](https://github.com/skjermfribarndom-no/skjermfribarndom-no.github.io/blob/main/static/images) katalogen. De er beskjært og resizet manuelt. Hugo støtter automatisk resize av bilder, men jeg er ikke sikker på hvordan å bruke det til bakgrunnsbilder.

## Designet

Siden bruker et ferdig design som heter [Asanke](https://github.com/theNewDynamic/gohugo-theme-ananke). Det tillater en del tilpasninger med setter også noen begrensinger.

Vi har gjort noen tilpasninger i [static/site.css](https://github.com/skjermfribarndom-no/skjermfribarndom-no.github.io/blob/main/static/site.css)

For endringer av designet - [registrer en ny oppgave](https://github.com/skjermfribarndom-no/skjermfribarndom-no.github.io/issues/new) (forutsetter at man er registret som bruker)
