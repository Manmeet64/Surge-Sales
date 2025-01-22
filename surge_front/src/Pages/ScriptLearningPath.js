var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-toastify";
import { Box, Typography, Button, CircularProgress, } from "@mui/material";
import { VerticalTimeline, VerticalTimelineElement, } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Book } from "lucide-react";
import ChapterFlashcards from "./ChapterFlashcards";
import { apiUrl } from '../config';
const genAI = new GoogleGenerativeAI("AIzaSyCQubE_v45ayXKLSN73QuwRtffmlSjDMFQ");
const ScriptLearningPath = () => {
    const navigate = useNavigate();
    const { scriptId } = useParams();
    const [chapters, setChapters] = useState([]);
    const [loadingStage, setLoadingStage] = useState("initial");
    const [pathName, setPathName] = useState("");
    useEffect(() => {
        const fetchScript = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!scriptId) {
                    toast.error('No script ID found in URL. Please generate a script first.');
                    navigate('/script-generator');
                    return;
                }
                setLoadingStage("initial");
                const response = yield fetch(apiUrl(`/sales/${scriptId}`), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch script');
                }
                const data = yield response.json();
                if (!data.success || !data.data) {
                    throw new Error('Script not found');
                }
                setLoadingStage("generating");
                yield generateLearningPath(data.data.script);
            }
            catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load script. Please try again.');
                navigate('/script-generator');
            }
        });
        fetchScript();
    }, [navigate, scriptId]);
    const generateLearningPath = (script) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const chaptersPrompt = `
                Generate a sales training path as a JSON object based on this sales script. 
                Create 3 chapters, each focusing on a different aspect of the script.
                Each chapter should have 5-7 flashcards that test key concepts from that chapter.
                
                Follow this exact JSON structure:
                {
                    "pathName": "Sales Training Path",
                    "chapters": [
                        {
                            "id": "chapter-1",
                            "title": "Chapter title here",
                            "flashcards": [
                                {
                                    "question": "Specific question from the script",
                                    "answer": "Clear, concise answer",
                                    "difficulty": "easy|medium|hard"
                                }
                            ]
                        }
                    ]
                }

                Rules:
                1. Questions should be specific to the script content
                2. Keep questions and answers concise
                3. Distribute difficulty levels evenly
                4. No markdown formatting, pure JSON only
                5. Focus on practical sales scenarios from the script

                Base the content on this script: "${script.substring(0, 1000)}..."
            `;
            const result = yield model.generateContent(chaptersPrompt);
            const response = yield result.response;
            let generatedContent = response.text();
            console.log("Raw Gemini response:", generatedContent);
            try {
                const jsonStartIndex = generatedContent.indexOf("{");
                const jsonEndIndex = generatedContent.lastIndexOf("}") + 1;
                if (jsonStartIndex === -1 || jsonEndIndex === 0) {
                    throw new Error("No valid JSON found in response");
                }
                generatedContent = generatedContent
                    .slice(jsonStartIndex, jsonEndIndex)
                    .replace(/\\n/g, " ")
                    .replace(/\\"/g, '"')
                    .replace(/\s+/g, " ")
                    .trim();
                console.log("Cleaned content:", generatedContent);
                let parsedContent;
                try {
                    parsedContent = JSON.parse(generatedContent);
                }
                catch (parseError) {
                    console.error("First parse attempt failed:", parseError);
                    generatedContent = generatedContent
                        .replace(/,\s*}/g, "}")
                        .replace(/,\s*]/g, "]")
                        .replace(/\}\s*\{/g, "},{")
                        .replace(/\]\s*\[/g, "],[")
                        .replace(/[^\x20-\x7E]/g, "");
                    console.log("Attempting parse with fixed content:", generatedContent);
                    parsedContent = JSON.parse(generatedContent);
                }
                setPathName(parsedContent.pathName);
                setChapters(parsedContent.chapters);
                setLoadingStage("complete");
            }
            catch (error) {
                console.error("Error parsing generated content:", error);
                console.error("Content that failed to parse:", generatedContent);
                toast.error("Failed to parse learning path content");
                throw error;
            }
        }
        catch (error) {
            console.error("Error generating learning path:", error);
            toast.error("Failed to generate learning path");
            throw error;
        }
    });
    const handleStartChapter = (chapter) => {
        navigate(`/script/${scriptId}/flashcards`, {
            state: {
                chapterData: chapter,
                scriptId: scriptId
            },
        });
    };
    return (_jsx(Box, { sx: {
            maxWidth: 1200,
            mx: "auto",
            p: { xs: 2, sm: 3 },
            mt: "80px",
            fontFamily: "Poppins, sans-serif",
        }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsxs(_Fragment, { children: [_jsx(Typography, { variant: "h4", component: "h1", sx: {
                                    mb: 6,
                                    fontWeight: 600,
                                    color: "#5A108F",
                                    textAlign: "center",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: { xs: "1.75rem", sm: "2rem" },
                                }, children: pathName }), loadingStage !== "complete" ? (_jsx(Box, { sx: {
                                    display: "flex",
                                    justifyContent: "center",
                                    p: 4,
                                }, children: _jsx(CircularProgress, { sx: { color: "#8B2FC9" } }) })) : (_jsx(VerticalTimeline, { lineColor: "#8B2FC9", children: chapters.map((chapter, index) => (_jsxs(VerticalTimelineElement, { className: "vertical-timeline-element", contentStyle: {
                                        background: "#f0e4f6",
                                        borderRadius: "16px",
                                        boxShadow: "0 4px 20px rgba(138, 47, 201, 0.1)",
                                        border: "1px solid rgba(138, 47, 201, 0.1)",
                                        padding: "2rem",
                                    }, contentArrowStyle: {
                                        borderRight: "7px solid #f0e4f6",
                                    }, iconStyle: {
                                        background: "#8B2FC9",
                                        color: "#FFFFFC",
                                        boxShadow: "0 0 0 4px #5A108F",
                                    }, icon: _jsx(Book, {}), children: [_jsx(Typography, { variant: "h6", component: "h3", sx: {
                                                color: "#5A108F",
                                                fontWeight: 600,
                                                mb: 2,
                                                fontFamily: "Poppins, sans-serif",
                                            }, children: chapter.title }), _jsx(Button, { variant: "contained", onClick: () => handleStartChapter(chapter), sx: {
                                                mt: 2,
                                                backgroundColor: "#8B2FC9",
                                                color: "#FFFFFC",
                                                fontFamily: "Poppins, sans-serif",
                                                textTransform: "none",
                                                fontWeight: 500,
                                                "&:hover": {
                                                    backgroundColor: "#5A108F",
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 4px 12px rgba(138, 47, 201, 0.2)",
                                                },
                                                transition: "all 0.2s ease",
                                            }, children: "Start Chapter" })] }, chapter.id))) }))] }) }), _jsx(Route, { path: "/chapter/:chapterId", element: _jsx(ChapterFlashcards, {}) })] }) }));
};
export default ScriptLearningPath;
