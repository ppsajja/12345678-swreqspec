import { useEffect, useState } from 'react'

function today() {
  return new Date().toISOString().slice(0, 10)
}

// รองรับ FR-BKG-01 และ FR-BKG-06 ด้วยการแสดง slot และโหลดใหม่ตาม package_code
export default function SlotPicker({ apiClient, onSlotSelected }) {
  const [dateFrom, setDateFrom] = useState(today)
  const [packageCode, setPackageCode] = useState('')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadSlots() {
      setLoading(true)
      setError('')
      try {
        const result = await apiClient.getSlots({ dateFrom, packageCode })
        if (active) setSlots(Array.isArray(result) ? result : result.slots ?? [])
      } catch {
        if (active) setError('ไม่สามารถโหลดช่วงเวลาที่ว่างได้')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSlots()
    return () => {
      active = false
    }
  }, [apiClient, dateFrom, packageCode])

  return (
    <section aria-labelledby="slot-picker-title" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Booking</p>
        <h1 id="slot-picker-title" className="mt-2 text-3xl font-bold text-slate-900">
          เลือกแพ็กเกจและช่วงเวลาตรวจ
        </h1>
        <p className="sr-only">ระบบจองคิวตรวจสุขภาพ</p>
        <p className="mt-2 text-slate-600">แสดงช่วงเวลาที่ว่างภายใน 30 วันข้างหน้า</p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          วันที่เริ่มค้นหา
          <input
            aria-label="วันที่เริ่มค้นหา"
            className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          รหัสแพ็กเกจ
          <input
            aria-label="รหัสแพ็กเกจ"
            className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            placeholder="กรอกรหัสแพ็กเกจ"
            value={packageCode}
            onChange={(event) => setPackageCode(event.target.value)}
          />
        </label>
      </div>

      {loading && <p role="status">กำลังโหลดช่วงเวลาที่ว่าง...</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-3" aria-label="ช่วงเวลาที่ว่าง">
          {slots.length === 0 && <p className="text-slate-600">ไม่พบช่วงเวลาที่ว่าง</p>}
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-teal-500"
              onClick={() => onSlotSelected?.(slot)}
            >
              <span>
                <span className="block font-semibold text-slate-900">{slot.start_time}</span>
                <span className="text-sm text-slate-600">{slot.slot_date}</span>
              </span>
              <span className="text-sm font-semibold text-teal-700">เหลือ {slot.remaining} ที่นั่ง</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
