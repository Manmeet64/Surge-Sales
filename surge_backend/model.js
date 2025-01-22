import mongoose from "mongoose";

const saleScriptSchema = new mongoose.Schema(
    {
        script: {
            type: String,
            required: [true, "Script content is required"],
            trim: true
        }
    },
    {
        timestamps: true,
        collection: 'salescripts'
    }
);

const SaleScript = mongoose.model('SaleScript', saleScriptSchema);

export default SaleScript;