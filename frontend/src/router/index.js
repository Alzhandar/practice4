import { createStore } from 'vuex';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export default createStore({
    state: {
        user: null,
        token: localStorage.getItem('token') || '',
        isLoading: false,
        error: null
    },
    getters: {
        isAuthenticated: state => !!state.token,
        isAdmin: state => state.user && state.user.role === 'admin',
        getUser: state => state.user,
        getError: state => state.error,
        isLoading: state => state.isLoading
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        LOGOUT(state) {
            state.user = null;
            state.token = '';
            localStorage.removeItem('token');
        },
        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        CLEAR_ERROR(state) {
            state.error = null;
        }
    },
    actions: {
        async login({ commit, dispatch }, credentials) {
            try {
                commit('SET_LOADING', true);
                commit('CLEAR_ERROR');
                const response = await axios.post(`${API_URL}login/`, credentials);
                commit('SET_TOKEN', response.data.access);
                await dispatch('fetchUser');
                return true;
            } catch (error) {
                commit('SET_ERROR', error.response ? error.response.data : { detail: 'Ошибка сервера' });
                return false;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async register({ commit }, userData) {
            try {
                commit('SET_LOADING', true);
                commit('CLEAR_ERROR');
                await axios.post(`${API_URL}register/`, userData);
                return true;
            } catch (error) {
                commit('SET_ERROR', error.response ? error.response.data : { detail: 'Ошибка сервера' });
                return false;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async fetchUser({ commit, state, dispatch }) {
            if (!state.token) return;
            
            try {
                commit('SET_LOADING', true);
                const response = await axios.get(`${API_URL}user/`, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                commit('SET_USER', response.data);
            } catch (error) {
                console.error("Ошибка при получении данных пользователя:", error);
                if (error.response && error.response.status === 401) {
                    dispatch('logout');
                }
            } finally {
                commit('SET_LOADING', false);
            }
        },
        logout({ commit }) {
            commit('LOGOUT');
        }
    }
});