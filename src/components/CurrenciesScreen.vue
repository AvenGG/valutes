<template >
<div class="container">
    <div v-if="!currencies.length" class="no-tickers-message">{{messageIfEmpty}}</div>
    <Item 
        v-for="currency in currencies"
        :currency="currency"
        :key="currency.code"
        :selected="selectedItem === currency"
        @delete-ticker="deleteTicker"
        @click.native="selectItem(currency)"
    />
</div>
   
</template>

<script>
import Item from "@/components/Item"
export default {
    name:'CurrenciesScreen',
    data(){
        return {
            selectedItem: null
        }
    },
    props: {
        currencies:{
            type: Array
        },
        messageIfEmpty:{
            type:String
        }
    },
    methods:{
        deleteTicker(ticker){
            let isEqual = false
            if(this.selectedItem?.code === ticker){
                this.selectedItem = null
                isEqual = true
            }
            this.$emit('delete-ticker', ticker, isEqual)
        },
        selectItem(currency){
            this.selectedItem = currency
            this.$emit('select-item',this.selectedItem)
        }
    },
    components:{
        Item
    }
}
</script>

<style scoped>
    .container{
        display: flex;
        flex-wrap: wrap;
        border-top: 2px solid rgb(139, 139, 139);
        border-bottom: 2px solid #555;
    }
    .no-tickers-message{
        font-size: 20px;
        margin:0 auto;
        font-weight: bold;
        color: rgb(58, 58, 58);
    }
    
</style>