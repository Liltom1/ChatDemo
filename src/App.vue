<template>
    <div id="app">
        <!-- <RouterLink to="/Chat">Go to About</RouterLink> -->
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import { ref,reactive} from 'vue'

</script>
<style scoped>
#app {
    height: 70vh;
}
</style>