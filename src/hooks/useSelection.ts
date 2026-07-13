import { useState } from 'react'

export function useSelection(allIds: string[]) {
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function enterSelectionMode(id?: string) {
    setIsSelectionMode(true)
    if (id) setSelectedIds(new Set([id]))
  }

  function exitSelectionMode() {
    setIsSelectionMode(false)
    setSelectedIds(new Set())
  }

  function toggleRow(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelectedIds(new Set(allIds))
  }

  function deselectAll() {
    setSelectedIds(new Set())
  }

  const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.has(id))
  const someSelected = selectedIds.size > 0

  return {
    isSelectionMode,
    selectedIds,
    allSelected,
    someSelected,
    enterSelectionMode,
    exitSelectionMode,
    toggleRow,
    selectAll,
    deselectAll,
  }
}
