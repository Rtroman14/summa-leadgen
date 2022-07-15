require("dotenv").config();

const HelpersApi = require("./src/Helpers");
const Helper = new HelpersApi();

const writeCsv = require("./src/writeCsv");
const parseReonomy = require("./src/parseReonomy");

const AirtableApi = require("./src/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

const NeverBounceApi = require("./src/NeverBounce");
const NeverBounce = new NeverBounceApi(process.env.NEVERBOUNCE_API);

(async () => {
    try {
        const airtableContacts = await Airtable.getFilteredRecords("appdkZUMJjVg7d8jH", {
            field: "Outreach",
            value: "Text",
        });

        console.log(airtableContacts);
    } catch (error) {
        console.log(error);
    }
})();
