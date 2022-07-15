require("dotenv").config();

const writeCsv = require("../../src/writeCsv");

const southAlabamaZips = require("./zipCodes");
let prospects = require("./data.json");

(async () => {
    try {
        prospects = prospects.map((prospect) => {
            if (southAlabamaZips.includes(prospect.Zip)) {
                return { ...prospect, Tag: "katie" };
            } else {
                return { ...prospect, Tag: "josh" };
            }
        });

        writeCsv(prospects, "I Am Roofing Prospects");
    } catch (error) {
        console.log(error);
    }
})();
