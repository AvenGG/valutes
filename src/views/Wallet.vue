<template>
    <div class="wallet">
        <div class="page">
            <div class="user-wallet">
                <strong>Мой кошелёк:</strong>
                <div class="coin"
                    v-for="coin of Object.keys(wallet)"
                    :key="coin"
                >
                {{coin}} : {{wallet[coin]}}
                </div>
            </div>
            <div class="operations">
                <div class="operation__container">
                    <div class="operation__label">Пополнение средств</div>
                    <div>Валюта: <select v-model="valuteToDeposit">
                                    <option v-for="v of Object.keys(wallet)"
                                            :key="v"
                                    >{{v}}</option>
                                </select>
                    </div>
                    <div>Сумма: <input v-model.number="amountToDeposit" class="valute-input"></div>
                        <button @click="deposit" class="operation__button">Пополнить</button>
                </div>      
                <div class="operation__container">
                    <div class="operation__label">Вывод средств</div>
                    <div>Валюта: <select v-model="valuteToWithdraw">
                                    <option v-for="v of Object.keys(wallet)"
                                            :key="v"
                                    >{{v}}</option>
                                </select>
                    </div>
                    <div>Сумма: <input v-model.number="amountToWithdraw" class="valute-input"></div>
                        <button @click="withdraw" class="operation__button">Вывести</button>
                </div>      
                <div class="create operation__container">
                    <div class="operation__label">Добавить валюту</div>
                    
                        <input type="text" class="valute-input"
                            v-model="coinToCreate"
                            @keydown.enter="create"
                        >
                        <div class="autocomplette">
                            <button class="autocomplette-button"
                                v-for="suggestion of autocompleteSuggestions"
                                :key="suggestion"
                                @click="addSuggestion(suggestion)"
                            >
                            {{suggestion}}
                            
                            </button>
                        </div>
                        <button @click="create" class="operation__button">Добавить</button>

                    
                </div>

                <div class="exchange operation__container">
                    <div class="give">
                        <div>Отдаёте</div>
                        <select v-model="valuteToGive">
                            <option
                                v-for="w of Object.keys(wallet)"
                                :key="w"
                            >{{w}}</option>
                        </select>
                        <input class="valute-input"
                            v-model.number="amountToGive"
                        >
                    </div>

                    <div class="receive">
                        <div>Получаете</div>
                        <select v-model="valuteToReceive">
                            <option
                                v-for="w of Object.keys(wallet)"
                                :key="w"
                            >{{w}}</option>
                        </select>
                        <div>
                            {{amountToReceive}}
                        </div>
                        

                    </div>
                    <button @click="exchange" class="operation__button">Обменять</button>
                    <button @click="getRate" class="operation__button">Обновить курс</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getCoinList, loadPair} from "@/api"

