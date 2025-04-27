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
    position_needs: Optional[list[str]] = []

class TeamBase(BaseModel):
    id: int

    class Config:
        orm_mode = True

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    position_needs: Optional[list[str]] = []

class DraftPickCreate(BaseModel):
    pick_number: int
    round: int
    year: int
    current_team_id: int
    original_team_id: int
    player_id: Optional[int] = None

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
    player_id: Optional[int] = None

