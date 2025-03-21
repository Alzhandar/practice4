<template>
  <div class="admin-panel">
    <div class="header">
      <h1>Административная панель</h1>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else>
      <h2>Управление элементами</h2>
      <div class="item-form">
        <h3>Добавить новый элемент</h3>
        <form @submit.prevent="addItem">
          <div class="form-group">
            <label for="name">Название</label>
            <input 
              id="name"
              v-model="newItem.name" 
              placeholder="Введите название" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="description">Описание</label>
            <textarea 
              id="description"
              v-model="newItem.description" 
              placeholder="Введите описание" 
              required
            ></textarea>
          </div>
          <button type="submit">Добавить</button>
        </form>
      </div>
      
      <h3>Список элементов</h3>
      <div v-if="items.length === 0" class="no-items">
        Нет доступных элементов
      </div>
      <div v-else class="items-list">
        <div v-for="item in items" :key="item.id" class="item-card">
          <div class="item-content">
            <h4>{{ item.name }}</h4>
            <p>{{ item.description }}</p>
          </div>
          <div class="item-actions">
            <button @click="editItem(item)" class="edit-btn">Редактировать</button>
            <button @click="deleteItem(item.id)" class="delete-btn">Удалить</button>
          </div>
        </div>
      </div>
      
      <!-- Модальное окно для редактирования -->
      <div v-if="editingItem" class="modal">
        <div class="modal-content">
          <span class="close" @click="cancelEdit">&times;</span>
          <h3>Редактировать элемент</h3>
          <form @submit.prevent="updateItem">
            <div class="form-group">
              <label for="edit-name">Название</label>
              <input 
                id="edit-name"
                v-model="editingItem.name" 
                placeholder="Введите название" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="edit-description">Описание</label>
              <textarea 
                id="edit-description"
                v-model="editingItem.description" 
                placeholder="Введите описание" 
                required
              ></textarea>
            </div>
            <button type="submit">Сохранить</button>
            <button type="button" @click="cancelEdit" class="cancel-btn">Отмена</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: 'Admin',
  data() {
    return {
      items: [],
      newItem: { name: '', description: '' },
      editingItem: null,
      loading: true
    };
  },
  async created() {
    await this.fetchItems();
  },
  methods: {
    ...mapActions(['logout']),
    async fetchItems() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/items/', {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        });
        this.items = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке элементов:', error);
        if (error.response && error.response.status === 401) {
          this.logout();
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },
    async addItem() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/items/', this.newItem, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        });
        this.items.push(response.data);
        this.newItem = { name: '', description: '' };
      } catch (error) {
        console.error('Ошибка при добавлении элемента:', error);
      }
    },
    editItem(item) {
      this.editingItem = { ...item };
    },
    async updateItem() {
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/items/${this.editingItem.id}/`, 
          this.editingItem, 
          {
            headers: { Authorization: `Bearer ${this.$store.state.token}` }
          }
        );
        const index = this.items.findIndex(item => item.id === this.editingItem.id);
        if (index !== -1) {
          this.items.splice(index, 1, response.data);
        }
        this.cancelEdit();
      } catch (error) {
        console.error('Ошибка при обновлении элемента:', error);
      }
    },
    async deleteItem(id) {
      if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return;
      
      try {
        await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        });
        this.items = this.items.filter(item => item.id !== id);
      } catch (error) {
        console.error('Ошибка при удалении элемента:', error);
      }
    },
    cancelEdit() {
      this.editingItem = null;
    }
  }
};
</script>

<style scoped>
.admin-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.logout-btn {
  background-color: #f44336;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
textarea {
  min-height: 100px;
}
button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}
.delete-btn {
  background-color: #f44336;
}
.edit-btn {
  background-color: #2196F3;
}
.cancel-btn {
  background-color: #ccc;
}
.items-list {
  margin-top: 20px;
}
.item-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
.item-content {
  flex: 1;
}
.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.item-actions button {
  margin-bottom: 5px;
}
.loading {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}
.no-items {
  text-align: center;
  padding: 20px;
  color: #888;
}
.item-form {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
  max-width: 500px;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}
</style>