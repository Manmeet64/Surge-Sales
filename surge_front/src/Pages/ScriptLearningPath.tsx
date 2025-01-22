import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Book } from "lucide-react";
import ChapterFlashcards from "./ChapterFlashcards";
import Navbar from "../Components/Navbar";
import { Volume2, Loader } from "react-feather";

interface Flashcard {
    question: string;
    answer: string;
    difficulty: string;
}

interface Chapter {
    id: string;
    title: string;
    flashcards: Flashcard[];
}

const genAI = new GoogleGenerativeAI("AIzaSyCQubE_v45ayXKLSN73QuwRtffmlSjDMFQ");

const ScriptLearningPath: React.FC = () => {
    const navigate = useNavigate();
    const { scriptId } = useParams();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loadingStage, setLoadingStage] = useState<
        "initial" | "generating" | "complete"
    >("initial");
    const [pathName, setPathName] = useState<string>("");

    useEffect(() => {
        const fetchScript = async () => {
            try {
                if (!scriptId) {
                    toast.error('No script ID found in URL. Please generate a script first.');
                    navigate('/script-generator');
                    return;
                }

                setLoadingStage("initial");
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sales/${scriptId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch script');
                }

                const data = await response.json();
                if (!data.success || !data.data) {
                    throw new Error('Script not found');
                }

                setLoadingStage("generating");
                await generateLearningPath(data.data.script);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load script. Please try again.');
                navigate('/script-generator');
            }
        };

        fetchScript();
    }, [navigate, scriptId]);

    const generateLearningPath = async (script: string) => {
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

                Base the content on this script: "${script.substring(
                    0,
                    1000
                )}..."
            `;

            const result = await model.generateContent(chaptersPrompt);
            const response = await result.response;
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
                } catch (parseError) {
                    console.error("First parse attempt failed:", parseError);
                    generatedContent = generatedContent
                        .replace(/,\s*}/g, "}")
                        .replace(/,\s*]/g, "]")
                        .replace(/\}\s*\{/g, "},{")
                        .replace(/\]\s*\[/g, "],[")
                        .replace(/[^\x20-\x7E]/g, "");

                    console.log(
                        "Attempting parse with fixed content:",
                        generatedContent
                    );
                    parsedContent = JSON.parse(generatedContent);
                }

                setPathName(parsedContent.pathName);
                setChapters(parsedContent.chapters);
                setLoadingStage("complete");
            } catch (error) {
                console.error("Error parsing generated content:", error);
                console.error(
                    "Content that failed to parse:",
                    generatedContent
                );
                toast.error("Failed to parse learning path content");
                throw error;
            }
        } catch (error) {
            console.error("Error generating learning path:", error);
            toast.error("Failed to generate learning path");
            throw error;
        }
    };

    const handleStartChapter = (chapter: Chapter) => {
        navigate(`/script/${scriptId}/flashcards`, {
            state: {
                chapterData: chapter,
                scriptId: scriptId
            },
        });
    };

    return (
        <Box
            sx={{
                maxWidth: 1200,
                mx: "auto",
                p: { xs: 2, sm: 3 },
                mt: "80px",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    mb: 6,
                                    fontWeight: 600,
                                    color: "#5A108F",
                                    textAlign: "center",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: { xs: "1.75rem", sm: "2rem" },
                                }}
                            >
                                {pathName}
                            </Typography>

                            {loadingStage !== "complete" ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        p: 4,
                                    }}
                                >
                                    <CircularProgress
                                        sx={{ color: "#8B2FC9" }}
                                    />
                                </Box>
                            ) : (
                                <VerticalTimeline lineColor="#8B2FC9">
                                    {chapters.map((chapter, index) => (
                                        <VerticalTimelineElement
                                            key={chapter.id}
                                            className="vertical-timeline-element"
                                            contentStyle={{
                                                background: "#f0e4f6",
                                                borderRadius: "16px",
                                                boxShadow:
                                                    "0 4px 20px rgba(138, 47, 201, 0.1)",
                                                border: "1px solid rgba(138, 47, 201, 0.1)",
                                                padding: "2rem",
                                            }}
                                            contentArrowStyle={{
                                                borderRight:
                                                    "7px solid #f0e4f6",
                                            }}
                                            iconStyle={{
                                                background: "#8B2FC9",
                                                color: "#FFFFFC",
                                                boxShadow: "0 0 0 4px #5A108F",
                                            }}
                                            icon={<Book />}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                sx={{
                                                    color: "#5A108F",
                                                    fontWeight: 600,
                                                    mb: 2,
                                                    fontFamily:
                                                        "Poppins, sans-serif",
                                                }}
                                            >
                                                {chapter.title}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    handleStartChapter(chapter)
                                                }
                                                sx={{
                                                    mt: 2,
                                                    backgroundColor: "#8B2FC9",
                                                    color: "#FFFFFC",
                                                    fontFamily:
                                                        "Poppins, sans-serif",
                                                    textTransform: "none",
                                                    fontWeight: 500,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#5A108F",
                                                        transform:
                                                            "translateY(-2px)",
                                                        boxShadow:
                                                            "0 4px 12px rgba(138, 47, 201, 0.2)",
                                                    },
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                Start Chapter
                                            </Button>
                                        </VerticalTimelineElement>
                                    ))}
                                </VerticalTimeline>
                            )}
                        </>
                    }
                />
                <Route
                    path="/chapter/:chapterId"
                    element={<ChapterFlashcards />}
                />
            </Routes>
        </Box>
    );
};

export default ScriptLearningPath;
