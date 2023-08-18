import "./Note.css";
import { Link } from "react-router-dom";
import { useStore } from "../../../../store";

type PropT = {
    _id: string;
    title: string;
    description: string;
    index: number;
};

const Note = ({ title, description, _id, index }: PropT) => {
    const notesCount = useStore(state => state.notes.length);
    const shiftNotes = useStore(state => state.shiftNotes);

    return (<div className="note-card" key={_id}>
        <Link to={`/view/${_id}`} title="Click to open">
            <div className="note-title">
                <h2>{title}</h2>
            </div>
            <div className="note-desc">
                <p>{description}</p>
            </div>
        </Link>
        <button className="shift-btn left" disabled={index === 0} onClick={() => shiftNotes(index, "L")} title="Shift Left">&larr;</button>
        <button className="shift-btn right" disabled={index === notesCount - 1} onClick={() => shiftNotes(index, "R")} title="Shift Right">&rarr;</button>
    </div >);
};

export default Note;