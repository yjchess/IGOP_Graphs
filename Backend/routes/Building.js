const path = require('path')
const express = require('express')
const router = express.Router()
console.log(__dirname)

router.get("/", (req, res)=>{
    res.sendFile(path.resolve(__dirname,"../models/BUILDINGVARIABLES.json")) 
 })


module.exports = router