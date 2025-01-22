import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
} from "@mui/material";
import { Volume2, Loader } from "lucide-react";
import { toast } from "react-toastify";

interface Question {
    question: string;
    answer: string;
}

const genAI = new GoogleGenerativeAI("AIzaSyCQubE_v45ayXKLSN73QuwRtffmlSjDMFQ");
const ELEVEN_LABS_API_KEY = "sk_f36f40ab2f605108f9d9037075702b15558c7cf51f8f40b6";
const VOICE_ID = "eyVoIoi3vo6sJoHOKgAc";

const CommonQuestions: React.FC = () => {
    const navigate = useNavigate();
    const [script, setScript] = useState<string>("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchScript = async () => {
            const currentScriptId = localStorage.getItem('currentScriptId');
            if (!currentScriptId) {
                toast.error('No script selected. Please generate a script first.');
                navigate('/script-generator');
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/sales/${currentScriptId}`,
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
                    console.error('Error response:', errorText);
                    throw new Error(
                        `Failed to fetch script: ${response.status}`
                    );
                }

                const data = await response.json();
                if (!data.success || !data.data) {
                    throw new Error("Failed to fetch script data");
                }

                setScript(data.data.script);
                await generateQuestions(data.data.script);
            } catch (error) {
                console.error("Error fetching script:", error);
                setError(error instanceof Error ? error.message : "Failed to fetch script");
                toast.error(error instanceof Error ? error.message : "Failed to fetch script");
            } finally {
                setLoading(false);
            }
        };

        fetchScript();
    }, [navigate]);

    const generateQuestions = async (scriptContent: string) => {
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

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const questionsArray = JSON.parse(
                response
                    .text()
                    .replace(/```json|\```/g, "")
                    .trim()
            );
            setQuestions(questionsArray);
        } catch (error) {
            console.error("Error generating questions:", error);
            setError("Failed to generate questions. Please try again.");
            toast.error("Failed to generate questions. Please try again.");
        }
    };

    const handlePlayAnswer = async (answer: string, index: number) => {
        try {
            setPlayingIndex(index);
            
            const response = await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
                {
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
                }
            );

            if (!response.ok) {
                throw new Error("Failed to convert text to speech");
            }

            const audioBlob = await response.blob();
            const audio = new Audio(URL.createObjectURL(audioBlob));
            
            audio.onended = () => {
                setPlayingIndex(null);
                URL.revokeObjectURL(audio.src);
            };

            audio.play();
        } catch (err) {
            console.error("Text-to-speech error:", err);
            toast.error("Failed to play audio. Please try again.");
            setPlayingIndex(null);
        }
    };

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box 
            sx={{ 
                maxWidth: 800, 
                mx: "auto", 
                p: 3, 
                mt: "80px",
                position: "relative",
                zIndex: 1,
                fontFamily: "Poppins, sans-serif"
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    boxShadow: "0 4px 20px rgba(138, 47, 201, 0.1)"
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 4,
                        fontWeight: 600,
                        color: "#5A108F",
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: { xs: "1.75rem", sm: "2rem" }
                    }}
                >
                    Common Client Questions
                </Typography>

                {loading ? (
                    <Box
                        sx={{ 
                            display: "flex", 
                            justifyContent: "center", 
                            p: 4 
                        }}
                    >
                        <CircularProgress sx={{ color: "#8B2FC9" }} />
                    </Box>
                ) : (
                    <List sx={{ width: "100%" }}>
                        {questions.map((item, index) => (
                            <ListItem
                                key={index}
                                disablePadding
                                sx={{
                                    mb: 2,
                                    backgroundColor: "#f0e4f6",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(138, 47, 201, 0.1)",
                                    overflow: "hidden",
                                    transition: "all 0.2s ease",
                                    '&:hover': {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 12px rgba(138, 47, 201, 0.1)"
                                    }
                                }}
                            >
                                <ListItemButton
                                    onClick={() => handlePlayAnswer(item.answer, index)}
                                    disabled={playingIndex !== null}
                                    sx={{
                                        p: 2,
                                        '&:hover': {
                                            backgroundColor: "rgba(138, 47, 201, 0.05)"
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={item.question}
                                        secondary={item.answer}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontWeight: 600,
                                                color: "#5A108F",
                                                mb: 1,
                                                fontFamily: "Poppins, sans-serif"
                                            }
                                        }}
                                        secondaryTypographyProps={{
                                            sx: { 
                                                color: "rgba(90, 16, 143, 0.8)",
                                                fontFamily: "Poppins, sans-serif"
                                            }
                                        }}
                                    />
                                    <IconButton
                                        edge="end"
                                        disabled={playingIndex !== null && playingIndex !== index}
                                        sx={{
                                            color: "#8B2FC9",
                                            backgroundColor: "rgba(138, 47, 201, 0.1)",
                                            width: 40,
                                            height: 40,
                                            ml: 2,
                                            '&:hover': {
                                                backgroundColor: "rgba(138, 47, 201, 0.2)"
                                            },
                                            '&.Mui-disabled': {
                                                color: "rgba(90, 16, 143, 0.4)",
                                                backgroundColor: "rgba(138, 47, 201, 0.05)"
                                            }
                                        }}
                                    >
                                        {playingIndex === index ? (
                                            <Loader className="spin" size={20} />
                                        ) : (
                                            <Volume2 size={20} />
                                        )}
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
};

export default CommonQuestions;
