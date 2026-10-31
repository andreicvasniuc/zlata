<script setup lang="ts">
import type { ContactGroup } from '@shared/types'
import { iconForClass } from '../icons'

defineProps<{ list: ContactGroup[] }>()
</script>

<template>
  <div class="fh5co-feature-1">
    <div class="fh5co-feature-blurb">
      <ul>
        <li v-for="contactGroup in list" :key="contactGroup.id">
          <span class="fh5co-feature-blurb-icon">
            <component :is="iconForClass(contactGroup.css_class)" class="size-[40px] text-accent" />
          </span>

          <div class="fh5co-feature-blurb-text">
            <h2 class="fh5co-feature-blurb-title h4 uppercase">{{ contactGroup.name }}</h2>
            <p v-for="contact in contactGroup.contacts" :key="contact.id" class="fh5co-feature-blurb-description">
              {{ contact.name }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.fh5co-feature-1 .fh5co-feature-blurb ul {
  padding: 0;
  margin: 0;
}
.fh5co-feature-1 .fh5co-feature-blurb ul li {
  float: left;
  width: 100%;
  padding: 0;
  margin: 0 0 1em 0;
  list-style: none;
}
.fh5co-feature-1 .fh5co-feature-blurb-text {
  float: right;
  width: 85%;
}
.fh5co-feature-1 .fh5co-feature-blurb-icon {
  float: left;
  width: 15%;
  padding-top: 7px;
  position: relative;
}
.fh5co-feature-1 .fh5co-feature-blurb-title {
  letter-spacing: 2px;
  margin-bottom: 0 !important;
  font-size: 16px;
  line-height: 28px;
}
.fh5co-feature-1 .fh5co-feature-blurb-description {
  margin-bottom: 0;
}
@media screen and (max-width: 992px) {
  .fh5co-feature-1 .fh5co-feature-blurb ul li {
    width: 50%;
  }
  .fh5co-feature-1 .fh5co-feature-blurb-text {
    width: 75%;
  }
  .fh5co-feature-1 .fh5co-feature-blurb-icon {
    width: 20%;
  }
}
@media screen and (max-width: 768px) {
  .fh5co-feature-1 .fh5co-feature-blurb-icon {
    width: 10%;
  }
}
@media screen and (max-width: 500px) {
  .fh5co-feature-1 .fh5co-feature-blurb ul li {
    width: 51%;
  }
  .fh5co-feature-1 .fh5co-feature-blurb-text {
    width: 65%;
  }
  .fh5co-feature-1 .fh5co-feature-blurb-icon {
    width: 20%;
  }
}
</style>
