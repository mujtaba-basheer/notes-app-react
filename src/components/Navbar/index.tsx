import "./Navbar.css";
import { Link } from "react-router-dom";
import { useStore } from "../../store";

type LogoutApiRespT = {
    status: "success";
} | {
    error: object;
    message: string;
    status: "fail";
    stack?: string;
};

const Navbar = () => {
    const user = useStore(store => store.user);
    const logoutUser = useStore(store => store.logoutUser);

    const logout = async () => {
        try {
            const req = await fetch("http://localhost:3000/api/auth/logout", { credentials: "include" });
            const resp: Awaited<LogoutApiRespT> = await req.json();

            if (req.status === 200 && resp.status === "success") {
                logoutUser();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return <nav className="navbar">
        <div className="heading">
            <h1>NOTES APP</h1>
        </div>
        <div className="view">
            {user ? <div className="greet">
                <p>Hello, {user.fname}</p>
                <button onClick={logout}>Logout</button>
            </div> : <button><Link to="/auth">Login/Signup</Link></button>}
        </div>
    </nav>;
};

export default Navbar;