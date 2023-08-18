import "./AddNote.css";
import { Link } from "react-router-dom";

const AddNote = () => {
    return <Link to="/new" className="add-note">
        <h3>Add a note</h3>
        <p>+</p>
    </Link>;
};

export default AddNote;