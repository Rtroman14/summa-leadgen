require("dotenv").config();

const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

const AirtableApi = require("./src/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

const HelpersApi = require("./src/Helpers");
const Helper = new HelpersApi();

const axios = require("axios");

const { domain } = require("./config/keys");

const baseID = "applMh4PTJl6JI8yS";
const recordID = "";
const client = "";

// const path = require("path");
// const fs = require("fs");

const parseCoStarExport = require("./src/parseCoStarExport");
const validateNumbers = require("./src/validateNumbers");

const writeCsv = require("./src/writeCsv");

let pdfFile = "./inputPDF/denver commercial reps.pdf";

// const directoryPath = path.join(__dirname, "src/pdf");

// fs.readdir(directoryPath, (err, files) => {
//     //handling error
//     if (err) {
//         return console.log("Unable to scan directory: " + err);
//     }

//     pdfFile = files;
//     console.log(pdfFile);
// });

(async () => {
    try {
        const prospects = await parseCoStarExport(pdfFile);

        let newProspects;

        // filter current reonomy contacts against contacts in view: "Texted"
        const airtableContacts = await Airtable.getFilteredRecords(baseID, {
            field: "Outreach",
            value: "Text",
        });

        if (airtableContacts) {
            newProspects = Helper.arrayDifference(prospects, airtableContacts, "Phone Number");
        }

        console.log("prospects.length -", prospects.length);
        console.log("airtableContacts.length -", airtableContacts.length);
        console.log("newProspects.length -", newProspects.length);

        let { mobileContacts, emailContacts } = await validateNumbers(newProspects);

        await writeCsv(mobileContacts, "denver commercial reps");

        mobileContacts = Helper.formatAirtableContacts(mobileContacts);

        const { data } = await axios.post(`${domain}/airtable/upload-mobile`, {
            mobileContacts,
            baseID,
        });
    } catch (error) {
        console.log("ERROR ---", error);
        return false;
    }
})();
