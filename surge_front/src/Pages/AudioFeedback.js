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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { apiUrl } from "../config";
const GOOGLE_API_KEY = "AIzaSyCi7wvXEC0r0td0KSSoeXzJNrUv5fYMNgw";
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const AudioFeedback = () => {
    const { scriptId } = useParams();
    const [audioFile, setAudioFile] = useState(null);
    const [analysis, setAnalysis] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [script, setScript] = useState("");
    // Fetch Script Data
    useEffect(() => {
        const fetchScript = () =>
            __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const response = yield fetch(apiUrl(`/sales/${scriptId}`), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    });
                    if (!response.ok) {
                        const errorText = yield response.text();
                        throw new Error(
                            `Failed to fetch script: ${response.status}`
                        );
                    }
                    const data = yield response.json();
                    if (!data.success) {
                        throw new Error("Failed to fetch script data");
                    }
                    setScript(data.data.script);
                } catch (err) {
                    console.error("Error fetching script:", err);
                    toast.error(
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch script"
                    );
                }
            });
        if (scriptId) fetchScript();
    }, [scriptId]);
    // Handle File Input
    const handleFileChange = (event) => {
        var _a;
        const file =
            (_a = event.target.files) === null || _a === void 0
                ? void 0
                : _a[0];
        if (file) {
            if (file.type !== "audio/wav") {
                setError("Please upload a WAV file only.");
                return;
            }
            setAudioFile(file);
            setAnalysis("");
            setError("");
        }
    };
    // Convert Audio to Text (Transcription)
    const transcribeAudio = (file) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const base64Audio = yield new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            const response = yield fetch(
                `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        config: {
                            encoding: "LINEAR16",
                            sampleRateHertz: 16000,
                            languageCode: "en-US",
                            enableAutomaticPunctuation: true,
                            model: "default",
                            audioChannelCount: 1,
                        },
                        audio: { content: base64Audio },
                    }),
                }
            );
            if (!response.ok) {
                const errorData = yield response.json();
                throw new Error(
                    ((_a = errorData.error) === null || _a === void 0
                        ? void 0
                        : _a.message) || "Failed to transcribe audio"
                );
            }
            const data = yield response.json();
            if (
                !((_b = data.results) === null || _b === void 0
                    ? void 0
                    : _b.length)
            ) {
                throw new Error(
                    "No transcription results found. Ensure the audio is clear."
                );
            }
            return data.results
                .map((res) => res.alternatives[0].transcript)
                .join(" ");
        });
    // Analyze Speech Content
    const analyzeSpeech = (text) =>
        __awaiter(void 0, void 0, void 0, function* () {
            // Example scoring logic
            const words = text.trim().split(/\s+/).length;
            const sentences = text.split(/[.!?]+/).filter(Boolean).length;
            const avgWordsPerSentence =
                sentences > 0 ? (words / sentences).toFixed(1) : "0";
            const clarityScore = Number(avgWordsPerSentence) <= 20 ? 8 : 5;
            const politenessScore = text.includes("thank you") ? 9 : 6;
            const confidenceScore = 8;
            const overallScore = (
                (clarityScore + politenessScore + confidenceScore) /
                3
            ).toFixed(1);
            let scriptFeedback = "";
            if (script) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: "gemini-pro",
                    });
                    const prompt = `Provide sales conversation feedback...`; // Truncated for clarity
                    const result = yield model.generateContent(prompt);
                    scriptFeedback = result.response;
                } catch (err) {
                    console.error("Error analyzing script feedback:", err);
                }
            }
            return `Clarity: ${clarityScore}/10\nPoliteness: ${politenessScore}/10\nConfidence: ${confidenceScore}/10\nOverall: ${overallScore}/10\n\n${scriptFeedback}`;
        });
    // Handle Analysis
    const handleAnalyze = () =>
        __awaiter(void 0, void 0, void 0, function* () {
            if (!audioFile) {
                setError("Please upload a WAV file!");
                return;
            }
            setIsLoading(true);
            setAnalysis("");
            setError("");
            try {
                const transcription = yield transcribeAudio(audioFile);
                if (transcription) {
                    const result = yield analyzeSpeech(transcription);
                    setAnalysis(result);
                }
            } catch (err) {
                console.error("Analysis error:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Error processing the audio file."
                );
            } finally {
                setIsLoading(false);
            }
        });
    return _jsx("div", {
        className: "min-h-screen bg-[#f0e4f6] p-6 font-[Poppins]",
        children: _jsx("div", {
            className: "max-w-4xl mx-auto",
            children: _jsxs(motion.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 },
                className: "bg-white rounded-2xl shadow-lg p-8",
                children: [
                    _jsx("h1", {
                        className:
                            "text-3xl font-bold text-[#5A108F] mb-6 text-center",
                        children: "Call Recording & Sales Pitch Analysis",
                    }),
                    _jsxs("div", {
                        className: "space-y-6",
                        children: [
                            _jsxs("div", {
                                className: "relative",
                                children: [
                                    _jsx("input", {
                                        type: "file",
                                        accept: "audio/wav",
                                        onChange: handleFileChange,
                                        className: "hidden",
                                        id: "audio-upload",
                                    }),
                                    _jsx("label", {
                                        htmlFor: "audio-upload",
                                        className:
                                            "block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer",
                                        children: audioFile
                                            ? `Selected file: ${audioFile.name}`
                                            : "Upload a WAV file",
                                    }),
                                    audioFile &&
                                        _jsxs("div", {
                                            className:
                                                "w-full flex items-center space-x-4 my-4",
                                            children: [
                                                _jsx("audio", {
                                                    controls: true,
                                                    className: "w-full",
                                                    children: _jsx("source", {
                                                        src: URL.createObjectURL(
                                                            audioFile
                                                        ),
                                                        type: "audio/wav",
                                                    }),
                                                }),
                                            ],
                                        }),
                                ],
                            }),
                            script &&
                                _jsx("h4", {
                                    className: "text-black",
                                    children: "The script : ",
                                }),
                            _jsx("div", {
                                className:
                                    "w-full h-[320px] p-4 rounded-lg overflow-scroll",
                                children: script,
                            }),
                            error &&
                                _jsx("div", {
                                    className: "text-red-500",
                                    children: error,
                                }),
                            _jsx("button", {
                                onClick: handleAnalyze,
                                disabled: isLoading,
                                className:
                                    "w-full p-4 bg-[#8B2FC9] text-white rounded-lg",
                                children: isLoading
                                    ? "Analyzing..."
                                    : "Analyze Audio",
                            }),
                            analysis &&
                                _jsx("div", {
                                    className:
                                        "bg-[#fdf9ff] border border-[#e0c5f7] text-gray-800 p-4 rounded-lg shadow-md",
                                    children: _jsx("pre", {
                                        children: analysis,
                                    }),
                                }),
                        ],
                    }),
                ],
            }),
        }),
    });
};
export default AudioFeedback;
