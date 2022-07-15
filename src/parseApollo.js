const axios = require("axios");
const csv = require("csvtojson");

const HelperApi = require("./Helpers");
const _ = new HelperApi();

module.exports = async (file, tag) => {
    try {
        const { data } = await axios.get(file);

        const prospects = await csv().fromString(data);

        let emailContacts = [];

        for (let contact of prospects) {
            emailContacts.push({
                "Full Name": `${contact["First Name"]} ${contact["Last Name"]}`,
                "First Name": contact["First Name"],
                "Last Name": contact["Last Name"],
                Email: contact.Email,
                Url: contact["Person Linkedin Url"],
                Title: contact.Title,
                "Company Name": contact["Company Name for Emails"],
                City: contact.City,
                State: contact.State,
                Outreach: "Email",
                Source: "Apollo",
                Tag: tag,
            });
        }

        emailContacts = emailContacts.filter(
            (contact) => contact["Email Status"] !== "Unavailable" && contact.Email !== ""
        );

        emailContacts = _.removeDuplicateKey(emailContacts, "Email");

        return { emailContacts, mobileContacts: null };
    } catch (error) {
        console.log("ERROR ---", error);
        return false;
    }
};
