var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
import {
    jsx as _jsx,
    jsxs as _jsxs,
    Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from "pdfjs-dist";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { apiUrl } from "../config";
// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
const SalesScriptGenerator = () => {
    const [companyName, setCompanyName] = useState("");
    const [industrySector, setIndustrySector] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [salesGoals, setSalesGoals] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [inputMode, setInputMode] = useState("text");
    const navigate = useNavigate();
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(
        "AIzaSyCQubE_v45ayXKLSN73QuwRtffmlSjDMFQ"
    );
    // Clean text helper
    const cleanText = (text) => {
        return text
            .replace(/\*/g, "")
            .replace(/\s+/g, " ")
            .replace(/^\s+|\s+$/g, "")
            .replace(/\n\s*\n/g, "\n")
            .trim();
    };
    // Extract text from PDF
    const extractTextFromPDF = (file) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const arrayBuffer = yield file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument(arrayBuffer);
                const pdf = yield loadingTask.promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = yield pdf.getPage(i);
                    const textContent = yield page.getTextContent();
                    const pageText = textContent.items
                        .map((item) => item.str)
                        .join(" ");
                    fullText += pageText + " ";
                }
                return cleanText(fullText);
            } catch (error) {
                console.error("PDF extraction error:", error);
                throw new Error("Failed to extract text from PDF");
            }
        });
    // Generate sales improvement prompt
    const generateSalesPrompt = (companyInfo) => {
        return `
       As a sales strategy and training expert, create a comprehensive sales improvement plan for ${companyInfo.companyName} in the ${companyInfo.industrySector} sector. Structure the content to be easily converted into microlearning flashcards and used for call recording feedback.


       Company Context:
       - Company Name: ${companyInfo.companyName}
       - Industry: ${companyInfo.industrySector}
       - Target Audience: ${companyInfo.targetAudience}
       - Sales Goals: ${companyInfo.salesGoals}


       Please provide a detailed response covering these learning paths, with each section structured as microlearning chapters:


       1. Foundational Sales Knowledge (Beginner Level):
       - Key industry terms and concepts
       - Basic sales psychology
       - Understanding customer needs
       - Product knowledge essentials
       - Sales cycle fundamentals


       2. Communication Excellence (All Levels):
       - Voice modulation and tone control
       - Active listening techniques
       - Professional vocabulary
       - Positive language patterns
       - Non-verbal communication cues (for video calls)


       3. Emotional Intelligence in Sales:
       - Reading customer emotions
       - Managing personal emotions
       - Building rapport techniques
       - Empathy in customer interactions
       - Stress management during calls


       4. Sales Pitch Mastery:
       - Opening hooks (with examples)
       - Value proposition delivery
       - Feature-to-benefit conversion
       - Social proof integration
       - Call-to-action techniques


       5. Objection Handling Framework:
       - Common objection scenarios
       - Response frameworks
       - Price objection handling
       - Competition comparison
       - Timing objection management


       6. Advanced Sales Techniques:
       - Consultative selling approach
       - Solution-based selling
       - Cross-selling opportunities
       - Upselling strategies
       - Account management


       7. Customer Psychology:
       - Buyer motivation factors
       - Decision-making patterns
       - Trust-building elements
       - Purchase timing psychology
       - Customer personality types


       8. Professional Etiquette:
       - Business conversation rules
       - Cultural sensitivity
       - Professional language usage
       - Email communication standards
       - Follow-up protocols


       9. Performance Metrics:
       - Key performance indicators
       - Self-assessment methods
       - Quality scoring criteria
       - Success metrics
       - Improvement tracking


       10. Practical Implementation:
       - Role-play scenarios
       - Real call examples
       - Daily practice routines
       - Feedback implementation
       - Continuous improvement strategies


       For each section:
       1. Break down concepts into bite-sized learning points suitable for flashcards
       2. Include "Do's and Don'ts" for each major concept
       3. Provide real-world examples specific to ${companyInfo.industrySector}
       4. Add assessment checkpoints
       5. Include common mistakes to avoid
       6. Provide positive and negative example phrases
       7. List specific metrics for evaluation


       Call Recording Feedback Framework:
       1. Evaluation criteria for each learning point
       2. Scoring rubric for different aspects
       3. Specific improvement suggestions
       4. Success indicators
       5. Performance benchmarks


       Format each section to be:
       - Easily convertible to flashcards
       - Measurable against call recordings
       - Progressive in difficulty
       - Actionable and practical
       - Industry-specific
       - Focused on revenue impact


       Include specific examples of:
       1. Ideal conversation flows
       2. Proper tone and language usage
       3. Effective handling of difficult situations
       4. Success metrics and KPIs
       5. Before/After improvement scenarios


       End with implementation guidelines for:
       1. Daily practice routines
       2. Self-assessment methods
       3. Peer review processes
       4. Manager feedback sessions
       5. Continuous improvement tracking
       `;
    };
    // Process with Gemini API and send to backend
    const processWithGemini = (prompt) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = yield model.generateContent(prompt);
                const response = yield result.response;
                const generatedScript = cleanText(response.text());
                // Send to backend
                try {
                    const backendResponse = yield fetch(
                        apiUrl("/sales/create"),
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ script: generatedScript }),
                        }
                    );
                    if (!backendResponse.ok) {
                        toast.error("Failed to save script to backend");
                    } else {
                        const responseData = yield backendResponse.json();
                        // Save to localStorage
                        if (responseData.success) {
                            // Save script ID to localStorage
                            localStorage.setItem(
                                "currentScriptId",
                                responseData.data._id
                            );
                            const savedScripts = JSON.parse(
                                localStorage.getItem("savedScripts") || "[]"
                            );
                            savedScripts.push({
                                script: responseData.data.script,
                                _id: responseData.data._id,
                                createdAt: responseData.data.createdAt,
                            });
                            localStorage.setItem(
                                "savedScripts",
                                JSON.stringify(savedScripts)
                            );
                            // Navigate to script page after successful save
                            navigate(`/script/${responseData.data._id}`);
                        }
                        if (responseData.showToast) {
                            if (responseData.toastType === "success") {
                                toast.success(
                                    responseData.message,
                                    responseData.toastConfig
                                );
                            } else {
                                toast.error(
                                    responseData.message,
                                    responseData.toastConfig
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error saving script to backend:", error);
                    toast.error("Error saving script to backend");
                }
                return generatedScript;
            } catch (error) {
                toast.error("Failed to generate sales strategy");
                throw new Error("Failed to generate sales strategy");
            }
        });
    // Handle file upload
    const handleFileUpload = (e) => {
        var _a;
        const file =
            (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            setError("");
            setInputMode("pdf");
        } else {
            setError("Please upload a valid PDF file");
            setPdfFile(null);
            setInputMode("text");
        }
    };
    // Handle form submission
    const handleSubmit = (e) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            e.preventDefault();
            setIsLoading(true);
            setError("");
            try {
                let companyInfo;
                if (inputMode === "text") {
                    if (
                        !companyName ||
                        !industrySector ||
                        !targetAudience ||
                        !salesGoals
                    ) {
                        throw new Error("Please fill in all fields");
                    }
                    companyInfo = {
                        companyName,
                        industrySector,
                        targetAudience,
                        salesGoals,
                    };
                } else {
                    if (!pdfFile) {
                        throw new Error("Please upload a PDF file");
                    }
                    const pdfText = yield extractTextFromPDF(pdfFile);
                    // Extract company info from PDF text (simplified version)
                    companyInfo = {
                        companyName:
                            ((_b =
                                (_a = pdfText.match(
                                    /Company Name:(.+?)(?=\n|$)/i
                                )) === null || _a === void 0
                                    ? void 0
                                    : _a[1]) === null || _b === void 0
                                ? void 0
                                : _b.trim()) || "Unknown Company",
                        industrySector:
                            ((_d =
                                (_c = pdfText.match(
                                    /Industry:(.+?)(?=\n|$)/i
                                )) === null || _c === void 0
                                    ? void 0
                                    : _c[1]) === null || _d === void 0
                                ? void 0
                                : _d.trim()) || "General",
                        targetAudience:
                            ((_f =
                                (_e = pdfText.match(
                                    /Target Audience:(.+?)(?=\n|$)/i
                                )) === null || _e === void 0
                                    ? void 0
                                    : _e[1]) === null || _f === void 0
                                ? void 0
                                : _f.trim()) || "General Customers",
                        salesGoals:
                            ((_h =
                                (_g = pdfText.match(
                                    /Sales Goals:(.+?)(?=\n|$)/i
                                )) === null || _g === void 0
                                    ? void 0
                                    : _g[1]) === null || _h === void 0
                                ? void 0
                                : _h.trim()) || "Increase Revenue",
                    };
                }
                const prompt = generateSalesPrompt(companyInfo);
                const result = yield processWithGemini(prompt);
                // Show generating toast
                const generatingToast = toast.loading(
                    "Generating your sales script...",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
                const response = yield fetch(apiUrl("/sales/generate"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        script: result,
                    }),
                });
                if (!response.ok) {
                    toast.update(generatingToast, {
                        render: "Failed to save script",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                if (data.success && data.data._id) {
                    // Store script ID in localStorage
                    localStorage.setItem("currentScriptId", data.data._id);
                    // Update loading toast to success
                    toast.update(generatingToast, {
                        render: "Sales script generated successfully!",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    // Navigate to script page with ID from response
                    navigate(`/script/${data.data._id}`);
                } else {
                    toast.update(generatingToast, {
                        render: "Failed to generate script",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    throw new Error("Failed to generate script");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        });
    return _jsxs(_Fragment, {
        children: [
            _jsx(Navbar, {}),
            _jsx("div", {
                className:
                    "min-h-screen bg-gradient-to-b from-[#FAF8FD] to-[#f5e6ff] py-20",
                children: _jsxs("div", {
                    className: "max-w-4xl mx-auto p-6 font-[Poppins]",
                    children: [
                        _jsx(ToastContainer, {}),
                        _jsx("h1", {
                            className:
                                "text-3xl font-bold text-[#5A108F] text-center mb-8",
                            children:
                                "Generate Sales Pitch Script & Team Training Content",
                        }),
                        _jsx("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-6",
                            children: _jsxs("div", {
                                className:
                                    "bg-white backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-[rgba(138,47,201,0.1)] hover:shadow-xl transition-all duration-300",
                                children: [
                                    _jsxs("div", {
                                        className: "mb-6 space-x-6",
                                        children: [
                                            _jsxs("label", {
                                                className:
                                                    "inline-flex items-center",
                                                children: [
                                                    _jsx("input", {
                                                        type: "radio",
                                                        name: "inputMode",
                                                        value: "pdf",
                                                        checked:
                                                            inputMode === "pdf",
                                                        onChange: () => {
                                                            setInputMode("pdf");
                                                            setCompanyName("");
                                                            setIndustrySector(
                                                                ""
                                                            );
                                                            setTargetAudience(
                                                                ""
                                                            );
                                                            setSalesGoals("");
                                                        },
                                                        className:
                                                            "form-radio h-4 w-4 text-[#8B2FC9]",
                                                    }),
                                                    _jsx("span", {
                                                        className:
                                                            "ml-2 text-[#5A108F]",
                                                        children:
                                                            "Upload Company PDF",
                                                    }),
                                                ],
                                            }),
                                            _jsxs("label", {
                                                className:
                                                    "inline-flex items-center",
                                                children: [
                                                    _jsx("input", {
                                                        type: "radio",
                                                        name: "inputMode",
                                                        value: "text",
                                                        checked:
                                                            inputMode ===
                                                            "text",
                                                        onChange: () => {
                                                            setInputMode(
                                                                "text"
                                                            );
                                                            setPdfFile(null);
                                                        },
                                                        className:
                                                            "form-radio h-4 w-4 text-[#8B2FC9]",
                                                    }),
                                                    _jsx("span", {
                                                        className:
                                                            "ml-2 text-[#5A108F]",
                                                        children:
                                                            "Enter Company Details",
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    inputMode === "text" &&
                                        _jsxs("div", {
                                            className: "space-y-4",
                                            children: [
                                                _jsxs("div", {
                                                    children: [
                                                        _jsx("label", {
                                                            className:
                                                                "block text-sm font-medium text-[#5A108F] mb-1",
                                                            children:
                                                                "Company Name",
                                                        }),
                                                        _jsx("input", {
                                                            type: "text",
                                                            value: companyName,
                                                            onChange: (e) =>
                                                                setCompanyName(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            placeholder:
                                                                "Enter company name",
                                                            className:
                                                                "w-full px-4 py-3 border border-[rgba(138,47,201,0.2)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2FC9] focus:border-transparent bg-white transition-all duration-200 ease-in-out",
                                                        }),
                                                    ],
                                                }),
                                                _jsxs("div", {
                                                    children: [
                                                        _jsx("label", {
                                                            className:
                                                                "block text-sm font-medium text-[#5A108F] mb-1",
                                                            children:
                                                                "Industry",
                                                        }),
                                                        _jsxs("select", {
                                                            value: industrySector,
                                                            onChange: (e) =>
                                                                setIndustrySector(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            className:
                                                                "w-full px-4 py-3 border border-[rgba(138,47,201,0.2)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2FC9] focus:border-transparent bg-white transition-all duration-200 ease-in-out",
                                                            children: [
                                                                _jsx("option", {
                                                                    value: "",
                                                                    children:
                                                                        "Select Industry",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "healthcare",
                                                                    children:
                                                                        "Healthcare",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "edtech",
                                                                    children:
                                                                        "EdTech",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "fintech",
                                                                    children:
                                                                        "FinTech",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "other",
                                                                    children:
                                                                        "Other",
                                                                }),
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                                _jsxs("div", {
                                                    children: [
                                                        _jsx("label", {
                                                            className:
                                                                "block text-sm font-medium text-[#5A108F] mb-1",
                                                            children:
                                                                "Target Audience",
                                                        }),
                                                        _jsxs("select", {
                                                            value: targetAudience,
                                                            onChange: (e) =>
                                                                setTargetAudience(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            className:
                                                                "w-full px-4 py-3 border border-[rgba(138,47,201,0.2)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2FC9] focus:border-transparent bg-white transition-all duration-200 ease-in-out",
                                                            children: [
                                                                _jsx("option", {
                                                                    value: "",
                                                                    children:
                                                                        "Select Target Audience",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "0-12",
                                                                    children:
                                                                        "0-12 years",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "13-19",
                                                                    children:
                                                                        "13-19 years",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "20-35",
                                                                    children:
                                                                        "20-35 years",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "36-50",
                                                                    children:
                                                                        "36-50 years",
                                                                }),
                                                                _jsx("option", {
                                                                    value: "51+",
                                                                    children:
                                                                        "51 years and above",
                                                                }),
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                                _jsxs("div", {
                                                    children: [
                                                        _jsx("label", {
                                                            className:
                                                                "block text-sm font-medium text-[#5A108F] mb-1",
                                                            children:
                                                                "Description of the Company",
                                                        }),
                                                        _jsx("textarea", {
                                                            value: salesGoals,
                                                            onChange: (e) =>
                                                                setSalesGoals(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            placeholder:
                                                                "Enter description of the company",
                                                            className:
                                                                "w-full px-4 py-3 border border-[rgba(138,47,201,0.2)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B2FC9] focus:border-transparent bg-white min-h-[100px] resize-y transition-all duration-200 ease-in-out",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    inputMode === "pdf" &&
                                        _jsxs("div", {
                                            className: "mb-4",
                                            children: [
                                                _jsx("label", {
                                                    className:
                                                        "block text-sm font-medium text-[#5A108F] mb-2",
                                                    children:
                                                        "Upload Company Information PDF",
                                                }),
                                                _jsx("input", {
                                                    type: "file",
                                                    accept: ".pdf",
                                                    onChange: handleFileUpload,
                                                    disabled: isLoading,
                                                    className:
                                                        "w-full text-sm text-[#5A108F] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#8B2FC9] file:text-white hover:file:bg-[#5A108F] file:transition-all file:duration-200 file:ease-in-out cursor-pointer",
                                                }),
                                                pdfFile &&
                                                    _jsxs("p", {
                                                        className:
                                                            "mt-2 text-sm text-[#8B2FC9]",
                                                        children: [
                                                            "Selected file: ",
                                                            pdfFile.name,
                                                        ],
                                                    }),
                                            ],
                                        }),
                                    _jsx("button", {
                                        type: "submit",
                                        disabled:
                                            isLoading ||
                                            (inputMode === "text" &&
                                                (!companyName ||
                                                    !industrySector ||
                                                    !targetAudience ||
                                                    !salesGoals)) ||
                                            (inputMode === "pdf" && !pdfFile),
                                        className: `w-full py-3 px-4 mt-6 rounded-xl text-white text-base font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                                            isLoading ||
                                            (inputMode === "text" &&
                                                (!companyName ||
                                                    !industrySector ||
                                                    !targetAudience ||
                                                    !salesGoals)) ||
                                            (inputMode === "pdf" && !pdfFile)
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-[#8B2FC9] to-[#5A108F] hover:from-[#5A108F] hover:to-[#8B2FC9] shadow-lg hover:shadow-xl"
                                        }`,
                                        children: isLoading
                                            ? _jsxs("div", {
                                                  className:
                                                      "flex items-center justify-center",
                                                  children: [
                                                      _jsxs("svg", {
                                                          className:
                                                              "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                                                          xmlns: "http://www.w3.org/2000/svg",
                                                          fill: "none",
                                                          viewBox: "0 0 24 24",
                                                          children: [
                                                              _jsx("circle", {
                                                                  className:
                                                                      "opacity-25",
                                                                  cx: "12",
                                                                  cy: "12",
                                                                  r: "10",
                                                                  stroke: "currentColor",
                                                                  strokeWidth:
                                                                      "4",
                                                              }),
                                                              _jsx("path", {
                                                                  className:
                                                                      "opacity-75",
                                                                  fill: "currentColor",
                                                                  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                                                              }),
                                                          ],
                                                      }),
                                                      "Generating Strategy...",
                                                  ],
                                              })
                                            : "Generate ",
                                    }),
                                ],
                            }),
                        }),
                        isLoading &&
                            _jsxs("div", {
                                className: "text-center py-6",
                                children: [
                                    _jsx("div", {
                                        className:
                                            "inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8B2FC9] border-t-transparent",
                                    }),
                                    _jsx("p", {
                                        className: "mt-3 text-[#5A108F]",
                                        children:
                                            "Crafting your sales strategy...",
                                    }),
                                ],
                            }),
                        error &&
                            _jsx("div", {
                                className:
                                    "mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-100",
                                children: error,
                            }),
                    ],
                }),
            }),
        ],
    });
};
export default SalesScriptGenerator;
