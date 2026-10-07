# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08:30 | test: 7 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | ไม่มี AC | T-02 | `backend/app/slots/router.py:get_slots`; `backend/app/slots/service.py:list_available_slots` | `tests/test_AC_BKG_05.py::test_AC_BKG_05` ผ่าน | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 | `backend/app/booking/service.py:create_booking` ไม่มีการตรวจคิวที่ยังไม่ได้ใช้ในวันเดียวกัน | ไม่มี test ที่รันใน repo | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | ไม่มีโค้ดจริงที่เสนอ 3 ตัวเลือกหรือป้องกันการจองซ้อน | ไม่มี test ที่รันใน repo | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | `backend/app/booking/service.py:create_booking`; `backend/app/booking/router.py:create_booking` | `tests/test_AC_BKG_01.py::test_AC_BKG_01` ผ่าน | รอ Q-02 |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มี logic ส่งข้อความยืนยันและคิวส่งซ้ำ | ไม่มี test ที่รันใน repo | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02, T-10 | `backend/app/slots/service.py:list_available_slots` กรองตาม `package_code` | `tests/test_AC_BKG_05.py::test_AC_BKG_05` ผ่าน (โดยผ่านพารามิเตอร์ `package_code`) | ครบ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | `backend/app/slots/service.py:list_available_slots` | `tests/test_AC_BKG_05.py::test_AC_BKG_05` ผ่าน | ครบ |
| NFR-SEC-01 | ไม่มี AC | — | ไม่มีการตั้งค่า TLS/HTTPS หรือ security middleware ในโค้ด | ไม่มี test | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มีคิวส่งซ้ำตาม 5 นาที | ไม่มี test | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | — | ไม่มี logic หรือ test ที่ประเมินเวลาจองภายใน 3 นาที | ไม่มี test | ยังไม่ถึง |
| CON-TECH-01 | — | T-01 | `backend/app/db/session.py`; `backend/app/db/models.py` | `tests/test_T01_schema.py` ผ่าน | ครบ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | `backend/app/db/models.py:AuditLog` แต่ไม่มี middleware/route ที่บันทึกทุกการเข้าถึงข้อมูลการจองจริง | ไม่มี test | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01 | T-03 | `backend/app/auth/idp.py:get_verified_hn` | `tests/test_AC_BKG_01.py::test_TC_BKG_01_3_booking_requires_identity_verification` ผ่าน | ครบ |
| IF-HIS-01 | ไม่มี AC | T-01, T-09 | `backend/app/db/models.py:Booking` เก็บเฉพาะ `hn` เท่านั้น แต่ไม่มีฟังก์ชันค้น HN จาก HIS | `tests/test_T01_schema.py::test_T01_no_national_id` ผ่าน | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 | ไม่มี `notify/queue.py` หรือ async send/retry logic | ไม่มี test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/slots/router.py:get_slots` | FR-BKG-01, FR-BKG-06 | ไม่ครบ | ใช้ `DAYS_AHEAD = 14` แทนการแสดง 30 วัน ตาม spec |
| `backend/app/booking/service.py:create_booking` | FR-BKG-02, FR-BKG-04 | ไม่ครบ | ตัดที่นั่งและบันทึกแล้ว แต่ไม่มีการห้ามจองซ้ำในวันเดียวกัน |
| `backend/app/booking/router.py:create_booking` | IF-IDP-01, FR-BKG-04 | ครบในส่วนยืนยันตัวตน | `401` เวลาไม่มี token เหมาะกับ IF-IDP-01 แต่ยังไม่มีตรวจสถานะคิวเดิม |
| `backend/app/db/models.py:Booking` | IF-HIS-01 | ส่วนหนึ่งตรง | เก็บ `hn` อย่างเดียว แต่ไม่มีการค้น HN จาก HIS หรือแม้แต่ฟังก์ชันเรียก HIS |
| `backend/app/slots/service.py:list_available_slots` | FR-BKG-01 | ไม่ครบ | มีกฎที่ให้แสดงช่วงเวลาที่เหลือแต่อยู่ในช่วง 14 วัน ไม่ใช่ 30 วัน |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ตัวเลขไม่ตรง spec | `backend/app/slots/service.py: DAYS_AHEAD = 14` | FR-BKG-01 | Spec ระบุ "ภายใน 30 วันข้างหน้า" แต่โค้ดแสดงเฉพาะ 14 วัน และไม่มี test ที่ตรวจช่วง 30 วัน ทำให้เห็นว่าเป็นการตัดสินใจแทนทีม | แก้โค้ด |
| F-002 | โค้ดไม่มี FR | `backend/app/booking/service.py:create_booking` | FR-BKG-02 | โค้ดไม่ตรวจว่าผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกันก่อนสร้าง booking ใหม่ โดยเฉพาะไม่มีเงื่อนไข `booking_date == today` หรือ `status == BOOKED` | แก้โค้ด |
| F-003 | เดา Q-xx | `backend/app/booking/service.py:next_queue_no`; `backend/app/db/models.py:Booking.queue_no` | FR-BKG-04, Q-02 | รูปแบบหมายเลขคิวถูกกำหนดแบบ `A001` โดยไม่รอคำตอบจากเจ้าหน้าที่เวชระเบียน และยังไม่มีเอกสาร/ข้อสรุปใน spec ว่ารูปแบบจริงเป็นอย่างไร | เพิ่ม Q-xx |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| — | ไม่พบข้อค้นพบเดิมใน repo นี้ | ไม่มี `rtm.md` เก่า และการตรวจรอบนี้ยืนยันว่าข้อค้นพบที่ปรากฏมีเพียง 3 รายการด้านบน |
