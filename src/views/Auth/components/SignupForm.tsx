import "./Form.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store";

type SignupApiRespT = {
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
type FormDataT = {
    fname: string;
    lname: string;
    email: string;
    password: string;
    passwordConfirm: string;
};
type PropsT = {
    switchView: () => void;
};

const SignupForm = ({ switchView }: PropsT) => {
    const [formData, setFormData] = useState<FormDataT>({
        fname: "",
        lname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        setError("");
        const { name, value } = ev.target;
        setFormData({ ...formData, [name]: value });
    };
    const setUser = useStore(state => state.setUser);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
        try {
            ev.preventDefault();

            const req = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            const resp: Awaited<SignupApiRespT> = await req.json();
            if (req.status !== 200 && req.status !== 201 && resp.status !== "success") {
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
            <input name="fname" value={formData.fname} onChange={onChange} minLength={3} placeholder="John" type="text" required />
        </div>
        <div className="field">
            <input name="lname" value={formData.lname} onChange={onChange} placeholder="Doe" type="text" />
        </div>
        <div className="field">
            <input name="email" value={formData.email} onChange={onChange} placeholder="test@example.com" type="email" required />
        </div>
        <div className="field">
            <input name="password" value={formData.password} onChange={onChange} minLength={8} placeholder="Password" type="password" required />
        </div>
        <div className="field">
            <input name="passwordConfirm" value={formData.passwordConfirm} onChange={onChange} minLength={8} placeholder="Confirm Password" type="password" required />
        </div>
        <p className="error">{error}</p>
        <div className="submit">
            <input value={"Signup"} type="submit" />
        </div>
        <div className="switch">
            <p>Already have an account? <button type="button" onClick={switchView}>Login</button></p>
        </div>
    </form>;
};

export default SignupForm;