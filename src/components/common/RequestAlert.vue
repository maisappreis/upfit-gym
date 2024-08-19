<template>
  <div>
    <div v-if="showSuccessAlert" class="alert-area success">
      <div class="marker green"></div>
      <div class="message">
        <font-awesome-icon icon="fa-solid fa-check" class="icon" />
        <slot></slot>
      </div>
    </div>
    <div v-else class="alert-area error">
      <div class="marker red"></div>
      <div class="message">
        <font-awesome-icon icon="fa-solid fa-xmark" class="icon" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestAlert',

  props: {
    responseMessage: String
  },

  computed: {
    showSuccessAlert() {
      return !this.responseMessage.trim().toLowerCase().includes('erro')
    }
  },

  methods: {
    closeMessage() {
      this.$emit('closeMessage')
    }
  },

  mounted() {
    setTimeout(this.closeMessage, 30000)
  }
}
</script>

<style scoped>
.alert-area {
  position: absolute;
  top: 15px;
  right: 75px;
  min-height: 90px;
  height: fit-content;
  min-width: 500px;
  max-width: 80vw;
  z-index: 99;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.success {
  background-color: rgb(154, 220, 154);
}

.error {
  background-color: rgb(243, 186, 186);
}

.marker {
  width: 3%;
  height: 100%;
  border-radius: 8px 0 0 8px;
}

.red {
  background-color: red;
}

.green {
  background-color: rgb(19, 163, 0);
}

.message {
  width: 97%;
  height: 100%;
  font-size: 18px;
}

.icon {
  margin-right: 15px;
  font-size: 20px;
}

@media only screen and (max-width: 1000px) {
  .alert-area {
    top: 25px;
    right: 25px;
    height: 50px;
    width: 300px;
  }

  .message {
    width: 95%;
    font-size: 14px;
  }

  .icon {
    font-size: 15px;
  }
}
</style>