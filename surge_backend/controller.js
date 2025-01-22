import SaleScript from "./model.js";

// Create a new sale script
export const createSaleScript = async (req, res) => {
    try {
        const { script } = req.body;

        if (!script) {
            return res.status(400).json({
                success: false,
                error: 'Script content is required',
                showToast: true,
                toastType: 'error'
            });
        }

        const saleScript = new SaleScript({ script });
        const savedScript = await saleScript.save();
        
        res.status(201).json({
            success: true,
            message: 'Script saved successfully! ',
            data: savedScript,
            showToast: true,
            toastType: 'success',
            toastConfig: {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }
        });
    } catch (error) {
        console.error('Error saving script:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save script',
            details: error.message,
            showToast: true,
            toastType: 'error',
            toastConfig: {
                position: 'top-right',
                autoClose: 5000
            }
        });
    }
};

// Get all sale scripts
export const getAllSaleScripts = async (req, res) => {
    try {
        const scripts = await SaleScript.find()
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json({
            success: true,
            count: scripts.length,
            data: scripts
        });
    } catch (error) {
        console.error('Error fetching scripts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scripts',
            details: error.message
        });
    }
};

// Get a single sale script by ID
export const getSaleScriptById = async (req, res) => {
    try {
        const script = await SaleScript.findById(req.params.id)
            .select('-__v');
        
        if (!script) {
            return res.status(404).json({
                success: false,
                error: 'Script not found'
            });
        }

        res.json({
            success: true,
            data: script
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid script ID format'
            });
        }

        console.error('Error fetching script:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch script',
            details: error.message
        });
    }
};
