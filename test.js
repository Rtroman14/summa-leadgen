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

(async () => {
    try {
        const { data } = await axios.get(
            "https://dl.airtable.com/.attachments/b8d4e944e895eb9953639239b3ef5b14/c9765ba4/257_072622_PERSON1.csv?ts=1658937736&userId=usrsOGsOrOjabYsje&cs=9cef99e81b21f0c1"
        );

        const jsonArray = await csvToJson().fromString(data);

        console.log(jsonArray);
    } catch (error) {
        console.log(error);
    }
})();
