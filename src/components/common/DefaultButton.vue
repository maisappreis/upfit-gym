<template>
  <button
    class="button-area"
    @click="$emit('executeAction')"
    :class="{ green: !disable, disabled: disable }"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'DefaultButton',

  props: {
    disable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.button-area {
  margin: 15px 20px 0px 20px;
  border: none;
  padding: 12px 20px;
  color: white;
  width: 200px;

  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
}

.green {
  background-color: green;
}

.disabled {
  background-color: rgba(3, 144, 3, 0.579);
  cursor: not-allowed;
}

@media only screen and (max-width: 900px) {
  .button-area {
    margin: 10px 5px 0px 5px;
    height: 30px;
    padding: 5px 20px;
    width: 110px;
  }
}
</style>