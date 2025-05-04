from sqlalchemy.orm import Session
from . import models, schemas

def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(name=player.name, position=player.position, college=player.college, rank=player.rank, year=player.year)
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
        db_player.rank = player.rank
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
    db_team = models.Team(name=team.name, qb=team.qb, rb=team.rb, wr=team.wr,te=team.te, ot=team.ot, iol=team.iol, de=team.de, dt=team.dt, lb=team.lb, cb=team.cb, s=team.s)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def get_team(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.id == team_id).first()

def get_teams(db: Session, skip: int = 0, limit: int = 32):
    return db.query(models.Team).offset(skip).limit(limit).all()

def update_team(db: Session, team_id: int, team: schemas.TeamUpdate):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if db_team:
        db_team.name = team.name
        db_team.qb = team.qb
        db_team.rb = team.rb
        db_team.wr = team.wr
        db_team.te = team.te
        db_team.ot = team.ot
        db_team.iol = team.iol
        db_team.de = team.de
        db_team.dt = team.dt
        db_team.lb = team.lb
        db_team.cb = team.cb
        db_team.s = team.s
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
    db_draft_pick = models.DraftPick(pick_number=draft_pick.pick_number, round=draft_pick.round, year=draft_pick.year, current_team_id=draft_pick.current_team_id, original_team_id=draft_pick.original_team_id, previous_team_id=draft_pick.current_team_id)
    db.add(db_draft_pick)
    db.commit()
    db.refresh(db_draft_pick)
    return db_draft_pick

def get_draft_pick(db: Session, draft_pick_id: int):
    return db.query(models.DraftPick).filter(models.DraftPick.id == draft_pick_id).first()

def get_draft_picks(db: Session, skip: int = 0, limit: int = 300):
    return db.query(models.DraftPick).offset(skip).limit(limit).all()

def update_draft_pick(db: Session, draft_pick_id: int, draft_pick: schemas.DraftPickUpdate):
    db_draft_pick = db.query(models.DraftPick).filter(models.DraftPick.id == draft_pick_id).first()
    if db_draft_pick:
        db_draft_pick.pick_number = draft_pick.pick_number
        db_draft_pick.round = draft_pick.round
        db_draft_pick.year = draft_pick.year
        db_draft_pick.current_team_id = draft_pick.current_team_id
        db_draft_pick.original_team_id = draft_pick.original_team_id
        db_draft_pick.previous_team_id = draft_pick.previous_team_id
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

def create_mock_draft(db: Session, mock_draft: schemas.MockDraftCreate):
    db_mock_draft = models.MockDraft(name=mock_draft.name, num_rounds=mock_draft.num_rounds)
    db.add(db_mock_draft)
    db.commit()
    db.refresh(db_mock_draft)
    return db_mock_draft

def get_mock_draft(db: Session, mock_draft_id: int):
    return db.query(models.MockDraft).filter(models.MockDraft.id == mock_draft_id).first()

def get_mock_drafts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.MockDraft).offset(skip).limit(limit).all()

def update_mock_draft(db: Session, mock_draft_id: int, mock_draft: schemas.MockDraftUpdate):
    db_mock_draft = db.query(models.MockDraft).filter(models.MockDraft.id == mock_draft_id).first()
    if db_mock_draft:
        db_mock_draft.name = mock_draft.name
        db_mock_draft.num_rounds = mock_draft.num_rounds
        db.commit()
        db.refresh(db_mock_draft)
    return db_mock_draft

def delete_mock_draft(db: Session, mock_draft_id: int):
    db_mock_draft = db.query(models.MockDraft).filter(models.MockDraft.id == mock_draft_id).first()
    if db_mock_draft:
        db.delete(db_mock_draft)
        db.commit()
        return db_mock_draft
    return None

def create_mock_draft_pick(db: Session, mock_draft_pick: schemas.MockDraftPickCreate):
    db_mock_draft_pick = models.MockDraftPick(mock_draft_id=mock_draft_pick.mock_draft_id, player_id=mock_draft_pick.player_id, team_id=mock_draft_pick.team_id, draft_pick_id=mock_draft_pick.draft_pick_id)
    db.add(db_mock_draft_pick)
    db.commit()
    db.refresh(db_mock_draft_pick)
    return db_mock_draft_pick

def get_mock_draft_pick(db: Session, mock_draft_pick_id: int):
    return db.query(models.MockDraftPick).filter(models.MockDraftPick.id == mock_draft_pick_id).first()

def get_mock_draft_picks(db: Session, mock_draft_id: int, skip: int = 0, limit: int = 300):
    return db.query(models.MockDraftPick).filter(models.MockDraft.id == mock_draft_id).offset(skip).limit(limit).all()

def update_mock_draft_pick(db: Session, mock_draft_pick_id: int, mock_draft_pick: schemas.MockDraftPickUpdate):
    db_mock_draft_pick = db.query(models.MockDraftPick).filter(models.MockDraftPick.id == mock_draft_pick_id).first()
    if db_mock_draft_pick:
        db_mock_draft_pick.mock_draft_id = mock_draft_pick.mock_draft_id
        db_mock_draft_pick.player_id = mock_draft_pick.player_id
        db_mock_draft_pick.team_id = mock_draft_pick.team_id
        db_mock_draft_pick.draft_pick_id = mock_draft_pick.draft_pick_id
        db.commit()
        db.refresh(db_mock_draft_pick)
    return db_mock_draft_pick

def delete_mock_draft_pick(db: Session, mock_draft_pick_id: int):
    db_mock_draft_pick = db.query(models.MockDraftPick).filter(models.MockDraftPick.id == mock_draft_pick_id).first()
    if db_mock_draft_pick:
        db.delete(db_mock_draft_pick)
        db.commit()
        return db_mock_draft_pick
    return None

def create_user_controlled_team(db: Session, user_controlled_team: schemas.UserControlledTeamCreate):
    db_user_controlled_team = models.UserControlledTeam(mock_draft_id=user_controlled_team.mock_draft_id, team_id=user_controlled_team.team_id)
    db.add(db_user_controlled_team)
    db.commit()
    db.refresh(db_user_controlled_team)
    return db_user_controlled_team

def get_user_controlled_team(db: Session, user_controlled_team_id: int):
    return db.query(models.UserControlledTeam).filter(models.UserControlledTeam.id == user_controlled_team_id).first()

def get_user_controlled_teams(db: Session, mock_draft_id: int, skip: int = 0, limit: int = 32):
    return db.query(models.UserControlledTeam).filter(models.MockDraft.id == mock_draft_id).offset(skip).limit(limit).all()

def update(db: Session, user_controlled_team_id: int, user_controlled_team: schemas.UserControlledTeamUpdate):
    db_user_controlled_team = db.query(models.UserControlledTeam).filter(models.UserControlledTeam.id == user_controlled_team_id).first()
    if db_user_controlled_team:
        db_user_controlled_team.mock_draft_id = user_controlled_team.mock_draft_id
        db_user_controlled_team.team_id = user_controlled_team.team_id
        db.commit()
        db.refresh(db_user_controlled_team)
    return db_user_controlled_team

def delete_user_controlled_team(db: Session, user_controlled_team_id: int):
    db_user_controlled_team = db.query(models.UserControlledTeam).filter(models.UserControlledTeam.id == user_controlled_team_id).first()
    if db_user_controlled_team:
        db.delete(db_user_controlled_team)
        db.commit()
        return db_user_controlled_team
    return None