<script setup lang="ts">
import Create from '../components/Create.vue'
import Back from '../components/Back.vue'
import Navbar from '../components/Navbar.vue'
</script>

<template>
  <main>
    <Navbar></Navbar>
    <div class="container">
      <Back></Back>
      <Create></Create>
    </div>
  </main>
</template>
