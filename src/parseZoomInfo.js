const HelpersApi = require("./Helpers");
const Helper = new HelpersApi();

module.exports = async (prospects, tag) => {
    try {
        // map over tag
        // prospects = prospects.map((contact) => ({ ...contact, Tag: tag }));

        let mobileContacts = prospects
            .filter((prospect) => prospect["Phone Number"] !== "")
            .map((prospect) => ({ ...prospect, Outreach: "Text", Email: "", Tag: tag }));

        let emailContacts = prospects
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
