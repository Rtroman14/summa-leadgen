module.exports = async (reonomyData, tag) => {
    let contacts = [];

    try {
        for (let property of reonomyData) {
            const lastPersonKey = Object.keys(property)[Object.keys(property).length - 1]; // person-2_name

            const numPeople = lastPersonKey.slice(
                lastPersonKey.indexOf("-") + 1,
                lastPersonKey.indexOf("_")
            ); // 2

            for (let num = 0; num <= numPeople; num++) {
                let person = {};

                let mobileKeys = [];
                for (let key in property) {
                    key.includes(`person-${num}_mobile`) && mobileKeys.push(key);
                }

                if (mobileKeys.length) {
                    for (let [numMobile, key] of mobileKeys.entries()) {
                        person["Full Name"] = property[`person-${num}_name`] || "";
                        person["First Name"] = property[`person-${num}_name`].split(" ")[0] || "";
                        person["Last Name"] =
                            property[`person-${num}_name`].split(" ").slice(1).join(" ") || "";
                        person["Phone Number"] =
                            property[`person-${num}_mobile-${numMobile}`] || "";
                        person["Square Feet"] =
                            property.buildingArea === "--" ? "" : property.buildingArea;
                        person.Address = property.address.length === 2 ? "" : property.address;
                        person.Street = property.street || "";
                        person.City = property.city.length === 2 ? "" : property.city;
                        person.State = String(property.state).length === 2 ? property.state : "";
                        person.Zip = property.zip.length === 2 ? "" : property.zip;
                        person.Email = property[`person-${num}_email`] || "";
                        person["Company Name"] = property.companyName || "";
                        person["Company Address"] = property.companyAddress || "";
                        person["Year Built"] =
                            property.yearBuild === "--" ? "" : property.yearBuild;
                        person["Year Renovated"] =
                            property.yearRenovated === "--" ? "" : property.yearRenovated;
                        person["Building Type"] = property.type || "";
                        person.Outreach = "Text";
                    }
                } else {
                    person["Full Name"] = property[`person-${num}_name`] || "";
                    person["First Name"] = property[`person-${num}_name`].split(" ")[0] || "";
                    person["Last Name"] =
                        property[`person-${num}_name`].split(" ").slice(1).join(" ") || "";
                    person["Phone Number"] = "";
                    person["Square Feet"] =
                        property.buildingArea === "--" ? "" : property.buildingArea;
                    person.Address = property.address.length === 2 ? "" : property.address;
                    person.Street = property.street || "";
                    person.City = property.city.length === 2 ? "" : property.city;
                    person.State = String(property.state).length === 2 ? property.state : "";
                    person.Zip = property.zip.length === 2 ? "" : property.zip;
                    person.Email = property[`person-${num}_email`] || "";
                    person["Company Name"] = property.companyName || "";
                    person["Company Address"] = property.companyAddress || "";
                    person["Year Built"] = property.yearBuild === "--" ? "" : property.yearBuild;
                    person["Year Renovated"] =
                        property.yearRenovated === "--" ? "" : property.yearRenovated;
                    person["Building Type"] = property.type || "";
                    person.Outreach = "Email";
                }

                contacts.push(person);
            }
        }

        contacts = contacts.map((contact) => ({ ...contact, Tag: tag }));

        // remove duplicates
        const contactsJson = new Set(contacts.map((e) => JSON.stringify(e)));
        contacts = Array.from(contactsJson).map((e) => JSON.parse(e));

        let mobileList = [];
        let nameList = [];

        const mobileContacts = contacts.filter((contact) => {
            if (contact["Phone Number"] !== "" && !mobileList.includes(contact["Phone Number"])) {
                mobileList.push(contact["Phone Number"]);
                nameList.push(contact["Full Name"]);
                return contact;
            }
        });

        let emailList = [];

        const emailContacts = contacts.filter((contact) => {
            if (
                contact.Email !== "" &&
                !emailList.includes(contact.Email) &&
                !nameList.includes(contact["Full Name"])
            ) {
                emailList.push(contact.Email);
                return contact;
            }
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
