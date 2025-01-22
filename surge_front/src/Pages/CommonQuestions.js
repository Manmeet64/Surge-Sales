var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Typography, CircularProgress, Alert, IconButton, } from "@mui/material";
import { Volume2, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrl } from '../config';
const genAI = new GoogleGenerativeAI("AIzaSyCQubE_v45ayXKLSN73QuwRtffmlSjDMFQ");
const ELEVEN_LABS_API_KEY = "sk_f36f40ab2f605108f9d9037075702b15558c7cf51f8f40b6";
const VOICE_ID = "eyVoIoi3vo6sJoHOKgAc";
const CommonQuestions = () => {
    const navigate = useNavigate();
    const [script, setScript] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [playingIndex, setPlayingIndex] = useState(null);
    useEffect(() => {
        const fetchScript = () => __awaiter(void 0, void 0, void 0, function* () {
            const currentScriptId = localStorage.getItem('currentScriptId');
            if (!currentScriptId) {
                toast.error('No script selected. Please generate a script first.');
                navigate('/script-generator');
                return;
            }
            try {
                const response = yield fetch(apiUrl(`/sales/${currentScriptId}`), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });
                if (!response.ok) {
                    const errorText = yield response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Failed to fetch script: ${response.status}`);
                }
                const data = yield response.json();
                if (!data.success || !data.data) {
                    throw new Error("Failed to fetch script data");
                }
                setScript(data.data.script);
                yield generateQuestions(data.data.script);
            }
            catch (error) {
                console.error("Error fetching script:", error);
                setError(error instanceof Error ? error.message : "Failed to fetch script");
                toast.error(error instanceof Error ? error.message : "Failed to fetch script");
            }
            finally {
                setLoading(false);
            }
        });
        fetchScript();
    }, [navigate]);
    const generateQuestions = (scriptContent) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Generate 5 basic, common questions that clients typically ask during sales conversations, along with general but informative answers. These should be universal questions that apply to most businesses.

Example question themes:
- Pricing and payment options
- Implementation timeline
- Support and maintenance
- Training and onboarding
- Integration capabilities
- Security and compliance
- Customization options
- Success metrics
- Contract terms
- Future roadmap

Return the response in this JSON format (return only raw JSON):
[
  {
    "question": "Common sales question that applies to most businesses",
    "answer": "Clear, informative answer that covers key points"
  }
]`;
            const result = yield model.generateContent(prompt);
            const response = yield result.response;
            const questionsArray = JSON.parse(response
                .text()
                .replace(/```json|\```/g, "")
                .trim());
            setQuestions(questionsArray);
        }
        catch (error) {
            console.error("Error generating questions:", error);
            setError("Failed to generate questions. Please try again.");
            toast.error("Failed to generate questions. Please try again.");
        }
    });
    const handlePlayAnswer = (answer, index) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setPlayingIndex(index);
            const response = yield fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": ELEVEN_LABS_API_KEY,
                },
                body: JSON.stringify({
                    text: answer,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to convert text to speech");
            }
            const audioBlob = yield response.blob();
            const audio = new Audio(URL.createObjectURL(audioBlob));
            audio.onended = () => {
                setPlayingIndex(null);
                URL.revokeObjectURL(audio.src);
            };
            audio.play();
        }
        catch (err) {
            console.error("Text-to-speech error:", err);
            toast.error("Failed to play audio. Please try again.");
            setPlayingIndex(null);
        }
    });
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { m: 2 }, children: error }));
    }
    return _jsxs(Box, {
        sx: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            minHeight: "100vh",
            backgroundColor: "#FAF8FD"
        },
        children: [
            _jsx("h1", {
                className: "text-3xl font-bold text-[#5A108F] mb-8",
                children: "Common Questions"
            }),
            loading ? (
                _jsx(CircularProgress, {
                    sx: { color: "#8B2FC9", mt: 4 }
                })
            ) : error ? (
                _jsx(Alert, {
                    severity: "error",
                    sx: { mt: 4 },
                    children: error
                })
            ) : (
                _jsxs(List, {
                    sx: {
                        width: "100%",
                        maxWidth: 800,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        p: 2
                    },
                    children: questions.map((question, index) => (
                        _jsxs(ListItem, {
                            disablePadding: true,
                            sx: { mb: 2 },
                            children: [
                                _jsx(ListItemButton, {
                                    onClick: () => handlePlayAnswer(question.answer, index),
                                    sx: {
                                        borderRadius: 2,
                                        "&:hover": {
                                            backgroundColor: "rgba(138, 47, 201, 0.1)"
                                        }
                                    },
                                    children: _jsx(ListItemText, {
                                        primary: _jsx(Typography, {
                                            sx: {
                                                fontWeight: 600,
                                                color: "#5A108F"
                                            },
                                            children: question.question
                                        }),
                                        secondary: (
                                            _jsx(Typography, {
                                                sx: {
                                                    color: "rgba(90, 16, 143, 0.7)",
                                                    mt: 1
                                                },
                                                children: question.answer
                                            })
                                        )
                                    })
                                }),
                                _jsx(IconButton, {
                                    onClick: () => handlePlayAnswer(question.answer, index),
                                    disabled: playingIndex !== null,
                                    sx: {
                                        height: 40,
                                        ml: 2,
                                        "&:hover": {
                                            backgroundColor: "rgba(138, 47, 201, 0.2)"
                                        },
                                        "&.Mui-disabled": {
                                            color: "rgba(90, 16, 143, 0.4)",
                                            backgroundColor: "rgba(138, 47, 201, 0.05)"
                                        }
                                    },
                                    children: playingIndex === index ? 
                                        _jsx(Loader, { className: "spin", size: 20 }) : 
                                        _jsx(Volume2, { size: 20 })
                                })
                            ]
                        }, index)
                    ))
                })
            )
        ]
    });
};
export default CommonQuestions;
