
const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
});

const api = {
    auth: {
        register: async (data) => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return response.json();
        },

        login: async (data) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return response.json();
        },

        setupBank: async (data) => {
            const response = await fetch(`${API_URL}/auth/setup-bank`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(data),
            });
            return response.json();
        },

        getMe: async () => {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: authHeaders(),
            });
            return response.json();
        },
    },

    courses: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/courses`);
            return response.json();
        },

        getOne: async (id) => {
            const response = await fetch(`${API_URL}/courses/${id}`);
            return response.json();
        },

        create: async (data) => {
            const response = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(data),
            });
            return response.json();
        },

        update: async (id, data) => {
            const response = await fetch(`${API_URL}/courses/${id}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(data),
            });
            return response.json();
        },

        delete: async (id) => {
            const response = await fetch(`${API_URL}/courses/${id}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });
            return response.json();
        },

        getInstructorCourses: async () => {
            const response = await fetch(`${API_URL}/courses/my/instructor`, {
                headers: authHeaders(),
            });
            return response.json();
        },
    },

    enrollments: {
        enroll: async (data) => {
            const response = await fetch(`${API_URL}/enrollments`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(data),
            });
            return response.json();
        },

        getMy: async () => {
            const response = await fetch(`${API_URL}/enrollments/my`, {
                headers: authHeaders(),
            });
            return response.json();
        },

        complete: async (id) => {
            const response = await fetch(`${API_URL}/enrollments/${id}/complete`, {
                method: 'PUT',
                headers: authHeaders(),
            });
            return response.json();
        },
    },
    transactions: {
        getMy: async () => {
            const response = await fetch(`${API_URL}/transactions/my`, {
                headers: authHeaders(),
            });
            return response.json();
        },

        getOne: async (id) => {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                headers: authHeaders(),
            });
            return response.json();
        },
    },

    certificates: {
        getMy: async () => {
            const response = await fetch(`${API_URL}/certificates/my`, {
                headers: authHeaders(),
            });
            return response.json();
        },

        getOne: async (id) => {
            const response = await fetch(`${API_URL}/certificates/${id}`);
            return response.json();
        },
    },
};
