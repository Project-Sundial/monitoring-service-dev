import MissedPingsMq from './MissedPingsMq.js';

const missedPingsMqProvider = async () => {
  if (MissedPingsMq.boss) {
    return MissedPingsMq;
  } else {
    await MissedPingsMq.init();
    return MissedPingsMq;
  }
};

export default missedPingsMqProvider;
