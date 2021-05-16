<template>
  <div class="home">
    <div class="page">
      <div class="ticker-form">
        <input  type="text" class="ticker-form__input" placeholder="Например BTC"
          @keydown.enter="add" v-model="ticker"
        >
        <button @click="add" class="ticker-form__button">Добавить</button>

        <div class="autocomplette">
          <button class="autocomplette-button"
            v-for="suggestion of autocompleteSuggestions"
            :key="suggestion"
            @click="addSuggestion(suggestion)"
          >
            {{suggestion}}
          </button>
        </div>
      </div>    
        <div class="navigation pages margin-top__10">
          <button class="page__button"
            :disabled="page === 1"
            @click="page--"
          >Назад</button>

          Страница {{page}} из {{pages}}
          <button class="page__button"
           :disabled="page >= pages"
            @click="page++"
          >Вперёд</button>
        </div>
        Фильтр: <input type="text" class="filter-input" placeholder="Введите название"
          v-model="filter"
        >
      <CurrenciesScreen class="margin-top__10"
        :messageIfEmpty="{true: 'Добавьте валюту!', false: 'Нет подходящих валют!'}[filter==='']"
        :currencies="paginatedCurrencies"
        @delete-ticker="deleteTicker"
        @select-item="selectItem"
      />
      <Graph class="margin-5"
        v-if="graphIsOpen"
        @graph-close="graphClose"
        :graph="graph"
        :name ="this.selectedItem.code"
      />
    </div>
  </div>
</template>

<script>
import CurrenciesScreen from "@/components/CurrenciesScreen"
import Graph from "@/components/Graph"
import {loadCurrencies, getCoinList} from "@/api"
export default {
  name: 'Home',
  data(){
    return {
      currencies: [],
      ticker: "",
      graph: [],
      selectedItem: null,
      graphIsOpen:false,
      page: 1,
      currenciesOnPage: 6,
      filter: '',
      validCoins: {}
    }
    
  },
  created(){
    this.getValidCoins()
    let currencies = localStorage.getItem('currencies-list')

    if (currencies)
      this.currencies = JSON.parse(currencies)
    setInterval(this.updateCurrencies,5000)
  },
  methods:{
    async getValidCoins(){
      this.validCoins = await getCoinList()
    },
    async updateCurrencies(){
      const data = await loadCurrencies(this.currencies.map(c=>c.code))
      if(!data) return
      console.log(data)
      this.currencies.forEach(c=>{
        const rate = data[c.code]?.USD
        if(rate){
          c.rate = rate
          if(this.selectedItem?.code === c.code)
              this.graph.push(rate)
        }
      })
    },
    add(){
      let t = this.ticker.trim().toUpperCase()
      this.ticker = ""
      if(!t || !(t in this.validCoins) || this.currencies.find(c=>c.code.toUpperCase() === t) ) return;
      
      const newTicker ={
        code: this.validCoins[t].code,
        rate: 'none',
        name: this.validCoins[t].name
      }
      this.currencies.push(newTicker)
      localStorage.setItem('currencies-list', JSON.stringify(this.currencies))
    },
    addSuggestion(s){
      this.ticker = s
      this.add()
      this.ticker = ''

    },
    deleteTicker(ticker, isEqual){
      this.currencies = this.currencies.filter(currency => currency.code != ticker)
      if(isEqual){
        this.selectedItem = null
        this.graphClose()
      }
      localStorage.setItem('currencies-list', JSON.stringify(this.currencies))
    },
    selectItem(item){
      this.selectedItem = item
      this.graphIsOpen = true
    },
    graphClose(){
      this.graphIsOpen = false
      this.graph = []
    }
  },
  computed:{
    paginatedCurrencies(){
            let start = this.page * this.currenciesOnPage -this.currenciesOnPage
            let end = this.page * this.currenciesOnPage
            return this.filteredCurrencies.slice(start, end)
    },
    filteredCurrencies(){
      return this.currencies.filter(c=> c.code.toUpperCase().includes(this.filter.toUpperCase()))
    },
    pages(){
      return Math.ceil(this.filteredCurrencies.length / this.currenciesOnPage) || 1
    },
    autocompleteSuggestions(){
      if(this.ticker.trim() === '') return
      let coins = []
      for (let coin of Object.keys(this.validCoins)){
        if (coin.includes(this.ticker.toUpperCase()))
        coins.push(coin)
      }
      return coins.sort((a,b)=>a.length - b.length).slice(0,5)
    }
  },
  watch:{
    selectedItem(){
      this.graph = []
    },
    filter(){
      this.page = 1
    },
    paginatedCurrencies(value){
      if (value.length === 0 && this.page != 1)
        this.page--
    }
  },
  components: {
    CurrenciesScreen,
    Graph
  }
}
</script>

<style scoped>
  *{
    margin:0;
    padding:0;
  }
  .home{
    margin-top: 15px;
  }
  .page{
    width:60%;
    min-width:600px;
    margin: 0 auto;
  }
  .ticker-form{
    margin-bottom: 20px;
  }
  .ticker-form__input{
    width: 200;
    height: 30px;
    margin: 0 10px 5px 0;
  }
  .ticker-form__button{
    width: 80px;
    height: 30px;
    box-shadow: 0px 0px 2px 1px rgb(117, 117, 117);
    border:none;
    color: rgb(0, 0, 0);
    background-color: rgb(240, 240, 240);
  }
  .ticker-form__button:hover{
    background-color: rgb(111, 255, 118);
  }
  .navigation{
  }
  .page__button{
    width: 60px;
    height: 25px;
    outline:none;
  }
  .autocomplette-button{
    margin: 2px;
    padding: 3px;
    border-radius: 100px;
    border:dashed 1px black;
    color: black;
    font-weight: bold;
    background-color: rgb(0, 204, 109);
    font-size: 10px;
    cursor:pointer;
  }
  .margin-5{
    margin:5px;
  }
  .margin-top__10{
    margin-top: 10px;
  }
</style>