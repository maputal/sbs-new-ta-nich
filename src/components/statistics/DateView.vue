<script setup>
defineProps({
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Date View'
  }
})
</script>

<template>
  <div class="date-container">
    <span class="title">
        <h1>{{ title }}</h1>
    </span>
    <span class="date-section">
        <span class="date-label">Date</span>
        <span class="date-value date-badge px-12">{{ date }}</span>
    </span>
  </div>
</template>

<style scoped>
.date-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  font-family: system-ui, -apple-system, sans-serif;
}

.title {
  color: #333;
  font-weight: 500;
}

.date-section {
  display: flex;
  align-items: center;
  gap: 48px;
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #e4e4e5;
  border-radius: 20px;
  padding: 8px 16px;
}

.date-label {
  color: #333;
  font-weight: 600;
  font-size: 1.2em;
}

.date-value {
  color: #dc2626;
  font-weight: 600;
  font-size: 1.2em;
}
</style>