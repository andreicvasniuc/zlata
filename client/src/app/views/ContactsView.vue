<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { collectionsApi, colorsApi, contactGroupsApi, sizesApi } from '@shared/api/resources/public'
import ContactForm from '../components/ContactForm.vue'
import ContactGroups from '../components/ContactGroups.vue'
import PageLayout from '../components/PageLayout.vue'
import { useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'
import { useLocalePath } from '../locale'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const title = computed(() => t('CONTACTS'))
usePageTitle(title)

const queryValue = (name: string) => {
  const value = route.query[name]
  return typeof value === 'string' ? value : undefined
}

// An enquiry from a product page names the dress in the URL (`?collection=..&product=..&size=..&color=..`, ids only,
// never personal data). It is checked against the published catalog; anything unknown is ignored.
async function loadEnquiry() {
  const collectionSlug = queryValue('collection')
  const productSlug = queryValue('product')
  if (!collectionSlug || !productSlug) return undefined

  try {
    const { collection } = await collectionsApi.get(collectionSlug)
    const product = collection?.published
      ? collection.products?.find((item) => item.published && item.slug === productSlug)
      : undefined
    if (!product) return undefined

    const sizeId = queryValue('size')
    const colorId = queryValue('color')
    const size =
      sizeId && product.size_ids?.includes(sizeId)
        ? (await sizesApi.list()).sizes?.find((s) => s.id === sizeId)
        : undefined
    const color =
      colorId && product.color_ids?.includes(colorId)
        ? (await colorsApi.list()).colors?.find((c) => c.id === colorId)
        : undefined

    const url = new URL(router.resolve(localePath(`/${collection.slug}/${product.slug}`)).href, window.location.origin)
      .href
    const lines = [t('ENQUIRY_GREETING', { name: product.name, url })]
    if (size) lines.push(t('ENQUIRY_SIZE', { size: size.name }))
    if (color) lines.push(t('ENQUIRY_COLOR', { color: color.name }))
    return { name: product.name, message: `${lines.join('\n')}\n` }
  } catch {
    // the form works without the context
    return undefined
  }
}

// the form works without the contact details and without the enquiry context
async function loadGroups() {
  try {
    return (await contactGroupsApi.list()).contact_groups ?? []
  } catch {
    return []
  }
}

const { data, loading } = useLoader(async () => ({ groups: await loadGroups(), enquiry: await loadEnquiry() }))
</script>

<template>
  <PageLayout :heading="title" :lead="t('CONTACTS_INTRO')" :breadcrumb="[{ name: title }]" :loading="loading">
    <div class="contacts-layout">
      <ContactForm v-if="data" :initial-message="data?.enquiry?.message" :context="data?.enquiry?.name" />
      <ContactGroups :list="data?.groups ?? []" />
    </div>
  </PageLayout>
</template>

<style>
.contacts-layout {
  display: grid;
  gap: 48px;
}
@media (min-width: 992px) {
  .contacts-layout {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 80px;
  }
}
</style>
