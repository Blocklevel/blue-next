<script src="./home.js"></script>
<style module src="./home.css"></style>

<template>
  <div :class="$style.page">
    <div :class="$style.content">
      <h1 :class="$style.title" v-html="$t('app')"></h1>
    </div>
  </div>
</template>
