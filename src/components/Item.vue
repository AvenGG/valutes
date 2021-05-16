<template>
    <div class="item-container" :class="{selected}" >
        <h3 class="code"> {{ currency.code }} - USD</h3>
        <p class="name"> {{ currency.name }} </p>
        <p class="rate"> {{ currency.rate }} </p>
        <button @click.stop="$emit('delete-ticker', currency.code)" class="delete__button"> Удалить </button>

    </div>
</template>

<script>
 export default {
    name: "Item",
    props:{
        currency: {
            type: Object
        },
        selected:{
            type: Boolean
        }
    }
 }
</script>

<style scoped>
*{
    margin:0;
}
    .item-container{
        border: none;
        box-shadow: 1px 1px 5px 1px rgb(68, 68, 68);
        width: 170px;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin: 10px;
        border-radius: 5px;
        cursor:pointer;
        transition: ease-in-out 0.04s;
    }
    .item-container:hover{
        background-color: rgb(255, 217, 0);
        transition: ease-in-out 0.2s;
    }
    .selected{
        box-shadow: 1px 1px 5px 1px rebeccapurple;
    }
    .delete__button{
    background-color: white;
    border: 1px solid rgb(19, 19, 19);
    border-radius: 2px;
    color: rgb(19, 19, 19);
    font-size: 14px;
    }
    .delete__button:hover{
        background-color: rgb(56, 56, 56);
        color: white;
        transition: ease-in-out 0.2s;
    }
    .code{

    }
    .rate{

    }
    .name{

    }
    
</style>
