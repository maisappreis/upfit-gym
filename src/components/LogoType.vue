<template>
  <div>
    <img src="@/assets/logo.png" alt="Logo" />
  </div>
</template>

<script>
export default {
  name: 'LogoType'
}
</script>

<style scoped>
img {
  height: 100%;
  width: 100%;
}

@media screen and (max-width: 900px) {
  img {
    width: 100%;
    max-height: 100px;
  }
}
</style>