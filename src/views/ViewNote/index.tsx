import "./ViewNote.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
type DeleteNoteApiRespT = {
    status: "success";
    message: string;
} | {
    status: "error";
    message: string;
    error: object;
    stack?: string;
};
type ReorderNoteApiRespT = {
    status: "success";
} | {
    status: "error";
    message: string;
    error: object;
    stack?: string;
};

const ViewNote = () => {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const user = useStore(state => state.user);
    if (!user || !noteId) { navigate("/auth"); }

    const [note, setNote] = useState<NoteT>({
        title: "", description: "", _id: ""
    });

    const fetchNote = useCallback(async () => {
        try {
            const req = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
                credentials: "include"
            });
            const resp: Awaited<NoteApiRespT> = await req.json();

            if (resp.status === "success") {
                setNote(resp.data);
            } else {
                throw new Error(resp.message);
            }
        } catch (error) {
            console.error(error);
        }
    }, [noteId]);

    const deleteCachedNote = useStore(state => state.deleteNote);
    const cachedNotes = useStore(state => state.notes);
    const deleteNote = async () => {
        try {
            const delReq = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
                credentials: "include",
                method: "DELETE"
            });
            const delResp: Awaited<DeleteNoteApiRespT> = await delReq.json();

            if (delResp.status === "success") {
                if (noteId) deleteCachedNote(noteId);

                // Reordering Notes
                const reorderReq = await fetch("http://localhost:3000/api/notes/reorder", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(cachedNotes)
                });
                const reorderResp: Awaited<ReorderNoteApiRespT> = await reorderReq.json();
                if (reorderResp.status === "success") {
                    alert(delResp.message);
                    navigate(-1);
                } else {
                    throw new Error(reorderResp.message);
                }
            } else {
                throw new Error(delResp.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error deleteing note!");
        }
    };

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    return (<div className="page" >
        <div className="content">
            <div className="field">
                <h2>{note.title}</h2>
            </div>
            <div className="field">
                <p>{note.description}</p>
            </div>
            <div className="buttons-wrapper">
                <Link className="edit" to={`/edit/${noteId}`}>Edit</Link>
                <button className="delete" onClick={() => {
                    if (confirm("Delete note?")) deleteNote();
                }}>Delete</button>
                <Link to="/">Close</Link>
            </div>
        </div>
    </div >);
};

export default ViewNote;