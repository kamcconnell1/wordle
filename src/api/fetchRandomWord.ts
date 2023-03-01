import axios from 'axios';

export const fetchRandomWord = async () => {
  return await axios
    .get('https://random-word-api.vercel.app/api?words=1&length=5')
    .then((res) => res.data)
    .then((data) => data.toString());
};
