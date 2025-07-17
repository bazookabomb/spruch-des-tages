//const { response } = require("express");

// Schritt 1: Elemente aus dem HTML "greifen".
const spruchAnzeige = document.getElementById('spruch-anzeige');
const randomSpruchBtn = document.getElementById('random-spruch-btn');
const neuesSpruchForm = document.getElementById('neuer-spruch-form');
const spruchInput = document.getElementById('spruch-input');
const autorInput = document.getElementById('autor-input');
const spruchListe = document.getElementById('spruch-liste');

const API_URL = "http://localhost:3000/api/";

let sprueche = [];
// Schritt 2: Deine Daten. Füge hier gleich 2-3 deiner eigenen Lieblingssprüche hinzu!
// let sprueche = [
//   { text: "In der Ruhe liegt die Kraft", autor: "Unklar, oft Konfuzius oder Goethe zugeschrieben" },
//   { text: "Möge die Macht mit dir sein", autor: "George Lucas / Star Wars" },
//   { text: "Ich denke, also bin ich.", autor: "René Descartes" },
//   { text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", autor: "Mahatma Gandhi" },
//   { text: "Der Weg ist das Ziel.", autor: "Konfuzius (oder Laozi)" },
//   { text: "Carpe diem", autor: "Horaz" },
//   { text: "Der Mensch ist, was er isst.", autor: "Ludwig Feuerbach" },
//   { text: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.", autor: "Bertolt Brecht" },
//   { text: "Cogito ergo sum", autor: "René Descartes" },
//   { text: "Alle Menschen werden Brüder", autor: "Friedrich Schiller" },
//   { text: "Wer nichts weiß, muss alles glauben.", autor: "Marie von Ebner-Eschenbach" }
// ];

async function holeSpruecheVonApi(){
    try {
        console.log(API_URL + "sprueche");
        const response = await fetch(API_URL + "sprueche");
        console.log(response);
        sprueche = await response.json();
        console.log(sprueche);

        renderSprueche();
    } catch (error) {
       console.log(error)
    }
}


// Schritt 3: Eine Funktion, die deine Sprüche-Liste im HTML anzeigt.
function renderSprueche() {
    spruchListe.innerHTML = '';
    sprueche.forEach((spruch, index) => {
        const li = document.createElement('li');
        
        li.className = 'list-group-item';
        li.innerHTML = `
            <p class="mb-1">"${spruch.text}"</p>
            <small class="text-muted fst-italic">- ${spruch.autor}</small>
            <button class="btn btn-warning" onclick="entferneSpruch(${index})">❌löschen</button>
        `;
        spruchListe.appendChild(li);
    });
}

function entferneSpruch(index){
    sprueche.splice(index,1);
    renderSprueche();
}

// Schritt 4: Auf das Absenden des Formulars reagieren.
neuesSpruchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const neuerSpruch = { text: spruchInput.value, autor: autorInput.value };
    sprueche.push(neuerSpruch);
    renderSprueche();
    neuesSpruchForm.reset();
});

// Schritt 5: Auf den Klick des "Zufalls-Button" reagieren.
randomSpruchBtn.addEventListener('click', function() {
    const zufallsIndex = Math.floor(Math.random() * sprueche.length);
    const zufallsSpruch = sprueche[zufallsIndex];
    spruchAnzeige.innerHTML = `
        <p>"${zufallsSpruch.text}"</p>
        <footer class="blockquote-footer">${zufallsSpruch.autor}</footer>
    `;
});

// Initialer Aufruf: Die Liste beim Start der Seite laden.
holeSpruecheVonApi();
