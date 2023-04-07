require("./generate_jsons.cjs")
const path = require('path');
const express = require("express");

const app = express();
const PORT = 3000

const buildingRoute = require('./routes/Building.js')
const unitRoute = require('./routes/Unit.js')
let site_files = path.resolve(__dirname, '../Frontend/Website/')
console.log(site_files);

app.use('/api/buildings', buildingRoute)
app.use('/api/units', unitRoute)

app.use('/',express.static(site_files));

app.listen(PORT,()=>console.log(`it's alive!!! On: http://localhost:${PORT}`))