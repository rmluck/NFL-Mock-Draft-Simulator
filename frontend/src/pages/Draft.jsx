import React from "react";
import { useState, useEffect, useRef } from "react";
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
    const [isSelecting, setIsSelecting] = useState(false);
    const pickRefs = useRef({});
    const onTheClockRef = useRef(null);
    const currentPickIndex = picks.findIndex(pick => !pick.player);
    const currentPick = currentPickIndex !== -1 ? picks[currentPickIndex] : null;
    const currentTeam = currentPick ? currentPick.team : null;
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
    ];

    const filteredPlayers = [...players].filter(player => (positionFilter.value === "ALL" || player.position === positionFilter.value) && player.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.rank - b.rank);
    
    const teamPositionalNeeds = currentTeam ? Object.entries(currentTeam).filter(([key, value]) => key !== "name" && key !== "id") : [];

    const teamPicks = currentTeam ? picks.filter(pick => pick.team.id === currentTeam.id) : [];

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
                const sortedPicks = picks_result.data.sort((a, b) => {
                    return a.draft_pick.pick_number - b.draft_pick.pick_number;
                });
                setPicks(sortedPicks);

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

    useEffect(() => {
        if (!picks.length) {
            return;
        }

        const currentPickIndex = picks.findIndex(pick => !pick.player);
        if (currentPickIndex === -1) {
            return;
        }

        const currentPick = picks[currentPickIndex];;

        if (userControlledTeams.includes(currentPick.team.id)) {
            return;
        }

        const timer = setTimeout(() => {
            handleAutoSelectPlayer(currentPick, filteredPlayers);
        }, 1000);

        return () => clearTimeout(timer);
    }, [picks, userControlledTeams, filteredPlayers]);

    useEffect(() => {
        const nextPickIndex = picks.findIndex(p => !p.player);
        if (nextPickIndex !== -1 && onTheClockRef.current) {
            const pickElement = onTheClockRef.current;
            const container = document.querySelector(".draft_picks");

            if (pickElement && container) {
                const containerRect = container.getBoundingClientRect();
                const pickRect = pickElement.getBoundingClientRect();
                const scrollOffset = pickRect.left - containerRect.left + 2;

                container.scrollBy({
                    left: scrollOffset,
                    behavior: "smooth"
                });
            }
        }
    }, [picks]);

    if (!draft) {
        return <div>Loading draft...</div>;
    }

    const handleSelectPlayer = async (selectedPlayer) => {
        if (isSelecting) {
            return;
        } else if (!currentPick) {
            alert("No pick is currently on the clock.");
            return;
        } else if (!userControlledTeams.includes(currentPick.team.id)) {
            alert("You do not control this team.");
            return;
        }
        setIsSelecting(true);

        try {
            await axios.put(`/api/mock_draft_picks/${currentPick.id}`, {
                player_id: selectedPlayer.id
            });

            const updatedPick = {...currentPick, player: selectedPlayer};
            setPicks(prevPicks => prevPicks.map(pick => pick.id === updatedPick.id ? updatedPick : pick));
            setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== selectedPlayer.id));
        } catch (err) {
            console.error("Failed to select player: ", err);
            alert("An error occurred while selecting the player. Please try again.");
        }
        
        setIsSelecting(false);
    }

    const handleAutoSelectPlayer = async (pick, availablePlayers) => {
        if (!pick) {
            alert("No pick is currently on the clock.");
            return;
        } else if (availablePlayers.length === 0) {
            alert("No players available to auto-select.");
            return;
        }

        const bestPlayerAvailable = availablePlayers[0];
        try {
            await axios.put(`/api/mock_draft_picks/${pick.id}`, {
                player_id: bestPlayerAvailable.id,
            });

            const updatedPick = {...pick, player: bestPlayerAvailable};
            setPicks(prevPicks => prevPicks.map(p => p.id === updatedPick.id ? updatedPick : p));
            setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== bestPlayerAvailable.id));
        } catch (err) {
            console.error("Failed to auto-select player: ", err);
            alert("An error occurred while auto-selecting the player. Please try again.");
        }
    }

    const getPositionUrgencyColor = (value) => {
        if (value >= 10) return '#9E1111';
        if (value === 9) return '#BA2626';
        if (value === 8) return '#C55555';
        if (value === 7) return '#E57373';
        if (value === 6) return '#F28B82';
        if (value === 5) return '#FAA199';
        if (value === 4) return '#A4CEAA';
        if (value === 3) return '#86C48F';
        if (value === 2) return '#58A263';
        if (value === 1) return '#3D8F40';
        return 'A5D6A7';
    };

    const positionFilterStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused || state.menuIsOpen ? '#264653' : '#68CABE',
            borderColor: 'black',
            borderWidth: '2px',
            borderRadius: '8px',
            boxShadow:'4px 4px 0 black',
            minHeight: '36px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#264653',
            },
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
            fontWeight: state.isSelected ? 700 : state.isFocused ? 500 : 400,
            backgroundColor: state.isSelected ? '#264643' : state.isFocused ? '#92AFAC' : 'white',
            color: state.isSelected ? 'white' : '#222',
            padding: '8px 12px',
            cursor: 'pointer'
        }),
        singleValue: (base, state) => ({
            ...base,
            color: state.isFocused || state.menuIsOpen ? 'white' : 'black',
            fontWeight: 700,
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused || state.menuIsOpen ? 'white' : 'black',
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
                    <div className="draft_picks">
                        {picks.map((pick, index) => {
                            if (index === currentPickIndex) {
                                return (
                                    <React.Fragment key={pick.id + "-with-header"}>
                                        <p ref={onTheClockRef} className="on_the_clock_header">On the<br />Clock</p>
                                        <div ref={el => pickRefs.current[pick.id] = el} className={`draft_pick on_the_clock`}>
                                            <div className="pick_team_logo_wrapper">
                                                <img src={`/logos/nfl/${pick.team.name}.png`} alt={pick.team.name} className="pick_team_logo" />
                                            </div>
                                            <div className="pick_text_wrapper">
                                                <div className="pick_team_name">{pick.team.name}</div>
                                            </div>
                                            <div className="pick_label">
                                                {userControlledTeams.includes(pick.team.id) && !pick.player && (<small className="user_controlled_team_label">User</small>)}
                                                <small>
                                                    {pick.draft_pick.round}.{pick.draft_pick.pick_number}
                                                </small>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            }
                            return (
                                <div key={pick.id} ref={el => pickRefs.current[pick.id] = el} className={`draft_pick ${pick.player ? "picked" : "future"}`}>
                                    <div className="pick_team_logo_wrapper">
                                        <img src={`/logos/nfl/${pick.team.name}.png`} alt={pick.team.name} className="pick_team_logo" />
                                    </div>
                                    <div className="pick_text_wrapper">
                                        <div className={`pick_team_name ${pick.player ? 'picked' : ''}`}>
                                            {pick.team.name}
                                        </div>
                                        {pick.player && (
                                            <div className="pick_selected_player">{pick.player.name}</div>
                                        )}
                                    </div>
                                    <div className="pick_label">
                                        {userControlledTeams.includes(pick.team.id) && !pick.player && (<small className="user_controlled_team_label">User</small>)}
                                        <small>
                                            {pick.draft_pick.round}.{pick.draft_pick.pick_number}
                                        </small>
                                    </div>
                                </div>
                            );
                        })}
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
                            <Select className="position_filter" classNamePrefix="select" options={positionOptions} value={positionFilter} onChange={setPositionFilter} isSearchable={false} styles={positionFilterStyles} theme={positionFilterTheme} />
                            {/* Add multi-select for position filter */}
                        </div>
                        <div className="big_board_center">
                            <h2>Big Board</h2>
                        </div>
                        <div className="big_board_right">
                            <input type="text" placeholder={isSearchFocused || isSearchHovered ? "Search players by name" : "Search"}className="player_search_input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} onMouseEnter={() => setIsSearchHovered(true)} onMouseLeave={() => setIsSearchHovered(false)} />
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
                                    <button className="select_player_btn" onClick={() => handleSelectPlayer(player)} disabled={isSelecting}>{justSelectedId === player.id ? "✓ Selected!" : "Select"}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="team_profile">
                    {currentTeam ? (
                        <div className="team">
                            <div className="team_profile_header">
                                <div className="team_profile_logo_wrapper">
                                    <img src={`/logos/nfl/${currentTeam.name}.png`} alt={currentTeam.name} className="team_profile_logo" />
                                </div>
                                <h2 className="team_name">{currentTeam.name}</h2>
                            </div>
                            <div className="team_positional_needs_grid">
                                <h3 className="team_positional_needs_header">
                                    Positional Needs
                                    <span className="positional_needs_info_icon" tabIndex="0">ⓘ
                                        <span className="positional_needs_tooltip_text">
                                            Each position is scored from 1 (low need) to 10 (high need). Color-coded by urgency from dark green (1) to dark red (10), with lighter shades in between. Based on team-specific roster evaluations.
                                        </span>
                                    </span>
                                </h3>
                                <div className="positional_needs_row offensive_need">
                                    {teamPositionalNeeds.slice(0, 6).map(([position, value]) => (
                                        <div key={position} className="position_box" style={{ backgroundColor: getPositionUrgencyColor(value) }}>
                                            <span className="position_label">{position.toUpperCase()}</span>
                                            <span className="position_value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="positional_needs_row defensive_need">
                                    {teamPositionalNeeds.slice(6).map(([position, value]) => (
                                        <div key={position} className="position_box" style={{ backgroundColor: getPositionUrgencyColor(value) }}>
                                            <span className="position_label">{position.toUpperCase()}</span>
                                            <span className="position_value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="team_picks_list">
                                <h3 className="team_picks_list_header">Picks</h3>
                                <div className="team_picks">
                                    {teamPicks.map((pick, index) => (
                                        <div key={index} className={`team_pick ${pick.id === currentPick?.id ? "current_team_pick" : ""}`}>
                                            <span className="pick_info">{pick.draft_pick.round}.{pick.draft_pick.pick_number}</span>
                                            {pick.player ? (
                                                <span className="pick_player"><strong>{pick.player.name}</strong> {pick.player.position} - {pick.player.college}</span>
                                            ) : (
                                                <span className="pick_empty">Not picked yet</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No team on the clock</p>
                    )}
                </aside>
            </main>
        </div>
    );
}

export default Draft;