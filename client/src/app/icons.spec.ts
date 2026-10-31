import { describe, expect, it } from 'vitest'
import { iconForClass } from './icons'

describe('iconForClass', () => {
  it('maps every Themify class used by the data to its own icon', () => {
    const classes = ['ti-telegram', 'ti-instagram', 'ti-vk', 'ti-facebook', 'ti-skype', 'ti-viber', 'ti-email']
    const icons = classes.map((cssClass) => iconForClass(cssClass))

    expect(new Set(icons).size).toBe(classes.length)
    expect(iconForClass('ti-pinterest-alt')).toBe(iconForClass('ti-pinterest'))
  })

  it('uses a generic icon for anything else', () => {
    expect(iconForClass('ti-unknown')).toBe(iconForClass(undefined))
    expect(iconForClass('ti-unknown')).not.toBe(iconForClass('ti-telegram'))
  })
})
