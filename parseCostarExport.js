require("dotenv").config();

const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

const AirtableApi = require("./src/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

const HelpersApi = require("./src/Helpers");
const Helper = new HelpersApi();

const { domain } = require("./config/keys");

const baseID = "apps7T6bpqSy7XOfa";
const recordID = "recPiPXj4v2psZxh5";
const client = "All Area Roofing";

const pdfFile = "ft pierce developer.pdf";

(async () => {
    const options = {};
    let allContacts = [];

    try {
        pdfExtract.extract(pdfFile, options, async (err, data) => {
            if (err) return console.log(err);

            for (let page of data.pages) {
                page = {
                    ...page,
                    content: page.content.map((el) => ({
                        ...el,
                        x: Math.floor(el.x),
                        y: Math.floor(el.y),
                        str: el.str.trim(),
                    })),
                };

                const phoneNumbers = page.content.filter((el) => Helper.isPhoneNumber(el.str));

                for (let phoneNumber of phoneNumbers) {
                    let contact = {};

                    const startYCoord = phoneNumber.y;
                    const endYCoord = phoneNumber.y + 40;

                    const rowHeight = 10;

                    const firstRowMin = startYCoord;
                    const firstRowMax = startYCoord + rowHeight;
                    const secondRowMin = firstRowMax;
                    const secondRowMax = secondRowMin + rowHeight;
                    const thirdRowMin = secondRowMax;
                    const thirdRowMax = thirdRowMin + rowHeight;

                    const contactSection = page.content.filter((el) =>
                        Helper.between(startYCoord, el.y, endYCoord)
                    );

                    const sectionColumns = {
                        first: contactSection
                            .filter((el) => el.x < 80)
                            .sort((a, b) => parseFloat(a.y) - parseFloat(b.y)),
                        second: contactSection
                            .filter((el) => Helper.between(80, el.x, 350))
                            .sort((a, b) => parseFloat(a.y) - parseFloat(b.y)),
                        third: contactSection
                            .filter((el) => el.x > 350)
                            .sort((a, b) => parseFloat(a.y) - parseFloat(b.y)),
                    };

                    // first column
                    const fullName = Helper.findValue(
                        sectionColumns.first,
                        firstRowMin,
                        firstRowMax
                    );

                    contact["Full Name"] = fullName;
                    contact["First Name"] = fullName.split(" ")[0];
                    contact["Last Name"] = fullName.split(" ").slice(1).join(" ");
                    contact.Title = Helper.findValue(
                        sectionColumns.first,
                        secondRowMin,
                        secondRowMax
                    );
                    contact["Company Name"] = Helper.findValue(
                        sectionColumns.first,
                        thirdRowMin,
                        thirdRowMax
                    );

                    // second column
                    const street = Helper.findValue(
                        sectionColumns.second,
                        secondRowMin,
                        secondRowMax
                    );
                    const cityStateZip = Helper.findValue(
                        sectionColumns.second,
                        thirdRowMin,
                        thirdRowMax
                    );

                    contact["Phone Number"] = Helper.findValue(
                        sectionColumns.second,
                        firstRowMin,
                        firstRowMax
                    );
                    contact.Address = street && cityStateZip && `${street}, ${cityStateZip}`;
                    contact.Street = street;
                    contact.City = cityStateZip?.split(",")[0] || "";
                    contact.State = cityStateZip?.split(",").slice(1)[0].trim().split(" ")[0] || "";
                    contact.Zip = cityStateZip?.split(" ").pop() || "";

                    // third column
                    contact.Email = Helper.findValue(
                        sectionColumns.third,
                        secondRowMin,
                        secondRowMax
                    );

                    allContacts.push(contact);
                }
            }

            console.log("Phone Numbers =", allContacts.length);
        });

        return false;
    } catch (error) {
        console.log("ERROR ---", error);
        return false;
    }
})();
