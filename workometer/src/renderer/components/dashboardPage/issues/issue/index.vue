<template>
    <div>
      {{ issue.fields.summary }}
    </div>
</template>

<script>
    export default {
      props: {
        issue: Object
      }
    }
</script>

<style lang="scss" scoped>

</style>