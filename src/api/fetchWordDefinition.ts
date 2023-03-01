import axios from 'axios';

export const fetchWordDefinition = async (word: string): Promise<string | any> => {
  return await axios
    .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(({ data }) => data);
};
