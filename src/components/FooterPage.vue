<template>
    <div class="footer-area">
      <span class="footer-text">
        Desenvolvido com <font-awesome-icon icon="fa-solid fa-heart" class="red" /> por <span class="red">Maisa</span>.
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
  top: 94vh;
  left: 230px;

  width: 83vw;
  height: 30px;
  padding: 10px;
  text-align: center;
  background-color: var(--gray-dark-color);
}

.footer-text {
  color: white;
  font-size: 16px;
  text-align: left;
  /* font-family: 'Marcellus', serif, sans-serif; */
}

.red {
    color: red;
    font-family: 'Dancing Script', Arial, Helvetica, sans-serif;
    font-size: 20px;
}
</style>