export default {
    data(){
        return{
            wallet:{USD: 0.0, BTC: 0.0},

            valuteToDeposit:'USD',
            amountToDeposit: 0,
            valuteToWithdraw:'USD',
            amountToWithdraw: 0,
            coinToCreate:'',

            valuteToGive:'USD',
            amountToGive: 0,
            valuteToReceive:'BTC',
            rate: 0,
            validCoins:{},
            user:''
        }
    },
    created(){
        this.getValidCoins()
        Number.prototype.toFixedNumber = function(digits, base){
            var pow = Math.pow(base||10, digits);
            return Math.round(this*pow) / pow;
        }
    },
    mounted(){
        let user = localStorage.getItem('user')
        if(user){
            this.user = user
            let ls_usersWallets = JSON.parse(localStorage.getItem('db_usersWallets'))
           
            if(!ls_usersWallets)
                ls_usersWallets = {}

            if(ls_usersWallets[user]){
                    this.wallet=ls_usersWallets[user]
            }else{
                ls_usersWallets[user]= this.wallet
                localStorage.setItem('db_usersWallets',JSON.stringify(ls_usersWallets))
            }
        }
        this.getRate()

    },
    methods:{
        async getValidCoins(){
            this.validCoins = await getCoinList()
        },
        async getRate(){
            let data = await loadPair(this.valuteToGive, this.valuteToReceive)
            this.rate = data[this.valuteToReceive]

        },
        deposit(){
            if(typeof this.amountToDeposit ==='number'){
                this.wallet[this.valuteToDeposit] = (this.wallet[this.valuteToDeposit] + this.amountToDeposit).toFixedNumber(8)
                this.synchronize()
            }
        },
        withdraw(){
            if(typeof this.amountToWithdraw ==='number'){
                if((this.wallet[this.valuteToWithdraw] - this.amountToWithdraw).toFixedNumber(8) >=0){
                    this.wallet[this.valuteToWithdraw] = (this.wallet[this.valuteToWithdraw] - this.amountToWithdraw).toFixedNumber(8)
                    this.synchronize()
                }
            }
        },
        create(){
            let c = this.coinToCreate.trim().toUpperCase()
            this.coinToCreate = ""
            if(!c || !(c in this.validCoins) ) return;
            this.$set(this.wallet,c, 0.0)
            this.synchronize()
        },
        async exchange(){
            if(typeof this.amountToGive ==='number'){
                await this.getRate()
                if((this.wallet[this.valuteToGive] - this.amountToGive).toFixedNumber(8) >=0){
                    this.wallet[this.valuteToGive] = (this.wallet[this.valuteToGive] - this.amountToGive).toFixedNumber(8)
                    this.wallet[this.valuteToReceive] = (this.wallet[this.valuteToReceive] + this.rate *this.amountToGive).toFixedNumber(8)
                }
                this.synchronize()
            }
        },
        addSuggestion(s){
            this.coinToCreate = s
            this.create()
            this.coinToCreate = ''
        },
        synchronize(){
            let ls_UW = JSON.parse(localStorage.getItem('db_usersWallets'))
            ls_UW[this.user] = this.wallet
            localStorage.setItem('db_usersWallets',JSON.stringify(ls_UW))
        },
    },
    computed:{
        autocompleteSuggestions(){
            if(this.coinToCreate.trim() === '') return
            let coins = []
            for (let coin of Object.keys(this.validCoins)){
                if (coin.includes(this.coinToCreate.toUpperCase()))
                    coins.push(coin)
            }
            return coins.sort((a,b)=>a.length - b.length).slice(0,5)
        },
        amountToReceive(){
            let result = this.amountToGive * this.rate
            return result.toFixedNumber(10)
        }
    },
    watch:{
        valuteToGive(){
            this.getRate()
        },
        valuteToReceive(){
            this.getRate()
        }
    }
}
</script>

<style scoped>

  .wallet{
  }

  .page{
    width:60%;
    min-width:600px;
    margin: 15px auto;
    display: flex;
  }
  .autocomplette-button{
    margin: 2px;
    padding: 3px;
    border-radius: 100px;
    border:dashed 1px black;
    color: black;
    font-weight: bold;
    background-color: rgb(192, 32, 255);
    font-size: 10px;
    cursor:pointer;
  }
  .user-wallet{
      box-shadow: 0px 0px 3px 1px rgb(117, 117, 117);
      padding: 10px;
      width: 200px;
      margin:10px;
  }
  .valute-input{
    width: 100px;
    height: 20px;
    outline: none;
  }
  .operation__container{
      box-shadow: 0px 0px 3px 1px rgb(117, 117, 117);
      padding: 10px;
      width: 200px;
      margin:10px;
  }
  .coin{
      border-bottom: 1px solid rgb(165, 165, 165);
  }
  
  .operation__button{
    margin:10px 10px 0 0;
    height: 30px;
    box-shadow: 0px 0px 2px 1px rgb(117, 117, 117);
    border:none;
    color: rgb(0, 0, 0);
    background-color: rgb(240, 240, 240);
  }
  .operation__button:hover{
      background-color: rgb(111, 255, 118);
  }
  .operation__label{
      font-weight: bold;
      color: rgb(37, 37, 37);
  }
</style>

