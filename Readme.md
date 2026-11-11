# Bulbapedia Item Filter

A userscript that filters the item tables on Bulbapedia location pages (`https://bulbapedia.bulbagarden.net/wiki/…`) by game, so you can see only the items available in the games you play. It runs in your browser through a userscript manager such as Tampermonkey, and only reads what is already on the page: it makes no network requests and stores nothing.

## Installing

1. Install a userscript manager, for example [Tampermonkey](https://www.tampermonkey.net/).
2. Open [Bulbapedia Item Filter.user.js](https://raw.githubusercontent.com/TheFirstSeeker/Bulbapedia-Item-Filter/refs/heads/main/Bulbapedia%20Item%20Filter.user.js) and click **Install**.

Your userscript manager checks this link for updates and offers each new version. To install by hand instead, create a new script in its dashboard, replace the template with the contents of `Bulbapedia Item Filter.user.js`, and save.

## Using it

1. Open a location page with an item table, for example [Viridian Forest](https://bulbapedia.bulbagarden.net/wiki/Viridian_Forest).
2. Next to the table's **Location** heading there is a checkbox for each game that appears in the table.
3. Tick one or more games. The table shows only the items available in at least one of the ticked games. Clicking a game's badge ticks its checkbox too.
4. Untick every game to show all items again.

Each item table on a page gets its own checkboxes. Tables without a **Location** column, or without game badges, are left as they are.

The badges in the checkbox labels have no links, so clicking one toggles its checkbox. The badges in the table still link to the game articles.

## Changelog

**1.1.0**
- The game badges in the table keep their links to the game articles. Only the badges in the checkbox labels have no links, so clicking them toggles the checkboxes.
- Ticking several games now shows the items available in any of them. Before, a game that every item had could make the next ticked game hide items it should have shown.
- The table's footer row stays visible while filtering.
- A table with an "Item" heading but a different layout no longer stops the checkboxes from appearing on the other tables.
- Unticking every game restores the rows exactly as the page had them.
- Faster on large tables.
- Installs and updates from GitHub. Licensed under MIT.
- Rewritten internally to be simpler and easier to maintain.

**1.0.1**
- Earlier version; no changelog was kept.
