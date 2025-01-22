import React, { useState } from "react";
import { Chart } from "chart.js";
import "tailwindcss/tailwind.css";

const CompanySearchAnalytics = () => {
  const [companyName, setCompanyName] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    uniqueDomains: "-",
    avgSnippetLength: "-",
    totalResults: "-",
    topKeyword: "-",
  });

  const API_KEY = "AIzaSyBZ9tgwnRN72AP7fOH0YHhotiRwN2Oc-EY";
  const CX = "8207d97ec990344f3";

  const searchCompany = async (query: string) => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(
      query
    )}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      setResults(data.items || []);
      generateAnalytics(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const generateAnalytics = (data: any) => {
    const domains: Record<string, boolean> = {};
    const snippetLengths: number[] = [];
    const titleLengths: number[] = [];
    const keywordCounts: Record<string, number> = {};
    const query = companyName.trim().toLowerCase();

    data.items?.forEach((item: any) => {
      const domain = new URL(item.link).hostname;
      domains[domain] = true;
      snippetLengths.push(item.snippet.length);
      titleLengths.push(item.title.length);

      const keywords = item.snippet.split(/\W+/);
      keywords.forEach((word: string) => {
        if (word.toLowerCase().includes(query)) {
          keywordCounts[word.toLowerCase()] =
            (keywordCounts[word.toLowerCase()] || 0) + 1;
        }
      });
    });

    setSummary({
      uniqueDomains: Object.keys(domains).length,
      avgSnippetLength: (
        snippetLengths.reduce((a, b) => a + b, 0) / snippetLengths.length
      ).toFixed(2),
      totalResults: data.items?.length || 0,
      topKeyword: Object.keys(keywordCounts).reduce(
        (a, b) => (keywordCounts[a] > keywordCounts[b] ? a : b),
        ""
      ),
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
      labels: data.items.map((item: any) => item.title),
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
      labels: data.items.map((item: any) => item.title),
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

  const createChart = (chartId: string, type: string, data: any) => {
    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    new Chart(ctx, {
      type,
      data,
      options: { responsive: true, maintainAspectRatio: false },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-4xl text-blue-600 font-bold uppercase mb-6">
        Company Search with Analytics
      </h2>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          className="w-80 p-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400"
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => searchCompany(companyName)}
        >
          Search
        </button>
      </div>

      <div
        id="results"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <a
                href={item.link}
                target="_blank"
                className="text-blue-600 font-medium"
              >
                {item.title}
              </a>
              <p className="text-gray-600 mt-2">{item.snippet}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Search results will appear here.
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <canvas
          id="domainChart"
          className="w-80 h-80 bg-white p-4 rounded-lg shadow-md"
        ></canvas>
        <canvas
          id="snippetLengthChart"
          className="w-80 h-80 bg-white p-4 rounded-lg shadow-md"
        ></canvas>
        <canvas
          id="keywordChart"
          className="w-80 h-80 bg-white p-4 rounded-lg shadow-md"
        ></canvas>
        <canvas
          id="titleLengthChart"
          className="w-80 h-80 bg-white p-4 rounded-lg shadow-md"
        ></canvas>
        <canvas
          id="resultCountChart"
          className="w-80 h-80 bg-white p-4 rounded-lg shadow-md"
        ></canvas>
      </div>

      <table className="mt-10 bg-white rounded-lg shadow-md w-full max-w-4xl">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-4">Statistic</th>
            <th className="p-4">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="p-4">Unique Domains</td>
            <td className="p-4 text-center">{summary.uniqueDomains}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="p-4">Average Snippet Length</td>
            <td className="p-4 text-center">{summary.avgSnippetLength}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="p-4">Total Results</td>
            <td className="p-4 text-center">{summary.totalResults}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="p-4">Top Keyword</td>
            <td className="p-4 text-center">{summary.topKeyword}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompanySearchAnalytics;
