import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import SlotPicker from '../pages/SlotPicker.jsx'

const slotsByPackage = {
  BASIC: [{ id: 1, slot_date: '2026-09-24', start_time: '09:00', remaining: 2 }],
  PLUS: [{ id: 2, slot_date: '2026-09-24', start_time: '13:00', remaining: 4 }],
}

test('แสดงช่วงเวลาและจำนวนที่นั่งจาก API จำลองตาม FR-BKG-01', async () => {
  const apiClient = { getSlots: vi.fn(({ packageCode }) => Promise.resolve(slotsByPackage[packageCode] ?? [])) }

  render(<SlotPicker apiClient={apiClient} />)
  fireEvent.change(screen.getByLabelText('รหัสแพ็กเกจ'), { target: { value: 'BASIC' } })

  expect(await screen.findByText('09:00')).toBeTruthy()
  expect(screen.getByText('เหลือ 2 ที่นั่ง')).toBeTruthy()
})

test('โหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจตาม FR-BKG-06', async () => {
  const apiClient = { getSlots: vi.fn(({ packageCode }) => Promise.resolve(slotsByPackage[packageCode] ?? [])) }

  render(<SlotPicker apiClient={apiClient} />)
  const packageInput = screen.getByLabelText('รหัสแพ็กเกจ')
  fireEvent.change(packageInput, { target: { value: 'BASIC' } })
  expect(await screen.findByText('09:00')).toBeTruthy()

  fireEvent.change(packageInput, { target: { value: 'PLUS' } })
  expect(await screen.findByText('13:00')).toBeTruthy()
  await waitFor(() => expect(screen.queryByText('09:00')).toBeNull())
  expect(apiClient.getSlots).toHaveBeenCalledWith(expect.objectContaining({ packageCode: 'PLUS' }))
})
