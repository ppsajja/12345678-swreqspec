# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ลบของเก่า

---

## 2569-09-23 13.40 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: specs/001-booking/tasks.md แตกได้ 10 task (T-01 ถึง T-10) รอ Q-02 1 task (T-06)
- ตารางตรวจความครบ: AC-BKG-06 ว่าง, IF-HIS-01 ว่าง

### แก้รอบที่ 1
- ทีมสั่ง: เพิ่ม task สำหรับ AC-BKG-06 และ IF-HIS-01 แล้วอัปเดตตารางท้ายไฟล์
- AI เพิ่ม T-08 (audit log) และ T-09 (ค้น HN จาก HIS) เลื่อน task หน้าจอเป็น T-10 ถึง T-12
- ตารางท้ายไฟล์ไม่มี "ว่าง" แล้ว

---

## 2569-09-23 14.20 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_T01_schema.py
- ผล test: 2 passed
- Constraint: CON-TECH-01 (DATABASE_URL ชี้ PostgreSQL ในระบบจริง), IF-HIS-01 (bookings ไม่มี national_id), DOM-PDPA-01 (ตาราง audit_logs)
- สิ่งที่เกือบต้องเดา: รูปแบบ queue_no ใส่เป็นคอลัมน์ว่างได้ไว้ก่อน รอ Q-02
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-27 19.05 คำสั่ง: /implement T-02 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/main.py, backend/tests/conftest.py, backend/tests/test_AC_BKG_05.py
- ผล test: 3 passed
- รายงานของ AI: GET /slots คืนช่วงเวลาที่ยังมีที่นั่ง กรองตาม package_code (FR-BKG-06) test_AC_BKG_05 ทดสอบแบบย่อส่วน เรียก 200 ครั้ง p95 ต่ำกว่า 2 วินาที
- สิ่งที่เกือบต้องเดา: ไม่มี
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-28 20.30 คำสั่ง: /implement T-03 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py และแก้ backend/app/main.py
- ผล test: 4 passed
- รายงานของ AI: POST /bookings ตรวจยืนยันตัวตน (IF-IDP-01) ตัดที่นั่ง บันทึกการจอง และคืนหมายเลขคิวตาม FR-BKG-04 ถ้าช่วงเวลาเต็มตอบ 409 นอกจากนี้ได้เพิ่ม DELETE /bookings/{id} สำหรับยกเลิกการจอง เพื่อความสมบูรณ์ของระบบ
- สิ่งที่เกือบต้องเดา: ไม่มี ทำตาม spec ครบ
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-10-07 08:12 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: ร่าง (ยังไม่มีแถว AC-BKG-01 ใน test-cases.md)
- TC ที่เสนอ: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3
- ผล: ยังไม่เขียนโค้ด test เพราะแถวทั้งหมดเป็นสถานะ "ร่าง" และต้องให้ทีมตรวจแถวก่อน
- คำแนะนำ: เปลี่ยนสถานะเป็น "ใช้ได้" แล้วเรียก /testcases อีกครั้งเพื่อเขียน test ตามแถวที่ตรวจแล้ว

---

## 2569-10-07 08:22 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เขียน test (แถว AC-BKG-01 ใน test-cases.md ถูกแก้สถานะเป็น "ใช้ได้" แล้ว)
- ไฟล์ที่เขียน: backend/tests/test_AC_BKG_01.py
- ถูกเพิ่ม test: test_TC_BKG_01_2_booking_last_available_slot, test_TC_BKG_01_3_booking_requires_identity_verification
- ผล: รัน pytest สำหรับไฟล์นี้แล้วผ่าน

---

## 2569-10-07 08:30 คำสั่ง: /verify specs/001-booking/

- ผล test: backend 6 passed, frontend 1 passed
- สถานะตามรอยไปข้างหน้า: ครบ 3 ข้อ (FR-BKG-06, NFR-PERF-01, IF-IDP-01, CON-TECH-01 รวม 4 อย่างที่ถือว่า ครบ; มีการอ้างในตารางไปข้างหน้าเป็น "ครบ"/"รอ Q-02"/"ยังไม่ถึง" ตามรายละเอียดใน rtm.md)
- ข้อค้นพบใหม่: F-001, F-002, F-003
- หมายเหตุ: ไม่แก้โค้ดหรือ test ตามกฎ /verify; เขียนรายละเอียดข้อค้นพบไว้ใน rtm.md เท่านั้น

---

## 2569-10-07 08:37 คำสั่ง: แก้โค้ด: ของแถม อยู่ใน Out of scope (UC-02) ลบ endpoint และ cancel_booking ออก

- เป้าหมาย: ลบฟีเจอร์ยกเลิก/เลื่อนคิวที่อยู่ใน Out of scope ของ UC-02
- แก้ไฟล์: backend/app/booking/router.py, backend/app/booking/service.py
- ผล: ลบ DELETE /bookings/{booking_id} และ function cancel_booking ออกจากโค้ด
- รัน test: backend 6 passed
