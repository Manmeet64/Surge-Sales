import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import SalesScriptGenerator from "./Pages/SalesScriptGenerator";
import ScriptLearningPath from "./Pages/ScriptLearningPath";
import CommonQuestions from "./Pages/CommonQuestions";
import AudioFeedback from "./Pages/AudioFeedback";
import ChapterFlashcards from "./Pages/ChapterFlashcards";
import Navbar from "./Components/Navbar";

const AppContent = () => {
    const location = useLocation();
    
    // Show navbar on all script-related pages except home and script generator
    const showNavbar = !['/', '/script-generator'].includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            <div className={showNavbar ? "pt-16" : ""}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/script-generator" element={<SalesScriptGenerator />} />
                    <Route path="/script/:scriptId" element={<ScriptLearningPath />} />
                    <Route path="/script/:scriptId/feedback" element={<AudioFeedback />} />
                    <Route path="/script/:scriptId/questions" element={<CommonQuestions />} />
                    <Route path="/script/:scriptId/flashcards" element={<ChapterFlashcards />} />
                </Routes>
            </div>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
