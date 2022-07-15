const HelpersApi = require("../src/Helpers");
const Helper = new HelpersApi();

module.exports = async (prospects) => {
    let mobileContacts = [];
    let emailContacts = [];

    let total = 0;

    try {
        for (let prospect of prospects) {
            total++;

            try {
                const isPhoneNumber = Helper.numDigits(prospect["Phone Number"]) < 12;

                if (isPhoneNumber) {
                    const carrierType = await Helper.lookup(prospect["Phone Number"]);

                    if (carrierType.carrier.type === "mobile") {
                        mobileContacts.push({ ...prospect, Outreach: "Text" });
                    } else {
                        emailContacts.push({ ...prospect, Outreach: "Email" });
                    }
                } else {
                    emailContacts.push({ ...prospect, Outreach: "Email" });
                }
            } catch (error) {
                console.log(error.message);
            }

            total % 100 === 0 &&
                console.log(`Contacts left to validate: ${prospects.length - total}`);
        }

        console.log("mobileContacts total =", mobileContacts.length);
        console.log("emailContacts total =", emailContacts.length);

        return {
            mobileContacts,
            emailContacts,
        };
    } catch (error) {
        console.log(error);
    }
};
