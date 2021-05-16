<template>
    <form class="form" @submit.prevent="registration">
        <div class="form__elements">
            <p class="invalid-message"
                v-show="hasSameLogin"
            >Пользователь с таким логином уже существует!</p>
            <p class="invalid-message"
                v-show="hasSameEmail"
            >Пользователь с таким Email-ом уже существует!</p>
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

            <label for="email">Email:</label>
            <input type="email" class="form__field" id="email" autocomplete="off"
                :class="{form__field_invalid:$v.form.login.$error && $v.form.email.$dirty}"
                v-model.trim="form.email"
            >
            <p class="invalid-message"
                v-show="!$v.form.email.required && $v.form.email.$dirty"
            >Обязательное поле!</p>
            <p class="invalid-message"
                v-show="!$v.form.email.email && $v.form.email.$dirty" 
            >Проверьте правильность email-а!</p>

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

            <button type="submit" class="submit-button">Регистрация</button>
            <router-link to="/Authorization" class="link"
            >Есть аккаунт? Авторизоваться</router-link>
        </div>
    </form>
</template>

<script>
import {validationMixin} from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
export default {
    mixins: [validationMixin],
    name: 'SignUp',
    data(){
        return {
            form:{
                login: '',
                email: '',
                password: ''
            },
            db_users:{
                test: {
                    email: 'test@test.test',
                    password: 'testtest'
                }
            }
           
        }
    },
    mounted(){
        let users = localStorage.getItem('db_users')
        if (users)
            this.db_users = JSON.parse(users)
    },
    methods:{
        registration(){
            if(this.isFormInvalid() || this.hasSameLogin || this.hasSameEmail) return;

            const newUser = {
                email: this.form.email,
                password: this.form.password
            }
           
            this.db_users[this.form.login] = newUser
            localStorage.setItem('db_users',JSON.stringify(this.db_users))
            this.$router.push('Authorization')
        },
        isFormInvalid(){
            this.$v.form.$touch()
            return this.$v.$invalid
        }
    },
    computed:{
        hasSameLogin(){
            if(this.form.login in this.db_users)
                return true
            return false
        },
        hasSameEmail(){
            for(let key of Object.keys(this.db_users)){
                if (this.db_users[key].email === this.form.email) return true
            }
            return false
        }
    },
    validations:{
        form:{
            login:{
                required,
                 minLength: minLength(4)
            },
            email:{
                required,
                email
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

