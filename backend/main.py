from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import pytz

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Models
# -----------------------------
class DeviceModel(BaseModel):
    name: str
    serial_number: str
    ip_address: str


class Booking(BaseModel):
    device_id: int
    user_id: int
    user_name: str
    start_time: str
    end_time: str
    timezone: str


# -----------------------------
# Devices
# -----------------------------
devices = [
    {"id": 1, "name": "NFVIS-01", "serial_number": "SN101", "ip_address": "192.168.1.101", "status": "Active"},
    {"id": 2, "name": "NFVIS-02", "serial_number": "SN102", "ip_address": "192.168.1.102", "status": "Active"},
    {"id": 3, "name": "NFVIS-03", "serial_number": "SN103", "ip_address": "192.168.1.103", "status": "Active"},
    {"id": 4, "name": "NFVIS-04", "serial_number": "SN104", "ip_address": "192.168.1.104", "status": "Active"},
    {"id": 5, "name": "NFVIS-05", "serial_number": "SN105", "ip_address": "192.168.1.105", "status": "Active"},
]

# -----------------------------
# Bookings
# -----------------------------
bookings: List[dict] = []
MAX_BOOKINGS_PER_USER = 2
booking_counter = 1


# -----------------------------
# Get Devices
# -----------------------------
@app.get("/devices")
def get_devices():
    return devices


# -----------------------------
# Get My Bookings
# -----------------------------
@app.get("/my_bookings/")
def get_my_bookings(user_id: int):
    return [b for b in bookings if b["user_id"] == user_id]


# -----------------------------
# Get All Bookings (Admin)
# -----------------------------
@app.get("/bookings")
def get_all_bookings():
    return bookings


# -----------------------------
# Check Device Availability
# -----------------------------
@app.get("/device_status/{device_id}")
def device_status(device_id: int):

    now = datetime.utcnow().replace(tzinfo=pytz.utc)

    for b in bookings:
        start = datetime.fromisoformat(b["start_time"])
        end = datetime.fromisoformat(b["end_time"])

        if b["device_id"] == device_id and start <= now <= end:
            return {"status": "In Use", "user": b["user_name"]}

    return {"status": "Available"}


# -----------------------------
# Book Device
# -----------------------------
@app.post("/book_device/")
def book_device(b: Booking):

    global booking_counter

    try:
        tz = pytz.timezone(b.timezone)

        start_utc = tz.localize(
            datetime.fromisoformat(b.start_time)
        ).astimezone(pytz.utc)

        end_utc = tz.localize(
            datetime.fromisoformat(b.end_time)
        ).astimezone(pytz.utc)

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid time or timezone")

    if start_utc >= end_utc:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # -----------------------------
    # Device Conflict Check
    # -----------------------------
    for existing in bookings:

        existing_start = datetime.fromisoformat(existing["start_time"])
        existing_end = datetime.fromisoformat(existing["end_time"])

        if existing["device_id"] == b.device_id and not (
            end_utc <= existing_start or start_utc >= existing_end
        ):
            raise HTTPException(
                status_code=400,
                detail="Device already booked for this time range"
            )

    # -----------------------------
    # User Max Booking Limit
    # -----------------------------
    overlap_count = 0

    for existing in bookings:

        existing_start = datetime.fromisoformat(existing["start_time"])
        existing_end = datetime.fromisoformat(existing["end_time"])

        if existing["user_id"] == b.user_id and not (
            end_utc <= existing_start or start_utc >= existing_end
        ):
            overlap_count += 1

    if overlap_count >= MAX_BOOKINGS_PER_USER:
        raise HTTPException(
            status_code=400,
            detail="User can book max 2 devices at same time"
        )

    # -----------------------------
    # Save Booking
    # -----------------------------
    new_booking = {
        "id": booking_counter,
        "device_id": b.device_id,
        "user_id": b.user_id,
        "user_name": b.user_name,
        "start_time": start_utc.isoformat(),
        "end_time": end_utc.isoformat(),
        "timezone": b.timezone
    }

    bookings.append(new_booking)
    booking_counter += 1

    return {"message": "Booking successful", "booking": new_booking}


# -----------------------------
# Cancel Booking
# -----------------------------
@app.delete("/cancel_booking/{booking_id}")
def cancel_booking(booking_id: int):

    global bookings

    for b in bookings:
        if b["id"] == booking_id:
            bookings.remove(b)
            return {"message": "Booking cancelled"}

    raise HTTPException(status_code=404, detail="Booking not found")


# -----------------------------
# Admin Add Device
# -----------------------------
@app.post("/admin/add_device/")
def add_device(device: DeviceModel):

    new_id = max([d["id"] for d in devices], default=0) + 1

    devices.append({
        "id": new_id,
        "name": device.name,
        "serial_number": device.serial_number,
        "ip_address": device.ip_address,
        "status": "Active"
    })

    return {"message": f"Device {device.name} added successfully."}


# -----------------------------
# Admin Delete Device
# -----------------------------
@app.post("/admin/delete_device/")
def delete_device(payload: dict):

    device_id = payload.get("id")

    global devices
    devices = [d for d in devices if d["id"] != device_id]

    return {"message": f"Device {device_id} deleted successfully."}


# -----------------------------
# Admin Statistics
# -----------------------------
@app.get("/admin/stats")
def admin_stats():

    now = datetime.utcnow().replace(tzinfo=pytz.utc)

    active = 0

    for b in bookings:

        start = datetime.fromisoformat(b["start_time"])
        end = datetime.fromisoformat(b["end_time"])

        if start <= now <= end:
            active += 1

    return {
        "total_devices": len(devices),
        "total_bookings": len(bookings),
        "active_devices": active
    }


# -----------------------------
# Root
# -----------------------------
@app.get("/")
def home():
    return {"message": "Device Booking API running 🚀"}
