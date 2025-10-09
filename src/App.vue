<script setup lang="ts">
import Alert from './Alert.vue';

</script>

<template>
  <header>
    <h1>Rules-as-Code (RaC) - Is This A Public Document?</h1>
  </header>
  <main class="container">
    <h3>Answer the following questions to classify this document as public or not.</h3>
    <Alert type="info" title="This only applies for writings and images" description="As per the definition of documents in Ch 2, art 4 FPA, 
      this tool only evaluates writings and images for whether they are to be considered official." />
  </main>
  <footer>
    <h5>This application was developed as a part of the coursework to RaC applications at Karlstad universitet.</h5>
  </footer>
</template>

<style scoped></style>
