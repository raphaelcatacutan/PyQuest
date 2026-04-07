const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Point this to your actual JSON file location
const JSON_PATH = path.join(__dirname, 'src', 'game', 'data', 'bosses.json');
const ENEMY_JSON_PATH = path.join(__dirname, 'src', 'game', 'data', 'enemies.json');
const CONSUMABLE_PATH = path.join(__dirname, 'src/game/data/consumables.json');
const ARMOR_PATH = path.join(__dirname, 'src/game/data/armors.json');
const WEAPON_PATH = path.join(__dirname, 'src/game/data/weapons.json');

app.post('/api/save-boss', (req, res) => {
  try {
    const newBoss = req.body;

    // 1. Read existing file
    const rawData = fs.readFileSync(JSON_PATH, 'utf8');
    const database = JSON.parse(rawData);

    // 2. Add/Update the boss
    database[newBoss.id] = newBoss;

    // 3. Write back to disk with pretty formatting
    fs.writeFileSync(JSON_PATH, JSON.stringify(database, null, 2), 'utf8');

    console.log(`Successfully saved: ${newBoss.name}`);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ error: 'Failed to save boss data' });
  }
});

app.post('/api/save-enemy', (req, res) => {
  try {
    const newEnemy = req.body;
    const rawData = fs.readFileSync(ENEMY_JSON_PATH, 'utf8');
    const database = JSON.parse(rawData);

    database[newEnemy.id] = newEnemy;

    fs.writeFileSync(ENEMY_JSON_PATH, JSON.stringify(database, null, 2), 'utf8');
    console.log(`Saved Enemy: ${newEnemy.name}`);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save enemy data' });
  }
});

app.post('/api/save-consumable', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(CONSUMABLE_PATH, 'utf8'));
    data[req.body.id] = req.body;
    fs.writeFileSync(CONSUMABLE_PATH, JSON.stringify(data, null, 2), 'utf8');
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save consumable' });
  }
});

app.post('/api/save-armor', (req, res) => {
  try {
    const newArmor = req.body;
    const rawData = fs.readFileSync(ARMOR_PATH, 'utf8');
    const database = JSON.parse(rawData);

    database[newArmor.id] = newArmor;

    fs.writeFileSync(ARMOR_PATH, JSON.stringify(database, null, 2), 'utf8');
    console.log(`Saved Armor: ${newArmor.name}`);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save armor data' });
  }
});

app.post('/api/save-weapon', (req, res) => {
  try {
    const newWeapon = req.body;
    const rawData = fs.readFileSync(WEAPON_PATH, 'utf8');
    const database = JSON.parse(rawData);

    database[newWeapon.id] = newWeapon;

    fs.writeFileSync(WEAPON_PATH, JSON.stringify(database, null, 2), 'utf8');
    console.log(`Saved Weapon: ${newWeapon.name}`);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save weapon data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Boss Architect Server running at http://localhost:${PORT}`);
});