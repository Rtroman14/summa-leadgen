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
                "First Name": contact.first_name,
                "Last Name": contact.last_name,
                "Full Name": `${contact.first_name} ${contact.last_name}`,
                Email: contact.email_first,
                Url: contact.url,
                Title: contact.job_title,
                "Company Name": contact.company_name,
                Address: contact.city,
                Outreach: "Email",
                Source: "Icy Leads",
                Tag: tag,
            });
        }

        emailContacts = _.removeDuplicateKey(emailContacts, "Email");

        return { emailContacts, mobileContacts: null };
    } catch (error) {
        console.log("ERROR ---", error);
        return false;
    }
};
