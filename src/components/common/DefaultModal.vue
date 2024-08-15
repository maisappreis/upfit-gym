<template>
  <div class="modal-area" :class="{ 'top-up': isForm, 'top-down': !isForm }">
    <slot></slot>
    <div v-if="!isForm" class="form-buttons-area">
      <DefaultButton style="background-color: green" @executeAction="$emit('executeAction')">
        {{ buttonMessage }}
      </DefaultButton>
      <DefaultButton style="background-color: red" @executeAction="$emit('closeModal')">
        Cancelar
      </DefaultButton>
    </div>
  </div>
</template>

<script>
import DefaultButton from './DefaultButton.vue'

export default {
  name: 'DefaultModal',

  components: {
    DefaultButton
  },

  props: {
    buttonMessage: {
      type: String,
      required: false,
      default: 'Confirmar'
    },
    isForm: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped>
.modal-area {
  position: absolute;
  left: 20vw;
  background-color: white;
  height: fit-content;
  width: 40vw;
  z-index: 12;
  border-radius: 10px;
}

.top-up {
  top: 30px;
}

.top-down {
  top: 25vh;
}

@media only screen and (max-width: 1000px) {
  .modal-area {
    left: 10vw;
    width: 75vw;
    overflow: auto;
    max-height: 240px;
  }
}
</style>