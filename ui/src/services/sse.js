import {
  BASE_URL,
  GET_SSE,
} from '../constants/routes';

export const getSse = () => {
  return new EventSource(BASE_URL + GET_SSE);
};
