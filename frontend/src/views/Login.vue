<template>
  <div class="login-container">
    <h2>Вход в систему</h2>
    <div v-if="error" class="error-message">
      {{ error.detail || 'Ошибка при авторизации. Проверьте имя пользователя и пароль.' }}
    </div>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Имя пользователя</label>
        <input 
          id="username"
          v-model="username" 
          type="text" 
          placeholder="Введите имя пользователя" 
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          placeholder="Введите пароль" 
          required
        />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Вход...' : 'Войти' }}
      </button>
    </form>
    <div class="links">
      <router-link to="/register">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'getError']),
    error() {
      return this.getError;
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      const success = await this.login({ 
        username: this.username, 
        password: this.password 
      });
      
      if (success) {
        if (this.$store.getters.isAdmin) {
          this.$router.push('/admin');
        } else {
          this.$router.push('/');
        }
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #cccccc;
}
.links {
  margin-top: 15px;
  text-align: center;
}
.error-message {
  color: red;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #ffecec;
  border-radius: 4px;
}
</style>