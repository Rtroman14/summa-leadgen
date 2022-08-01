const HelpersApi = require("./Helpers");
const Helper = new HelpersApi();

module.exports = async (reonomyData, tag) => {
    let mobileContacts = [];
    let emailContacts = [];

    try {
        reonomyData.forEach((property) => {
            const { stats } = property;

            if (stats === undefined) return;

            // const { house_nbr, street, city, state, zip5 } = stats;
            const houseNumber = stats?.house_nbr || "";
            const street = stats?.street || "";
            const city = stats?.city || "";
            const state = stats?.state || "";
            const zip5 = stats?.zip5 || "";

            const bldgAddress = `${houseNumber} ${street}, ${city}, ${state}, ${zip5}`;

            let building = {
                Url: `https://app.reonomy.com/!/property/${stats.property_id}`,
                Source: "Reonomy",
                Street: `${houseNumber} ${street}`.trim(),
                City: city,
                State: state,
                Zip: zip5,
                Address: bldgAddress.trim(),
                "Square Feet": String(stats.building_area),
                "Year Built": stats.year_built,
                "Building Type": stats.asset_category,
            };

            property.prospects.forEach((prospect) => {
                const { addresses } = prospect;

                const firstName = prospect.name.first || "There";
                const lastName = prospect.name.last || "";

                let contactAddress = "";

                if (addresses.length) {
                    const address = addresses[0];
                    contactAddress = `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`;
                }

                let title = "";

                if (prospect.companies?.length) {
                    title = prospect.companies[0].title[0];
                } else {
                    if (prospect.is_property_owner) {
                        title = "Owner";
                    }
                }

                let contact = {
                    "Full Name": `${firstName} ${lastName}`,
                    "First Name": firstName,
                    "Last Name": lastName,
                    "Contact Address": contactAddress || "",
                    "Properties in Portfolio": String(prospect.properties_count) || "",
                    "Portfolio Assessed Value": String(prospect.assd_total_value) || "",
                    "Last Acquisition Date": prospect.most_recent_acquisition_date || "",
                    Title: title,
                };

                if (prospect.phones.length) {
                    const mobileProspects = prospect.phones
                        .filter((phone) => phone.phone_type === "mobile")
                        .map((phone) => ({
                            ...building,
                            ...contact,
                            "Phone Number": phone.number,
                            Outreach: "Text",
                            Tag: tag,
                        }));

                    mobileContacts = [...mobileContacts, ...mobileProspects];
                }

                if (prospect.emails.length) {
                    const emailProspects = prospect.emails.map((email) => ({
                        ...building,
                        ...contact,
                        Email: email.address,
                        Outreach: "Email",
                        Tag: tag,
                    }));

                    emailContacts = [...emailContacts, ...emailProspects];
                }
            });
        });

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
