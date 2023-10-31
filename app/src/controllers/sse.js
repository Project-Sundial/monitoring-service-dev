let clients = [];

const getSse = (request, response) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);
  console.log(`New sse connection: ${clientId}`);

  request.on('close', () => {
    console.log(`${clientId}: Sse connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
};

const sendMessage = (message) => {
  clients.forEach(client => client.response.write(message));
};

const sendNewMonitor = (monitor) => {
  const message =
    'event: newMonitor\n' +
    `data: ${JSON.stringify(monitor)}` +
    '\n\n';

  sendMessage(message);
};

const sendUpdatedMonitor = (monitor) => {
  const message =
    'event: updatedMonitor\n' +
    `data: ${JSON.stringify(monitor)}` +
    '\n\n';

  sendMessage(message);
};

const sendNewRun = (run) => {
  const message =
    'event: newRun\n' +
    `data: ${JSON.stringify(run)}` +
    '\n\n';

  sendMessage(message);
};

const sendUpdatedRun = (run) => {
  const message =
    'event: updatedRun\n' +
    `data: ${JSON.stringify(run)}` +
    '\n\n';

  sendMessage(message);
};

export {
  getSse,
  sendNewMonitor,
  sendUpdatedMonitor,
  sendNewRun,
  sendUpdatedRun,
};
