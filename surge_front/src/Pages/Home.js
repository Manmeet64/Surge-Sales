import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Suspense } from "react";
import Landing from "./Landing";
import Features from "./Features";
const Footer = React.lazy(() => import("./Footer"));
const Home = () => {
    return (_jsxs("section", { children: [_jsx(Landing, {}), _jsx(Features, {}), _jsx(Suspense, { fallback: _jsx("div", { children: "Loading Footer..." }), children: _jsx(Footer, {}) })] }));
};
export default Home;
