from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ItineraryRequest(BaseModel):
    destination: str = Field(..., min_length=1, max_length=100, description="Destination city, region, or country")
    days: int = Field(..., ge=1, le=30, description="Duration of travel in days (1-30)")
    theme: str = Field("General Exploration", description="Travel vibe or focus area")
    budget_level: str = Field("Medium", description="Budget tier (Low, Medium, High)")
    language: str = Field("English", description="Output language for the itinerary")


class ItineraryResponse(BaseModel):
    ai_plan: str = Field(..., description="Generated markdown itinerary")
    status: str = Field("success", description="Status string: success | fallback | error")
    source: str = Field("gemini", description="AI provider or smart planner engine")
    destination: Optional[str] = None
    days: Optional[int] = None
    estimated_cost: Optional[str] = None


class TripCreate(BaseModel):
    destination: str = Field(..., min_length=1, max_length=100)
    days: int = Field(..., ge=1, le=30)
    theme: str = Field("General Exploration")
    budget_level: str = Field("Medium")
    itinerary: str = Field(..., min_length=10)


class TripUpdate(BaseModel):
    destination: Optional[str] = None
    days: Optional[int] = Field(None, ge=1, le=30)
    theme: Optional[str] = None
    budget_level: Optional[str] = None
    itinerary: Optional[str] = None


class TripResponse(BaseModel):
    id: int
    destination: str
    days: int
    theme: str
    budget_level: str
    itinerary: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HealthResponse(BaseModel):
    status: str
    service: str
    database: str
    version: str
    gemini_configured: bool
