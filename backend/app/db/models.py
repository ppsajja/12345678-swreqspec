from datetime import date, datetime, time

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Time
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


# รองรับ FR-BKG-01 และ FR-BKG-04 ด้วยข้อมูลช่วงเวลาและจำนวนที่นั่ง
class Slot(Base):
    __tablename__ = "slots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slot_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    package_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    remaining: Mapped[int] = mapped_column(Integer, nullable=False)

    bookings: Mapped[list["Booking"]] = relationship(back_populates="slot")


# รองรับ FR-BKG-02, FR-BKG-04 และ IF-HIS-01 โดยอ้างอิงผู้รับบริการด้วย HN
class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    hn: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    slot_id: Mapped[int] = mapped_column(ForeignKey("slots.id"), nullable=False)
    booking_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    queue_no: Mapped[str | None] = mapped_column(String(20), nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    slot: Mapped[Slot] = relationship(back_populates="bookings")


# รองรับ DOM-PDPA-01 ด้วยข้อมูลผู้เข้าถึง เวลา และรหัสผู้รับบริการ
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor_id: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    hn: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    accessed_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
