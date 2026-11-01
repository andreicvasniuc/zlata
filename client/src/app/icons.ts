import type { Component } from 'vue'
import IconMail from '~icons/lucide/mail'
import IconLink from '~icons/lucide/link'
import IconTelegram from '~icons/simple-icons/telegram'
import IconInstagram from '~icons/simple-icons/instagram'
import IconVk from '~icons/simple-icons/vk'
import IconPinterest from '~icons/simple-icons/pinterest'
import IconFacebook from '~icons/simple-icons/facebook'
import IconSkype from '~icons/simple-icons/skype'
import IconViber from '~icons/simple-icons/viber'
import IconWhatsapp from '~icons/simple-icons/whatsapp'
import IconPhone from '~icons/lucide/phone'

// Social networkings and contact groups store the Themify class of their icon (`ti-telegram`, ...) in the database.
// The Themify font is gone; the known classes map to Iconify icons, anything else gets a generic link icon.
const byThemifyClass: Record<string, Component> = {
  'ti-telegram': IconTelegram,
  'ti-instagram': IconInstagram,
  'ti-vk': IconVk,
  'ti-pinterest-alt': IconPinterest,
  'ti-pinterest': IconPinterest,
  'ti-facebook': IconFacebook,
  'ti-skype': IconSkype,
  'ti-viber': IconViber,
  'ti-whatsapp': IconWhatsapp,
  'ti-mobile': IconPhone,
  'ti-email': IconMail,
}

export const iconForClass = (cssClass?: string): Component => (cssClass && byThemifyClass[cssClass]) || IconLink
