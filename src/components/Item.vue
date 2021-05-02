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
        border: 2px solid rgb(131, 131, 131);
        width: 150px;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin: 10px;
        border-radius: 5px;
        cursor:pointer
    }
    .selected{
        border:2px solid rebeccapurple;
    }
    .code{

    }
    .rate{

    }
    .name{

    }
    
</style>
