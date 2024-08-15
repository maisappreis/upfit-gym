<template>
  <div class="footer-area">
    <span class="footer-text">
      Desenvolvido com
      <font-awesome-icon icon="fa-solid fa-heart" class="red" /> por <span class="red">Maisa</span>.
    </span>
  </div>
</template>

<script>
export default {
  name: 'FooterPage'
}
</script>

<style scoped>
.footer-area {
  position: fixed;
  bottom: 0;
  left: 230px;

  width: 85vw;
  height: 25px;
  padding: 5px;
  text-align: center;
  background-color: var(--gray-dark-color);
}

.footer-text {
  color: white;
  font-size: 16px;
  text-align: left;
}

.red {
  color: red;
  font-family: 'Dancing Script', Arial, Helvetica, sans-serif;
  font-size: 20px;
}

@media only screen and (max-width: 1300px) {
  .footer-area {
    left: 100px;
    width: 100%;
  }
}

@media only screen and (max-width: 1000px) {
  .footer-area {
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 25px;
    padding: 0 5px 5px 5px;
  }

  .red {
    font-size: 15px;
  }

  .footer-text {
    font-size: 10px;
  }
}
</style>