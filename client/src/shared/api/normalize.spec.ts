import { describe, expect, it } from 'vitest'
import { normalizeIds } from './normalize'

describe('normalizeIds', () => {
  it('maps _id.$oid to a string id', () => {
    expect(normalizeIds({ _id: { $oid: 'abc' }, name: 'Dress' })).toEqual({ id: 'abc', name: 'Dress' })
  })

  it('normalizes nested documents and arrays', () => {
    const input = {
      _id: { $oid: 'p1' },
      images: [
        { _id: { $oid: 'i1' }, url: 'a' },
        { _id: { $oid: 'i2' }, url: 'b' },
      ],
      size_ids: [{ $oid: 's1' }, 's2'],
    }
    expect(normalizeIds(input)).toEqual({
      id: 'p1',
      images: [
        { id: 'i1', url: 'a' },
        { id: 'i2', url: 'b' },
      ],
      size_ids: ['s1', 's2'],
    })
  })

  it('leaves other values untouched', () => {
    expect(normalizeIds({ published: true, count: 3, text: null })).toEqual({ published: true, count: 3, text: null })
    expect(normalizeIds(null)).toBeNull()
  })
})
