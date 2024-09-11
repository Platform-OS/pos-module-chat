import { createConsumer } from "@rails/actioncable";
import csrfToken from "./csrfToken";

const getWebSocketURL = () => {
  const token = csrfToken();
  return `/websocket?authenticity_token=${token}`;
};

export default createConsumer(getWebSocketURL);
