<template>
    <div class="page">
        <div class="nav">
            <div class="routes">
                <router-link to="/" class="link border-right-none"> Currencies </router-link>
                <router-link to="/wallet" class="link"> Wallet </router-link>
            </div>
            <div v-if="userName" class="user-container">
                <div class="user">{{userName}}</div>
                <button class="exit-button"
                    @click="exit"
                >Выйти</button>
            </div>
            <div v-else class="authorization">
                <router-link to="/authorization" class="link login"> Login </router-link>
                <router-link to="/registration" class="link signup"> Sign Up </router-link>
            </div>
        </div>

        <router-view @set-user="setUser"></router-view>

    </div>
</template>

<script>
export default {
    data(){
        return{
            userName:''
        }
    },
    created(){
        let ls_user = localStorage.getItem('user')
        if(ls_user)
            this.userName = ls_user
    },
    methods:{
        setUser(user){
            this.userName = user
        },
        exit(){
            this.userName = ''
            localStorage.removeItem('user')
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
    .page{
        background-color: rgb(255, 255, 255);
        box-sizing: border-box;
        box-shadow:0px 0px 4px 1px rgb(77, 77, 77);
        height: 40px;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
    }
    .nav{
        height: 100%;
        width:60%;
        min-width:600px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 300;
        font-family: 'Montserrat', sans-serif;
        text-transform: uppercase;
        letter-spacing: 1px;

    }
    .router-link-exact-active{
        background-color: rgb(231, 231, 231);
    }
    .routes{
        height: 100%;
        display: flex;
        
    }
    .link{
        display: flex;
        align-items: center;
        padding: 0 10px;
        text-decoration: none;
        height: 100%;
        border: 1px solid rgba(0, 0, 0, 0.4);
        border-bottom: none;
        border-top: none;
        background: none;
        font-weight: 300;
        font-family: 'Montserrat', sans-serif;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .border-right-none{
        border-right: none;
    }
    .link:visited{
        color: black;
    }
    .link:hover{
        background-color: rgb(201, 201, 201);
    }
    
    .authorization{
        height: 100%;
        flex-direction: column;
        display: flex;
        font-size: 14px;

    }
    .login{
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    }
    .user-container{
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
    }
    .user{
        margin-right: 5px;
        color: rgb(173, 32, 255);
        font-weight: bold;
    }
    .exit-button{
        height: 100%;
        border: 1px solid rgba(0, 0, 0, 0.4);
        border-bottom: none;
        border-top: none;
        background: none;
        font-weight: 300;
        font-family: 'Montserrat', sans-serif;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .exit-button:hover{
        background-color: rgb(255, 82, 82);
    }
   
</style>
