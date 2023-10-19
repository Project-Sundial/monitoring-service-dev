import { useState } from 'react';

const useTemporaryMessages = () => {
  const [messages, setMessages] = useState({});

  const addMessage = (message) => {
    if (messages[message]) {
      clearTimeout(messages[message]);
    }

    const newMessageObject = {};
    newMessageObject[message] = setTimeout(() => {
      setMessages(prevMessages => {
        const copy = Object.assign({}, prevMessages);
        delete copy[message];
        return copy;
      });
    }, 3000);

    setMessages(prevMessages => Object.assign(
      {}, 
      prevMessages, 
      newMessageObject
    ));
  }

  return [messages, addMessage];
};

export default useTemporaryMessages;