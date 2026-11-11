import os
import logging
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Import Google GenAI library
from google import genai

# Import local database tools
from .database import engine, SessionLocal, Base
from . import models

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_trip_planner_backend")

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

# Load Environment Variables
load_dotenv()

app = FastAPI(
    title="AI Trip Planner API",
    description="Intelligent Travel Itinerary & Budget Backend powered by Google Gemini AI and SQLite database.",
    version="2.0.0"
)

# CORS Configuration - Allow all local origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency Injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Data Models
class ItineraryRequest(BaseModel):
    destination: str = Field(..., description="Target travel destination city or region")
    days: int = Field(..., ge=1, le=30, description="Duration of the trip in days")
    theme: str = Field("General Exploration", description="Travel vibe or focus area")
    budget_level: str = Field("Medium", description="Budget tier or estimated budget range")
    language: str = Field("English", description="Target language for output itinerary")

class ItineraryResponse(BaseModel):
    ai_plan: str
    status: str = "success"

class TripCreate(BaseModel):
    destination: str
    days: int
    theme: str
    budget_level: str
    itinerary: str

class TripResponse(BaseModel):
    id: int
    destination: str
    days: int
    theme: str
    budget_level: str
    itinerary: str

    class Config:
        from_attributes = True

# --- API ROUTES ---

@app.get("/", tags=["Health Check"])
def read_root():
    """Root welcoming endpoint."""
    return {"message": "Welcome to the AI Trip Planner Backend API!", "docs": "/docs"}

@app.get("/health", tags=["Health Check"])
def health_check():
    """Health check endpoint to verify server status."""
    return {
        "status": "online",
        "service": "AI Trip Planner Backend",
        "database": "connected"
    }

