require("dotenv").config();

const express = require("express");
const router = express.Router();

const NeverBounceApi = require("../src/NeverBounce");
const NeverBounce = new NeverBounceApi(process.env.NEVERBOUNCE_API);

router.post("/create-job", async (req, res) => {
    const { emailContacts, title } = req.body;

    const createdJob = await NeverBounce.createJob(emailContacts, title);

    res.json(createdJob);
});

router.post("/get-job", async (req, res) => {
    const { jobID } = req.body;

    const emailProspects = await NeverBounce.jobResults(jobID);

    res.json(emailProspects);
});

module.exports = router;

// can filter only valide emails with parameters - https://developers.neverbounce.com/v4.0/reference#jobs-download
