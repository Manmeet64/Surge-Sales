import React, { Suspense } from "react";
import Landing from "./Landing";
import Features from "./Features";

const Footer = React.lazy(() => import("./Footer"));

const Home: React.FC = () => {
    return (
        <section>
            <Landing />
            <Features />
            <Suspense fallback={<div>Loading Footer...</div>}>
                <Footer />
            </Suspense>
        </section>
    );
};

export default Home;