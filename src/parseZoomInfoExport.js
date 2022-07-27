const HelpersApi = require("./Helpers");
const Helper = new HelpersApi();
const csvToJson = require("csvtojson");

const axios = require("axios");

module.exports = async (url, tag) => {
    let allProspects = [];

    try {
        const { data } = await axios.get(url);

        const jsonArray = await csvToJson().fromString(data);

        for (let contact of jsonArray) {
            let prospect = {
                "Full Name": `${contact["First Name"]} ${contact["Last Name"]}` || "",
                "First Name": contact["First Name"] || "",
                "Last Name": contact["Last Name"] || "",
                Title: contact["Job Title"] || "",
                Street: contact["Company Street Address"] || "",
                City: contact["Company City"] || "",
                State: contact["Company State"] || "",
                Zip: contact["Company Zip Code"] || "",
                "Phone Number": contact["Mobile phone"] || "",
                Email: contact["Email Address"] || "",
                "Company Name": contact["Company Name"] || "",
                Url: contact["ZoomInfo Contact Profile URL"],
                Source: "ZoomInfo Export",
            };

            allProspects.push(prospect);
        }

        let mobileContacts = allProspects
            .filter((prospect) => prospect["Phone Number"] !== "")
            .map((prospect) => ({ ...prospect, Outreach: "Text", Email: "", Tag: tag }));

        let emailContacts = allProspects
            .filter((prospect) => prospect.Email !== "")
            .map((prospect) => ({ ...prospect, Outreach: "Email", "Phone Number": "", Tag: tag }));

        // remove duplicates contacts
        mobileContacts = Helper.removeDuplicateKey(mobileContacts, "Phone Number");
        emailContacts = Helper.removeDuplicateKey(emailContacts, "Email");

        return {
            mobileContacts,
            emailContacts,
        };
    } catch (error) {
        console.log("ERROR ---", error);
        return false;
    }
};
