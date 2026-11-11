// ==UserScript==
// @name			Bulbapedia Item Filter
// @namespace		https://github.com/TheFirstSeeker
// @version			1.1.0
// @description     Allows you to filter items by games
// @author			TheFirstSeeker
// @match			https://bulbapedia.bulbagarden.net/wiki/*
// @grant			none
// @license			MIT
// @downloadURL     https://raw.githubusercontent.com/TheFirstSeeker/Bulbapedia-Item-Filter/refs/heads/main/Bulbapedia%20Item%20Filter.user.js
// ==/UserScript==

(() => {
    'use strict';

    const BADGE = 'span[style^="background"]';
    const GAME = 'span[style^="color"]';

    // Find the unique games in a table's badges (game code -> first badge, in page order).
    function findUniqueGames(table) {
        const games = new Map();

        table.querySelectorAll(BADGE).forEach(badge => {
            const code = badge.querySelector('a > span')?.textContent.trim();
            if (code && !games.has(code)) games.set(code, badge);
        });

        return games;
    }

    // A copy of a badge for a checkbox label. Its link is removed, so clicking the badge
    // toggles the checkbox instead of opening the game's article. The page's badges keep their links.
    function labelBadge(badge) {
        const copy = badge.cloneNode(true);
        copy.querySelectorAll('a').forEach(link => link.replaceWith(...link.childNodes));
        return copy;
    }

    // The game codes in each row with game badges. The header, footer and any other rows are left out,
    // so they stay as they are. A row's games never change, so they're read once.
    function readRows(table) {
        const rows = [];

        Array.from(table.children).forEach(row => {
            const games = new Set(Array.from(row.querySelectorAll(`td ${GAME}`), span => span.textContent.trim()));
            if (games.size > 0) rows.push({ row, games });
        });

        return rows;
    }

    // Show a row if no game is checked, or if the row has any of the checked games.
    function filterRows(rows, checkboxes) {
        const checked = checkboxes.filter(box => box.checked).map(box => box.value);

        rows.forEach(({ row, games }) => {
            const show = checked.length === 0 || checked.some(game => games.has(game));
            row.style.display = show ? '' : 'none';
        });
    }

    // Add child after a space. The space is the gap between each badge and its checkbox,
    // and between the checkboxes; without it the controls run together.
    function spacedAppend(parent, child) {
        parent.append(' ', child);
    }

    // Add the checkboxes to one item table, next to its "Location" header.
    function addFilter(itemHeader) {
        const headerRow = itemHeader.parentElement;
        const locationHeader = Array.from(headerRow.children).find(cell => cell.textContent.trim() === 'Location');
        if (!locationHeader) return;

        const table = headerRow.parentElement;
        const games = findUniqueGames(table);
        if (games.size === 0) return;

        const rows = readRows(table);
        const container = document.createElement('span');
        const checkboxes = [];

        games.forEach((badge, code) => {
            const label = document.createElement('label');
            label.appendChild(document.createElement('b')).appendChild(labelBadge(badge));

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = code;
            checkboxes.push(checkbox);

            spacedAppend(label, checkbox);
            spacedAppend(container, label);
        });

        // One listener for all the checkboxes: their change events bubble up to the container.
        container.addEventListener('change', () => filterRows(rows, checkboxes));
        spacedAppend(locationHeader, container);
    }

    // Each table is set up on its own, so a table the script can't handle doesn't stop the others.
    document.querySelectorAll('th').forEach(th => {
        if (th.textContent.trim() !== 'Item') return;
        try {
            addFilter(th);
        } catch (error) {
            console.error('Bulbapedia Item Filter:', error);
        }
    });
})();
