import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";

function Results() {
    const { draftId } = useParams();
    const [draft, setDraft] = useState(null);
    const [picks, setPicks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [userControlledTeams, setUserControlledTeams] = useState([]);
    const[activeTab, setActiveTab] = useState("full");
    const [fullDraftView, setFullDraftView] = useState("list");
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const resultsRef = useRef(null);
    const rounds = Array.from(new Set(picks.map(pick => pick.draft_pick.round))).sort((a, b) => a - b);
    const picksByRound = rounds.map(round => picks.filter(pick => pick.draft_pick.round === round));
    const navigate = useNavigate();

    const handleNewDraft = () => {
        navigate("/");
    };

    const exportToCSV = () => {
        const exportPicks = activeTab === "full" ? picks : picks.filter(pick => pick.team.id === activeTab);
        const csvRows = [["Round", "Pick", "Team", "Player", "Position", "College", "Rank"]];

        exportPicks.forEach(pick => {
            csvRows.push([
                pick.draft_pick.round,
                pick.draft_pick.pick_number,
                pick.team.name,
                pick.player.name,
                pick.player.position,
                pick.player.college,
                pick.player.rank
            ]);
        });

        const csvContent = csvRows.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);

        const filename = `${draft?.name?.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") || "draft"}_results${activeTab === "full" ? "" : `_${teams.find(team => team.team.id === activeTab).team.name.toLowerCase().replace(/\s+/g, "_")}`}.csv`;

        link.setAttribute("download", filename);
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportToJSON = () => {
        const exportPicks = activeTab === "full" ? picks : picks.filter(pick => pick.team.id === activeTab);

        const simplifiedData = exportPicks.map(pick => ({
            round: pick.draft_pick.round,
            pick: pick.draft_pick.pick_number,
            team: pick.team.name,
            player: pick.player.name,
            position: pick.player.position,
            college: pick.player.college,
            rank: pick.player.rank
        }));

        const jsonString = JSON.stringify(simplifiedData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);

        const filename = `${draft?.name?.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") || "draft"}_results${activeTab === "full" ? "" : `_${teams.find(team => team.team.id === activeTab).team.name.toLowerCase().replace(/\s+/g, "_")}`}.json`;

        link.setAttribute("download", filename);
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportToPNG = () => {
        if (!resultsRef.current) {
            alert("Nothing to export.");
            return;
        }

        html2canvas(resultsRef.current, { scale: 2 }).then(canvas => {
            canvas.toBlob(blob => {
                if (!blob) {
                    alert("Failed to generate image.");
                    return;
                }
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);

                const filename = `${draft?.name?.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") || "draft"}_results${activeTab === "full" ? "" : `_${teams.find(team => team.team.id === activeTab).team.name.toLowerCase().replace(/\s+/g, "_")}`}.png`;

                link.setAttribute("download", filename);
                link.click();
                URL.revokeObjectURL(url);
            }, "image/png");
        }).catch(err => {
            console.error("html2canvas error: ", err);
            alert("Failed to generate image. Please try again.");
        });
    };

    const handleShareLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            const toast = document.getElementById("share_toast");
            toast.classList.remove("hidden");
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.classList.add("hidden"), 300);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy link to clipboard: ", err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const [picksResponse, userControlledTeamsResponse, draftResponse] = await Promise.all([
                axios.get(`/api/mock_draft_picks/${draftId}`),
                axios.get(`/api/user_controlled_teams/${draftId}`),
                axios.get(`/api/mock_drafts/${draftId}`)
            ]);

            const picks = picksResponse.data.sort((a, b) => {
                if (a.draft_pick.round !== b.draft_pick.round) {
                    return a.draft_pick.round - b.draft_pick.round;
                }
                return a.draft_pick.pick_number - b.draft_pick.pick_number;
            });
            const userControlledTeams = userControlledTeamsResponse.data.map(team => team.team_id);
            const teamsMap = {};

            picks.forEach(pick => {
                const teamId = pick.team.id;
                if (!userControlledTeams.includes(teamId)) return;
                
                if (!teamsMap[teamId]) {
                    teamsMap[teamId] = {
                        team: pick.team,
                        picks: []
                    };
                }
                teamsMap[teamId].picks.push(pick);
            });

            setPicks(picksResponse.data);
            setTeams(Object.values(teamsMap));
            setUserControlledTeams(userControlledTeams);
            setDraft(draftResponse.data);
        };

        fetchData();
    }, [draftId]);

    return (
        <div className="results_container">
            <header className="results_header">
                <Link to="/" className="logo_link">
                    <img src="/site/alternate_logo.png" alt="NFL Mock Draft Simulator logo" className="results_logo" />
                </Link>
                <h1>Draft Results</h1>
                <div id="share_toast" className="share_toast hidden">Link copied to clipboard!</div>
                <button className="share_btn_wrapper" onClick={handleShareLink}>
                    <img src="/site/share.svg" alt="Share" className="share_btn" />
                </button>
                <div className="results_draft_buttons">
                    <button className="results_draft_btn" onClick={handleNewDraft}>New Draft</button>
                    <button className="results_draft_btn" onClick={exportToPNG}>Export as PNG</button>
                    {/* <button className="export_draft_btn">Export as PDF</button> */}
                    <button className="results_draft_btn" onClick={exportToCSV}>Export as CSV</button>
                    <button className="results_draft_btn" onClick={exportToJSON}>Export as JSON</button>
                </div>
            </header>
            
            <main className="results_main" ref={resultsRef}>
                <section className="results">
                    <div className="results_tabs">
                        <div className={`tab ${activeTab === "full" ? "active" : ""}`} onClick={() => setActiveTab("full")}>FULL DRAFT</div>
                        {teams.map(({ team }) => (
                            <div key={team.id} className={`tab ${activeTab === team.id ? "active" : ""}`} onClick={() => setActiveTab(team.id)}>{team.name}</div>
                        ))}
                    </div>
                    <div className={activeTab === "full" && fullDraftView === "grid" ? "results_grid" : "results_list"}>
                        {activeTab === "full" && fullDraftView === "list" && (() => {
                            let currentRound = null;

                            return picks.map((pick, index) => {
                                const roundChanged = pick.draft_pick.round !== currentRound;
                                currentRound = pick.draft_pick.round;

                                return (
                                    <React.Fragment key={pick.id}>
                                        {roundChanged && (
                                            <div className="round_divider">Round {pick.draft_pick.round}</div>
                                        )}

                                        <div className="results_pick">
                                            <div className="results_pick_logo_wrapper">
                                                <img src={`/logos/nfl/${pick.team.name}.png`} alt={pick.team.name} className="results_pick_logo" />
                                            </div>
                                            <div className="results_pick_details">
                                                <span className="results_pick_number">{pick.draft_pick.round}.{pick.draft_pick.pick_number}</span>
                                                <span className="results_player_name">{pick.player.name}</span>
                                                <span className="results_player_background">{pick.player.college}</span>
                                            </div>
                                            <div className="results_player_position">{pick.player.position}</div>
                                            <div className="results_pick_rank">
                                                <small>{pick.player.rank}</small>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            });
                        })()}

                        {activeTab === "full" && fullDraftView === "grid" && (() => {
                            return picksByRound[currentRoundIndex].map(pick => (
                                <div key={pick.id} className="results_pick grid">
                                    <div className="results_pick_logo_wrapper grid">
                                        <img src={`/logos/nfl/${pick.team.name}.png`} alt={pick.team.name} className="results_pick_logo grid" />
                                    </div>
                                    <div className="results_pick_details grid">
                                        <div className="results_pick_text_wrapper grid">
                                            <span className="results_player_name grid">{pick.player.name}</span>
                                            <span className="results_player_background grid">{pick.player.college}</span>
                                        </div>
                                    </div>
                                    <div className="results_player_position grid">{pick.player.position}</div>
                                    <div className="results_pick_number grid">
                                        <small>{pick.draft_pick.pick_number}</small>
                                    </div>
                                </div>
                            ));
                        })()}

                        {activeTab !== "full" && (() => {
                            const team = teams.find(team => team.team.id === activeTab);
                            if (!team) return null;

                            return team.picks.map(pick => (
                                <div key={pick.id} className="results_pick">
                                    <div className="results_pick_logo_wrapper">
                                        <img src={`/logos/college/${pick.player.college.replaceAll(" ", "_")}.png`} alt={pick.player.college} className="results_pick_logo" />
                                    </div>
                                    <div className="results_pick_details">
                                        <span className="results_pick_number">{pick.draft_pick.round}.{pick.draft_pick.pick_number}</span>
                                        <span className="results_player_name">{pick.player.name}</span>
                                        <span className="results_player_background">{pick.player.college}</span>
                                    </div>
                                    <div className="results_player_position">{pick.player.position}</div>
                                    <div className="results_pick_rank">
                                        <small>{pick.player.rank}</small>
                                    </div>
                                </div>
                            ));
                        })()}

                        {/* {(() => {
                            let currentRound = null;

                            return (activeTab === "full" ? picks : teams.find(team => team.team.id === activeTab)?.picks || []).map((pick, index) => {
                                const roundChanged = pick.draft_pick.round !== currentRound;
                                currentRound = pick.draft_pick.round;

                                return (
                                    <React.Fragment key={pick.id}>
                                        {roundChanged && (
                                            <div className="round_divider">Round {pick.draft_pick.round}</div>
                                        )}

                                        <div className="results_pick">
                                            <div className="results_pick_logo_wrapper">
                                                <img src={activeTab === "full" ? `/logos/nfl/${pick.team.name}.png` : `/logos/college/${pick.player.college.replaceAll(" ", "_")}.png`} alt={activeTab === "full" ? pick.team.name : pick.player.college} className="results_pick_logo" />
                                            </div>
                                            <div className="results_pick_details">
                                                <span className="results_pick_number">{pick.draft_pick.round}.{pick.draft_pick.pick_number}</span>
                                                <span className="results_player_name">{pick.player.name}</span>
                                                <span className="results_player_background">{pick.player.college}</span>
                                            </div>
                                            <div className="results_player_position">{pick.player.position}</div>
                                            <div className="results_pick_rank">
                                                <small>{pick.player.rank}</small>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            });
                        })()} */}
                    </div>
                    <div className="view_controls_wrapper">
                        {activeTab === "full" && fullDraftView === "grid" && (
                            <div className="round_nav">
                                <button className="round_arrow" onClick={() => setCurrentRoundIndex((prev) => Math.max(prev - 1, 0))} disabled={currentRoundIndex === 0}>◀</button>
                                <span className="round_label">Round {rounds[currentRoundIndex]}</span>
                                <button className="round_arrow" onClick={() => setCurrentRoundIndex((prev) => Math.min(prev + 1, rounds.length - 1))} disabled={currentRoundIndex === rounds.length - 1}>▶</button>
                            </div>
                        )}
                        {activeTab === "full" && (
                            <div className="view_toggle">
                                <button className={`switch_option list ${fullDraftView === "list" ? "active" : ""}`} onClick={() => setFullDraftView("list")}>List</button>
                                <button className={`switch_option grid ${fullDraftView === "grid" ? "active" : ""}`} onClick ={() => setFullDraftView("grid")}>Grid</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Results;