@app.post("/generate-itinerary", response_model=ItineraryResponse, tags=["Itinerary Generation"])
def generate_itinerary(
    destination: Optional[str] = Query(None),
    days: Optional[int] = Query(None),
    theme: Optional[str] = Query("General Exploration"),
    budget_level: Optional[str] = Query("Medium"),
    language: Optional[str] = Query("English"),
    body: Optional[ItineraryRequest] = None
):
    """
    Generates a complete multi-day travel itinerary using Gemini 2.5 Flash.
    Supports both JSON body payload and URL query parameters for maximum flexibility.
    """
    # Extract parameter values from JSON body or URL query params
    target_dest = body.destination if body else destination
    target_days = body.days if body else days
    target_theme = body.theme if body else theme
    target_budget = body.budget_level if body else budget_level
    target_lang = body.language if body else language

    if not target_dest or not target_days:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Destination and duration (days) are required parameters."
        )

    api_key = os.getenv("GEMINI_API_KEY")

    # Fallback response if API key is missing
    if not api_key or api_key.strip() == "" or api_key == "your_api_key_goes_here":
        logger.warning("GEMINI_API_KEY is missing or invalid. Returning fallback itinerary.")
        fallback_plan = (
            f"# {target_days}-Day Trip to {target_dest}\n\n"
            f"**Estimated Cost Range:** ₹10,000 - ₹20,000\n"
            f"**Theme:** {target_theme} | **Budget Level:** {target_budget} | **Language:** {target_lang}\n\n"
            f"[Search Flights to {target_dest}](https://www.google.com/travel/flights?q=flights+to+{target_dest})\n\n"
            f"## Recommended Stays\n"
            f"1. [Central City Hotel](https://www.google.com/travel/search?q=hotels+in+{target_dest})\n"
            f"2. [Heritage Boutique Resort](https://www.google.com/travel/search?q=resorts+in+{target_dest})\n"
            f"3. [Comfort Traveller Inn](https://www.google.com/travel/search?q=budget+stays+in+{target_dest})\n\n"
            f"## Daily Itinerary\n"
            f"### Day 1: Arrival & Exploration\n"
            f"- Arrive in {target_dest} and check into your hotel.\n"
            f"- Enjoy lunch at a local restaurant: [View Location Map](https://www.google.com/maps/search/?api=1&query=restaurants+in+{target_dest})\n"
            f"- Evening heritage walk around historic city center.\n\n"
            f"### Day 2: Culture & Sightseeing\n"
            f"- Morning visit to famous landmarks and local museums.\n"
            f"- Afternoon shopping at local artisan bazaars.\n\n"
            f"### Day 3: Farewell & Departure\n"
            f"- Relaxed morning brunch before departure."
        )
        return {"ai_plan": fallback_plan, "status": "mock_fallback"}

    # Prompt generation
    prompt = f"""
    You are an expert travel planner. Create a {target_days}-day itinerary for {target_dest}.
    Theme: {target_theme}. 
    Style: {target_budget}.
    
    CRITICAL INSTRUCTIONS:
    1. NO EMOJIS: Do NOT include any emoji characters anywhere in your response. Keep all text clean, professional, and elegant.
    2. LANGUAGE: You MUST write the ENTIRE response (including headings, tips, and descriptions) completely in {target_lang}.
    3. BUDGET RANGE: At the very top, provide an estimated total cost range in ₹ (INR).
    4. FLIGHTS: Right below the budget, add a link to search for flights: [Search Flights to {target_dest}](https://www.google.com/travel/flights?q=flights+to+{target_dest})
    5. TOP HOTELS: Create a "Recommended Stays" section. Suggest 3 real hotels in {target_dest} matching the {target_budget} budget. Include booking links like this: [Book Hotel](https://www.google.com/travel/search?q=hotel+name+{target_dest})
    6. ITINERARY: Format the day-by-day plan clearly with clean Markdown headers and bullet points.
    7. RESTAURANTS: For EVERY food/restaurant suggestion in the itinerary, include a Google Maps link. Format it like this: [View Location Map](https://www.google.com/maps/search/?api=1&query=Restaurant+Name+{target_dest})
    """

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return {"ai_plan": response.text, "status": "success"}

    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}")
        # Graceful fallback on API error
        fallback_plan = (
            f"# {target_days}-Day Travel Plan for {target_dest}\n\n"
            f"**Estimated Cost Range:** ₹12,000 - ₹22,000\n"
            f"**Theme:** {target_theme} | **Budget Level:** {target_budget}\n\n"
            f"[Search Flights to {target_dest}](https://www.google.com/travel/flights?q=flights+to+{target_dest})\n\n"
            f"## Recommended Stays\n"
            f"1. [Central Hotel {target_dest}](https://www.google.com/travel/search?q=hotels+in+{target_dest})\n\n"
            f"## Itinerary\n"
            f"### Day 1\n- Arrival, hotel check-in, and local sightseeing.\n"
            f"- Lunch: [View Location Map](https://www.google.com/maps/search/?api=1&query=restaurants+in+{target_dest})\n"
        )
        return {"ai_plan": fallback_plan, "status": "error_fallback"}

@app.post("/save-trip", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["Trip Library"])
def save_trip(trip: TripCreate, db: Session = Depends(get_db)):
    """Saves a generated itinerary to the SQLite database."""
    try:
        new_trip = models.Trip(
            destination=trip.destination,
            days=trip.days,
            theme=trip.theme,
            budget_level=trip.budget_level,
            itinerary=trip.itinerary
        )
        db.add(new_trip)
        db.commit()
        db.refresh(new_trip)
        return {"message": "Trip successfully saved to your library!", "trip_id": new_trip.id}
    except Exception as e:
        db.rollback()
        logger.error(f"Database error in save_trip: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save trip to database."
        )

@app.get("/get-trips", response_model=List[TripResponse], tags=["Trip Library"])
def get_trips(db: Session = Depends(get_db)):
    """Retrieves all saved trips from the database."""
    try:
        return db.query(models.Trip).order_by(models.Trip.id.desc()).all()
    except Exception as e:
        logger.error(f"Database error in get_trips: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trips."
        )

@app.delete("/delete-trip/{trip_id}", response_model=dict, tags=["Trip Library"])
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Deletes a saved trip from the database by ID."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found."
        )
    try:
        db.delete(trip)
        db.commit()
        return {"message": f"Trip {trip_id} successfully deleted from library."}
    except Exception as e:
        db.rollback()
        logger.error(f"Database error in delete_trip: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete trip."
        )