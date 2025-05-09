// ==UserScript==
// @name			Bulbapedia Item Filter
// @namespace		Seeker02
// @version			1.0.0
// @description     Allows you to filter items by games
// @author			Seeker
// @match			https://bulbapedia.bulbagarden.net/wiki/*
// @grant			none
// ==/UserScript==

// find all unique game texts in span elements in each table
function findUniqueGames(table) {
    var games = [];
    var spans = table.querySelectorAll('span[style^="background"]');

    spans.forEach(span => {
        var text = span.textContent.trim();
        var innerSpan = span.querySelector('a > span');
        span.innerHTML = innerSpan.outerHTML;
        if (text !== '' && !games.some(node => node.textContent.trim() === text)) {
            games.push(span);
        }
    });

    return games;
}

// function to add class="hide" to entries
function HideEntries(NodeList) {
    for (var i = 0; i < NodeList.length; i++) {
        NodeList[i].style.display = "none";
    }
}

// function to show all entries
function ShowEntries(NodeList) {
    for (var i = 1; i < NodeList.length; i++) {
        NodeList[i].style.display = "table-row";
    }
}

function FindNodes(NodeList, parameter) {
    var HideList = [];

    if (parameter.checked) {
        var filter = parameter.parentElement.textContent.trim()

        for (var i = 0; i < NodeList.length; i++) {
            var games = NodeList[i].querySelectorAll('span[style^="color"]');

            // Check if any span contains the game
            var hasText = Array.from(games).some(game => game.textContent.trim() === filter);

            // If the game is not found, hide the row
            if (!hasText) {
                HideList.push(NodeList[i]);
            }
        }
    }

    return HideList;
}

// function to apply filters
function ApplyFilters(NodeList, filters) {
    var HideList = [];
    var FilteredList = NodeList;

    for (var i = 0; i < filters.length; i++) {
        HideList = FindNodes(FilteredList, filters[i]);
        if(HideList.length != 0) {
            FilteredList = HideList;
        }
    }

    if (FilteredList != NodeList) {
        HideEntries(FilteredList);
    }
}

// https://stackoverflow.com/questions/19736663/appending-elements-to-dom-with-indentation-spacing
function indentedAppend(parent, child) {
    var indent = "", elem = parent;

    while (elem && elem !== document.body) {
        indent += "  ";
        elem = elem.parentNode;
    }

    if (parent.hasChildNodes() && parent.lastChild.nodeType === 3 && /^\s*[\r\n]\s*$/.test(parent.lastChild.textContent)) {
        parent.insertBefore(document.createTextNode("\n" + indent), parent.lastChild);
        parent.insertBefore(child, parent.lastChild);
    }

    else {
        parent.appendChild(document.createTextNode("\n" + indent));
        parent.appendChild(child);
        parent.appendChild(document.createTextNode("\n" + indent.slice(0, -2)));
    }
}

// function to apply filters
function Filter(NodeList, filters) {
    ShowEntries(NodeList);
    ApplyFilters(NodeList, filters);
}

// Create filter button. call Filter() when clicked.
function main() {
    // Get all item tables
    var tables = [];
    document.querySelectorAll('th').forEach(th => {
        if (th.textContent.trim() === 'Item') {
          tables.push(th.parentElement.parentElement);
        }
    });

    tables.forEach(table => {
        var games = findUniqueGames(table);
        // Get "Location" header
        var locationheader = table.children[0].children[1];

        // Create a container for checkboxes
        var checkboxContainer = document.createElement("span");

        // Add checkboxes
        games.forEach(function(option) {
            var checkbox = document.createElement("label");
            var clonedSpan = option.cloneNode(true);
            checkbox.appendChild(document.createElement("b")).appendChild(clonedSpan);

            var checkboxInput = document.createElement("input");
            checkboxInput.type = "checkbox";
            // Event listener to call Filter()
            checkboxInput.addEventListener('change', function(){Filter(table.children, locationheader.querySelectorAll('input'));});

            indentedAppend(checkbox, checkboxInput);
            indentedAppend(checkboxContainer, checkbox);
        });

        // Append checkboxes next to "Location"
        indentedAppend(locationheader, checkboxContainer);
    })
}

window.addEventListener("DOMContentLoaded", main())