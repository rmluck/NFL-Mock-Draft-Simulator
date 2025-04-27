from sqlalchemy.orm import Session
from . import models, schemas

def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(name=player.name, position=player.position, college=player.college, year=player.year)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def get_player(db: Session, player_id: int):
    return db.query(models.Player).filter(models.Player.id == player_id).first()

def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Player).offset(skip).limit(limit).all()

def update_player(db: Session, player_id: int, player: schemas.PlayerUpdate):
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if db_player:
        db_player.name = player.name
        db_player.position = player.position
        db_player.college = player.college
        db_player.year = player.year
        db.commit()
        db.refresh(db_player)
    return db_player

def delete_player(db: Session, player_id: int):
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if db_player:
        db.delete(db_player)
        db.commit()
        return db_player
    return None

def create_team(db: Session, team: schemas.TeamCreate):
    db_team = models.Team(name=team.name, position_needs=team.position_needs)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def get_team(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.id == team_id).first()

def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Team).offset(skip).limit(limit).all()

def update_team(db: Session, team_id: int, team: schemas.TeamUpdate):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if db_team:
        db_team.name = team.name
        db_team.position_needs = team.position_needs
        db.commit()
        db.refresh(db_team)
    return db_team

def delete_team(db: Session, team_id: int):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if db_team:
        db.delete(db_team)
        db.commit()
        return db_team
    return None

def create_draft_pick(db: Session, draft_pick: schemas.DraftPickCreate):
    db_draft_pick = models.DraftPick(pick_number=draft_pick.pick_number, round=draft_pick.round, year=draft_pick.year, current_team_id=draft_pick.current_team_id, original_team_id=draft_pick.original_team_id, player_id=draft_pick.player_id)
    db.add(db_draft_pick)
    db.commit()
    db.refresh(db_draft_pick)
    return db_draft_pick

def get_draft_pick(db: Session, draft_pick_id: int):
    return db.query(models.DraftPick).filter(models.DraftPick.id == draft_pick_id).first()

def get_draft_picks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DraftPick).offset(skip).limit(limit).all()

def update_draft_pick(db: Session, draft_pick_id: int, draft_pick: schemas.DraftPickUpdate):
    db_draft_pick = db.query(models.DraftPick).filter(models.DraftPick.id == draft_pick_id).first()
    if db_draft_pick:
        db_draft_pick.pick_number = draft_pick.pick_number
        db_draft_pick.round = draft_pick.round
        db_draft_pick.year = draft_pick.year
        db_draft_pick.current_team_id = draft_pick.current_team_id
        db_draft_pick.original_team_id = draft_pick.original_team_id
        db_draft_pick.player_id = draft_pick.player_id
        db.commit()
        db.refresh(db_draft_pick)
    return db_draft_pick

def delete_draft_pick(db: Session, draft_pick_id: int):
    db_draft_pick = db.query(models.DraftPick).filter(models.DraftPick.id == draft_pick_id).first()
    if db_draft_pick:
        db.delete(db_draft_pick)
        db.commit()
        return db_draft_pick
    return None