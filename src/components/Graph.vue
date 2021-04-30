<template>
    <div class="graph">
        <button @click="$emit('graph-close')" class="graph__close">&times;</button>
        <div class="graph__column"
            v-for="(g,i) in normalizedGraph"
            :key="i"
            :style="`height:${g}%`"
        >
        </div>
    </div>
</template>

<script>


export default {
    data(){
        return {

        }
    },
    props: {
        graph:{
            type: Array
        }
    },
    computed:{
        normalizedGraph(){
            const min = Math.min(...this.graph)
            const max = Math.max(...this.graph)
            return this.graph.map(rate => 5 + ((rate - min) * 95 ) / (max - min))
        }
    },
    watch:{
        graph(){
            if (this.graph.length >10)
                this.graph.unshift()
        }
    }
}
</script>

<style scoped>
    .graph{
        max-width:800px;
        width:80%;
        height: 400px;
        display: flex;
        flex-direction: row;
        border: 1px solid #222;
        align-items: flex-end;
        position: relative;
    }
    .graph__column{
        width: 5%;
        height: 90%;
        margin: 0 1px;
        background-color: blueviolet;

    }
    .graph__close{
        position: absolute;
        right: 10px;
        top:10px;
        width: 25px;
        height: 25px;
        outline:none;
        border-radius: 50%;
    }
</style>
