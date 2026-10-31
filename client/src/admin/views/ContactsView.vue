<script setup lang="ts">
import { contactGroupsApi } from '@shared/api/resources/contactGroups'
import ParentSelector from '../components/ParentSelector.vue'

const load = async () => (await contactGroupsApi.list()).contactGroups
</script>

<template>
  <ParentSelector
    title="CONTACTS"
    parent-label="CONTACT_GROUP_"
    add-parent-label="GO_AND_ADD_CONTACT_GROUPS"
    parent-list-path="/contact-groups"
    :load="load"
    :child-path="(slug) => `/contact-group/${encodeURIComponent(slug)}/contacts`"
  />
</template>
