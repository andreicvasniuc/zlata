// The Rails API renders every ObjectId as `{ "$oid": "..." }` and documents' ids as `_id`.
// This is the only place that knows about it: responses leave here with plain string ids under `id`.

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isOid = (value: Record<string, unknown>): value is { $oid: string } =>
  typeof value.$oid === 'string' && Object.keys(value).length === 1

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize)
  if (!isRecord(value)) return value
  if (isOid(value)) return value.$oid

  const result: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value)) {
    result[key === '_id' ? 'id' : key] = normalize(child)
  }
  return result
}

export function normalizeIds<T = unknown>(value: unknown): T {
  return normalize(value) as T
}
