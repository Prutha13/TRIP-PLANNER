import os
import logging
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Import database, models, and schemas
from app.database import engine, get_db, ensure_database_schema
from app import models, schemas

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("ai_trip_planner_backend")

# Load Environment Variables
load_dotenv()

# Ensure Database Tables and schema
ensure_database_schema()

app = FastAPI(
    title="AI Trip Planner API - Horizon Code",
    description="Next-generation intelligent travel itinerary generator & budget forecast backend powered by Gemini AI and SQLite.",
    version="3.0.0"
)

# CORS Configuration - Allow all local dev origins & web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def calculate_cost_estimate(days: int, budget_level: str) -> dict:
    """Calculates realistic travel expense breakdown in INR."""
    budget_clean = budget_level.lower()
    if "low" in budget_clean or "backpacker" in budget_clean:
        per_day_stay = 1200
        per_day_food = 600
        per_day_transit = 400
        per_day_activities = 300
    elif "high" in budget_clean or "luxury" in budget_clean:
        per_day_stay = 7500
        per_day_food = 2500
        per_day_transit = 1800
        per_day_activities = 2000
    else:  # Medium / Balanced
        per_day_stay = 3200
        per_day_food = 1200
        per_day_transit = 800
        per_day_activities = 900

    total_stay = per_day_stay * days
    total_food = per_day_food * days
    total_transit = per_day_transit * days
    total_activities = per_day_activities * days
    total_min = int((total_stay + total_food + total_transit + total_activities) * 0.9)
    total_max = int((total_stay + total_food + total_transit + total_activities) * 1.25)

    return {
        "stay": f"₹{total_stay:,}",
        "food": f"₹{total_food:,}",
        "transit": f"₹{total_transit:,}",
        "activities": f"₹{total_activities:,}",
        "range": f"₹{total_min:,} - ₹{total_max:,}"
    }


def generate_smart_fallback_itinerary(destination: str, days: int, theme: str, budget_level: str, language: str) -> str:
    """
    Generates a rich, structured, comprehensive multi-day itinerary when
    Gemini is unreachable or offline. Completely tailored to user inputs.
    """
    costs = calculate_cost_estimate(days, budget_level)
    dest_title = destination.strip().title()

    days_plan = []
    daily_themes = [
        ("Arrival, Historic City Center & Welcome Feast", "heritage heart and famous central squares", "Central Old Bazaar & Royal Cafes"),
        ("Iconic Cultural Landmarks & Hidden Viewpoints", "historic monuments, museums, and botanical vistas", "Traditional Artisan Bistro"),
        ("Adventure Trails, Natural Wonders & Scenic Sunset", "panoramic nature corridors and skyline sunset points", "Sunset Ridge Diner"),
        ("Artisan Markets, Handicrafts & Local Flavors", "local craft quarters, textile bazaars, and local street delicacies", "Heritage Courtyard Restaurant"),
        ("Tranquil Retreat, Wellness & Panoramic Vistas", "peaceful gardens, waterfronts, and architectural jewels", "Lakefront Terrace Eatery"),
        ("Grand Exploration & Day Excursion", "scenic valley route and nearby cultural heritage village", "Valley View Restaurant"),
        ("Farewell Strolls, Souvenirs & Final Memories", "favorite local spots and commemorative souvenirs", "Historic Grand Cafe")
    ]

    for d in range(1, days + 1):
        theme_idx = (d - 1) % len(daily_themes)
        day_title, highlights, eatery = daily_themes[theme_idx]
        eatery_query = f"{eatery}+{dest_title}".replace(" ", "+")

        day_block = f"""### Day {d}: {day_title}
- **Morning (09:00 - 12:30)**: Start with breakfast at a local bakery, then set out for {highlights}. Take memorable photographs along the walking route.
- **Lunch & Rest (12:30 - 14:30)**: Enjoy local culinary specialties at [{eatery}](https://www.google.com/maps/search/?api=1&query={eatery_query}).
- **Afternoon (14:30 - 17:30)**: Explore local architecture, artisan shops, and scenic lookouts matching your {theme} vibe.
- **Evening & Dinner (18:00 - 21:30)**: Leisurely twilight stroll followed by dinner at a highly rated local restaurant."""
        days_plan.append(day_block)

    joined_days = "\n\n".join(days_plan)

    itinerary_md = f"""# {days}-Day Travel Itinerary: {dest_title}

**Estimated Budget Range:** {costs['range']}
**Theme:** {theme} | **Style:** {budget_level} Tier | **Language:** {language}

[Search Flights to {dest_title}](https://www.google.com/travel/flights?q=flights+to+{dest_title})

---

## Estimated Budget Breakdown
- **Accommodations ({days} nights):** {costs['stay']}
- **Food & Dining:** {costs['food']}
- **Local Transit & Sightseeing:** {costs['transit']}
- **Activities & Entrance Fees:** {costs['activities']}

---

## Recommended Stays in {dest_title}
1. [{dest_title} Heritage Palace Hotel](https://www.google.com/travel/search?q=luxury+hotels+in+{dest_title}) - Premium amenities, prime location, and breakfast included.
2. [{dest_title} Central Boutique Inn](https://www.google.com/travel/search?q=boutique+hotel+{dest_title}) - Cozy atmosphere, modern conveniences, and walking distance to center.
3. [{dest_title} Traveler Haven](https://www.google.com/travel/search?q=budget+stays+in+{dest_title}) - Friendly staff, high-speed Wi-Fi, and budget-conscious rates.

---

## Daily Schedule

{joined_days}

---

## Travel & Practical Tips
- **Best Transit:** Use local rideshares, auto-rickshaws, or metro passes for convenient city transit.
- **Packing Essentials:** Comfortable walking shoes, universal power adapter, breathable layers, and sun protection.
- **Currency & Payments:** Digital payments (UPI / cards) are widely accepted; keep a small amount of cash for artisan stalls.
"""
    return itinerary_md


