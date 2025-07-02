import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

function Draft() {
    const { draftId } = useParams();
    const location = useLocation();
    const [draft, setDraft] = useState(location.state?.createdDraft || null);

    useEffect(() => {
        const fetchDraft = async () => {
            if (!draft) {
                try {
                    const response = await axios.get(`/api/mock_drafts/${draftId}`);
                    setDraft(response.data);
                } catch (err) {
                    console.error("Failed to load draft:", err);
                }
            }
        };
        fetchDraft();
    }, [draftId, draft]);

    if (!draft) {
        return <div>Loading draft...</div>;
    }

    return (
        <div>
            <h1>Mock Draft ID: {draft.id}</h1>
        </div>
    );
}

export default Draft;