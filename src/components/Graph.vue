<template>
<div class="graph-container">
    <div class="elements">
        {{name}} - USD
        <button @click="$emit('graph-close')" class="graph__close">&times;</button>
    </div>
    <div class="graph" ref="graph">
        <div class="graph__column"
            v-for="(g,i) in normalizedGraph"
            :key="i"
            :style="`height:${g}%`"
        >
        </div>
    </div>
</div>
</template>

<script>


export default {
    data(){
        return {
            graphElementsQuantity: 5
        }
    },
    mounted(){
        this.setGraphElementsQuantity()
        window.addEventListener('resize', this.setGraphElementsQuantity)
    },
    beforeDestroy(){
        window.removeEventListener('resize', this.setGraphElementsQuantity)

    },
    props: {
        graph:{
            type: Array
        },
        name:{
            type: String
        }
    },
    methods:{
        setGraphElementsQuantity(){
            this.graphElementsQuantity =  this.$refs.graph.clientWidth / 11
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
            while (this.graph.length > this.graphElementsQuantity)
                this.graph.shift()
        },
        graphElementsQuantity(){
            while (this.graph.length > this.graphElementsQuantity)
                this.graph.shift()
        }
    }
}
</script>

<style scoped>
    .graph-container{
        width:100%;
        height: 300px;
        border: 1px solid #222;
    }
    .graph{
        height: 90%;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
    }
    
    .elements{
        height: 10%;
        display: flex;
        justify-content: space-between;
    }
    .graph__column{
        width: 10px;
        height: 90%;
        margin: 0 1px 0 0;
        background-color: blueviolet;

    }
    .graph__close{
        width: 25px;
        height: 25px;
        outline:none;
        font-size: 20px;
        border: 1px solid black;
        border-right: transparent;
        border-top: transparent;
        background-color: rgb(255, 255, 255);
    }
</style>
