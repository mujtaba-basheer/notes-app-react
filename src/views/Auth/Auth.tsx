import "./Auth.css";
import { useState } from "react";

import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const Auth = () => {
    const [view, setView] = useState<"login" | "signup">("login");

    return <div className="auth-container">
        <div className="auth-content">
            {view === "signup" ? <SignupForm switchView={() => setView("login")} /> : <LoginForm switchView={() => setView("signup")} />}
        </div>
    </div>;
};

export default Auth;