# --- API ROUTES ---

@app.get("/", tags=["General"])
def read_root():
    return {
        "service": "AI Trip Planner API - Horizon Code",
        "version": "3.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=schemas.HealthResponse, tags=["General"])
def health_check():
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    return {
        "status": "online",
        "service": "AI Trip Planner Backend",
        "database": "sqlite_connected",
        "version": "3.0.0",
        "gemini_configured": bool(api_key and api_key != "your_gemini_api_key_here")
    }


@app.post("/generate-itinerary", response_model=schemas.ItineraryResponse, tags=["Planner Engine"])
def generate_itinerary(
    destination: Optional[str] = Query(None),
    days: Optional[int] = Query(None),
    theme: Optional[str] = Query("General Exploration"),
    budget_level: Optional[str] = Query("Medium"),
    language: Optional[str] = Query("English"),
    body: Optional[schemas.ItineraryRequest] = None
):
    """
    Generates a personalized multi-day travel itinerary.
    Accepts both JSON body and URL query parameters for seamless frontend compatibility.
    """
    target_dest = body.destination if body else destination
    target_days = body.days if body else days
    target_theme = (body.theme if body else theme) or "General Exploration"
    target_budget = (body.budget_level if body else budget_level) or "Medium"
    target_lang = (body.language if body else language) or "English"

    if not target_dest or not str(target_dest).strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Destination is required."
        )

    try:
        target_days = int(target_days)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Days must be a valid integer between 1 and 30."
        )

    if target_days < 1 or target_days > 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duration must be between 1 and 30 days."
        )

    costs = calculate_cost_estimate(target_days, target_budget)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    # Try live Gemini generation if key is present
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            from google import genai
            client = genai.Client(api_key=api_key)

            prompt = f"""
You are an expert travel consultant. Design a detailed, beautiful {target_days}-day travel itinerary for {target_dest}.
Trip Theme: {target_theme}
Budget Style: {target_budget}
Target Output Language: {target_lang}

STRICT GUIDELINES:
1. NO EMOJIS: Do not include emojis anywhere in the response. Maintain an elegant, clean editorial tone.
2. LANGUAGE: Write the entire response strictly in {target_lang}.
3. ESTIMATED BUDGET: At the very top, state an estimated total cost range in INR (₹).
4. FLIGHT LINK: Under the budget, include: [Search Flights to {target_dest}](https://www.google.com/travel/flights?q=flights+to+{target_dest})
5. RECOMMENDED STAYS: Include 3 real hotels in {target_dest} matching {target_budget} style with Google Travel links formatted as: [Book Hotel](https://www.google.com/travel/search?q=Hotel+Name+{target_dest})
6. DAILY SCHEDULE: Format each day with ### Day X headers, morning, afternoon, and evening bullet points.
7. RESTAURANTS: For every food recommendation, provide a Google Maps search link: [View Location Map](https://www.google.com/maps/search/?api=1&query=Restaurant+Name+{target_dest})
8. PACKING & TRAVEL TIPS: End with 3 practical bullet points for the destination.
"""
            # Try 2.0-flash, fallback to 1.5-flash
            for model_name in ["gemini-2.0-flash", "gemini-1.5-flash"]:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    if response and response.text:
                        return schemas.ItineraryResponse(
                            ai_plan=response.text,
                            status="success",
                            source=f"gemini_{model_name}",
                            destination=target_dest,
                            days=target_days,
                            estimated_cost=costs["range"]
                        )
                except Exception as inner_err:
                    logger.warning(f"Failed with {model_name}: {inner_err}")

        except Exception as e:
            logger.warning(f"Gemini API invocation encountered issue: {str(e)}. Using Smart Travel Engine fallback.")

    # Smart engine fallback if Gemini is not available or encounters errors
    fallback_plan = generate_smart_fallback_itinerary(
        destination=target_dest,
        days=target_days,
        theme=target_theme,
        budget_level=target_budget,
        language=target_lang
    )
    return schemas.ItineraryResponse(
        ai_plan=fallback_plan,
        status="smart_engine",
        source="horizon_smart_planner",
        destination=target_dest,
        days=target_days,
        estimated_cost=costs["range"]
    )


