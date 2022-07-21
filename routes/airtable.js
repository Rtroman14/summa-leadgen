require("dotenv").config();

const axios = require("axios");
const express = require("express");

const router = express.Router();

const writeCsv = require("../src/writeCsv");

const AirtableApi = require("../src/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

const HelpersApi = require("../src/Helpers");
const Helper = new HelpersApi();

const { domain } = require("../config/keys");

router.post("/validate", async (req, res) => {
    const { recordID, baseID, client } = req.body;

    const record = await Airtable.getRecord(baseID, recordID);

    const runValidator = !("Text" in record) || !("Email" in record);

    let prospects;

    if (runValidator && record.Source === "Reonomy") {
        prospects = await axios.post(`${domain}/parse/reonomy`, { record });
    }
    if (runValidator && record.Source === "Reonomy Export") {
        console.log("Reonomy Export");
        prospects = await axios.post(`${domain}/parse/reonomy-export`, { record });
    }
    if (runValidator && record.Source === "CoStar") {
        prospects = await axios.post(`${domain}/parse/costar`, { record });
        // formate prospects for Airtable then validate numbers
        // prospects = false;
    }
    if (runValidator && record.Source === "Icy Leads") {
        prospects = await axios.post(`${domain}/parse/icy-leads`, { record });
    }
    if (runValidator && record.Source === "Apollo") {
        let { data } = await axios.post(`${domain}/parse/apollo`, { record });

        // filter current reonomy contacts against contacts in view: "Texted"
        const airtableContacts = await Airtable.getFilteredRecords(baseID, {
            field: "Outreach",
            value: "Email",
        });

        if (airtableContacts) {
            let emailContacts = Helper.arrayDifference(
                data.emailContacts,
                airtableContacts,
                "Email"
            );

            console.log("New email total =", emailContacts.length);

            let emailProspects = Helper.formatAirtableContacts(emailContacts);

            // batch upload
            const uploadedEmailContacts = await Airtable.batchUpload(emailProspects, baseID);

            const result = uploadedEmailContacts ? "Uploaded" : "Error";

            await Airtable.updateRecord(baseID, record.id, { Email: result });
        }
    }

    if (prospects) {
        let { mobileContacts, emailContacts } = prospects.data;

        if (!("Email" in record)) {
            console.log(`Email contacts: ${emailContacts.length}`);

            const title = `${client} - ${record.Location}`;

            // filter current reonomy contacts against contacts in view: "Texted"
            let airtableContacts = await Airtable.getFilteredRecords(baseID, {
                field: "Outreach",
                value: "Email",
            });

            // Farha
            if (baseID === "app1Fif2x748y3tnn") {
                // let farhaArchivedContacts = await Airtable.getFilteredRecords("appAJd8DNpOfsXN53", {
                //     field: "Outreach",
                //     value: "Email",
                // });
                // console.log(`Farha's archived based: ${farhaArchivedContacts.length}`);

                // airtableContacts = [...airtableContacts, ...farhaArchivedContacts];
                const archivedContacts = await Airtable.fetchArchiveBases(
                    ["app3yxqMbRKS90o3E", "appAJd8DNpOfsXN53"],
                    "Email"
                );
                airtableContacts = [...airtableContacts, ...archivedContacts];
            }
            // Roper
            if (baseID === "appr7rcKd3W6oMdiC") {
                const archivedContacts = await Airtable.fetchArchiveBases(
                    ["appeGXwk0TSkWK325"],
                    "Email"
                );
                airtableContacts = [...airtableContacts, ...archivedContacts];
            }
            // Eco Tec
            if (baseID === "appoNqmB15dMPPEXD") {
                const archivedContacts = await Airtable.fetchArchiveBases(
                    ["appUzWnleU21USqls"],
                    "Email"
                );
                airtableContacts = [...airtableContacts, ...archivedContacts];
            }

            if (airtableContacts) {
                emailContacts = Helper.arrayDifference(emailContacts, airtableContacts, "Email");
            }

            console.log(`Email contacts after filter: ${emailContacts.length}`);

            const { data } = await axios.post(`${domain}/neverbounce/create-job`, {
                emailContacts,
                title,
            });

            if (data) {
                await Airtable.updateRecord(baseID, record.id, { Email: "In Neverbounce" });
                await Airtable.updateRecord(baseID, record.id, {
                    "Neverbounce Job": data.job_id,
                });
                console.log(`Uploaded prospects to Neverbounce: ${data.job_id}`);
            } else {
                await Airtable.updateRecord(baseID, record.id, { Email: "Error" });
                console.log("ERROR uploading prospects to Neverbounce");

                writeCsv(emailContacts, title);
            }
        }

        if (!("Text" in record) && record.Source !== "Icy Leads") {
            console.log(`Mobile contacts: ${mobileContacts.length}`);

            // filter current reonomy contacts against contacts in view: "Texted"
            let airtableContacts = await Airtable.getFilteredRecords(baseID, {
                field: "Outreach",
                value: "Text",
            });

            // Farha
            if (baseID === "app1Fif2x748y3tnn") {
                const archivedContacts = await Airtable.fetchArchiveBases(
                    ["app3yxqMbRKS90o3E", "appAJd8DNpOfsXN53"],
                    "Text"
                );
                airtableContacts = [...airtableContacts, ...archivedContacts];
            }
            // Roper
            if (baseID === "appr7rcKd3W6oMdiC") {
                const archivedContacts = await Airtable.fetchArchiveBases(
                    ["appeGXwk0TSkWK325"],
                    "Text"
                );
                airtableContacts = [...airtableContacts, ...archivedContacts];
            }
            // Eco Tec
            if (baseID === "appoNqmB15dMPPEXD") {
                const archivedContacts = await Airtable.fetchArchiveBases(
                    ["appUzWnleU21USqls"],
                    "Text"
                );
                airtableContacts = [...airtableContacts, ...archivedContacts];
            }

            if (airtableContacts) {
                mobileContacts = mobileContacts.map((contact) => ({
                    ...contact,
                    "Phone Number": contact["Phone Number"]?.replace(/\D/g, ""),
                }));
                airtableContacts = airtableContacts.map((contact) => ({
                    ...contact,
                    "Phone Number": contact["Phone Number"]?.replace(/\D/g, ""),
                }));

                mobileContacts = Helper.arrayDifference(
                    mobileContacts,
                    airtableContacts,
                    "Phone Number"
                );
            }

            console.log(`Mobile contacts after filter: ${mobileContacts.length}`);

            mobileContacts = Helper.formatAirtableContacts(mobileContacts);

            const { data } = await axios.post(`${domain}/airtable/upload-mobile`, {
                mobileContacts,
                baseID,
            });

            if (data) {
                await Airtable.updateRecord(baseID, record.id, { Text: "Uploaded" });
                console.log("Successfully uploaded Text prospects");
            } else {
                await Airtable.updateRecord(baseID, record.id, { Text: "Error" });
                console.log("ERROR uploading Text prospects");
            }
        }
    }

    res.json(record);
});

router.post("/upload-mobile", async (req, res) => {
    const { mobileContacts, baseID } = req.body;

    // batch upload
    const uploadedMobileContacts = await Airtable.batchUpload(mobileContacts, baseID);

    res.json(uploadedMobileContacts);
});

router.post("/upload-email", async (req, res) => {
    const { recordID, baseID } = req.body;

    const record = await Airtable.getRecord(baseID, recordID);

    const jobID = record["Neverbounce Job"];

    const { data } = await axios.post(`${domain}/neverbounce/get-job`, { jobID });

    let emailProspects = Helper.formatAirtableContacts(data);

    // batch upload
    const uploadedEmailContacts = await Airtable.batchUpload(emailProspects, baseID);

    const result = uploadedEmailContacts ? "Uploaded" : "Error";

    await Airtable.updateRecord(baseID, record.id, { Email: result });

    res.json(data);
});

router.post("/test", async (req, res) => {
    console.log(req.headers);
    res.json(req.headers);
});

module.exports = router;
