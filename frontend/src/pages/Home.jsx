import React, { useState } from "react";
import axios from "axios";

function Home() {
    const [name, setName] = useState("");
    const [num_rounds, set_num_rounds] = useState(1);
    const [loading, set_loading] = useState(false);
    const [draft, set_draft] = useState(null);
    const [error, set_error] = useState("");

    const handle_start_draft = async () => {
        set_loading(true);
        set_error("");

        try {
            const result = await axios.post("http://localhost:8000/mock_drafts", {
                name: name || "Mock Draft",
                num_rounds: num_rounds
            });
            set_draft(result.data);
        } catch (err) {
            set_error("Failed to create mock draft.");
        } finally {
            set_loading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Welcome to the NFL Mock Draft Simulator</h1>

            <label>
                Draft Name: 
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mock Draft" />
            </label>
            <br />

            <label>
                Number of Rounds:
                <input type="number" value={num_rounds} onChange={(e) => set_num_rounds(parseInt(e.target.value))} min={1} max={7} />
            </label>
            <br />

            <button onClick={handle_start_draft} disabled={loading}>
                {loading ? "Creating..." : "Start Draft"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {draft && <p>Draft created! ID: {draft.id}, Name: {draft.name}</p>}
        </div>
    );
}

export default Home;