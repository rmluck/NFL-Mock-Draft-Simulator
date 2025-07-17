import React, { use } from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
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
    const navigate = useNavigate();
    const currentPickIndex = picks.findIndex(pick => !pick.player);
    const currentPick = currentPickIndex !== -1 ? picks[currentPickIndex] : null;
    const currentTeam = currentPick ? currentPick.team : null;
    const [showConfirmUndoModal, setShowConfirmUndoModal] = useState(false);
    const [pickToUndo, setPickToUndo] = useState(null);
    const [showConfirmRestartModal, setShowConfirmRestartModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const timerRef = useRef(null);
    const isUserTurn = currentPick && userControlledTeams.includes(currentPick.team.id);
    const hasAutoPickedRef = useRef(false);
    const [paused, setPaused] = useState(false);
    const previousPickIdRef = useRef(null);
    const draftPickSoundRef = useRef(null);
    const onTheClockSoundRef = useRef(null);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [tradePartner, setTradePartner] = useState(null);
    const userInteractedRef = useRef(false);
    const [tradeEvaluation, setTradeEvaluation] = useState(null);
    const [tradedPicks, setTradedPicks] = useState({
        currentTeam: [],
        tradePartner: []
    });
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

    const tradeValueChart = {2025: {1: 1000, 2: 717, 3: 514, 4: 491, 5: 468, 6: 446, 7: 426, 8: 406, 9: 387, 10: 369, 11: 358, 12: 347, 13: 336, 14: 325, 15: 315, 16: 305, 17: 296, 18: 287, 19: 278, 20: 269, 21: 261, 22: 253, 23: 245, 24: 237, 25: 230, 26: 223, 27: 216, 28: 209, 29: 202, 30: 196, 31: 190, 32: 184, 33: 180, 34: 175, 35: 170, 36: 166, 37: 162, 38: 157, 39: 153, 40: 149, 41: 146, 42: 142, 43: 138, 44: 135, 45: 131, 46: 128, 47: 124, 48: 121, 49: 118, 50: 115, 51: 112, 52: 109, 53: 106, 54: 104, 55: 101, 56: 98, 57: 96, 58: 93, 59: 91, 60: 88, 61: 86, 62: 84, 63: 82, 64: 80, 65: 78, 66: 76, 67: 75, 68: 73, 69: 71, 70: 70, 71: 68, 72: 67, 73: 65, 74: 64, 75: 63, 76: 61, 77: 60, 78: 59, 79: 57, 80: 56, 81: 55, 82: 54, 83: 52, 84: 51, 85: 50, 86: 49, 87: 48, 88: 47, 89: 46, 90: 45, 91: 44, 92: 43, 93: 32, 94: 41, 95: 40, 96: 39, 97: 38, 98: 37, 99: 36, 100: 35, 101: 34, 102: 34, 103: 33, 104: 33, 105: 32, 106: 32, 107: 31, 108: 31, 109: 30, 110: 30, 111: 29, 112: 29, 113: 28, 114: 28, 115: 27, 116: 26, 117: 26, 118: 25, 119: 25, 120: 24, 121: 24, 122: 23, 123: 23, 124: 22, 125: 21, 126: 21, 127: 20, 128: 20, 129: 19, 130: 19, 131: 18, 132: 18, 133: 18, 134: 17, 135: 17, 136: 17, 137: 16, 138: 16, 139: 15, 140: 15, 141: 15, 142: 14, 143: 14, 144: 14, 145: 13, 146: 13, 147: 13, 148: 13, 149: 12, 150: 12, 151: 12, 152: 12, 153: 11, 154: 11, 155: 11, 156: 11, 157: 10, 158: 10, 159: 10, 160: 10, 161: 10, 162: 10, 163: 10, 164: 9, 165: 9, 166: 9, 167: 9, 168: 9, 169: 9, 170: 9, 171: 9, 172: 9, 173: 8, 174: 8, 175: 8, 176: 8, 177: 8, 178: 8, 179: 8, 180: 7, 181: 7, 182: 7, 183: 7, 184: 7, 185: 6, 186: 6, 187: 6, 188: 6, 189: 6, 190: 6, 191: 6, 192: 6, 193: 5, 194: 5, 195: 5, 196: 5, 197: 5, 198: 5, 199: 5, 200: 5, 201: 5, 202: 4, 203: 4, 204: 4, 205: 4, 206: 4, 207: 4, 208: 4, 209: 4, 210: 4, 211: 4, 212: 4, 213: 4, 214: 4, 215: 4, 216: 3, 217: 3, 218: 3, 219: 3, 220: 3, 221: 3, 222: 3, 23: 3, 224: 3, 225: 3, 226: 2, 227: 2, 228: 2, 229: 2, 230: 2, 231: 2, 232: 2, 233: 2, 234: 2, 235: 2, 236: 2, 237: 2, 238: 1, 239: 1, 240: 1, 241: 1, 242: 1, 243: 1, 244: 1, 245: 1, 246: 1, 247: 1, 248: 1, 249: 1, 250: 1, 251: 1, 252: 1, 253: 1, 254: 1, 255: 1, 256: 1, 257: 1}};

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
                const pickedPlayers = sortedPicks.filter(pick => pick.player).map(pick => pick.player.id);
                const availablePlayers = players_result.data.filter(player => !pickedPlayers.includes(player.id));
                setPlayers(availablePlayers);
            } catch (err) {
                console.error("Failed to fetch additional data:", err);
            }
        };
        fetchRest();
    }, [draft]);

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

    useEffect(() => {
        const allPicked = picks.length > 0 && picks.every(p => p.player);
        if (allPicked) {
            navigate(`/results/${draftId}`);
        }
    }, [picks, draftId])

    useEffect(() => {
        draftPickSoundRef.current = new Audio("/sounds/draft_pick.mp3");
        draftPickSoundRef.current.preload = "auto";
        draftPickSoundRef.current.playbackRate = 1.5;
        onTheClockSoundRef.current = new Audio("/sounds/on_the_clock.mp3");
        onTheClockSoundRef.current.preload = "auto";
    }, []);

    useEffect(() => {
        if (!currentPick || !currentPick.team) {
            return;
        }

        const isUserPick = userControlledTeams.includes(currentPick.team.id);

        if (isUserPick && currentPick.id !== previousPickIdRef.current) {
            setTimeLeft(60);
            if (userInteractedRef.current && onTheClockSoundRef.current) {
                onTheClockSoundRef.current.currentTime = 0;
                setTimeout(() => {
                    onTheClockSoundRef.current.play();
                }, 1000);
            }
            previousPickIdRef.current = currentPick.id;
        }

        clearInterval(timerRef.current);

        if (paused) {
            return;
        }

        hasAutoPickedRef.current = false;

        if (isUserPick) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (paused) {
                        clearInterval(timerRef.current);
                        return prev;
                    }

                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        if (!hasAutoPickedRef.current) {
                            hasAutoPickedRef.current = true;
                            handleAutoSelectPlayer(currentPick, [...filteredPlayers]);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (!currentPick.player && filteredPlayers.length > 0) {
            if (!hasAutoPickedRef.current && !paused) {
                hasAutoPickedRef.current = true;
                setTimeout(() => {
                    handleAutoSelectPlayer(currentPick, [...filteredPlayers]);
                }, 1000);
            }
        }

        return () => clearInterval(timerRef.current);
    }, [currentPick, userControlledTeams, paused, filteredPlayers]);

    useEffect(() => {
        const handleUserInteraction = () => {
            userInteractedRef.current = true;
            window.removeEventListener("click", handleUserInteraction);
            window.removeEventListener("keydown", handleUserInteraction);
        };
        window.addEventListener("click", handleUserInteraction);
        window.addEventListener("keydown", handleUserInteraction);

        return () => {
            window.removeEventListener("click", handleUserInteraction);
            window.removeEventListener("keydown", handleUserInteraction);
        };
    }, []);

    if (!draft) {
        return <div>Loading draft...</div>;
    }

    const handleSelectPlayer = async (selectedPlayer) => {
        if (isSelecting) {
            return;
        } else if (paused) {
            alert("Draft is paused. Please resume before selecting a player.");
            return;
        } else if (!currentPick) {
            alert("No pick is currently on the clock.");
            return;
        } else if (!userControlledTeams.includes(currentPick.team.id)) {
            alert("You do not control this team.");
            return;
        }
        if (draftPickSoundRef.current) {
            draftPickSoundRef.current.pause();
            draftPickSoundRef.current.currentTime = 0;
            setTimeout(() => {
                draftPickSoundRef.current.play().catch(() => {});
            }, 50);
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

    const initiateUndoPick = () => {
        const lastCompletedPickIndex = [...picks].reverse().findIndex(pick => pick.player);
        if (lastCompletedPickIndex === -1) {
            alert("No picks have been made yet.");
            return;
        }

        const indexToUndo = picks.length - 1 - lastCompletedPickIndex;
        setPickToUndo(picks[indexToUndo]);
        setShowConfirmUndoModal(true);
    };

    const confirmUndoPick = async () => {
        try {
            await axios.put(`/api/mock_draft_picks/${pickToUndo.id}`, { player_id: null });
            setPlayers(prev => [...prev, pickToUndo.player].sort((a, b) => a.rank - b.rank));
            setPicks(prev => prev.map(pick => pick.id === pickToUndo.id ? {...pick, player: null, player_id: null} : pick));
        } catch (err) {
            console.error("Failed to undo pick: ", err);
            alert("An error occurred while undoing the pick. Please try again.");
        } finally {
            setShowConfirmUndoModal(false);
            setPickToUndo(null);
        }
    };

    const cancelUndoPick = () => {
        setShowConfirmUndoModal(false);
        setPickToUndo(null);
    };

    const togglePickSelection = (teamSide, pickId) => {
        setTradedPicks(prev => {
            const currentSelectedIds = prev[teamSide];
            const updated = {
                ...prev,
                [teamSide]: currentSelectedIds.includes(pickId) ? currentSelectedIds.filter(id => id !== pickId) : [...currentSelectedIds, pickId]
            };

            const picksDataFromIds = (pickIds) => picks.filter(pick => pickIds.includes(pick.id));

            const team1Picks = picksDataFromIds(updated.currentTeam);
            const team2Picks = picksDataFromIds(updated.tradePartner);

            if (team1Picks.length > 0 || team2Picks.length > 0) {
                const evaluation = evaluateTrade(team1Picks, team2Picks, tradeValueChart);
                setTradeEvaluation(evaluation);
            } else {
                setTradeEvaluation(null);
            }

            return updated;
        });
    };

    const getTradePartnerOptions = () => {
        return [...new Set(picks.map(pick => pick.team))].filter(team => team.id !== currentTeam.id).map(team => ({ value: team.id, label: team.name, team }));
    };

    const handleSelectTradePartner = (selectedOption) => {
        setTradePartner(selectedOption.team);
        setTradedPicks(prev => ({ ...prev, tradePartner: []}));
    };

    const evaluateTrade = (team1Picks, team2Picks, tradeValueChart) => {
        const sumValues = picks => picks.reduce((sum, pick) => sum + (tradeValueChart[draft.year]?.[pick.draft_pick.pick_number] || 0), 0);

        const team1Total = sumValues(team1Picks);
        const team2Total = sumValues(team2Picks);

        const difference = Math.abs(team1Total - team2Total);
        const largerTotal = Math.max(team1Total, team2Total);
        const percentDifference = (difference / largerTotal) * 100;

        let verdict;
        if (percentDifference <= 5) {
            verdict = "Fair";
        } else if (percentDifference <= 10) {
            verdict = "Acceptable";
        } else {
            verdict = "Lopsided";
        }

        return { team1Total, team2Total, difference, percentDifference, verdict };
    };

    const submitTrade = () => {
        if (tradedPicks.currentTeam.length === 0 && tradedPicks.tradePartner.length === 0) {
            alert("Please select at least one pick from each team to trade.");
            return;
        }

        try {
            for (const pickId of tradedPicks.currentTeam) {
                axios.put(`/api/mock_draft_picks/${pickId}`, {
                    team_id: tradePartner.id
                });

                setPicks(prevPicks => prevPicks.map(pick => pick.id === pickId ? {...pick, team: tradePartner } : pick));
            }
            for (const pickId of tradedPicks.tradePartner) {
                axios.put(`/api/mock_draft_picks/${pickId}`, {
                    team_id: currentTeam.id
                });

                setPicks(prevPicks => prevPicks.map(pick => pick.id === pickId ? {...pick, team: currentTeam } : pick));
            }
        } catch (err) {
            console.error("Failed to submit trade: ", err);
            alert("An error occurred while submitting the trade. Please try again.");
        } finally {
            setShowTradeModal(false);
            setTradePartner(null);
            setTradedPicks({
                currentTeam: [],
                tradePartner: []
            });
        }
    };

    const confirmRestartDraft = () => {
        setPicks(prev => prev.map(pick => ({...pick, player: null, player_id: null, team: pick.original_team, team_id: pick.original_team.id})));

        const fetchAllPlayers = async () => {
            try {
                const players_result = await axios.get(`/api/players/by_year/`, { params: { year: draft.year } });
                setPlayers(players_result.data.sort((a, b) => a.rank - b.rank));
            } catch (err) {
                console.error("Failed to fetch players:", err);
            }
        };

        fetchAllPlayers();
        setShowConfirmRestartModal(false);
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
                <Link to="/" className="logo_link">
                    <img src="/site/alternate_logo.png" alt="NFL Mock Draft Simulator logo" id="draft_logo" />
                </Link>
                
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
            </header>

            <main className="draft_main">
                <aside className="draft_tools">
                    <h2>Draft Tools</h2>
                    <button className="draft_tool" onClick={initiateUndoPick}>Undo Pick</button>
                    <br />
                    <button className="draft_tool" onClick={() => setShowTradeModal(true)}>Trade Pick</button>
                    <br />
                    <button className="draft_tool" onClick={() => setPaused(prev => !prev)}>{paused ? "Resume" : "Pause"} Draft</button>
                    <br />
                    <button className="draft_tool" onClick={() => setShowConfirmRestartModal(true)}>Restart Draft</button>
                    <br />
                    {showConfirmUndoModal && (
                        <div className="confirm_undo_modal">
                            <div className="confirm_undo_modal_content">
                                <p className="confirm_undo_modal_message">Undo pick {pickToUndo?.draft_pick.round}.{pickToUndo?.draft_pick.pick_number}?</p>
                                <p className="confirm_undo_modal_pick">{pickToUndo?.player.name} selected by {pickToUndo?.team.name}</p>
                                <div className="confirm_undo_modal_buttons">
                                    <button className="confirm_undo_modal_btn confirm" onClick={confirmUndoPick}>Yes</button>
                                    <button className="confirm_undo_modal_btn cancel" onClick={cancelUndoPick}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showTradeModal && (
                        <div className="trade_modal">
                            <div className="trade_modal_content">
                                <div className="trade_modal_header">
                                    <h2>Trade Picks</h2>
                                    <Select className="trade_team_dropdown" options={getTradePartnerOptions()} onChange={handleSelectTradePartner} placeholder="Select Trade Partner" />
                                </div>
                                <div className="trade_columns">
                                    <div className="trade_team_column">
                                        <div className="trade_team">
                                            <div className="trade_team_logo_wrapper">
                                                <img src={`/logos/nfl/${currentTeam.name}.png`} alt={currentTeam.name} className="trade_team_logo" />
                                            </div>
                                            <div className="trade_team_name">
                                                {currentTeam.name}
                                            </div>
                                        </div>
                                        <div className="trade_picks">
                                            {teamPicks.filter(pick => !pick.player).map(pick => (
                                                <button key={pick.id} className={`trade_pick_btn ${tradedPicks.currentTeam.includes(pick.id) ? "selected" : ""}`} onClick={() => togglePickSelection("currentTeam", pick.id)}>
                                                    {pick.draft_pick.round}.{pick.draft_pick.pick_number}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="trade_team_column">
                                        {tradePartner && (
                                            <>
                                                <div className="trade_team">
                                                    <div className="trade_team_logo_wrapper">
                                                        <img src={`/logos/nfl/${tradePartner.name}.png`} alt={tradePartner.name} className="trade_team_logo" />
                                                    </div>
                                                    <div className="trade_team_name">
                                                        {tradePartner.name}
                                                    </div>
                                                </div>
                                                <div className="trade_picks">
                                                    {picks.filter(pick => pick.team.id === tradePartner.id && !pick.player).map(pick => (
                                                        <button key={pick.id} className={`trade_pick_btn ${tradedPicks.tradePartner.includes(pick.id) ? "selected" : ""}`} onClick={() => togglePickSelection("tradePartner", pick.id)}>
                                                            {pick.draft_pick.round}.{pick.draft_pick.pick_number}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {tradeEvaluation && (
                                    <div className="trade_evaluation">
                                        <div className={`trade_evaluation_bar ${tradeEvaluation.verdict.toLowerCase()}`} style={{ transform: tradeEvaluation.verdict === "Fair" ? "translateX(0)" : tradeEvaluation.team1Total > tradeEvaluation.team2Total ? `translateX(${tradeEvaluation.percentDifference}%)` : `translateX(${-tradeEvaluation.percentDifference}%)` }} title={`Trade Verdict: ${tradeEvaluation.verdict}`}>{tradeEvaluation.verdict}</div>
                                    </div>
                                )}
                                <div className="trade_modal_buttons">
                                    <button className="trade_modal_btn submit" onClick={submitTrade}>Submit Trade</button>
                                    <button className="trade_modal_btn cancel" onClick={() => setShowTradeModal(false)}>Cancel Trade</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showConfirmRestartModal && (
                        <div className="confirm_restart_modal">
                            <div className="confirm_restart_modal_content">
                                <p className="confirm_restart_modal_message">Restart draft?</p>
                                <div className="confirm_restart_modal_buttons">
                                    <button className="confirm_restart_modal_btn confirm" onClick={confirmRestartDraft}>Yes</button>
                                    <button className="confirm_restart_modal_btn cancel" onClick={() => setShowConfirmRestartModal(false)}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
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
                        {isUserTurn && (
                            <div className={`pick_timer ${timeLeft <= 10 ? "urgent" : ""}`}>
                                <span>{timeLeft}s</span>
                            </div>
                        )}
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
                                    <span className="player_background">{player.college}</span>
                                </div>
                                <div className="player_position">
                                    {player.position}
                                </div>
                                <div className="player_rank">
                                    <small>{player.rank}</small>
                                </div>
                                <div className="select_player">
                                    <button className="select_player_btn" onClick={() => handleSelectPlayer(player)} disabled={isSelecting || !isUserTurn || timeLeft === 0}>Select</button>
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