@app.post("/save-trip", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["Trip Library"])
def save_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    """Saves a trip itinerary to the library."""
    try:
        new_trip = models.Trip(
            destination=trip.destination.strip(),
            days=trip.days,
            theme=trip.theme,
            budget_level=trip.budget_level,
            itinerary=trip.itinerary
        )
        db.add(new_trip)
        db.commit()
        db.refresh(new_trip)
        return {
            "message": "Trip successfully saved to your library!",
            "trip_id": new_trip.id,
            "status": "success"
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Database error in save_trip: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save trip to database."
        )


@app.get("/get-trips", response_model=List[schemas.TripResponse], tags=["Trip Library"])
def get_trips(db: Session = Depends(get_db)):
    """Retrieves all saved trips from the database ordered by newest first."""
    try:
        return db.query(models.Trip).order_by(models.Trip.id.desc()).all()
    except Exception as e:
        logger.error(f"Database error in get_trips: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trips."
        )


@app.get("/get-trip/{trip_id}", response_model=schemas.TripResponse, tags=["Trip Library"])
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    """Retrieves a single trip by ID."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found."
        )
    return trip


@app.put("/update-trip/{trip_id}", response_model=dict, tags=["Trip Library"])
def update_trip(trip_id: int, trip_update: schemas.TripUpdate, db: Session = Depends(get_db)):
    """Updates an existing trip's details or itinerary."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found."
        )
    try:
        if trip_update.destination:
            trip.destination = trip_update.destination.strip()
        if trip_update.days:
            trip.days = trip_update.days
        if trip_update.theme:
            trip.theme = trip_update.theme
        if trip_update.budget_level:
            trip.budget_level = trip_update.budget_level
        if trip_update.itinerary:
            trip.itinerary = trip_update.itinerary
        db.commit()
        return {"message": f"Trip {trip_id} updated successfully.", "status": "success"}
    except Exception as e:
        db.rollback()
        logger.error(f"Database error in update_trip: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update trip."
        )


@app.delete("/delete-trip/{trip_id}", response_model=dict, tags=["Trip Library"])
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Deletes a saved trip from the database."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found."
        )
    try:
        db.delete(trip)
        db.commit()
        return {
            "message": f"Trip {trip_id} successfully deleted from library.",
            "status": "success"
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Database error in delete_trip: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete trip."
        )
