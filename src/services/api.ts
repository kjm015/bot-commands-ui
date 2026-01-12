import axios, {AxiosInstance} from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:8081",
    timeout: 1000,
});

export const fetchCommandEventData = async () => {
    try {
        const response = await instance.get('/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching data: ', error);
        // Handle errors here or throw them to be handled where the function is called
        throw error;
    }
};