const arrayDifference = (newArray, array, key) =>
    newArray.filter(({ [key]: value1 }) => !array.some(({ [key]: value2 }) => value2 === value1));

let reonomyContacts = [
    { id: "0", display: "Jamsheer", phoneNumber: "(715) 252-0000" },
    { id: "1", display: "Muhammed", phoneNumber: "(715) 252-0001" },
    { id: "2", display: "Ravi", phoneNumber: "(715) 252-0002" },
    { id: "3", display: "Ajmal", phoneNumber: "(715) 252-0003" },
    { id: "4", display: "Different", phoneNumber: "(715) 252-9999" }, // diff
    { id: "5", display: "Different", phoneNumber: "(715) 252-9998" }, // diff
];

let airtableContacts = [
    { id: "00", display: "Jamsheer", phoneNumber: "715-252-0000" },
    { id: "10", display: "Muhammed", phoneNumber: "715-252-0001" },
    { id: "20", display: "Ravi", phoneNumber: "715-252-0002" },
    { id: "30", display: "Ajmal", phoneNumber: "715-252-0003" },
    { id: "40", display: "Different", phoneNumber: "715-252-0004" },
    { id: "50", display: "Different", phoneNumber: "715-252-0005" },
];

reonomyContacts = reonomyContacts.map((contact) => ({
    ...contact,
    phoneNumber: contact.phoneNumber.replace(/\D/g, ""),
}));
airtableContacts = airtableContacts.map((contact) => ({
    ...contact,
    phoneNumber: contact.phoneNumber.replace(/\D/g, ""),
}));

const results = arrayDifference(reonomyContacts, airtableContacts, "phoneNumber");

console.log(results);
