from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, crud, database

app = FastAPI()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/players/")
def get_players(db: Session = Depends(get_db)):
    return crud.get_players(db)

@app.post("/players/")
def create_player(player: models.Player, db: Session = Depends(get_db)):
    return crud.create_player(db, player)