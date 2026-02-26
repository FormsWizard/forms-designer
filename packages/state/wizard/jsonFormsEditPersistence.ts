import type { JsonFormsEditState } from './exampleState'

const STORAGE_KEY = 'forms-designer/jsonFormsEdit/v1'

function isJsonFormsEditState(value: unknown): value is JsonFormsEditState {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  if (!o.jsonSchema || typeof o.jsonSchema !== 'object') return false
  if (!o.definitions || typeof o.definitions !== 'object') return false
  if (!o.uiSchemas || typeof o.uiSchemas !== 'object') return false
  if (typeof o.selectedDefinition !== 'string') return false
  if (o.definitionsKey !== 'definitions' && o.definitionsKey !== '$defs') return false
  return true
}

export function loadPersistedJsonFormsEditState(): JsonFormsEditState | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as unknown
    if (!isJsonFormsEditState(parsed)) return undefined
    return parsed
  } catch {
    return undefined
  }
}

export function savePersistedJsonFormsEditState(state: JsonFormsEditState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable
  }
}

export function clearPersistedJsonFormsEditState(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
