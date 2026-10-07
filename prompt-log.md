# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ต้องลบของเก่า

---

## 2569-09-23 08:00 UTC คำสั่ง: /tasks

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์: `specs/001-booking/spec.md`, `specs/001-booking/plan.md`
- คำถามที่ AI ถาม: ไม่มี
- คำตอบของทีม: ไม่มีคำถามเพิ่มเติม เนื่องจาก `spec.md` เป็น Draft v2 และ Q-02 ถูกระบุไว้เป็น Open Question แล้ว
- ผลลัพธ์: สร้าง `specs/001-booking/tasks.md` จำนวน 19 task โดยอ้างอิง FR, NFR, Constraint และ AC ตาม spec
- Task ที่รอ Open Question: T-05, T-07, T-11 และ T-18 รอ Q-02 เรื่องรูปแบบและวิธีออกหมายเลขคิว
- สิ่งที่ยังไม่ทำ: ยังไม่เริ่มทำ task ใด ๆ และไม่เดาคำตอบ Q-02

---

## 2569-09-23 คำสั่ง: /implement T-01

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: `backend/app/db/models.py`, `backend/app/db/session.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ผลลัพธ์: สร้างโมเดล `slots`, `bookings` และ `audit_logs`, migration สำหรับสร้าง schema, session ที่อ่าน `DATABASE_URL` และ fixture SQLite in-memory
- ผล test: schema check ผ่านและ `python -m compileall -q app tests` ผ่าน; `pytest -q` ยังไม่มี test ให้รันและคืนค่า `no tests ran`
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่ได้เดารูปแบบหรือวิธีออกหมายเลขคิวตาม Q-02 จึงเว้น `queue_no` เป็น nullable ตาม plan

---

## 2569-09-23 คำสั่ง: /implement T-16

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ผลลัพธ์: สร้างหน้าจอเลือกวันที่และรหัสแพ็กเกจ แสดงช่วงเวลาพร้อมจำนวนที่นั่งจาก API จำลอง และโหลดรายการใหม่เมื่อเปลี่ยนแพ็กเกจตาม FR-BKG-01 และ FR-BKG-06
- ผล test: `npm test` ผ่าน 2 test files และ 3 tests; `npm run build` ผ่าน
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่ได้กำหนดรายการหรือรหัสแพ็กเกจเอง เพราะ spec ไม่ระบุ จึงใช้ช่องกรอกรหัสแพ็กเกจตามสัญญา `package_code` ใน plan

---

## 2569-09-23 คำสั่ง: แก้ proxy error หลัง /implement T-16

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: `frontend/src/App.jsx`
- ผลลัพธ์: เปลี่ยนการเริ่มต้นของหน้าจอ T-16 ให้ใช้ API จำลองตาม plan จึงไม่เรียก proxy ไป `/slots` ก่อนที่ T-18 จะต่อ API จริง
- ผล test: `npm test` ผ่าน 2 test files และ 3 tests; `npm run build` ผ่าน
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ตรวจแล้วว่า backend ยังไม่มี `app/main.py` และ port 8000 ไม่มี service จึงไม่เปิด backend แทน และคง `api/client.js` ไว้สำหรับ T-18
