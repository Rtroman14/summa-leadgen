require("dotenv").config();

const HelpersApi = require("./src/Helpers");
const Helper = new HelpersApi();

const writeCsv = require("./src/writeCsv");
const parseReonomy = require("./src/parseReonomy");

const AirtableApi = require("./src/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

const NeverBounceApi = require("./src/NeverBounce");
const NeverBounce = new NeverBounceApi(process.env.NEVERBOUNCE_API);

const axios = require("axios");
const csvToJson = require("csvtojson");
const writeJson = require("./src/writeJson");

(async () => {
    try {
        const archivedContacts = await Airtable.fetchArchiveBases(["appUzWnleU21USqls"], "Email");
        console.log(archivedContacts.length);
    } catch (error) {
        console.log(error);
    }
})();
