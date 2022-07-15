require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const axios = require("axios");

module.exports = class HelpersApi {
    filterValidEmails = (results) => {
        return results
            .filter((email) => email.verification.result === "valid")
            .map((item) => item.data)
            .map((contact) => {
                let email = contact.email;
                delete contact.email;
                return {
                    ...contact,
                    Email: email,
                };
            });
    };

    formatAirtableContacts = (contacts) => contacts.map((contact) => ({ fields: { ...contact } }));

    readFiles = async (record) => {
        let prospects = [];

        for (let file of record.Data) {
            const { data } = await axios.get(file.url);
            prospects = [...prospects, ...data];
        }

        return prospects;
    };

    arrayDifference = (newArray, array, key) =>
        newArray.filter(
            ({ [key]: value1 }) => !array.some(({ [key]: value2 }) => value2 === value1)
        );

    lookup = async (phoneNumber) => {
        try {
            return await client.lookups.v1
                .phoneNumbers(phoneNumber)
                .fetch({ countryCode: "US", type: ["carrier"] });
        } catch (error) {
            console.log("VALIDATENUMBER ERROR ---", error.message);
            return false;
        }
    };

    reformatContact = (department, num, contact) => {
        const newContact = {};

        newContact["Full Name"] = contact[`${department}_Name_${num}`] || "";
        newContact["First Name"] = contact[`${department}_Name_${num}`].split(" ")[0] || "";
        newContact["Last Name"] =
            contact[`${department}_Name_${num}`].split(" ").slice(1).join(" ") || "";
        newContact["Phone Number"] = contact[`${department}_Phone_${num}`] || "";
        newContact["Square Feet"] = contact.sf || "";
        newContact["Address"] = contact.address || "";
        newContact["Street"] = contact.street || "";
        newContact["City"] = contact.city || "";
        newContact["State"] = contact.state || "";
        newContact["Zip"] = contact.zip || "";
        newContact["Email"] = contact[`${department}_Email_${num}`] || "";
        newContact["Company Name"] = contact[`${department}_Company`] || "";
        newContact.Source = "CoStar";

        return newContact;
    };

    between = (min, value, max) => value >= min && value <= max;

    findValue = (column, yMin, yMax) => {
        const value = column.find((el) => this.between(yMin, el.y, yMax));

        return value ? value.str : "";
    };

    isPhoneNumber = (phoneNumber) => {
        const phoneNumberRegex =
            /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

        const isPhoneNumber = phoneNumberRegex.test(phoneNumber);

        return isPhoneNumber;
    };

    numDigits = (phoneNumber) => phoneNumber.replace(/[^0-9]/g, "").length;

    removeDuplicateKey = (array, key) =>
        array.filter(
            (element, index, arr) => arr.findIndex((el) => el[key] === element[key]) === index
        );
};
