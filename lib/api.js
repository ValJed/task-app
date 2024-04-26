export async function fetchContexts() {
  const response = await request('context');
  return response.json();
}

export async function createTask(content, context_id) {
  const response = await request(
    'task',
    'POST',
    JSON.stringify({ content, context_id }),
  );

  return response.json();
}

export async function deleteTask(id) {
  const response = await request(`task/${id}`, 'DELETE');

  return response.json();
}

function request(url, method = 'GET', body = null) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const endpoint = 'http://10.0.2.2:3000';

  return fetch(`${endpoint}/${url}`, { method, headers, body });
}
