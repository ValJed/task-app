import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchContexts() {
  const res = await request({ url: 'context' });

  if (!res.ok) {
    throw new Error('Network response failed');
  }
  return res.json();
}

export async function createContext(name) {
  const res = await request({
    url: 'context',
    method: 'POST',
    body: JSON.stringify({ name, simple_create: true }),
  });

  if (!res.ok) {
    throw new Error('Network response failed');
  }

  return res.json();
}

export async function deleteContext(id) {
  const res = await request({
    url: `context/${id}`,
    method: 'Delete',
  });

  if (!res.ok) {
    throw new Error('Network response failed');
  }
  return res.json();
}

export async function updateContext(context) {
  const res = await request({
    url: `context/${context.id}`,
    method: 'PUT',
    body: JSON.stringify(context),
  });

  if (!res.ok) {
    throw new Error('Network response failed');
  }
  return res.json();
}

export async function fetchTasks(context_id) {
  const res = await request({
    url: 'task',
    qs: { context_id },
  });

  if (!res.ok) {
    throw new Error('Network response failed');
  }
  return res.json();
}

export async function createTask({ content, context_id }) {
  if (!content) {
    return;
  }
  const res = await request({
    url: 'task',
    method: 'POST',
    body: JSON.stringify({ content, context_id }),
  });

  if (!res.ok) {
    throw new Error('Network response failed');
  }

  return res.json();
}

export async function deleteTask(id) {
  const res = await request({ url: `task/${id}`, method: 'DELETE' });

  if (!res.ok) {
    throw new Error('Network response failed');
  }

  return res.json();
}

export async function updateTask(id, body) {
  const res = await request({
    url: `task/${id}`,
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('Network response failed');
  }

  return res.json();
}

function request({ url, method = 'GET', body = null, qs = null }) {
  const endPoint = AsyncStorage.getItem('apiUrl');
  const apiKey = AsyncStorage.getItem('apiKey');
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  /* const endpoint = 'http://10.0.2.2:3000'; */

  return fetch(`${endPoint}/${addQuery(url, qs)}`, { method, headers, body });
}

function addQuery(url, qs) {
  if (!qs) {
    return url;
  }

  return Object.entries(qs).reduce((acc, [key, val], i) => {
    return `${acc}${i === 0 ? '?' : '&'}${key}=${val}`;
  }, url);
}
