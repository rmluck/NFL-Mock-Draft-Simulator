import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

function Draft() {
    const { draftId } = useParams();
    const location = useLocation();
    const [draft, setDraft] = useState(location.state?.createdDraft || null);
    const [picks, setPicks] = useState([]);
    const [userControlledTeams, setUserControlledTeams] = useState([]);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                if (!draft) {
                    const draft_result = await axios.get(`/api/mock_drafts/${draftId}`);
                    setDraft(draft_result.data);
                }
            } catch (err) {
                console.error("Failed to load draft:", err);
            }
        };
        fetchDraft();
    }, [draftId]);

    useEffect(() => {
        const fetchRest = async() => {
            try {
                if (!draft) return;

                const picks_result = await axios.get(`/api/mock_draft_picks/${draftId}`);
                setPicks(picks_result.data);

                const user_controlled_teams_result = await axios.get(`/api/user_controlled_teams/${draftId}`);
                setUserControlledTeams(user_controlled_teams_result.data.map(team => team.team_id));

                const players_result = await axios.get(`/api/players/by_year/`, { params: { year: draft.year } });
                setPlayers(players_result.data);
            } catch (err) {
                console.error("Failed to fetch additional data:", err);
            }
        };
        fetchRest();
    }, [draft]);

    if (!draft) {
        return <div>Loading draft...</div>;
    }

    const currentPickIndex = picks.findIndex(pick => !pick.player);
    const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);

    return (
        <div className="draft_container">
            <header className="draft_header">
                <img src="/site/alternate_logo.png" alt="NFL Mock Draft Simulator logo" id="draft_logo" />
                
                <div className="draft_picks">
                    <p id="on_the_clock">On the Clock</p>
                    
                    {picks.map((pick, index) => (
                        <div key={index} className={`draft_pick ${pick.player ? "picked" : index === currentPickIndex ? "on_the_clock" : "future"}`}>
                            <div className="pick_team_logo_wrapper">
                                <img src={`/logos/nfl/${pick.team.name}.png`} alt={pick.team.name} className="pick_team_logo" />
                            </div>
                            <span className="pick_team_name">{pick.team.name}</span>
                            {/* {pick.player && (
                                    <div className="pick_selected_player">{pick.player_id.name}</div>
                            )} */}
                            <div className="pick_label">
                                {userControlledTeams.includes(pick.team.id) && !pick.player && (<small className="user_controlled_team_label">User</small>)}
                                <small>
                                    {pick.draft_pick.round}.{pick.draft_pick.pick_number}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
                {/* For rest of header, include horizontally scrollable list of all upcoming draft picks as little boxes that include team assigned to draft pick with team logo, pick number and round. The list will shift to the left when a pick is made to make sure that the team on the clock is the leftmost box that is visible (scrolling right will show picks in the near/distant future, scrolling left will show picks in the past that have been made with their assigned player*/}
            </header>

            <main className="draft_main">
                <aside className="draft_tools">
                    <h2>Draft Tools</h2>
                    <button className="draft_tool">Undo Pick</button>
                    <br />
                    <button className="draft_tool">Trade Pick</button>
                    <br />
                    <button className="draft_tool"> Pause Draft</button>
                    <br />
                    <button className="draft_tool">Restart Draft</button>
                    <br />
                    <div className="draft_details">
                        <h3>Details</h3>
                        <br />
                        <p><strong>Name</strong></p>
                        <p>{draft.name}</p>
                        <br />
                        <p><strong>Year</strong></p>
                        <p>{draft.year}</p>
                        <br />
                        <p><strong>Rounds</strong></p>
                        <p>{draft.num_rounds}</p>
                        <br />
                    </div>
                    {/* Include buttons for Undo Pick, Trade Pick, Pause Draft, Restart Draft, etc. */}
                </aside>

                <section className="big_board">
                    <div className="big_board_header">
                        <h2>Big Board</h2>
                    </div>
                    <div className="players">
                        {sortedPlayers.map(player => (
                            <div key={player.id} className="player">
                                <div className="player_college_logo_wrapper">
                                    <img src={`/logos/college/${player.college.replaceAll(" ", "_")}.png`} alt={player.college} className="player_college_logo" />
                                </div>
                                <div className="player_details">
                                    <span className="player_name">{player.name}</span>
                                    <span className="player_background">{player.position} - {player.college}</span>
                                </div>
                                <div className="player_rank">
                                    <small>{player.rank}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Include vertically scrollable list of all players available in individual boxes, each with college logo, player name, position, college name, and button to pick player with current pick */}
                    {/* Also have filter and search buttons at top of section */}
                </section>

                <aside className="team_profile">
                    <h2>Team Profile</h2>
                    {/* Include box that has all the information about the team that is currently on the clock, including their positional needs and collection of picks in the draft (the picks that have been made already will have the player assigned to it, the picks that haven't been made will not) */}
                </aside>
            </main>
        </div>
    );
}

export default Draft;