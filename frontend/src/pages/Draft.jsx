import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

function Draft() {
    const { draftId } = useParams();
    const location = useLocation();
    const [draft, setDraft] = useState(location.state?.createdDraft || null);
    const [picks, setPicks] = useState([]);
    const [userControlledTeams, setUserControlledTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [positionFilter, setPositionFilter] = useState({value: "ALL", label: "ALL"});
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchHovered, setIsSearchHovered] = useState(false);

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

    const positionOptions = [
        {value: "ALL", label: "ALL"}, 
        {value: "QB", label: "QB"},
        {value: "RB", label: "RB"},
        {value: "WR", label: "WR"},
        {value: "TE", label: "TE"},
        {value: "OT", label: "OT"},
        {value: "IOL", label: "IOL"},
        {value: "DE", label: "DE"},
        {value: "DT", label: "DT"},
        {value: "LB", label: "LB"},
        {value: "CB", label: "CB"},
        {value: "S", label: "S"},
        {value: "K", label: "K"},
        {value: "P", label: "P"},
    ];
    const filteredPlayers = [...players].filter(player => (positionFilter.value === "ALL" || player.position === positionFilter.value) && player.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.rank - b.rank);
    const positionFilterStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: '#265653',
            borderColor: 'black',
            borderWidth: '2px',
            borderRadius: '8px',
            boxShadow:'4px 4px 0 black',
            minHeight: '36px',
            fontSize: '0.9rem',
            '&hover': {
                borderColor: 'black'
            }
        }), 
        menu: (base) => ({
            ...base,
            backgroundColor: '#264653',
            border: '2px solid black',
            borderRadius: '8px',
            boxShadow: '4px 4px 0 black',
            marginTop: '8px',
            zIndex: 10
        }), 
        menuList: (base) => ({
            ...base,
            borderRadius: '8px',
            paddingTop: 0,
            paddingBottom: 0,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#264643' : state.isFocused ? '#92AFAC' : 'white',
            color: state.isSelected ? 'white' : '#222',
            padding: '8px 12px',
            cursor: 'pointer'
        }),
        singleValue: (base) => ({
            ...base,
            color: 'white',
            fontWeight: 500
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#EDF2F4',
            '&:hover': {
                color: 'white'
            }
        }),
    };
    const positionFilterTheme = (theme) => ({
        ...theme,
        borderRadius: 8,
        colors: {
            ...theme.colors,
            primary: '#264643',
            primary25: '#92AFAC', // hover background
            neutral0: '#264653', // control background
            neutral20: 'black', // control border
            neutral80: '#EDF2F4', // control text
        },
    });

    return (
        <div className="draft_container">
            <header className="draft_header">
                <img src="/site/alternate_logo.png" alt="NFL Mock Draft Simulator logo" id="draft_logo" />
                
                <div className="draft_picks_wrapper">
                    <p id="on_the_clock">On the Clock</p>
                    <div className="draft_picks">
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
                </div>
                {/* The list will shift to the left when a pick is made to make sure that the team on the clock is the leftmost box that is visible (scrolling right will show picks in the near/distant future, scrolling left will show picks in the past that have been made with their assigned player*/}
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
                </aside>

                <section className="big_board">
                    <div className="big_board_header">
                        <div className="big_board_left">
                            <Select className="position_filter" options={positionOptions} value={positionFilter} onChange={setPositionFilter} isSearchable={false} styles={positionFilterStyles} theme={positionFilterTheme} />
                        </div>
                        <div className="big_board_center">
                            <h2>Big Board</h2>
                        </div>
                        <div className="big_board_right">
                            <input type="text" placeholder={isSearchFocused || isSearchHovered ? "Search player name" : "Search"}className="player_search_input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} onMouseEnter={() => setIsSearchHovered(true)} onMouseLeave={() => setIsSearchHovered(false)} />
                        </div>
                    </div>
                    <div className="players">
                        {filteredPlayers.map(player => (
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
                                <div className="select_player">
                                    <button className="select_player_btn">Select</button>
                                </div>
                            </div>
                        ))}
                    </div>
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