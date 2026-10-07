# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from app.db.models import Booking
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_2_booking_last_available_slot(client, db, make_slot):
    """TC-BKG-01-2: เหลือ 1 ที่สุดท้าย จองแล้วต้องตัดที่นั่งเป็น 0"""
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่างตรง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจองช่วง 09.00 น.
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกการจองสำเร็จ; แสดงหมายเลขคิว; ที่นั่งว่างของช่วงนั้นเป็น 0
    assert res.status_code == 201
    payload = res.json()
    assert payload["slot_id"] == slot.id
    assert payload["queue_no"] == "A001"
    db.refresh(slot)
    assert slot.remaining == 0
    assert db.query(Booking).count() == 1


def test_TC_BKG_01_3_booking_requires_identity_verification(client, db, make_slot):
    """TC-BKG-01-3: ยังไม่ได้ยืนยันตัวตน ต้องปฏิเสธการจอง"""
    # Given: ยังไม่ได้ยืนยันตัวตนก่อนเข้าถึงข้อมูลผู้รับบริการ และไม่ผ่าน IF-IDP-01
    slot = make_slot(start="09:00", remaining=1)

    # When: พยายามยืนยันการจองช่วง 09.00 น.
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then: ปฏิเสธการจอง; ไม่บันทึกรายการจองใหม่; ไม่แสดงหมายเลขคิว
    assert res.status_code == 401
    assert res.json()["detail"] == "ยังไม่ได้ยืนยันตัวตน"
    db.refresh(slot)
    assert slot.remaining == 1
    assert db.query(Booking).count() == 0
