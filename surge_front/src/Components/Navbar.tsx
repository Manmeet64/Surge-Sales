import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Tooltip, Box } from "@mui/material";
import { Book, HelpCircle, Mic, Home, PenSquare } from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate();
    const { scriptId } = useParams();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/" || path === "/script-generator") {
            return location.pathname === path;
        }
        const currentScriptId = localStorage.getItem("currentScriptId");
        return location.pathname === `/script/${currentScriptId}${path}`;
    };

    const navigationItems = [
        {
            path: "/",
            icon: Home,
            tooltip: "Home",
            ariaLabel: "Navigate to Home",
            isHomeLink: true
        },
        {
            path: "/script-generator",
            icon: PenSquare,
            tooltip: "Script Generator",
            ariaLabel: "Navigate to Script Generator",
            isHomeLink: true
        },
        {
            path: "",
            icon: Book,
            tooltip: "Learning Path",
            ariaLabel: "Navigate to Learning Path"
        },
        {
            path: "/feedback",
            icon: Mic,
            tooltip: "Audio Feedback",
            ariaLabel: "Navigate to Audio Feedback"
        },
        {
            path: "/questions",
            icon: HelpCircle,
            tooltip: "Common Questions",
            ariaLabel: "Navigate to Common Questions"
        }
    ];

    const handleNavigation = (path: string, isHomeLink?: boolean) => {
        if (isHomeLink) {
            navigate(path);
            return;
        }

        const currentScriptId = localStorage.getItem("currentScriptId");
        if (!currentScriptId) {
            toast.error("No script selected. Please generate a script first.");
            navigate("/script-generator");
            return;
        }
        navigate(`/script/${currentScriptId}${path}`);
    };

    // Show navbar on script-generator page as well
    const showNavbar = location.pathname === "/script-generator" || localStorage.getItem("currentScriptId");

    if (!showNavbar) {
        return null;
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 10px rgba(90, 16, 143, 0.1)",
                borderBottom: "1px solid rgba(90, 16, 143, 0.1)",
            }}
        >
            <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
                {navigationItems.map(({ path, icon: Icon, tooltip, ariaLabel, isHomeLink }) => (
                    <Tooltip key={path} title={tooltip} arrow>
                        <IconButton
                            onClick={() => handleNavigation(path, isHomeLink)}
                            aria-label={ariaLabel}
                            sx={{
                                color: isActive(path) ? "#5A108F" : "rgba(90, 16, 143, 0.6)",
                                backgroundColor: isActive(path)
                                    ? "rgba(138, 47, 201, 0.1)"
                                    : "transparent",
                                "&:hover": {
                                    backgroundColor: "rgba(138, 47, 201, 0.1)",
                                    color: "#5A108F",
                                    transform: "translateY(-2px)"
                                },
                                transition: "all 0.2s ease",
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                margin: "0 4px"
                            }}
                        >
                            <Icon size={24} />
                        </IconButton>
                    </Tooltip>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
