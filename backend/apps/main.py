from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import SessionLocal, engine

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/players/", response_model=schemas.PlayerBase)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    return crud.create_player(db=db, player=player)

@app.get("/players/{player_id}", response_model=schemas.PlayerBase)
def get_player(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.get_player(db=db, player_id=player_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.get("/players/", response_model=list[schemas.PlayerBase])
def get_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_players(db=db, skip=skip, limit=limit)

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

@app.get("/draft_picks/", response_model=list[schemas.DraftPickBase])
def get_draft_picks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
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