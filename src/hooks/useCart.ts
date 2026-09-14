'use client'
import { useState } from 'react'

export function useCart() {
  const [items, setItems] = useState<any[]>([])
  return { items, setItems }
}
