import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import { ArrowLeft, ArrowRight, X, RotateCw } from 'lucide-react';
const ChapterFlashcards = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { chapterId } = useParams();
    const state = location.state;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!(state === null || state === void 0 ? void 0 : state.chapterData)) {
            // If no chapter data is passed, navigate back to learning path
            navigate(`/script/${(state === null || state === void 0 ? void 0 : state.scriptId) || ''}`);
            return;
        }
        setLoading(false);
    }, [state, navigate]);
    const handleNext = () => {
        if (currentIndex < state.chapterData.flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped(false);
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFlipped(false);
        }
    };
    const handleClose = () => {
        navigate(`/script/${state.scriptId}`);
    };
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }, children: _jsx(CircularProgress, { sx: { color: "#8B2FC9" } }) }));
    }
    const currentFlashcard = state.chapterData.flashcards[currentIndex];
    return (_jsx(Box, { sx: {
            maxWidth: 800,
            mx: "auto",
            p: { xs: 2, sm: 3 },
            mt: "80px",
            fontFamily: "Poppins, sans-serif"
        }, children: _jsxs(Paper, { elevation: 3, sx: {
                p: { xs: 3, sm: 4 },
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(138, 47, 201, 0.1)",
                position: "relative"
            }, children: [_jsx(IconButton, { onClick: handleClose, sx: {
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        color: "#5A108F",
                        '&:hover': {
                            backgroundColor: "rgba(138, 47, 201, 0.1)"
                        }
                    }, children: _jsx(X, {}) }), _jsx(Typography, { variant: "h4", component: "h1", sx: {
                        mb: 4,
                        fontWeight: 600,
                        color: "#5A108F",
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: { xs: "1.75rem", sm: "2rem" }
                    }, children: state.chapterData.title }), _jsx(Box, { onClick: () => setFlipped(!flipped), sx: {
                        minHeight: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: "#f0e4f6",
                        borderRadius: "12px",
                        p: 4,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: flipped ? 'rotateX(180deg)' : 'none',
                        transformStyle: 'preserve-3d',
                        '&:hover': {
                            boxShadow: "0 4px 20px rgba(138, 47, 201, 0.15)"
                        }
                    }, children: _jsx(Typography, { variant: "h6", sx: {
                            color: "#5A108F",
                            textAlign: 'center',
                            transform: flipped ? 'rotateX(180deg)' : 'none',
                            fontFamily: "Poppins, sans-serif",
                            backfaceVisibility: 'hidden'
                        }, children: flipped ? currentFlashcard.answer : currentFlashcard.question }) }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }, children: [_jsx(IconButton, { onClick: handlePrevious, disabled: currentIndex === 0, sx: {
                                color: "#8B2FC9",
                                backgroundColor: "rgba(138, 47, 201, 0.1)",
                                '&:hover': {
                                    backgroundColor: "rgba(138, 47, 201, 0.2)"
                                },
                                '&.Mui-disabled': {
                                    color: "rgba(90, 16, 143, 0.4)",
                                    backgroundColor: "rgba(138, 47, 201, 0.05)"
                                }
                            }, children: _jsx(ArrowLeft, {}) }), _jsx(IconButton, { onClick: () => setFlipped(!flipped), sx: {
                                color: "#8B2FC9",
                                backgroundColor: "rgba(138, 47, 201, 0.1)",
                                '&:hover': {
                                    backgroundColor: "rgba(138, 47, 201, 0.2)"
                                }
                            }, children: _jsx(RotateCw, {}) }), _jsx(IconButton, { onClick: handleNext, disabled: currentIndex === state.chapterData.flashcards.length - 1, sx: {
                                color: "#8B2FC9",
                                backgroundColor: "rgba(138, 47, 201, 0.1)",
                                '&:hover': {
                                    backgroundColor: "rgba(138, 47, 201, 0.2)"
                                },
                                '&.Mui-disabled': {
                                    color: "rgba(90, 16, 143, 0.4)",
                                    backgroundColor: "rgba(138, 47, 201, 0.05)"
                                }
                            }, children: _jsx(ArrowRight, {}) })] }), _jsxs(Typography, { sx: {
                        textAlign: 'center',
                        mt: 2,
                        color: "rgba(90, 16, 143, 0.6)",
                        fontFamily: "Poppins, sans-serif"
                    }, children: [currentIndex + 1, " of ", state.chapterData.flashcards.length] })] }) }));
};
export default ChapterFlashcards;
