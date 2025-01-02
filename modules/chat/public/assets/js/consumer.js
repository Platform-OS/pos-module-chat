import { createConsumer } from "https://unpkg.com/@rails/actioncable@8.0.100/app/assets/javascripts/actioncable.esm.js";
alert('aaa');
const getWebSocketURL = () => {
  return `/websocket?authenticity_token=${posChat.csrfToken}`;
};

export default createConsumer(getWebSocketURL);
