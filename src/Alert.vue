<template>
  <div :class="'alert ' + type" :data-type="type">
    <header class="alert-header" @click="toggleOpen" :aria-expanded="isOpen">
      <div class="alert-title-group">
        <span class="icon" v-html="alertIcon"></span>
        <h2 class="title">{{ title }}</h2>
      </div>
      <span class="toggle-icon" :class="{ 'is-open': isOpen }" v-html="chevronIcon"></span>
    </header>

    <div class="alert-content-wrapper" :style="contentStyle">
      <div class="alert-content">
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface AlertProps {
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  description: string
}

const props = defineProps({
  type: {
    type: String as () => AlertProps['type'],
    required: true,
    validator: (value: string) => ['info', 'warning', 'error', 'success'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

const ICON_SVGS: Record<string, string> = {
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  error:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  chevronDown:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
}

const isOpen = ref(false)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const alertIcon = computed(() => {
  return ICON_SVGS[props.type] || ICON_SVGS.info
})

// Computed property to set the dynamic max-height for the accordion transition
// We use a large arbitrary value (500px) because 'auto' is not supported for CSS transitions
const contentStyle = computed(() => ({
  maxHeight: isOpen.value ? '500px' : '0',
}))

const chevronIcon = computed(() => ICON_SVGS.chevronDown)
</script>

<style scoped>
/* Base Component Structure */
.alert {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-left: 4px solid transparent;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  user-select: none;
}

.alert-header:hover {
  opacity: 0.9;
}

.alert-title-group {
  display: flex;
  align-items: center;
}

.alert h2 {
  margin: 0;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1.2;
}

/* Accordion Content */
.alert-content-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.1s ease-out;
}

.alert-content {
  padding: 0 1.2rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  line-height: 1.5;
}

.alert-content p {
  margin: 1rem 0 0 0;
}

/* Icon & Arrow Styles */
.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.toggle-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.toggle-icon.is-open {
  transform: rotate(180deg);
}

/* Color Variants */
.alert[data-type='info'] {
  header {
    border-color: #1f3596;
    background-color: #2f51e7;
    color: white;
  }

  .alert-content-wrapper {
    background-color: #2f51e742;
  }

  h2 {
    color: white;
  }
}

.alert[data-type='success'] {
  header {
    border-color: rgb(61, 117, 63);
    background-color: #1dad22;
    color: white;
  }

  .alert-content-wrapper {
    background-color: #1dad2275;
  }

  h2 {
    color: white;
  }
}

.alert[data-type='warning'] {
  header {
    border-color: #925800;
    background-color: #ff9900;
    color: white;
  }

  .alert-content-wrapper {
    background-color: #ff990062;
  }

  h2 {
    color: white;
  }
}

.alert[data-type='error'] {
  header {
    border-color: #85241d;
    background-color: #f44336;
    color: white;
  }

  .alert-content-wrapper {
    background-color: #f443366c;
  }

  h2 {
    color: white;
  }
}
</style>
