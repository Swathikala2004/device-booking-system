# models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    role = Column(String)  # "user" or "admin"
    timezone = Column(String)

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    serial_number = Column(String)
    ip_address = Column(String)
    status = Column(String)  # Active / Maintenance

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(Integer, ForeignKey("devices.id"))
    from_time = Column(DateTime)  # stored in UTC
    to_time = Column(DateTime)    # stored in UTC

    user = relationship("User")
    device = relationship("Device")
