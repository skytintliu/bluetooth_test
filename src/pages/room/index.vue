<template>
 
</template>

<script setup>
import crc32  from "@/utils/crc32";

console.log(crc32.encryptCrc32('906e7a5e', 1));
</script>
x
<style scoped lang="scss">
.test-container {
  padding: 20px;
  .result-item {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
}
</style>