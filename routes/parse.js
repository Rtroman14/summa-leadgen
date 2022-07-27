const express = require("express");
const router = express.Router();

const axios = require("axios");

const HelpersApi = require("../src/Helpers");
const Helper = new HelpersApi();

const parseReonomy = require("../src/parseReonomy");
const parseCoStar = require("../src/parseCoStar");
const parseReonomyExport = require("../src/parseReonomyExport");
const parseIcyLeads = require("../src/parseIcyLeads");
const parseApollo = require("../src/parseApollo");
const parseZoomInfo = require("../src/parseZoomInfo");
const parseZoomInfoExport = require("../src/parseZoomInfoExport");

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

router.post("/reonomy-export", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    // parse reonomy data
    let reonomyExportProspects = await parseReonomyExport(record.Data[0].url, tag);

    res.json(reonomyExportProspects);
});

router.post("/zoominfo", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    // read json attachment
    let prospects = await Helper.readFiles(record);

    // parse zoomInfo data
    let zoomInfoProspects = await parseZoomInfo(prospects, tag);

    res.json(zoomInfoProspects);
});

router.post("/zoominfo-export", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    // parse zoomInfo data
    let zoomInfoProspects = await parseZoomInfoExport(record.Data[0].url, tag);

    res.json(zoomInfoProspects);
});

router.post("/costar", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    // read json attachment
    let prospects = await Helper.readFiles(record);

    // parse reonomy data
    let costarProspects = await parseCoStar(prospects, tag); // return formated prospects

    res.json(costarProspects);
});

router.post("/costar-export", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    // read json attachment
    let prospects = await Helper.readFiles(record);

    // parse reonomy data
    let costarProspects = await parseCoStar(prospects, tag);

    res.json(costarProspects);
});

router.post("/icy-leads", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    const file = record.Data[0].url;

    let icyLeadsProspects = await parseIcyLeads(file, tag);

    res.json(icyLeadsProspects);
});

router.post("/apollo", async (req, res) => {
    const { record } = req.body;

    let tag = "";

    if ("Tag" in record) {
        tag = record.Tag;
    }

    const file = record.Data[0].url;

    let apolloProspects = await parseApollo(file, tag);

    res.json(apolloProspects);
});

module.exports = router;
