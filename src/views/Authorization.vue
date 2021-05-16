<template>
    <form class="form" @submit.prevent="authorization">
        <div class="form__elements">
            <p class="invalid-message"
                v-show="authorizationFaild.noUserWithLogin"
            >Пользователя с таким логином не существует!</p>
            <p class="invalid-message"
                v-show="authorizationFaild.wrongPassword"
            >Неверный пароль!</p>
            <label for="login">Login:</label>
            <input type="text" class="form__field" id="login" autocomplete="off"
                :class="{form__field_invalid:$v.form.login.$error && $v.form.login.$dirty}"
                v-model.trim="form.login"
            >
            <p class="invalid-message"
                v-show="!$v.form.login.required && $v.form.login.$dirty"
            >Обязательное поле!</p>
            <p class="invalid-message"
                v-show="!$v.form.login.minLength && $v.form.login.$dirty" 
            >Минимальная длина 4 символа!</p>

            <label for="password">Password:</label>
            <input type="password" class="form__field" id="password" autocomplete="off"
                :class="{form__field_invalid:$v.form.password.$error && $v.form.password.$dirty}"
                v-model.trim="form.password"
            >
            <p class="invalid-message"
                v-show="!$v.form.password.required && $v.form.password.$dirty"
            >Обязательное поле!</p>
            <p class="invalid-message"
                v-show="!$v.form.password.minLength && $v.form.password.$dirty" 
            >Минимальная длина пароля 8 символов!</p>

            <button type="submit" class="submit-button">Авторизация</button>
             <router-link to="/Registration" class="link"
            >Нет аккаунта? Зарегистрироваться</router-link>
        </div>
    </form>
</template>

<script>
import {validationMixin} from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    name: 'SignUp',
    data(){
        return {
            form:{
                login: '',
                password: ''
            },
            db_users:{
                test: {
                    email: 'test@test.test',
                    password: 'testtest'
                }
            },
            authorizationFaild:{
                noUserWithLogin:false,
                wrongPassword: false

            }
           
        }
    },
    mounted(){
        let users = localStorage.getItem('db_users')
        if (users)
            this.db_users = JSON.parse(users)
    },
    methods:{
        authorization(){
            if (this.isFormInvalid()) return;
            if (this.form.login in this.db_users ){
                if(this.db_users[this.form.login].password === this.form.password){
                    console.log('Авторизация успешна!')
                    this.$emit('set-user', this.form.login)
                    localStorage.setItem('user',this.form.login)
                    this.$router.push('/')
                }
                else(this.authorizationFaild.wrongPassword = true)
            }
            else(this.authorizationFaild.noUserWithLogin = true)
        },
        isFormInvalid(){
            this.$v.form.$touch()
            return this.$v.$invalid
        }
    },
    validations:{
        form:{
            login:{
                required,
                 minLength: minLength(4)
            },
            password:{
                required,
                minLength: minLength(8)
            }
        }
    }
}
</script>

<style scoped>
.form{
    width: 400px;
    height: 400px;
    margin: 100px auto;
    border-radius:2%;
    box-shadow: 3px 3px 10px 2px rgb(109, 109, 109);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: center;
}
.form__elements{
    margin: 10px auto;
    width: 300px;
    display: flex;
    flex-direction: column;

}
.form__field{
    outline: none;
    height: 30px;
    border:none;
    border-bottom: solid 1px rgb(51, 214, 255);
}
.form__field_invalid{
    border-bottom: solid 1px red;

}
.invalid-message{
    color: red;
    margin: 0;
    padding: 0;
    font-size: 12px;
}
label{
    margin-top: 10px;
}

.submit-button{
    margin:10px;
    height: 50px;
    background-color: rgb(19, 19, 19);
    border: 2px solid #FFFFFF;
    border-radius: 2px;
    color: white;
    font-size: 14px;
}

.link,
.link:visited{
    color: rgb(4, 0, 255);
    text-decoration: none;
    align-self: center;
    font-size: 12px;
}
</style>

