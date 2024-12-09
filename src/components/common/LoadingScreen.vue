<template>
  <div class="overlay">
    <div class="conteiner">
      <div class="spinner" />
      <h3 class="message">
        <slot></slot>
      </h3>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.conteiner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid transparent;
  border-top: 5px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.message {
  margin-top: 20px;
  font-weight: bold;
  color: white;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>