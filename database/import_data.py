import csv, os
from backend.apps.models import Team, Player, DraftPick
from backend.database import SessionLocal

DATA_FOLDER = os.path.join(os.path.dirname(__file__), "2025")

session = SessionLocal()

with open(os.path.join(DATA_FOLDER, "players.csv"), newline="") as file:
    reader = csv.DictReader(file)
    for row in reader:
        player = Player(
            name=row["Name"],
            position=row["Position"],
            college=row["College"],
            rank=row["Rank"],
            year=row["Year"]
        )
        session.add(player)

with open(os.path.join(DATA_FOLDER, "teams.csv"), newline="") as file:
    reader = csv.DictReader(file)
    for row in reader:
        team = Team(
            name=row["Name"],
            qb=row["QB"],
            rb=row["RB"],
            wr=row["WR"],
            te=row["TE"],
            ot=row["OT"],
            iol=row["IOL"],
            de=row["DE"],
            dt=row["DT"],
            lb=row["LB"],
            cb=row["CB"],
            s=row["S"]
        )
        session.add(team)

session.commit()

with open(os.path.join(DATA_FOLDER, "draft_picks.csv"), newline="") as file:
    reader = csv.DictReader(file)
    for row in reader:
        current_team = session.query(Team).filter_by(name=row["Current Team"]).first()
        original_team = session.query(Team).filter_by(name=row["Original Team"]).first()

        draft_pick = DraftPick(
            round = row["Round"],
            pick_number = row["Pick Number"],
            current_team_id=current_team.id if current_team else None,
            original_team_id=original_team.id if original_team else None,
            previous_team_id=current_team.id if current_team else None,
            year = row["Year"]
        )
        session.add(draft_pick)

session.commit()
session.close()