import Pusher from 'pusher-js';

const pusher = new Pusher('66a996d7c63fe6a9fac5', {
    cluster: 'ap2',
  });

export default pusher;
