from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String(255), index=True, nullable=False)
    days = Column(Integer, nullable=False)
    theme = Column(String(100), default="General Exploration")
    budget_level = Column(String(50), default="Medium")
    itinerary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "destination": self.destination,
            "days": self.days,
            "theme": self.theme,
            "budget_level": self.budget_level,
            "itinerary": self.itinerary,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
