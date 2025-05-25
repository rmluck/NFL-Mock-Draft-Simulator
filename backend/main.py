from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .apps import models, crud, schemas
from .database import SessionLocal, engine

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the NFL Mock Draft Simulator."}

@app.post("/players/", response_model=schemas.PlayerBase)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    return crud.create_player(db=db, player=player)

@app.get("/players/{player_id}", response_model=schemas.PlayerBase)
def get_player(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.get_player(db=db, player_id=player_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.get("/players/by_year/", response_model=list[schemas.PlayerBase])
def get_players(year: int = 2025, db: Session = Depends(get_db)):
    return crud.get_players(db=db, year=year)

@app.put("/players/{player_id}", response_model=schemas.PlayerBase)
def update_player(player_id: int, player: schemas.PlayerUpdate, db: Session = Depends(get_db)):
    db_player = crud.update_player(db=db, player_id=player_id, player=player)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.delete("/players/{player_id}", response_model=schemas.PlayerBase)
def delete_player(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.delete_player(db=db, player_id=player_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.post("/teams/", response_model=schemas.TeamBase)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    return crud.create_team(db=db, team=team)

@app.get("/teams/{team_id}", response_model=schemas.TeamBase)
def get_team(team_id: int, db: Session = Depends(get_db)):
    db_team = crud.get_team(db=db, team_id=team_id)
    if db_team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return db_team

@app.get("/teams/", response_model=list[schemas.TeamBase])
def get_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_teams(db=db, skip=skip, limit=limit)

@app.put("/teams/{team_id}", response_model=schemas.TeamBase)
def update_team(team_id: int, team: schemas.TeamUpdate, db: Session = Depends(get_db)):
    db_team = crud.update_team(db=db, team_id=team_id, team=team)
    if db_team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return db_team

@app.delete("/teams/{team_id}", response_model=schemas.TeamBase)
def delete_team(team_id: int, db: Session = Depends(get_db)):
    db_team = crud.delete_team(db=db, team_id=team_id)
    if db_team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return db_team

@app.post("/draft_picks/", response_model=schemas.DraftPickBase)
def create_draft_pick(draft_pick: schemas.DraftPickCreate, db: Session = Depends(get_db)):
    return crud.create_draft_pick(db=db, draft_pick=draft_pick)

@app.get("/draft_picks/{draft_pick_id}", response_model=schemas.DraftPickBase)
def get_draft_pick(draft_pick_id: int, db: Session = Depends(get_db)):
    db_draft_pick = crud.get_draft_pick(db=db, draft_pick_id=draft_pick_id)
    if db_draft_pick is None:
        raise HTTPException(status_code=404, detail="Draft pick not found")
    return db_draft_pick

@app.get("/draft_picks/by_rounds/", response_model=list[schemas.DraftPickBase])
def get_draft_picks_by_round(num_rounds: int = 7, db: Session = Depends(get_db)):
    return crud.get_draft_picks_by_round(db=db, num_rounds=num_rounds)

@app.get("/draft_picks/", response_model=list[schemas.DraftPickBase])
def get_draft_picks(skip: int = 0, limit: int = 300, db: Session = Depends(get_db)):
    return crud.get_draft_picks(db=db, skip=skip, limit=limit)

@app.put("/draft_picks/{draft_pick_id}", response_model=schemas.DraftPickBase)
def update_draft_pick(draft_pick_id: int, draft_pick: schemas.DraftPickUpdate, db: Session = Depends(get_db)):
    db_draft_pick = crud.update_draft_pick(db=db, draft_pick_id=draft_pick_id, draft_pick=draft_pick)
    if db_draft_pick is None:
        raise HTTPException(status_code=404, detail="Draft pick not found")
    return db_draft_pick

@app.delete("/draft_picks/{draft_pick_id}", response_model=schemas.DraftPickBase)
def delete_draft_pick(draft_pick_id: int, db: Session = Depends(get_db)):
    db_draft_pick = crud.delete_draft_pick(db=db, draft_pick_id=draft_pick_id)
    if db_draft_pick is None:
        raise HTTPException(status_code=404, detail="Draft pick not found")
    return db_draft_pick

@app.post("/mock_drafts", response_model=schemas.MockDraftBase)
def create_mock_draft(mock_draft: schemas.MockDraftCreate, db: Session = Depends(get_db)):
    return crud.create_mock_draft(db=db, mock_draft=mock_draft)

@app.get("/mock_drafts/{mock_draft_id}", response_model=schemas.MockDraftBase)
def get_mock_draft(mock_draft_id: int, db: Session = Depends(get_db)):
    db_mock_draft = crud.get_mock_draft(db=db, mock_draft_id=mock_draft_id)
    if db_mock_draft is None:
        raise HTTPException(status_code=404, detail="Mock draft not found")
    return db_mock_draft

@app.get("/mock_drafts/", response_model=list[schemas.MockDraftBase])
def get_mock_drafts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_mock_drafts(db=db, skip=skip, limit=limit)

@app.put("/mock_drafts/{mock_draft_id}", response_model=schemas.MockDraftBase)
def update_mock_draft(mock_draft_id: int, mock_draft: schemas.MockDraftUpdate, db: Session = Depends(get_db)):
    db_mock_draft = crud.update_mock_draft(db=db, mock_draft_id=mock_draft_id, mock_draft=mock_draft)
    if db_mock_draft is None:
        raise HTTPException(status_code=404, detail="Mock draft not found")
    return db_mock_draft

@app.delete("/mock_drafts/{mock_draft_id}", response_model=schemas.MockDraftBase)
def delete_mock_draft(mock_draft_id: int, db: Session = Depends(get_db)):
    db_mock_draft = crud.delete_mock_draft(db=db, mock_draft_id=mock_draft_id)
    if db_mock_draft is None:
        raise HTTPException(status_code=404, detail="Mock draft not found")
    return db_mock_draft

@app.post("/mock_draft_picks", response_model=schemas.MockDraftPickBase)
def create_mock_draft_pick(mock_draft_pick: schemas.MockDraftPickCreate, db: Session = Depends(get_db)):
    return crud.create_mock_draft_pick(db=db, mock_draft_pick=mock_draft_pick)

@app.get("/mock_draft_picks/mock_draft_pick/", response_model=schemas.MockDraftPickBase)
def get_mock_draft_pick(mock_draft_pick_id: int, db: Session = Depends(get_db)):
    db_mock_draft_pick = crud.get_mock_draft_pick(db=db, mock_draft_pick_id=mock_draft_pick_id)
    if db_mock_draft_pick is None:
        raise HTTPException(status_code=404, detail="Mock draft pick not found")
    return db_mock_draft_pick

@app.get("/mock_draft_picks/{mock_draft_id}", response_model=list[schemas.MockDraftPickBase])
def get_mock_draft_picks(mock_draft_id: int, skip: int = 0, limit: int = 300, db: Session = Depends(get_db)):
    db_mock_draft_picks = crud.get_mock_draft_picks(db=db, mock_draft_id=mock_draft_id, skip=skip, limit=limit)
    if db_mock_draft_picks is None:
        raise HTTPException(status_code=404, detail="Mock draft not found or no picks have been made yet")
    return db_mock_draft_picks

@app.put("/mock_draft_picks/{mock_draft_pick_id}", response_model=schemas.MockDraftPickBase)
def update_mock_draft_pick(mock_draft_pick_id: int, mock_draft_pick: schemas.MockDraftPickUpdate, db: Session = Depends(get_db)):
    db_mock_draft_pick = crud.update_mock_draft_pick(db=db, mock_draft_pick_id=mock_draft_pick_id, mock_draft_pick=mock_draft_pick)
    if db_mock_draft_pick is None:
        raise HTTPException(status_code=404, detail="Mock draft pick not found")
    return db_mock_draft_pick

@app.delete("/mock_draft_picks/{mock_draft_pick_id}", response_model=schemas.MockDraftPickBase)
def delete_mock_draft_pick(mock_draft_pick_id: int, db: Session = Depends(get_db)):
    db_mock_draft_pick = crud.delete_mock_draft_pick(db=db, mock_draft_pick_id=mock_draft_pick_id)
    if db_mock_draft_pick is None:
        raise HTTPException(status_code=404, detail="Mock draft pick not found")
    return db_mock_draft_pick

@app.post("/user_controlled_teams", response_model=schemas.UserControlledTeamBase)
def create_user_controlled_team(user_controlled_team: schemas.UserControlledTeamCreate, db: Session = Depends(get_db)):
    return crud.create_user_controlled_team(db=db, user_controlled_team=user_controlled_team)

@app.get("/user_controlled_teams/{mock_draft_id}", response_model=list[schemas.UserControlledTeamBase])
def get_user_controlled_teams(mock_draft_id: int, skip: int = 0, limit: int = 32, db: Session = Depends(get_db)):
    db_user_controlled_teams = crud.get_user_controlled_teams(db=db, mock_draft_id=mock_draft_id, skip=skip, limit=limit)
    if db_user_controlled_teams is None:
        raise HTTPException(status_code=404, detail="Mock draft not found")
    return db_user_controlled_teams

@app.put("/user_controlled_teams/{user_controlled_team_id}", response_model=schemas.UserControlledTeamBase)
def update_user_controlled_team(user_controlled_team_id: int, user_controlled_team: schemas.UserControlledTeamUpdate, db: Session = Depends(get_db)):
    db_user_controlled_team = crud.update_user_controlled_team(db=db, user_controlled_team_id=user_controlled_team_id, user_controlled_team=user_controlled_team)
    if db_user_controlled_team is None:
        raise HTTPException(status_code=404, detail="User does not control this team")
    return db_user_controlled_team

@app.delete("/user_controlled_teams/{user_controlled_team_id}", response_model=schemas.UserControlledTeamBase)
def delete_user_controlled_team(user_controlled_team_id: int, db: Session = Depends(get_db)):
    db_user_controlled_team = crud.delete_user_controlled_team(db=db, user_controlled_team_id=user_controlled_team_id)
    if db_user_controlled_team is None:
        raise HTTPException(status_code=404, detail="User does not control this team")
    return db_user_controlled_team