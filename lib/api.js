import AsyncStorage from '@react-native-async-storage/async-storage';

export default ({ apiUrl, apiKey }) => {
  return {
    fetchContexts,
    createContext,
    deleteContext,
    updateContext,
    fetchTasks,
    createTask,
    deleteTask,
    updateTask,
  };

  async function fetchContexts() {
    console.log('=====> fetching context <=====');
    const res = await request({ url: 'context' });

    handleError(res);
    return res.json();
  }

  async function createContext(name) {
    const res = await request({
      url: 'context',
      method: 'POST',
      body: JSON.stringify({ name, simple_create: true }),
    });

    handleError(res);

    return res.json();
  }

  async function deleteContext(id) {
    const res = await request({
      url: `context/${id}`,
      method: 'Delete',
    });

    handleError(res);

    return res.json();
  }

  async function updateContext(context) {
    const res = await request({
      url: `context/${context.id}`,
      method: 'PUT',
      body: JSON.stringify(context),
    });

    handleError(res);

    return res.json();
  }

  async function fetchTasks(context_id) {
    const res = await request({
      url: 'task',
      qs: { context_id },
    });

    handleError(res);

    return res.json();
  }

  async function createTask({ content, context_id }) {
    if (!content) {
      return;
    }
    const res = await request({
      url: 'task',
      method: 'POST',
      body: JSON.stringify({ content, context_id }),
    });

    handleError(res);

    return res.json();
  }

  async function deleteTask(id) {
    const res = await request({ url: `task/${id}`, method: 'DELETE' });

    handleError(res);

    return res.json();
  }

  async function updateTask(id, body) {
    const res = await request({
      url: `task/${id}`,
      method: 'PUT',
      body: JSON.stringify(body),
    });

    handleError(res);

    return res.json();
  }

  function request({ url, method = 'GET', body = null, qs = null }) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      AUTHORIZATION: apiKey,
    };

    return fetch(`${apiUrl}/${addQuery(url, qs)}`, { method, headers, body });
  }

  function addQuery(url, qs) {
    if (!qs) {
      return url;
    }

    return Object.entries(qs).reduce((acc, [key, val], i) => {
      return `${acc}${i === 0 ? '?' : '&'}${key}=${val}`;
    }, url);
  }

  function handleError(res) {
    if (res.ok) {
      return;
    }

    const message =
      res.status === 401 ? 'Unauthorized' : 'Network response failed';

    throw new Error(message);
  }
};
