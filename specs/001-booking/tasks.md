# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง: [plan.md](plan.md)
- วันที่: 2569-09-23
- สรุป: แบ่งงานทั้งหมด 20 task ตั้งแต่โครงสร้างข้อมูล, API, หน้าจอ, การเชื่อมต่อ และการทดสอบ
- มี 4 task ที่ต้องรอคำตอบจาก Open Question Q-02 เรื่องรูปแบบและวิธีออกหมายเลขคิว

## รายการ task

### T-01 สร้างโครงสร้างฐานข้อมูลการจอง
- รองรับ: CON-TECH-01, IF-HIS-01, DOM-PDPA-01, FR-BKG-01, FR-BKG-02, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-02, T-04 และ T-14
- ไฟล์ที่แตะ: `backend/app/db/models.py`, `backend/app/db/session.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings` และ `audit_logs` ได้ และตาราง `bookings` ไม่มีเลขบัตรประชาชน
- สถานะ: พร้อมทำ

### T-02 สร้างบริการค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03 และ T-10
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/slots/router.py`, `backend/app/main.py`, `backend/tests/test_slots.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: `GET /slots` คืนช่วงเวลาภายใน 30 วันพร้อม `remaining` และคำนวณใหม่เมื่อเปลี่ยน `package_code`
- สถานะ: พร้อมทำ

### T-03 สร้าง API และทดสอบค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-10
- ไฟล์ที่แตะ: `backend/app/slots/router.py`, `backend/tests/test_slots.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: test ของ `GET /slots` ผ่านสำหรับช่วงเวลาและจำนวนที่นั่งตามแพ็กเกจที่เลือก
- สถานะ: พร้อมทำ

### T-04 สร้างบริการบันทึกการจองและตัดที่นั่ง
- รองรับ: FR-BKG-04, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05 และ T-09
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/app/main.py`, `backend/tests/test_booking_service.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: บริการบันทึก booking ด้วย `hn` และตัด `remaining` ในธุรกรรมเดียวกันได้
- สถานะ: พร้อมทำ

### T-05 รองรับการจองสำเร็จตาม AC-BKG-01
- รองรับ: FR-BKG-04
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_01.py`, `backend/app/booking/service.py`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: `test_AC_BKG_01` ตรวจพบบันทึกการจองสำเร็จและที่นั่งช่วง 09.00 น. ลดจาก 1 เหลือ 0 โดยส่วนเลขคิวรอ T-09
- สถานะ: รอ Q-02

### T-06 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-07
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_duplicate_booking.py`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: บริการตรวจ booking ที่ยังไม่ได้ใช้ในวันเดียวกันตามเขตเวลา Asia/Bangkok และคืนข้อมูล booking เดิมเมื่อพบ
- สถานะ: พร้อมทำ

### T-07 ปฏิเสธการจองซ้ำตาม AC-BKG-02
- รองรับ: FR-BKG-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_02.py`, `backend/app/booking/router.py`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: `test_AC_BKG_02` ผ่านโดยคำขอซ้ำถูกปฏิเสธและแสดงหมายเลขคิวเดิมเมื่อมีข้อมูลเลขคิวตาม Q-02
- สถานะ: รอ Q-02

### T-08 เสนอช่วงเวลาใกล้เคียงเมื่อเต็ม
- รองรับ: FR-BKG-03, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-09
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_nearby_slots.py`
- ต้องทำหลัง: T-02, T-04
- เสร็จเมื่อ: API คืนข้อผิดพลาดเมื่อช่วงเวลาถูกจองไปแล้ว พร้อมช่วงว่าง 3 ช่วงที่ใกล้ที่สุดในวันเดียวกันและวันถัดไป 1 วัน โดยไม่สร้าง booking
- สถานะ: พร้อมทำ

### T-09 ทดสอบกรณีช่วงเวลาเต็มตาม AC-BKG-03
- รองรับ: FR-BKG-03
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_03.py`
- ต้องทำหลัง: T-08
- เสร็จเมื่อ: `test_AC_BKG_03` ผ่าน โดยได้ข้อผิดพลาด, ตัวเลือกใกล้เคียง 3 รายการ และไม่เกิดรายการจองซ้อน
- สถานะ: พร้อมทำ

### T-10 สร้างคิวส่งข้อความยืนยันแบบ asynchronous
- รองรับ: FR-BKG-04, FR-BKG-05, IF-NOT-01, ASM-03
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-11
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_notify_queue.py`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: POST การจองวางงานลงคิวจำลองและคืนผลการจองโดยไม่รอผลการส่งข้อความ
- สถานะ: พร้อมทำ

### T-11 รองรับการส่งซ้ำเมื่อแจ้งเตือนไม่สำเร็จ
- รองรับ: FR-BKG-05, NFR-REL-02, IF-NOT-01, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_04.py`
- ต้องทำหลัง: T-10
- เสร็จเมื่อ: `test_AC_BKG_04` ผ่าน โดย booking ยังอยู่, มีหมายเลขคิวตาม Q-02 และงานส่งซ้ำถูกกำหนดภายใน 5 นาที
- สถานะ: รอ Q-02

