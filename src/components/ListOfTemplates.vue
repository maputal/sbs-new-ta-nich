<script setup>
  defineProps([
    'listOfTemplates', 
    'toTimeDMYHM',
  ])

  const emits = defineEmits([
    'click',
  ])

  const bodyTemplate = ref('')


  const isOpen = ref(false);
  const selectedOption = ref(null);
  const options = [
    { value: 'option1', text: 'Option 1' },
    { value: 'option2', text: 'Option 2' },
    { value: 'option3', text: 'Option 3' },
  ];

  const selectedOptionText = () => {
    return selectedOption.value ? selectedOption.value.text : 'Select an option';
  };

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const selectOption = (option) => {
    selectedOption.value = option;
    isOpen.value = false;
  };
</script>

<template>
  <!-- <div 
    v-for="(template, index) in listOfTemplates"
    :key="index"
    class="d-flex align-center"
  >
    <VCol
      cols="12"
      class="pa-0"
    > 
      <div class="d-flex align-center pa-0">
        Status:
      </div>
      <div 
        class="d-flex align-center pa-0"
      >
        {{ template}}
      </div>
      <VDivider />
    </VCol>
  </div> -->


  <div class="custom-select" @click="toggleDropdown">
    <div class="selected-option">{{ selectedOptionText }}</div>
    <div class="dropdown" v-show="isOpen">
      <div v-for="(option, index) in options" :key="index" @click="selectOption(option)">
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<style lang=scss scoped>
.no-wrap {
  -webkit-line-clamp: unset;
}

.custom-select {
  position: relative;
  width: 200px; /* Adjust as needed */
}

.selected-option {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  background-color: #fff;
  display: none;
}

.dropdown div {
  padding: 10px;
  cursor: pointer;
}

.dropdown div:hover {
  background-color: #f0f0f0;
}
</style>
