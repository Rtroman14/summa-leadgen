const express = require("express");
const router = express.Router();

const HelpersApi = require("../src/Helpers");
const Helper = new HelpersApi();

const parseReonomy = require("../src/parseReonomy");

router.post("/reonomy", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    // read json attachment
    let prospects = await Helper.readFiles(record);

    // parse reonomy data
    let reonomyProspects = await parseReonomy(prospects, tag);

    res.json(reonomyProspects);
});

module.exports = router;
