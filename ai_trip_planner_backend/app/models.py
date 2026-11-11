from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, index=True)
    days = Column(Integer)
    # BUDGET COLUMN DELETED!
    theme = Column(String)
    budget_level = Column(String) 
    itinerary = Column(Text)