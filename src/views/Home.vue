<template>
  <div class="home">
      <input  type="text" class="ticker-form__input" placeholder="Например BTC"
        @keydown.enter="add" v-model="ticker"
      >
      <button @click="add" class="ticker-form__button">Добавить</button>

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
    />
  </div>
</template>

<script>
import CurrenciesScreen from "@/components/CurrenciesScreen"
import Graph from "@/components/Graph"
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
      currenciesOnPage: 4,
      filter: ''
    }
    
  },
  created(){
    let currencies = localStorage.getItem('currencies-list')

    if (currencies){
      this.currencies = JSON.parse(currencies)
      this.currencies.forEach(c => setInterval(async ()=>{this.addFetch(c)},5000))
    }
  },
  methods:{
    addFetch(newTicker){
      
       fetch(`https://min-api.cryptocompare.com/data/price?fsym=${newTicker.code}&tsyms=USD&api_key=4104769462fe146c52a8d6d1b4bb86966d73b85a8da6ba7790ce38f29f6da2e0`)
          .then((responce)=>{
              return responce.json()
          })
          .then((data) =>{
            console.log(data)
            this.currencies.find(c=> c.code ===  newTicker.code).rate = data.USD
            if(this.selectedItem?.code === newTicker.code)
              this.graph.push(data.USD)
          })
      
    },
    add(){
      let t = this.ticker.trim()
      this.ticker = ""
      if(!t || this.currencies.find(c=>c.code.toLowerCase() === t.toLowerCase()) ) return;
      const newTicker ={
        code: t,
        rate: 'none',
        name: 'none'
      }
      this.currencies.push(newTicker)
      localStorage.setItem('currencies-list', JSON.stringify(this.currencies))
      setInterval(async ()=>{this.addFetch(newTicker)},5000)
    },
    deleteTicker(ticker, isEqual){
      this.currencies = this.currencies.filter(currency => currency.code != ticker)
      if(isEqual){
        this.selectedItem = null
        this.graphClose()
      }
      if (this.page!==1 && (this.page-1) * this.currenciesOnPage +1 > this.filteredCurrencies.length)
       this.page--
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
      return this.currencies.filter(c=> c.code.includes(this.filter))
    },
    pages(){
      return Math.ceil(this.filteredCurrencies.length / this.currenciesOnPage) || 1
    }
  },
  watch:{
    selectedItem(){
      this.graph = []
    },
    filter(){
      this.page = 1
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

.ticker-form__input{
  width: 200;
  height: 30px;
  margin: 10px;
  

}
.ticker-form__button{
  width: 80px;
  height: 30px;
  border-radius: 100px;
  outline:none;
}
.navigation{
}
.page__button{
  width: 60px;
  height: 25px;
  outline:none;
}
.margin-5{
  margin:5px;
}
.margin-top__10{
  margin-top: 10px;
}
</style>