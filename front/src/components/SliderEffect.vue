<template>
  <div id="slider">
    <div id="slider_container">
      <h2>FreeScroll</h2>
      <span>
      <Flickity  class="flickity" ref="flickity" :options="flickityOptions">
        <div class="carousel-cell">1</div>
        <div class="carousel-cell">2</div>
        <div class="carousel-cell">3</div>
        <div class="carousel-cell">4</div>
        <div class="carousel-cell">5</div>
      </Flickity>
      </span>
    </div>
  </div>
</template>

<script>
//npm install vue-flickity
import Flickity from 'vue-flickity'

export default {
  components: {
    Flickity
  },
  data () {
    return {
      flickityOptions: {
        initialIndex: 0,
        prevNextButtons: true,
        pageDots: true,
        wrapAround: true,
        freeScroll: true
        // any options from Flickity can be used
      }
    }
  }
}
</script>

<style>
#slider {
  display: table;
  margin: auto;
  height: 100%;
  width: 100%;
}
#slider_container {
  display: table-cell;
  vertical-align: middle;
}

.carousel-cell {
  width: 100%;
  height: 160px;
  margin-right: 10px;
}

@media screen and ( min-width: 768px ) {
  /* half-width cells for larger devices */
  .carousel-cell { width: 50%; }
}
</style>