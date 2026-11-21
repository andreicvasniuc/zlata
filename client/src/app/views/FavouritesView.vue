<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GridItem } from '../components/ItemGrid.vue'
import ItemGrid from '../components/ItemGrid.vue'
import PageLayout from '../components/PageLayout.vue'
import { contactsQuery } from '../contacts'
import { usePageTitle } from '../composables/usePageTitle'
import { useLocalePath } from '../locale'
import { useFavourites } from '../stores/favourites'

const { t } = useI18n()
const localePath = useLocalePath()
const favourites = useFavourites()

const title = computed(() => t('FAVOURITES'))
usePageTitle(title)

const items = computed<GridItem[]>(() => favourites.items.map((item) => ({ ...item, favourite: item })))
const fittingLink = computed(() => ({
  path: localePath('/contacts'),
  query: contactsQuery(
    'fitting',
    favourites.items.map((item) => item.name),
  ),
}))
</script>

<template>
  <PageLayout :heading="title" :intro="t('FAVOURITES_INTRO')" :breadcrumb="[{ name: title }]">
    <div class="wrap listing favourites">
      <template v-if="items.length">
        <ItemGrid :items="items" />
        <div class="favourites__cta">
          <RouterLink :to="fittingLink" class="btn">{{ t('BOOK_FITTING_FOR_FAVOURITES') }}</RouterLink>
        </div>
      </template>
      <div v-else class="favourites__empty">
        <p>{{ t('FAVOURITES_EMPTY') }}</p>
        <RouterLink :to="localePath('/collections')" class="btn">{{ t('BROWSE_COLLECTIONS') }}</RouterLink>
      </div>
    </div>
  </PageLayout>
</template>

<style>
.favourites__cta {
  display: flex;
  justify-content: center;
  margin-top: 56px;
}
.favourites__empty {
  display: grid;
  justify-items: start;
  gap: 28px;
  padding: 32px 0 24px;
  border-top: 1px solid var(--z-line);
}
.favourites__empty p {
  max-width: 520px;
  font-size: 17px;
  color: var(--z-muted);
}
</style>
