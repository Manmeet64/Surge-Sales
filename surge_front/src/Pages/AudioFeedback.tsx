import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const GOOGLE_API_KEY = "AIzaSyCi7wvXEC0r0td0KSSoeXzJNrUv5fYMNgw";
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

interface AnalysisResult {
    communication: { score: number; feedback: string };
    tone: { score: number; feedback: string };
    politeness: { score: number; feedback: string };
    salesKnowledge: { score: number; feedback: string };
    empathy: { score: number; feedback: string };
    recommendations: string;
}

const AudioFeedback: React.FC = () => {
    const { scriptId } = useParams();
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [script, setScript] = useState<string>("");

    // Fetch Script Data
    useEffect(() => {
        const fetchScript = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/sales/${scriptId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(
                        `Failed to fetch script: ${response.status}`
                    );
                }

                const data = await response.json();
                if (!data.success) {
                    throw new Error("Failed to fetch script data");
                }

                setScript(data.data.script);
            } catch (err: unknown) {
                console.error("Error fetching script:", err);
                toast.error(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch script"
                );
            }
        };

        if (scriptId) fetchScript();
    }, [scriptId]);

    // Handle File Input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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
    const transcribeAudio = async (file: File): Promise<string> => {
        const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
                resolve((reader.result as string).split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const response = await fetch(
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
            const errorData = await response.json();
            throw new Error(
                errorData.error?.message || "Failed to transcribe audio"
            );
        }

        const data = await response.json();
        if (!data.results?.length) {
            throw new Error(
                "No transcription results found. Ensure the audio is clear."
            );
        }

        return data.results
            .map((res: any) => res.alternatives[0].transcript)
            .join(" ");
    };

    // Analyze Speech Content
    const analyzeSpeech = async (text: string): Promise<string> => {
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
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const prompt = `Provide sales conversation feedback...`; // Truncated for clarity
                const result = await model.generateContent(prompt);
                scriptFeedback = result.response;
            } catch (err) {
                console.error("Error analyzing script feedback:", err);
            }
        }

        return `Clarity: ${clarityScore}/10\nPoliteness: ${politenessScore}/10\nConfidence: ${confidenceScore}/10\nOverall: ${overallScore}/10\n\n${scriptFeedback}`;
    };

    // Handle Analysis
    const handleAnalyze = async () => {
        if (!audioFile) {
            setError("Please upload a WAV file!");
            return;
        }

        setIsLoading(true);
        setAnalysis("");
        setError("");

        try {
            const transcription = await transcribeAudio(audioFile);
            if (transcription) {
                const result = await analyzeSpeech(transcription);
                setAnalysis(result);
            }
        } catch (err: unknown) {
            console.error("Analysis error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error processing the audio file."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0e4f6] p-6 font-[Poppins]">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-[#5A108F] mb-6 text-center">
                        Audio Feedback Analysis
                    </h1>

                    <div className="space-y-6">
                        <div className="relative">
                            <input
                                type="file"
                                accept="audio/wav"
                                onChange={handleFileChange}
                                className="hidden"
                                id="audio-upload"
                            />
                            <label
                                htmlFor="audio-upload"
                                className="block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer"
                            >
                                {audioFile
                                    ? `Selected file: ${audioFile.name}`
                                    : "Upload a WAV file"}
                            </label>
                        </div>

                        {error && <div className="text-red-500">{error}</div>}

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="w-full p-4 bg-[#8B2FC9] text-white rounded-lg"
                        >
                            {isLoading ? "Analyzing..." : "Analyze Audio"}
                        </button>

                        {analysis && (
                            <div className="bg-[#fdf9ff] border border-[#e0c5f7] text-gray-800 p-4 rounded-lg shadow-md">
                                <pre>{analysis}</pre>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AudioFeedback;
