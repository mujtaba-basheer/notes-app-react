import "./Home.css";
import { useStore } from "../../store";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import Loader from "../../components/Loader";
import Note from "./components/Note";
import AddNote from "./components/AddNote";

type NoteT = {
    title: string;
    description: string;
    priority: number;
    _id: string;
};
type NotesApiRespT = {
    status: "success",
    data: NoteT[];
} | {
    status: "error",
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

const Home = () => {
    // const [notes, setNotes] = useState<NoteT[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const setNotesCache = useStore(state => state.setNotes);
    const notes = useStore(state => state.notes);

    const fetchNotes = useCallback(async () => {
        try {
            const req = await fetch("http://localhost:3000/api/notes", {
                credentials: "include"
            });
            const resp: Awaited<NotesApiRespT> = await req.json();

            if (resp.status === "success") {
                // setNotes(resp.data);
                setNotesCache(resp.data);
                setLoading(false);
            } else {
                throw new Error(resp.message);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [setNotesCache]);

    const reorderNotes = useCallback(async () => {
        try {
            const reorderReq = await fetch("http://localhost:3000/api/notes/reorder", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(notes.map(n => ({ _id: n._id, priority: n.priority })))
            });
            const reorderResp: Awaited<ReorderNoteApiRespT> = await reorderReq.json();
            if (reorderResp.status !== "success") {
                throw new Error(reorderResp.message);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        }
    }, [notes]);

    useEffect(() => { fetchNotes(); }, [fetchNotes]);
    useEffect(() => {
        if (!loading) {
            reorderNotes();
        }
    }, [notes, reorderNotes, loading]);
    const user = useStore(state => state.user);

    if (!user) navigate("/auth");
    return (loading ? <Loader /> : <div className="home">
        {notes.length ? <div className="notes-container">
            {notes.map((note, index) => <Note key={note._id} index={index} {...note} />)}
            <AddNote />
        </div> : <div className="empty">
            <p>No notes to display. <Link to={"/new"}>Add a note.</Link></p>
        </div>
        }
    </div>);
};

export default Home;