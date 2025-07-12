import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function Results() {
    const { draftId } = useParams();
    const [picks, setPicks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [userControlledTeams, setUserControlledTeams] = useState([]);
    const[activeTab, setActiveTab] = useState("full");
    const [fullDraftView, setFullDraftView] = useState("list");
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const rounds = Array.from(new Set(picks.map(pick => pick.draft_pick.round))).sort((a, b) => a - b);
    const picksByRound = rounds.map(round => picks.filter(pick => pick.draft_pick.round === round));

    useEffect(() => {
        const fetchData = async () => {
            const [picksResponse, userControlledTeamsResponse] = await Promise.all([
                axios.get(`/api/mock_draft_picks/${draftId}`),
                axios.get(`/api/user_controlled_teams/${draftId}`)
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
        };

        fetchData();
    }, [draftId]);

    return (
        <div className="results_container">
            <header className="results_header">
                <Link to="/" class="logo_link">
                    <img src="/site/alternate_logo.png" alt="NFL Mock Draft Simulator logo" id="results_logo" />
                </Link>
                <h1>Draft Results</h1>
                <div className="export_draft_options">
                    <button className="export_draft_btn">Export as PNG</button>
                    <button className="export_draft_btn">Export as PDF</button>
                    <button className="export_draft_btn">Export as CSV</button>
                    <button className="export_draft_btn">Export as JSON</button>
                </div>
            </header>
            
            <main className="results_main">
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