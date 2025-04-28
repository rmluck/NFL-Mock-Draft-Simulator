from pydantic import BaseModel
from typing import Optional

class PlayerCreate(BaseModel):
    name: str
    position: str
    college: str
    year: int

class PlayerBase(BaseModel):
    id: int

    class Config:
        orm_mode = True

class PlayerUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    college: Optional[str] = None
    year: Optional[int] = None

class TeamCreate(BaseModel):
    name: str
    qb: int
    rb: int
    wr: int
    te: int
    ot: int
    iol: int
    de: int
    dt: int
    lb: int
    cb: int
    s: int

class TeamBase(BaseModel):
    id: int

    class Config:
        orm_mode = True

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    qb: Optional[int] = None
    rb: Optional[int] = None
    wr: Optional[int] = None
    te: Optional[int] = None
    ot: Optional[int] = None
    iol: Optional[int] = None
    de: Optional[int] = None
    dt: Optional[int] = None
    lb: Optional[int] = None
    cb: Optional[int] = None
    s: Optional[int] = None

class DraftPickCreate(BaseModel):
    pick_number: int
    round: int
    year: int
    current_team_id: int
    original_team_id: int
    previous_team_id: int

class DraftPickBase(BaseModel):
    id: int

    class Config:
        orm_mode = True

class DraftPickUpdate(BaseModel):
    pick_number: Optional[int] = None
    round: Optional[int] = None
    year: Optional[int] = None
    current_team_id: Optional[int] = None
    original_team_id: Optional[int] = None
    previous_team_id: Optional[int] = None

class MockDraftCreate(BaseModel):
    name: str

class MockDraftBase(BaseModel):
    id: int

    class Config:
        orm_mode = True

class MockDraftUpdate(BaseModel):
    name: Optional[str] = None

class MockDraftPickCreate(BaseModel):
    mock_draft_id: int
    player_id: int
    team_id: int
    draft_pick_id: int

class MockDraftPickBase(BaseModel):
    id: int

    class Config:
        orm_mode = True

class MockDraftPickUpdate(BaseModel):
    mock_draft_id: Optional[int] = None
    player_id: Optional[int] = None
    team_id: Optional[int] = None
    draft_pick_id: Optional[int] = None