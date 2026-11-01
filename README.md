# Ne mondd így angolul

Marosi Helga könyvének reszponzív, magyar nyelvű bemutatkozó oldala. A borítóhoz illeszkedő, könyvközpontú megjelenés: egyszerű szöveges fejléc, jól felismerhető gombok, interaktív mondatpéldák, fejezetlista, szerzői bemutatkozás, ár és gyakori kérdések. Nincs kitalált logó, díszmonogram, nyíl vagy számozott szekciófelcím.

Az oldal egyszerű HTML-, CSS- és JavaScript-fájlokból áll. Nincs szükség telepítésre, fordításra, adatbázisra vagy külső betűtípus-szolgáltatásra.

## Megnézés helyben

A projektmappában:

```sh
python3 -m http.server 4173
```

Ezután nyisd meg: http://localhost:4173

## Közzététel GitHub Pagesen

1. Hozz létre egy GitHub repositoryt, majd töltsd fel a mappa tartalmát a `main` ágra. A rejtett `.github` mappát is töltsd fel.
2. A repository **Settings → Pages → Build and deployment → Source** beállításánál válaszd a **GitHub Actions** lehetőséget.
3. Az **Actions** fülön indítsd el a **GitHub Pages** munkafolyamatot, vagy tölts fel egy új módosítást a `main` ágra.
4. A sikeres közzététel után a **Settings → Pages** alatt találod az oldal címét.

Minden helyi útvonal relatív, ezért az oldal repositorynév alatti címen is működik. A feltöltés csak az oldalhoz szükséges fájlokat teszi közzé; az eredeti nagy borítókép és a README nem kerül a kiszolgált csomagba.

Alternatívaként a **Deploy from a branch → main → / (root)** beállítás is használható; ilyenkor a repository összes nem rejtett fájlja nyilvánosan kiszolgálható.

## Későbbi módosítások

- **Vásárlási link:** a `site-config.js` fájl `purchaseUrl` mezőjébe írd be a valódi, `https://` kezdetű vásárlási címet. A gomb ekkor automatikusan oda vezet. Üresen hagyva a helyőrző párbeszédablak jelenik meg.
- **Szerzői portré:** az `index.html` fájl `author-portrait` elemét cseréld valódi képre. Adj meg értelmes alternatív szöveget, szélességet és magasságot. A hozzá tartozó CSS a `styles.css` fájlban található.
- **Árak és szövegek:** az `index.html` fájlban szerkeszthetők. Az árazás a kapott szövegtervezetet követi.
- **Közösségi megosztás:** amikor megvan a végleges publikus cím, az `og:image` értékét állítsd a borító teljes, abszolút publikus URL-jére. Ekkor érdemes `og:url` és canonical metaadatot is megadni.

## Jelenlegi helyőrzők

Az online vásárlás és a nyomtatott könyv még nem elérhető. Nincs fizetési vagy feliratkozási űrlap. A portré helyén egyértelműen jelölt, arculathoz illő helyőrző szerepel. Nincs kitalált kapcsolati adat, olvasói vélemény vagy külső szolgáltatás.

Az animációk között fokozatos címmegjelenés, könyvmozgás, finom mondatváltás és mozgó aktív fül, animált mobilmenü és magasság szerint nyíló fejezetek szerepelnek. A gyors egymás utáni kattintásokat és a méretváltozást is kezelik.

Az oldal nem használ követést, sütiket vagy külső betűtípus-kéréseket. A fontlicencek az `assets/fonts` mappában vannak. A rendszer „csökkentett mozgás” beállítását tiszteletben tartja; a navigáció, a mondatpéldák, a lenyíló részek és a párbeszédablak billentyűzettel is használhatók.

A közzétételi munkafolyamat a [GitHub hivatalos statikus Pages mintáját](https://github.com/actions/starter-workflows/blob/main/pages/static.yml) követi.
