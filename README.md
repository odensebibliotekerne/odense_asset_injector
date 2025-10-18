# Webmaster Asset Injector Dev

Modul som kan bruges til, at teste sin ccs / javascript, inden man sætter det ind i Asset Injector i Drupal.
Kan også installeret som et lokalt modul på test/produktion.

## Tokens 
Nogle funktioner kræver library og user tokens.
(kør cron for at hente tokens, udløber efter cirka en dag)

Tokens hentes fra denne sti
/dpl-react/user-tokens

## Generelle funktioner
Generelle funktioner som f.eks. hentning af data fra FBI er defineret i utility.js

## Serie
Installation: Lav en helt almindelig side uden indhold på /serie

Inden /serie

Visning af serie på f.eks. /serie?sid=f297c5d4d347582deb504b9d3ff1af88f305d102e6863e11ca819eef0fc30cac
Koden ligger i serie.js

Link til serie fra søgning
Koden ligger i search.js

Link til serie fra værkvisning
Koden ligger i work-of.js

## Univers
Installation: Lav en helt almindelig side uden indhold på /univers 

Visning af universer på f.eks. /univers?pid=870979:134979356 
Koden ligger i univers.js