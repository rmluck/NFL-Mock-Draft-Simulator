from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    position = Column(String(10), nullable=False)
    college = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)

    drafted_pick = relationship("DraftPick", back_populates="player", uselist=False)

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    position_needs = Column(ARRAY(String))

    draft_picks = relationship("DraftPick", foreign_keys="[DraftPick.current_team_id]", back_populates="current_team")

class DraftPick(Base):
    __tablename__ = "draft_picks"

    id = Column(Integer, primary_key=True, index=True)
    pick_number = Column(Integer, nullable=False)
    round = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    current_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    original_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"))

    current_team = relationship("Team", foreign_keys=[current_team_id], back_populates="draft_picks")
    player = relationship("Player", back_populates="drafted_pick", uselist=False)