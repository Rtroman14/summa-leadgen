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
        let newContacts = [
            {
                name: "Ryan",
                phoneNumber: "(715)-252-1111",
            },
            {
                name: "Nick",
                phoneNumber: "(715)-252-1112",
            },
            {
                name: "Johnny",
                phoneNumber: "(715)-252-1113",
            },
        ];

        let airtableContacts = [
            {
                name: "Ryan",
                phoneNumber: "715-252-1111",
            },
            {
                name: "Nick",
                phoneNumber: "715-252-1112",
            },
            {
                name: "Chris",
                phoneNumber: "715-252-1114",
            },
        ];

        newContacts = newContacts.map((el) => ({
            ...el,
            phoneNumber: el.phoneNumber.replace(/\D/g, ""),
        }));
        airtableContacts = airtableContacts.map((el) => ({
            ...el,
            phoneNumber: el.phoneNumber.replace(/\D/g, ""),
        }));

        const filtered = Helper.arrayDifference(newContacts, airtableContacts, "phoneNumber");
        console.log(filtered);
        // const
    } catch (error) {
        console.log(error);
    }
})();
