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
}

@media screen and (max-width: 800px) {
  img {
    height: 85%;
  }
}
</style>