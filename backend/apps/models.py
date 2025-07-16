from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from ..database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    position = Column(String(10), nullable=False)
    college = Column(String(100), nullable=False)
    rank = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    qb = Column(Integer, nullable=False)
    rb = Column(Integer, nullable=False)
    wr = Column(Integer, nullable=False)
    te = Column(Integer, nullable=False)
    ot = Column(Integer, nullable=False)
    iol = Column(Integer, nullable=False)
    de = Column(Integer, nullable=False)
    dt = Column(Integer, nullable=False)
    lb = Column(Integer, nullable=False)
    cb = Column(Integer, nullable=False)
    s = Column(Integer, nullable=False)

    draft_picks = relationship("DraftPick", foreign_keys="[DraftPick.current_team_id]", back_populates="current_team")

class DraftPick(Base):
    __tablename__ = "draft_picks"

    id = Column(Integer, primary_key=True, index=True)
    pick_number = Column(Integer, nullable=False)
    round = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    current_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    original_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)

    current_team = relationship("Team", foreign_keys=[current_team_id], back_populates="draft_picks")

class MockDraft(Base):
    __tablename__ = "mock_drafts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    num_rounds = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    mock_draft_picks = relationship("MockDraftPick", back_populates="mock_draft")

class MockDraftPick(Base):
    __tablename__ = "mock_draft_picks"

    id = Column(Integer, primary_key=True, index=True)

    mock_draft_id = Column(Integer, ForeignKey("mock_drafts.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    draft_pick_id = Column(Integer, ForeignKey("draft_picks.id"), nullable=False)
    original_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)

    mock_draft = relationship("MockDraft", back_populates="mock_draft_picks")
    player = relationship("Player")
    team = relationship("Team", foreign_keys=[team_id])
    draft_pick = relationship("DraftPick")
    original_team = relationship("Team", foreign_keys=[original_team_id])

class UserControlledTeam(Base):
    __tablename__ = "user_controlled_teams"

    id = Column(Integer, primary_key=True, index=True)

    mock_draft_id = Column(Integer, ForeignKey("mock_drafts.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)