### T-12 สร้างการตรวจผลยืนยันตัวตน
- รองรับ: IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-13 และทุก endpoint ที่เข้าถึงข้อมูลผู้รับบริการ
- ไฟล์ที่แตะ: `backend/app/auth/idp.py`, `backend/app/main.py`, `backend/tests/test_idp_guard.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: endpoint ที่เกี่ยวข้องปฏิเสธคำขอที่ไม่มีผลยืนยันตัวตน และยอมรับคำขอที่ยืนยันแล้ว
- สถานะ: พร้อมทำ

### T-13 สร้างการค้นหา HN ผ่าน HIS
- รองรับ: IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04 และ T-17
- ไฟล์ที่แตะ: `backend/app/his/client.py`, `backend/app/booking/router.py`, `backend/app/main.py`, `backend/tests/test_patient_lookup.py`
- ต้องทำหลัง: T-12
- เสร็จเมื่อ: `GET /patients/lookup` ส่งเลขบัตรไปยัง HIS เพื่อคืน `hn` และไม่เก็บเลขบัตรไว้ใน booking
- สถานะ: พร้อมทำ

### T-14 บันทึก audit log การเข้าถึงข้อมูล
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: `backend/app/audit/middleware.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_06.py`
- ต้องทำหลัง: T-01, T-12
- เสร็จเมื่อ: `test_AC_BKG_06` ผ่านโดย audit log มี `actor_id`, `accessed_at` และ `hn` และเก็บข้อมูลได้ตามอายุไม่น้อยกว่า 1 ปี
- สถานะ: พร้อมทำ

### T-15 บังคับการสื่อสารด้วย TLS
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของการ deploy API ตาม NFR-SEC-01
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/main.py`, `backend/tests/test_tls_config.py`
- ต้องทำหลัง: T-12
- เสร็จเมื่อ: การตั้งค่า API และ client ปฏิเสธการเชื่อมต่อที่ต่ำกว่า TLS 1.2 และ test configuration ผ่าน
- สถานะ: พร้อมทำ

### T-16 สร้างหน้าจอเลือกแพ็กเกจและเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-17
- ไฟล์ที่แตะ: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอเลือกแพ็กเกจแสดงช่วงเวลาและที่นั่งจาก API จำลอง และโหลดรายการใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: พร้อมทำ

### T-17 สร้างหน้าจอยืนยันและผลการจอง
- รองรับ: FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-03, AC-BKG-04
- ไฟล์ที่แตะ: `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/AC-BKG-03.test.jsx`, `frontend/src/__tests__/AC-BKG-04.test.jsx`
- ต้องทำหลัง: T-16
- เสร็จเมื่อ: หน้าจอจำลองแสดง "ช่วงเวลาเต็ม" พร้อม 3 ตัวเลือกเมื่อได้ 409 และแสดงหมายเลขคิวเมื่อการจองสำเร็จแม้การแจ้งเตือนล้มเหลว
- สถานะ: พร้อมทำ

### T-18 เชื่อมหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05, IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานเชื่อมต่อของ AC-BKG-01 ถึง AC-BKG-04
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`
- ต้องทำหลัง: T-03, T-05, T-09, T-11, T-17
- เสร็จเมื่อ: หน้าจอเรียก `/api` จริงและแสดงผลสำเร็จ, ข้อผิดพลาดช่วงเวลาเต็ม และผลการแจ้งเตือนตามสัญญา API ใน plan.md
- สถานะ: รอ Q-02

### T-19 ทดสอบประสิทธิภาพการค้นหาช่วงเวลา
- รองรับ: NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_05.py`, `backend/app/slots/service.py`
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: `test_AC_BKG_05` ยิงคำขอจำลองพร้อมกัน 200 รายการและวัด p95 ไม่เกิน 2 วินาที หรือบันทึกผลจริงบนเครื่องทดสอบตาม NFR
- สถานะ: พร้อมทำ

### T-20 ประเมินความสำเร็จของผู้ใช้ใหม่
- รองรับ: NFR-USE-01, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นการตรวจคุณภาพการใช้งานตาม NFR-USE-01
- ไฟล์ที่แตะ: `frontend/src/__tests__/usability-NFR-USE-01.test.jsx`, `docs/srs/` (บันทึกผลการทดสอบตามรูปแบบเอกสารของทีม)
- ต้องทำหลัง: T-17
- เสร็จเมื่อ: อาสาสมัคร 10 คนที่ไม่เคยใช้ระบบจองคิวนี้มาก่อนอย่างน้อย 8 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-05 |
| AC-BKG-02 | T-07 |
| AC-BKG-03 | T-09, T-17 |
| AC-BKG-04 | T-11, T-17 |
| AC-BKG-05 | T-19 |
| AC-BKG-06 | T-14 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-14 |
| IF-IDP-01 | T-12, T-18 |
| IF-HIS-01 | T-01, T-04, T-13 |
| IF-NOT-01 | T-10, T-11 |

## สิ่งที่ยังไม่ทำ

- Q-02 หมายเลขคิวรีเซ็ตรายวันหรือนับต่อเนื่อง และมีรูปแบบอย่างไร เช่น `A001` ยังไม่ได้รับคำตอบจากเจ้าหน้าที่เวชระเบียน
- งานที่ต้องรู้คำตอบ Q-02 คือ T-05, T-07, T-11 และ T-18 จึงยังไม่เริ่มทำตามกติกา และไม่เดารูปแบบหรือวิธีออกหมายเลขคิว
