import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
const Features = () => {
    useEffect(() => {
        const cards = document.querySelectorAll(".card");
        const stackArea = document.querySelector(".stack_area");
        const rotateCards = () => {
            let angle = 0;
            cards.forEach((card, index) => {
                if (card.classList.contains("away")) {
                    card.style.transform = `translateY(-120vh) rotate(-48deg)`;
                } else {
                    card.style.transform = `rotate(${angle}deg)`;
                    angle -= 10;
                    card.style.zIndex = (cards.length - index).toString();
                }
            });
        };
        const handleScroll = () => {
            if (!stackArea) return;
            const distance = window.innerHeight / 2; // Center of the viewport
            const topVal = stackArea.getBoundingClientRect().top; // Top of the stack area
            const threshold = -1; // Threshold to delay the first card's disappearance
            const index = Math.floor(
                -1 * ((topVal - distance) / distance) + threshold
            );
            cards.forEach((card, i) => {
                if (i < index) {
                    card.classList.add("away"); // Move cards away
                } else {
                    card.classList.remove("away"); // Bring cards back
                }
            });
            rotateCards(); // Reapply rotations after scroll
        };
        // Initial setup to apply rotations
        rotateCards();
        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return _jsxs("div", {
        className: "stack_area flex w-full h-[360vh]",
        children: [
            _jsx("div", {
                className:
                    "left bg-purple-image sticky top-0 flex-[0_0_50%] h-[100vh] flex justify-center items-start text-6xl pt-40 pl-20 rounded-tr-3xl rounded-br-3xl",
                style: { opacity: 0.8 },
                children: _jsx("h1", {
                    className: "top-1/2 text-white",
                    children: "Because People Make Businesses",
                }),
            }),
            _jsxs("div", {
                className:
                    "right bg-white h-screen sticky top-0 flex-[0_0_50%] relative",
                children: [
                    _jsx("div", {
                        className:
                            "card flex justify-center items-center text-2xl card-4 bg-violet_1 text-white font-semibold w-[360px] h-[360px] rounded-[32px] absolute top-[calc(50%-180px)] left-[calc(50%-180px)] transition-transform ease-in-out duration-500",
                        children: _jsx("h3", {
                            children: "Sales Analysis & Reports",
                        }),
                    }),
                    _jsx("div", {
                        className:
                            "card flex justify-center items-center text-2xl card-1 bg-violet_2 text-white font-semibold w-[360px] h-[360px] rounded-[32px] absolute top-[calc(50%-180px)] left-[calc(50%-180px)] transition-transform ease-in-out duration-500",
                        children: _jsx("h3", {
                            children: "Salesperson Training",
                        }),
                    }),
                    _jsx("div", {
                        className:
                            "card flex justify-center items-center text-2xl card-2 bg-violet_3 text-white font-semibold w-[360px] h-[360px] rounded-[32px] absolute top-[calc(50%-180px)] left-[calc(50%-180px)] transition-transform ease-in-out duration-500",
                        children: _jsx("h3", {
                            children: "AI Call Attenders",
                        }),
                    }),
                    _jsx("div", {
                        className:
                            "card flex justify-center items-center text-2xl card-4 bg-violet_4 text-white font-semibold w-[360px] h-[360px] rounded-[32px] absolute top-[calc(50%-180px)] left-[calc(50%-180px)] transition-transform ease-in-out duration-500",
                        children: _jsx("h3", {
                            children: "Microlearning Platform",
                        }),
                    }),
                ],
            }),
        ],
    });
};
export default Features;
