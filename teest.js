const data = require("./files/Houston TX, 5k sqft_T=11_7_2022-09_05 (1).json");

const writeCsv = require("./src/writeCsv");

(async () => {
    try {
        let jobTitles = [];

        data.forEach((property) => {
            property?.prospects?.forEach((prospect) => {
                if (prospect.companies[0]?.title[0]) {
                    jobTitles.push(prospect.companies[0]?.title[0]);
                }
            });
        });

        jobTitles = [...new Set(jobTitles)];
        console.log(jobTitles.length);

        writeCsv(jobTitles, "Reonomy Job Titles");
    } catch (error) {
        console.log(error);
    }
})();
