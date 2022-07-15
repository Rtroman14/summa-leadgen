const HelpersApi = require("./Helpers");
const Helper = new HelpersApi();

// const titles = require("./titles");

module.exports = async (reonomyData, tag) => {
    // const re = new RegExp(titles, "i");

    try {
        // map over tag
        reonomyData = reonomyData.map((contact) => ({ ...contact, Tag: tag }));

        // TODO: make object values string

        // // filter list to same state prospects
        // const sameStateProspects = reonomyData.filter((prospect) => {
        //     const state = prospect.State;
        //     const prospectState =
        //         prospect["Contact Address"].split(" ")[
        //             prospect["Contact Address"].split(" ").length - 2
        //         ];

        //     return state === prospectState;
        // });

        // let prospectTitles = reonomyData.filter((prospect) => re.test(prospect.Title));

        let mobileContacts = reonomyData.filter((prospect) => prospect.Outreach === "Text");
        let emailContacts = reonomyData.filter((prospect) => prospect.Outreach === "Email");

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
