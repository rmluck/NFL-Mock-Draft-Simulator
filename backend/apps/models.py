from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    position = Column(String)
    school = Column(String)
    draft_position = Column(Integer)
    grade = Column(String)

    def __repr__(self):
        return f"<Player(name={self.name}, position={self.position}, school={self.school}, draft_position={self.draft_position}, grade={self.grade})>"