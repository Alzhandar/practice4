<template>
  <div class="register-container">
    <h2>Регистрация</h2>
    <div v-if="error" class="error-message">
      <div v-for="(errors, field) in error" :key="field">
        <strong>{{ field }}:</strong> {{ Array.isArray(errors) ? errors.join(', ') : errors }}
      </div>
    </div>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Имя пользователя</label>
        <input 
          id="username"
          v-model="form.username" 
          type="text" 
          placeholder="Введите имя пользователя" 
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email"
          v-model="form.email" 
          type="email" 
          placeholder="Введите email" 
          required
        />
      </div>
      <div class="form-group">
        <label for="role">Роль</label>
        <select id="role" v-model="form.role" required>
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </select>
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input 
          id="password"
          v-model="form.password" 
          type="password" 
          placeholder="Введите пароль" 
          required
        />
      </div>
      <div class="form-group">
        <label for="password2">Подтверждение пароля</label>
        <input 
          id="password2"
          v-model="form.password2" 
          type="password" 
          placeholder="Повторите пароль" 
          required
        />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </form>
    <div class="links">
      <router-link to="/login">Уже есть аккаунт? Войти</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        role: 'user',
        password: '',
        password2: ''
      }
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'getError']),
    error() {
      return this.getError;
    }
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      const success = await this.register(this.form);
      
      if (success) {
        // Редирект на страницу входа
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.register-container {
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
input, select {
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