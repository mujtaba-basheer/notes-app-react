import "./New.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../../store";

type AddNoteApiRespT = {
    status: "success";
    message: string;
} | {
    error: object;
    message: string;
    status: "error";
    stack?: string;
};
type FormDataT = {
    title: string;
    description: string;
    sl_no: number;
};

const New = () => {
    const navigate = useNavigate();
    const user = useStore(state => state.user);
    if (!user) navigate("/auth");

    const notesCount = useStore(state => state.notes.length);
    const [formData, setFormData] = useState<FormDataT>({
        title: "",
        description: "",
        sl_no: notesCount
    });
    const [error, setError] = useState("");

    const onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (ev) => {
        setError("");
        const { name, value } = ev.target;
        setFormData({ ...formData, [name]: value });
    };
    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
        try {
            ev.preventDefault();

            const req = await fetch("http://localhost:3000/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });
            const resp: Awaited<AddNoteApiRespT> = await req.json();

            if (req.status === 201 && resp.status !== "success") {
                throw new Error(resp.message);
            }

            alert(resp.message);
            navigate("/");
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        }
    };

    return (<div className="page">
        <div className="content">
            <form id="note-add-form" onSubmit={onSubmit}>
                <div className="field">
                    <label>Title*</label>
                    <input value={formData.title} onChange={onChange} name="title" type="text" required />
                </div>
                <div className="field">
                    <label>Description*</label>
                    <textarea rows={8} value={formData.description} onChange={onChange} name="description" required />
                </div>
                <p className="error">{error}</p>
                <div className="buttons-wrapper">
                    <button>Submit</button>
                    <Link to="/">Cancel</Link>
                </div>
            </form>
        </div>
    </div>);
};

export default New;