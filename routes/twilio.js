const express = require("express");
const router = express.Router();

const HelpersApi = require("../src/Helpers");
const Helper = new HelpersApi();

router.post("/lookup", async (req, res) => {
    const { prospects } = req.body;

    // parse reonomy data
    let mobileNumbers = await parseReonomy(prospects, tag);

    // validate all numbers
    // return valide and non valide numbers

    res.json(mobileNumbers);
});

module.exports = router;
