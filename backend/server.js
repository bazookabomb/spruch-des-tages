// server.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware, damit unser Server JSON-Anfragen versteht.
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Unsere Daten leben jetzt hier auf dem Server!
// let sprueche = [
//   { id: 1, text: "In der Ruhe liegt die Kraft", autor: "Unklar, oft Konfuzius oder Goethe zugeschrieben" },
//   { id: 2, text: "Möge die Macht mit dir sein", autor: "George Lucas / Star Wars" },
//   { id: 3, text: "Ich denke, also bin ich.", autor: "René Descartes" },
//   { id: 4, text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", autor: "Mahatma Gandhi" },
//   { id: 5, text: "Der Weg ist das Ziel.", autor: "Konfuzius (oder Laozi)" },
//   { id: 6, text: "Carpe diem", autor: "Horaz" },
//   { id: 7, text: "Der Mensch ist, was er isst.", autor: "Ludwig Feuerbach" },
//   { id: 8, text: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.", autor: "Bertolt Brecht" },
//   { id: 9, text: "Cogito ergo sum", autor: "René Descartes" },
//   { id: 10, text: "Alle Menschen werden Brüder", autor: "Friedrich Schiller" },
//   { id: 11, text: "Wer nichts weiß, muss alles glauben.", autor: "Marie von Ebner-Eschenbach" }
// ];

const { pool } = require('./db.js'); // Importiere die Datenbankverbindung

// --- HIER KOMMEN GLEICH UNSERE API-ENDPUNKTE HIN ---
// ENDPUNKT 1: Alle Sprüche holen (GET)
// Wenn das Frontend die URL /api/sprueche aufruft, passiert das hier:
// app.get('/api/sprueche', (req, res) => {
//     res.json(sprueche);
// });

app.get('/api/sprueche', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM sprueche');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Laden der Sprüche' });
    }
});

// ENDPUNKT 2: Einen neuen Spruch speichern (POST)
// app.post('/api/sprueche', (req, res) => {
//     // Die Daten, die das Frontend schickt, sind in req.body
//     const neuerSpruch = {
//         id: sprueche[sprueche.length - 1].id + 1,
//         text: req.body.text,
//         autor: req.body.autor
//     };

//     // Füge den neuen Spruch zu unserem Array hinzu
//     sprueche.push(neuerSpruch); // neuerSpruch soll hier zum Array hinzugefügt werden

//     // Schicke eine Erfolgsmeldung zurück
//     res.status(201).json(neuerSpruch);
// });
// ✅ NEU: In MySQL einfügen
app.post('/api/sprueche', async (req, res) => {
    try {
        const { text, autor } = req.body;
        if (!text || !autor) {
            return res.status(400).json({ error: "Text und Autor sind erforderlich" });
        }

        const [result] = await pool.execute(
            'INSERT INTO sprueche (text, autor) VALUES (?, ?)',
            [text, autor]
        );
        const [newSpruch] = await pool.execute('SELECT * FROM sprueche WHERE id = ?', [result.insertId]);
        res.status(201).json(newSpruch[0]);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen des Spruchs' });
    }
});



// ENDPUNKT 3: Einen bestimmten Spruch löschen (DELETE)
// Die :id in der URL ist ein Platzhalter.
// app.delete('/api/sprueche/:id', (req, res) => {
//     // Die ID aus der URL bekommen wir über req.params.id
//     const idZumLoeschen = parseInt(req.params.id); // Wichtig: in eine Zahl umwandeln!

//     // DEINE AUFGABE: Finde den Spruch mit der richtigen ID im `sprueche`-Array
//     // und entferne ihn.
//     // Tipp: Finde zuerst den Index des Spruchs (z.B. mit findIndex) und nutze
//     // dann die splice-Methode, um ihn aus dem Array zu entfernen.
//     // ______
//     sprueche.splice(sprueche.findIndex(idZumLoeschen),1); //entferne Spruch an der id idZumLoeschen


//     console.log(`Spruch mit ID ${idZumLoeschen} wurde gelöscht.`);
//     res.status(204).send(); // 204 = Erfolg, aber keine Daten werden zurückgeschickt
// });
app.delete('/api/sprueche/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM sprueche WHERE id = ?', [id]);
        res.status(204).send(); // 204 = Erfolg, kein Inhalt
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen des Spruchs' });
    }
});


app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
