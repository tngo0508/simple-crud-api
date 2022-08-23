const mongoose = require("mongoose");

const moldCostSchema = new mongoose.Schema({
    userId: {
        type: Number
    },
    templates: {
        type: Object
    }
}, { timestamps: true, strict: false });

const moldCost = mongoose.model("moldcosts", moldCostSchema);

module.exports = moldCost;
