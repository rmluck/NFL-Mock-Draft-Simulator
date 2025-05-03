import requests

from backend.database import SessionLocal
from backend.apps import crud, models, schemas


def prompt_user_for_draft_settings() -> schemas.MockDraftCreate:
    draft_name = input("Enter a name for your mock draft (press Enter to use default): ")

    if draft_name == "":
        draft_name = "Mock Draft"
    
    while True:
        try:
            num_rounds = int(input("Enter number of rounds (1-7): "))
            if 1 <= num_rounds <= 7:
                break
            else:
                print("Please enter a number between 1 and 7.")
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    return schemas.MockDraftCreate(name=draft_name, num_rounds=num_rounds)

def run_mock_draft():
    draft_settings = prompt_user_for_draft_settings()
    response = requests.post("http://localhost:8000/mock_drafts", json=draft_settings.model_dump())

    if response.status_code == 200:
        print("Mock draft created: ", response.json())
    else:
        print("Failed to create mock draft: ", response.text)

    # TODO: Step 2 - Ask user which teams they want to control, add to UserControlledTeams
    # TODO: Step 3 - Find all draft picks from Draft Picks table with round <= num_rounds
    # TODO: Step 4 - Begin draft simulation
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