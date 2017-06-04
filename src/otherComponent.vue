<template>
  <div>
    This is a test
  </div>
</template>

<script>
  export default {
    data () {
      return {
        count: 0
      }
    },
    created() {
      // Upon creation, do something
    },
    filters: {
      filter_something: function(value) {
        return value + 'filtered';
      }
    },
    computed: {
      computed_value: function() {
        return 'This is a computed value';
      }
    },
    watch: {
      computed_value: function() {
        console.log('The compute value just changed.')
      }
    },
    methods: {
      increment () {
        this.count ++;
      }
    }
  }
</script>

<style>

</style>