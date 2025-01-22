import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { ChartNoAxesCombined, BadgeIndianRupee } from "lucide-react";
import emailjs from "@emailjs/browser";
function Footer() {
    const footerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const formRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isloading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(Object.assign(Object.assign({}, form), { [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        emailjs
            .send("service_qgii1p8", "template_fp5i0n7", {
            from_name: form.name,
            to_name: "Prem - Agent",
            from_email: form.email,
            to_email: "2023.tprem@isu.ac.in",
            message: form.message,
        }, "Gg0_CZUDlyA0zFRAd")
            .then(() => {
            setLoading(false);
            alert("Thank you! I'll get to you ASAP.");
            setForm({
                name: "",
                email: "",
                message: "",
            });
        }, (error) => {
            console.log(error);
            setLoading(false);
            alert("Something went wrong!");
        });
    };
    // Set up Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting); // Check visibility
        }, { threshold: 0.2 });
        if (footerRef.current) {
            observer.observe(footerRef.current);
        }
        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);
    // GSAP animation for the inner_* divs and heading
    useEffect(() => {
        if (isVisible) {
            console.log("Footer is visible. Starting animation...");
            const tl = gsap.timeline({
                defaults: { duration: 1.2, ease: "elastic.out" },
            });
            // Animate the heading first
            tl.to(".heading", { y: "0px", opacity: 1 })
                .to(".inner_1", { y: "0px", opacity: 1 }, "-=0.8")
                .to(".inner_2", { y: "0px", opacity: 1 }, "-=0.8")
                .to(".inner_3", { y: "0px", opacity: 1 }, "-=0.8")
                .to(".inner_4", { y: "0px", opacity: 1 }, "-=0.8")
                .to(".inner_5", { y: "0px", opacity: 1 }, "-=0.8")
                .to(".inner_6", { y: "0px", opacity: 1 }, "-=0.8")
                .to(".inner_7", { y: "0px", opacity: 1 }, "-=0.8");
        }
    }, [isVisible]);
    return (_jsxs("section", { ref: footerRef, className: "h-[100vh] w-[100%] bg-white flex justify-center items-center relative px-40 gap-4 text-2xl text-white font-semibold", children: [_jsxs("div", { className: "first h-[100vh] flex-[0_0_30%] flex flex-col items-start justify-end pb-8 gap-4", children: [_jsxs("div", { className: "flex gap-4 items-end", children: [_jsx("div", { className: "card inner_1 w-48 h-48 p-4 bg-violet_1 rounded-3xl", style: { opacity: 0, transform: "translateY(-50px)" }, children: _jsx("h2", { children: "Focusing on what matters" }) }), _jsx("div", { className: "card inner_3 bg-bg_secondary rounded-3xl w-28 h-24 flex justify-center items-center", style: { opacity: 0, transform: "translateY(-50px)" }, children: _jsx(ChartNoAxesCombined, { size: 48 }) })] }), _jsx("div", { className: "card inner_2 w-[100%] h-60 bg-violet_2 p-4 rounded-3xl", style: { opacity: 0, transform: "translateY(-50px)" }, children: _jsx("h2", { children: "We Empower." }) })] }), _jsxs("div", { className: "second h-[100vh] flex-[0_0_50%] flex flex-col items-end justify-end pb-8 gap-[20px]", children: [_jsxs("h1", { className: "heading text-7xl font-bold self-center mb-8 text-gray-800 ml-[-90px] text-center", style: { opacity: 0, transform: "translateY(-50px)" }, children: ["Your messages", _jsx("br", {}), "Our Priority"] }), _jsx("div", { className: "card inner_4 w-[100%] h-[500px] bg-violet_3 p-6 rounded-3xl flex items-center justify-center", style: { opacity: 0, transform: "translateY(-50px)" }, children: _jsxs("form", { ref: formRef, onSubmit: handleSubmit, className: "flex flex-col gap-4 w-full max-w-md text-sm", children: [_jsxs("label", { htmlFor: "name", className: "flex flex-col ", children: [_jsx("span", { className: "font-medium mb-2 text-white", children: "Your Name:" }), _jsx("input", { type: "text", name: "name", value: form.name, onChange: handleChange, placeholder: "What's your name?", className: "bg-tertiary py-3 px-4 text-gray-700 rounded-lg outline-none placeholder:text-gray-500 border border-gray-300 focus:border-violet-500" })] }), _jsxs("label", { htmlFor: "email", className: "flex flex-col", children: [_jsx("span", { className: "text-white font-medium mb-2", children: "Your Email:" }), _jsx("input", { type: "email", name: "email", value: form.email, onChange: handleChange, placeholder: "What's your email?", className: "bg-tertiary py-3 px-4 text-gray-700 rounded-lg outline-none placeholder:text-gray-500 border border-gray-300 focus:border-violet-500" })] }), _jsxs("label", { htmlFor: "message", className: "flex flex-col", children: [_jsx("span", { className: "text-white font-medium mb-2", children: "Your Message:" }), _jsx("textarea", { rows: "4", name: "message", value: form.message, onChange: handleChange, placeholder: "What do you have to say?", className: "bg-tertiary py-3 px-4 text-gray-700 rounded-lg outline-none placeholder:text-gray-500 border border-gray-300 focus:border-violet-500 resize-none" })] }), _jsx("button", { type: "submit", className: "bg-violet-500 py-3 px-6 text-white font-bold rounded-lg shadow-md hover:bg-violet-600 transition duration-200", children: isloading ? "Sending..." : "Send" })] }) })] }), _jsxs("div", { className: "third h-[100vh] flex-[0_0_20%] flex flex-col items-end justify-end pb-8 gap-4", children: [_jsx("div", { className: "card inner_5 bg-bg_secondary rounded-3xl w-28 h-24 flex justify-center items-center", style: { opacity: 0, transform: "translateY(-50px)" }, children: _jsx(BadgeIndianRupee, { size: 48 }) }), _jsx("div", { className: "card inner_6 w-[100%] h-60 bg-violet_2 p-4 rounded-3xl", style: { opacity: 0, transform: "translateY(-50px)" }, children: _jsx("h2", { children: "Elevating Businesses" }) }), _jsx("div", { className: "card inner_7 w-[100%] h-60 bg-violet_2 p-4 rounded-3xl", style: { opacity: 0, transform: "translateY(-50px)" }, children: _jsx("h2", { children: "Investing in people" }) })] })] }));
}
export default Footer;
