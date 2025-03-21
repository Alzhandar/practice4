<template>
  <div>
    <h1>Список элементов</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} - {{ item.description }}
      </li>
    </ul>
    <div class="form">
      <h2>Добавить новый элемент</h2>
      <form @submit.prevent="addItem">
        <div>
          <input v-model="newItem.name" placeholder="Название" required />
        </div>
        <div>
          <textarea v-model="newItem.description" placeholder="Описание" required></textarea>
        </div>
        <button type="submit">Добавить</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getItems, createItem } from '../api';

export default {
  data() {
    return {
      items: [],
      newItem: { name: '', description: '' },
    };
  },
  async created() {
    this.items = await getItems();
  },
  methods: {
    async addItem() {
      const item = await createItem(this.newItem);
      this.items.push(item);
      this.newItem = { name: '', description: '' };
    },
  },
};
</script>

<style scoped>
.form {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
form div {
  margin-bottom: 10px;
}
input, textarea {
  width: 100%;
  padding: 8px;
}
button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>