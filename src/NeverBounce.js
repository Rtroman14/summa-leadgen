const NeverBounce = require("neverbounce");

const HelperApi = require("./Helpers");
const Helper = new HelperApi();

module.exports = class NeverBounceApi {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("Using NeverBounce requires an API key.");
        }

        this.apiKey = apiKey;
    }

    async config() {
        try {
            return new NeverBounce({ apiKey: this.apiKey });
        } catch (error) {
            console.log("NO API KEY PROVIDED ---", error);
        }
    }

    async validateEmail(email) {
        try {
            const client = await this.config();

            const res = await client.single.check(email);

            const result = res.getResult();

            return result;
        } catch (error) {
            console.log("ERROR VALIDATEEMAIL() ---", error);
            return false;
        }
    }

    async getJob(filename) {
        try {
            const client = await this.config();

            const res = await client.jobs.search({
                //    'job_id': 10000, // Filter jobs based on id
                filename, // Filter jobs based on filename
                //    'job_status': 'complete', // Show completed jobs only
                //    'page': 1, // Page to start from
                //    'items_per_page': 10, // Number of items per page
            });

            return res;
        } catch (error) {
            console.log("ERROR GETJOB() ---", error);
            return false;
        }
    }

    async createJob(array, title) {
        try {
            const client = await this.config();

            const res = await client.jobs.create(
                array,
                "supplied", // Either `supplied` or `remote_url`
                title, // Friendly name that can be used to identify job
                false, // Run sample
                true, // Auto parse
                true // Auto run
            );

            return res;
        } catch (error) {
            console.log("ERROR CREATEJOB() ---", error);
            return false;
        }
    }

    async jobResults(jobID) {
        try {
            let allJobResults = [];

            const client = await this.config();

            const res = await client.jobs.results(jobID, {
                page: 1, // Page to start from
                items_per_page: 1000, // Number of items per page
            });

            for (let page = 1; page <= res.total_pages; page++) {
                const { results } = await client.jobs.results(jobID, {
                    page, // Page to start from
                    items_per_page: 1000, // Number of items per page
                });

                const data = Helper.filterValidEmails(results);

                allJobResults = [...allJobResults, ...data];
            }

            return allJobResults;
        } catch (error) {
            console.log("ERROR RESULTS() ---", error);
            return false;
        }
    }
};
