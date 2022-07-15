const express = require("express");

const airtable = require("./routes/airtable");
const parseFile = require("./routes/parse");
const neverbounce = require("./routes/neverbounce");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use("/airtable", airtable); // defaults all routes to start with "/airtable"
app.use("/parse", parseFile);
app.use("/neverbounce", neverbounce);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
