import "./Form.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store";

type LoginApiRespT = {
    data: {
        user: {
            _id: string;
            fname: string;
        };
    };
    status: "success";
    token: string;
} | {
    error: object;
    message: string;
    status: "fail";
    stack?: string;
};
type PropsT = {
    switchView: () => void;
};

const LoginForm = ({ switchView }: PropsT) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const setUser = useStore(state => state.setUser);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
        try {
            ev.preventDefault();
            const formData = { email, password };

            const req = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            const resp: Awaited<LoginApiRespT> = await req.json();
            if (req.status !== 200 && resp.status === "fail") {
                throw new Error(resp.message);
            } else if (resp.status === "success") {
                const { data: { user: { _id, fname } }, token } = resp;
                const user = { _id, fname, token };
                setUser(user);
                navigate("/");
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        }
    };

    return <form id="login-form" className="form" onSubmit={onSubmit}>
        <div className="field">
            <input name="email" placeholder="test@example.com" type="email" value={email} onChange={(ev) => { setError(""); setEmail(ev.target.value); }} required />
        </div>
        <div className="field">
            <input name="password" minLength={8} placeholder="Password" type="password" value={password} onChange={(ev) => { setError(""); setPassword(ev.target.value); }} required />
        </div>
        <p className="error">{error}</p>
        <div className="submit">
            <input value={"Login"} type="submit" />
        </div>
        <div className="switch">
            <p>Don't have an account? <button type="button" onClick={switchView}>Signup</button></p>
        </div>
    </form>;
};

export default LoginForm;