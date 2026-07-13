import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export function FAQAccordion({ items, defaultOpen = -1 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  const item = items[0]

  if (!item) return null

  const isOpen = openIndex === 0

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpenIndex(isOpen ? -1 : 0)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-gray-800"
      >
        {item.question}
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 px-4 py-3 text-sm leading-relaxed text-gray-600">
          {item.answer}
        </div>
      )}
    </div>
  )
}
