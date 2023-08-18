import "./EditNote.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { useStore } from "../../store";

type NoteT = {
    title: string;
    description: string;
    _id: string;
};
type NoteApiRespT = {
    status: "success",
    data: NoteT;
} | {
    status: "error",
    message: string;
    error: object;
    stack?: string;
};
type EditNoteApiRespT = {
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
};

const EditNote = () => {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const user = useStore(state => state.user);
    if (!user || !noteId) navigate("/auth");

    const [formData, setFormData] = useState<FormDataT>({
        title: "",
        description: ""
    });
    const [error, setError] = useState("");

    const fetchNote = useCallback(async () => {
        try {
            const req = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
                credentials: "include"
            });
            const resp: Awaited<NoteApiRespT> = await req.json();

            if (resp.status === "success") {
                const { title, description } = resp.data;
                setFormData({
                    title, description
                });
            } else {
                throw new Error(resp.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error fetching note!");
            navigate(-1);
        }
    }, [noteId, navigate]);

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    const onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (ev) => {
        setError("");
        const { name, value } = ev.target;
        setFormData({ ...formData, [name]: value });
    };
    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
        try {
            ev.preventDefault();

            const req = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });
            const resp: Awaited<EditNoteApiRespT> = await req.json();

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

export default EditNote;