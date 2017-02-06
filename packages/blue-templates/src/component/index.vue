<script src="./{{ name }}.js"></script>

<style module src="./{{ name }}.css"></style>

<template>
  <div :class="$style.{{ type }}">
    {{ name }} {{ type }}
  </div>
</template>
