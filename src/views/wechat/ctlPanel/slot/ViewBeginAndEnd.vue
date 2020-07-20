<template>
  <div class="box">
    <div class="head">
      <img class="back" src="../img/back.png" alt="" @click="toHome">
      <img class="head-img" :src="companyLogo" alt="">
    </div>
    <slot name="content" />
    <div class="end" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import companyConfig from '../CompanyConfig';

export default {
  name: 'ViewBeginAndEnd',
  computed: {
    ...mapState('device', ['index']),
    companyLogo() {
      return this.index.logo
    }
  },
  methods: {
    toHome() {
      this.$emit('changeView')
    }
  }
}
</script>

<style scoped>
  .box {
    background-color: #d1d1d1;
    width: 100%;
    height: 779px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .head {
    max-width: 420px;
    flex: none;
    background-color: #2980b9;
    width: 80%;
    height: 9%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .head-img {
    height: 80%;
  }

  .back{
    position: absolute;
    left:0;
    padding: 10px;
    height: 56px;
  }

  .end {
    max-width: 420px;
    flex: none;
    background-color: #2980b9;
    width: 80%;
    height: 2%;
  }

</style>
