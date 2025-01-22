import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    return (_jsxs(_Fragment, { children: [showNavbar && _jsx(Navbar, {}), _jsx("div", { className: showNavbar ? "pt-16" : "", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/script-generator", element: _jsx(SalesScriptGenerator, {}) }), _jsx(Route, { path: "/script/:scriptId", element: _jsx(ScriptLearningPath, {}) }), _jsx(Route, { path: "/script/:scriptId/feedback", element: _jsx(AudioFeedback, {}) }), _jsx(Route, { path: "/script/:scriptId/questions", element: _jsx(CommonQuestions, {}) }), _jsx(Route, { path: "/script/:scriptId/flashcards", element: _jsx(ChapterFlashcards, {}) })] }) })] }));
};
function App() {
    return (_jsx(Router, { children: _jsx(AppContent, {}) }));
}
export default App;
