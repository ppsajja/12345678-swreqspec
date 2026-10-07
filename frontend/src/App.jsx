import SlotPicker from './pages/SlotPicker.jsx'

const mockSlots = [
  { id: 1, slot_date: '2026-09-23', start_time: '09:00', package_code: 'BASIC', remaining: 2 },
  { id: 2, slot_date: '2026-09-23', start_time: '13:00', package_code: 'BASIC', remaining: 4 },
]

const mockApi = {
  // รองรับ FR-BKG-01 และ FR-BKG-06 ระหว่างพัฒนาหน้าจอก่อนต่อ API จริงใน T-18
  async getSlots({ packageCode }) {
    return mockSlots.filter((slot) => !packageCode || slot.package_code === packageCode)
  },
}

// รองรับ FR-BKG-01 และ FR-BKG-06 ด้วยหน้าจอเลือกแพ็กเกจและช่วงเวลา
export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SlotPicker apiClient={mockApi} />
      </div>
    </main>
  )
}
