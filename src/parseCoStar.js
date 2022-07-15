const HelpersApi = require("../src/Helpers");
const Helper = new HelpersApi();

module.exports = async (coStarData, tag) => {
    let contacts = [];

    try {
        // ORGANIZE COSTAR DATA
        coStarData.forEach((contact) => {
            for (let i = 1; i < 4; i++) {
                if (`trueOwner_Email_${i}` in contact) {
                    contacts.push(Helper.reformatContact("trueOwner", i, contact));
                }
                if (`propertyManagement_Email_${i}` in contact) {
                    contacts.push(Helper.reformatContact("propertyManagement", i, contact));
                }
                if (`previousTrueOwner_Email_${i}` in contact) {
                    contacts.push(Helper.reformatContact("previousTrueOwner", i, contact));
                }
                if (`trueOwner_Name_${i}` in contact) {
                    contacts.push(Helper.reformatContact("trueOwner", i, contact));
                }
                if (`propertyManagement_Name_${i}` in contact) {
                    contacts.push(Helper.reformatContact("propertyManagement", i, contact));
                }
                if (`previousTrueOwner_Name_${i}` in contact) {
                    contacts.push(Helper.reformatContact("previousTrueOwner", i, contact));
                }
            }
        });

        // REMOVE DUPLICATES
        const contactsJson = new Set(contacts.map((e) => JSON.stringify(e)));
        contacts = Array.from(contactsJson).map((e) => JSON.parse(e));

        console.log("contacts total =", contacts.length);

        let nameList = []; // every mobile number
        let pNumbers = [];
        let mobileContacts = [];

        // SORT MOBILE AND LANDLINE NUMBERS
        contacts.forEach((contact) => {
            if (contact["Phone Number"] !== "" && !nameList.includes(contact["Full Name"])) {
                delete contact["First Line"];

                if (contact["Phone Number"].includes("X")) {
                    let phoneNumber = contact["Phone Number"].slice(
                        0,
                        contact["Phone Number"].indexOf(" X")
                    );

                    pNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                    });
                }

                if (contact["Phone Number"].includes("(p)")) {
                    let phoneNumber = contact["Phone Number"].replace(" (p)", "");

                    pNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                    });
                }

                if (contact["Phone Number"].includes("(m)")) {
                    let phoneNumber = contact["Phone Number"].replace(" (m)", "");

                    mobileContacts.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                        Outreach: "Text",
                        Tag: tag,
                    });
                    nameList.push(contact["Full Name"]);
                }
            }
        });

        total = 0;

        // CHECK IF pNUMBERS ARE MOBILE
        for (let contact of pNumbers) {
            total++;

            if (!nameList.includes(contact["Full Name"])) {
                try {
                    const carrierType = await Helper.lookup(contact["Phone Number"]);

                    if (carrierType && carrierType.carrier.type === "mobile") {
                        mobileContacts.push({
                            ...contact,
                            Outreach: "Text",
                            Tag: tag,
                        });
                        nameList.push(contact["Full Name"]);
                    }
                } catch (error) {
                    console.log(
                        `Error validating: ${contact["Phone Number"]} --- ${error.message}`
                    );
                }
            }

            total % 100 === 0 &&
                console.log(`Contacts left to validate: ${pNumbers.length - total}`);
        }

        let emailList = [];

        let emailContacts = contacts.filter((contact) => {
            if (
                contact.Email !== "" &&
                !emailList.includes(contact.Email) &&
                !nameList.includes(contact["Full Name"])
            ) {
                emailList.push(contact.Email);
                nameList.push(contact["Full Name"]);

                return contact;
            }
        });

        emailContacts = emailContacts.map((contact) => ({
            ...contact,
            Outreach: "Email",
            Tag: tag,
        }));

        // remove duplicates contacts
        mobileContacts = Helper.removeDuplicateKey(mobileContacts, "Phone Number");
        emailContacts = Helper.removeDuplicateKey(emailContacts, "Email");

        let emails = [];

        mobileContacts = mobileContacts.map((prospect) => {
            if (emails.includes(prospect.Email)) {
                return { ...prospect, Email: "" };
            }
            emails.push(prospect.Email);
            return prospect;
        });

        console.log("emails total =", emailContacts.length);
        console.log("mobile total =", mobileContacts.length);

        return {
            mobileContacts,
            emailContacts,
        };
    } catch (error) {
        console.log("ERROR ---", error);
        return false;
    }
};
