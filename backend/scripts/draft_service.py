import requests

from backend.database import SessionLocal
from backend.apps import crud, models, schemas


def prompt_user_for_draft_settings() -> list[int, str, int]:
    draft_name = input("Enter a name for your mock draft (press Enter to use default): ")
    if draft_name == "":
        draft_name = "Mock Draft"

    years = [2025]
    while True:
        try:
            year = int(input("Enter year: "))
            if year in years:
                break
            else:
                print("Please enter an eligible year: ")
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    while True:
        try:
            num_rounds = int(input("Enter number of rounds (1-7): "))
            if 1 <= num_rounds <= 7:
                break
            else:
                print("Please enter a number between 1 and 7.")
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    draft_settings = schemas.MockDraftCreate(name=draft_name, num_rounds=num_rounds, year=year)
    response = requests.post("http://localhost:8000/mock_drafts", json=draft_settings.model_dump())
    if response.status_code != 200:
        print("Failed to create mock draft: ", response.text)
        return
    draft_settings = response.json()

    mock_draft_id, mock_draft_name, num_rounds, year = draft_settings["id"], draft_settings["name"], draft_settings["num_rounds"], draft_settings["year"]
    
    return [mock_draft_id, mock_draft_name, num_rounds, year]

def prompt_user_for_teams(mock_draft_id: int) -> list[dict, list[int]]:
    response = requests.get("http://localhost:8000/teams/")
    teams = response.json()

    print("Select teams to control:")
    for team in teams:
        print(f"{team["id"]}: {team["name"]}")
    
    while True:
        try:
            chosen_ids = input("Enter team ID (or 0 for all teams): ")
            print(chosen_ids)
            if len(chosen_ids) == 1 and int(chosen_ids) == 0:
                chosen_ids = [i for i in range(1, 33)]
            else:
                chosen_ids = [int(id.strip()) for id in chosen_ids.split(",") if 1 <= id.strip().isdigit() <= 32]
            break
        except ValueError:
            print("invalid input. Please enter only numeric IDs.")
    
    for chosen_id in chosen_ids:
        user_controlled_team = schemas.UserControlledTeamCreate(mock_draft_id=mock_draft_id, team_id=chosen_id)
        response = requests.post("http://localhost:8000/user_controlled_teams", json=user_controlled_team.model_dump())
        if response.status_code != 200:
            print("Failed to create user controlled team: ", response.text)
            return
    
    return [teams, chosen_ids]

def get_draft_picks(mock_draft_id: int, num_rounds: int):
    response = requests.get("http://localhost:8000/draft_picks/by_rounds/", params={"num_rounds": num_rounds})
    draft_picks = response.json()

    for draft_pick in draft_picks:
        draft_pick_id = draft_pick["id"]
        current_team_id = draft_pick["current_team_id"]
        mock_draft_pick = schemas.MockDraftPickCreate(mock_draft_id=mock_draft_id, team_id=current_team_id, draft_pick_id= draft_pick_id)
        response = requests.post("http://localhost:8000/mock_draft_picks", json=mock_draft_pick.model_dump())
        if response.status_code != 200:
            print("Failed to create mock draft pick: ", response.text)
            return

def prompt_user_for_player(players: list[dict], team: str):
    print("\nBEST PLAYERS AVAILABLE\n----------------------")
    for player in players[:10]:
        print(f"{player["rank"]}. {player["name"]}, {player["position"]}, {player["college"]}")
    while True:
        name = input(f"\nEnter a player name for {team}: ").strip()
        for player in players:
            if player.get("name") == name:
                return player
        print("Name not found. Please try again.")

def run_mock_draft_simulation(mock_draft_id: int, year: int):
    response = requests.get("http://localhost:8000/mock_draft_picks/" + str(mock_draft_id))
    draft_picks = sorted(response.json(), key=lambda x: x["id"])
    
    response = requests.get("http://localhost:8000/user_controlled_teams/" + str(mock_draft_id))
    user_controlled_teams = response.json()
    user_team_ids = [team["team_id"] for team in user_controlled_teams]
    
    response = requests.get("http://localhost:8000/players/by_year/", params={"year": year})
    players = response.json()
    
    for pick in draft_picks:
        team_id = pick["team_id"]
        if team_id in user_team_ids:
            selected_player = prompt_user_for_player(players, pick["team"]["name"])
        else:
            selected_player = players[0]
        pick["player"] = selected_player
        pick_update = schemas.MockDraftPickUpdate(player_id=selected_player["id"])
        response = requests.put("http://localhost:8000/mock_draft_picks/" + str(pick["id"]), json=pick_update.model_dump())
        if response.status_code != 200:
            print("Failed to make draft pick: ", response.text)
        print(f"With the No. {pick["draft_pick"]["pick_number"]} pick in the 2025 NFL Draft, the {pick["team"]["name"]} select {pick["player"]["name"]}.")
        players.remove(selected_player)

    return

def run_mock_draft():
    mock_draft_id, mock_draft_name, num_rounds, year = prompt_user_for_draft_settings()
    teams, chosen_team_ids = prompt_user_for_teams(mock_draft_id)
    get_draft_picks(mock_draft_id, num_rounds)
    run_mock_draft_simulation(mock_draft_id, year)

    # TODO: Step 5 - Loop through picks and let user select player if they control that team
        # TODO: 5.1 - For current pick, display team that currently owns it
        # TODO: 5.2 - Display best players available
        # TODO: 5.3 - If user does not control team that owns current pick, let CPU select first player on BPA list; If user does control team that owns current pick, let them select player from BPA list to draft
        # TODO: 5.4 - Insert new Mock Draft Pick to database with mock draft id, player id of player that was selected, team id of current team, draft pick id of current draft pick
        # TODO: 5.5 - Remove player from BPA list, update BPA list
        # TODO: 5.6 - Move to next pick
    # TODO: Step 6 - Mark mock draft as complete, reset team ownership for picks


if __name__ == "__main__":
    run_mock_draft()