<template>
  <div id="secondcomponent">
    <div slot="header" class="clearfix">
      <h1 style="line-height: 36px; color: #20A0FF">豆瓣电影排行榜1</h1>
    </div>
    <div v-for="article in articles" class="text item">
      {{article.title}}
    </div>
    <div slot="header" class="clearfix">
      <h1 style="line-height: 36px; color: #20A0FF">豆瓣电影排行榜2</h1>
    </div>
    <div v-for="article in articles" class="text item">
      {{article.title}}
    </div>
    <div slot="header" class="clearfix">
      <h1 style="line-height: 36px; color: #20A0FF">豆瓣电影排行榜3</h1>
    </div>
    <div v-for="article in articles" class="text item">
      {{article.title}}
    </div>
    <div slot="header" class="clearfix">
      <h1 style="line-height: 36px; color: #20A0FF">豆瓣电影排行榜4</h1>
    </div>
    <div v-for="article in articles" class="text item">
      {{article.title}}
    </div>
    <div slot="header" class="clearfix">
      <h1 style="line-height: 36px; color: #20A0FF">豆瓣电影排行榜5</h1>
    </div>
    <div v-for="article in articles" class="text item">
      {{article.title}}
    </div>
    <div slot="header" class="clearfix">
      <h1 style="line-height: 36px; color: #20A0FF">豆瓣电影排行榜6</h1>
    </div>
    <div v-for="article in articles" class="text item">
      {{article.title}}
    </div>
    <div slot="header" class="clearfix">
      <h1 style="line-height: 36px; color: #20A0FF">豆瓣电影排行榜7</h1>
    </div>
    <div v-for="article in articles" class="text item">
      {{article.title}}
    </div>
  </div>
</template>

<script>
  export default {
    // name: "secondcomponent",
    data() {
      return {
        articles: []
      }
    },
    mounted: function () {
      this.$http.jsonp('https://api.douban.com/v2/movie/top250?count=10', {}, {
        headers: {},
        emulateJSON: true
      }).then(function (res) {
        this.articles = res.data.subjects
      }, function (res) {
        console.log(res)
      })
    }
  }
</script>

<style scoped>
#secondcomponent{
  background: red;
  border: 5px solid gold;
  text-align: center;
}
</style>
