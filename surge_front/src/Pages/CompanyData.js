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
import { useState } from "react";
import { Chart } from "chart.js";
import "tailwindcss/tailwind.css";
const CompanySearchAnalytics = () => {
    const [companyName, setCompanyName] = useState("");
    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState({
        uniqueDomains: "-",
        avgSnippetLength: "-",
        totalResults: "-",
        topKeyword: "-",
    });
    const API_KEY = "AIzaSyBZ9tgwnRN72AP7fOH0YHhotiRwN2Oc-EY";
    const CX = "8207d97ec990344f3";
    const searchCompany = (query) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }
            setResults(data.items || []);
            generateAnalytics(data);
        }
        catch (error) {
            console.error("Error fetching search results:", error);
        }
    });
    const generateAnalytics = (data) => {
        var _a, _b;
        const domains = {};
        const snippetLengths = [];
        const titleLengths = [];
        const keywordCounts = {};
        const query = companyName.trim().toLowerCase();
        (_a = data.items) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
            const domain = new URL(item.link).hostname;
            domains[domain] = true;
            snippetLengths.push(item.snippet.length);
            titleLengths.push(item.title.length);
            const keywords = item.snippet.split(/\W+/);
            keywords.forEach((word) => {
                if (word.toLowerCase().includes(query)) {
                    keywordCounts[word.toLowerCase()] =
                        (keywordCounts[word.toLowerCase()] || 0) + 1;
                }
            });
        });
        setSummary({
            uniqueDomains: Object.keys(domains).length,
            avgSnippetLength: (snippetLengths.reduce((a, b) => a + b, 0) / snippetLengths.length).toFixed(2),
            totalResults: ((_b = data.items) === null || _b === void 0 ? void 0 : _b.length) || 0,
            topKeyword: Object.keys(keywordCounts).reduce((a, b) => (keywordCounts[a] > keywordCounts[b] ? a : b), ""),
        });
        // Generate charts
        createChart("domainChart", "pie", {
            labels: Object.keys(domains),
            datasets: [
                {
                    data: Object.values(domains).map(() => 1),
                    backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FFFF33"],
                },
            ],
        });
        createChart("snippetLengthChart", "bar", {
            labels: data.items.map((item) => item.title),
            datasets: [
                {
                    label: "Snippet Length",
                    data: snippetLengths,
                    backgroundColor: "#FF5733",
                },
            ],
        });
        createChart("keywordChart", "bar", {
            labels: Object.keys(keywordCounts),
            datasets: [
                {
                    label: "Keyword Count",
                    data: Object.values(keywordCounts),
                    backgroundColor: "#33FF57",
                },
            ],
        });
        createChart("titleLengthChart", "line", {
            labels: data.items.map((item) => item.title),
            datasets: [
                {
                    label: "Title Length",
                    data: titleLengths,
                    borderColor: "#3357FF",
                    fill: false,
                },
            ],
        });
        createChart("resultCountChart", "doughnut", {
            labels: ["Results"],
            datasets: [
                {
                    data: [data.items.length],
                    backgroundColor: ["#FFFF33"],
                },
            ],
        });
    };
    const createChart = (chartId, type, data) => {
        const ctx = document.getElementById(chartId);
        new Chart(ctx, {
            type,
            data,
            options: { responsive: true, maintainAspectRatio: false },
        });
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 flex flex-col items-center justify-center", children: [_jsx("h2", { className: "text-4xl text-blue-600 font-bold uppercase mb-6", children: "Company Search with Analytics" }), _jsxs("div", { className: "flex space-x-4 mb-6", children: [_jsx("input", { type: "text", className: "w-80 p-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400", placeholder: "Enter company name", value: companyName, onChange: (e) => setCompanyName(e.target.value) }), _jsx("button", { className: "bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700", onClick: () => searchCompany(companyName), children: "Search" })] }), _jsx("div", { id: "results", className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: results.length > 0 ? (results.map((item, index) => (_jsxs("div", { className: "bg-white p-4 rounded-lg shadow-md", children: [_jsx("a", { href: item.link, target: "_blank", className: "text-blue-600 font-medium", children: item.title }), _jsx("p", { className: "text-gray-600 mt-2", children: item.snippet })] }, index)))) : (_jsx("p", { className: "text-center text-gray-500 italic", children: "Search results will appear here." })) }), _jsxs("div", { className: "flex flex-wrap justify-center gap-6 mt-6", children: [_jsx("canvas", { id: "domainChart", className: "w-80 h-80 bg-white p-4 rounded-lg shadow-md" }), _jsx("canvas", { id: "snippetLengthChart", className: "w-80 h-80 bg-white p-4 rounded-lg shadow-md" }), _jsx("canvas", { id: "keywordChart", className: "w-80 h-80 bg-white p-4 rounded-lg shadow-md" }), _jsx("canvas", { id: "titleLengthChart", className: "w-80 h-80 bg-white p-4 rounded-lg shadow-md" }), _jsx("canvas", { id: "resultCountChart", className: "w-80 h-80 bg-white p-4 rounded-lg shadow-md" })] }), _jsxs("table", { className: "mt-10 bg-white rounded-lg shadow-md w-full max-w-4xl", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-blue-600 text-white", children: [_jsx("th", { className: "p-4", children: "Statistic" }), _jsx("th", { className: "p-4", children: "Value" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "hover:bg-gray-100", children: [_jsx("td", { className: "p-4", children: "Unique Domains" }), _jsx("td", { className: "p-4 text-center", children: summary.uniqueDomains })] }), _jsxs("tr", { className: "hover:bg-gray-100", children: [_jsx("td", { className: "p-4", children: "Average Snippet Length" }), _jsx("td", { className: "p-4 text-center", children: summary.avgSnippetLength })] }), _jsxs("tr", { className: "hover:bg-gray-100", children: [_jsx("td", { className: "p-4", children: "Total Results" }), _jsx("td", { className: "p-4 text-center", children: summary.totalResults })] }), _jsxs("tr", { className: "hover:bg-gray-100", children: [_jsx("td", { className: "p-4", children: "Top Keyword" }), _jsx("td", { className: "p-4 text-center", children: summary.topKeyword })] })] })] })] }));
};
export default CompanySearchAnalytics;
