from sqlalchemy.orm import Session
from . import models

def get_players(db: Session):
    return db.query(models.Player).all()

def create_player(db: Session, player: models.Player):
    db.add(player)
    db.commit()
    db.refresh(player)
    return player