import 'dotenv/config';
import axios from 'axios';

const slack = {
  async sendNotification(text) {
    if (process.env.SLACK_WEBHOOK_URL) {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text
      });
    }
  },
};

export default slack;
