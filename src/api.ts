// Frontend API Service client

const BASE_URL = ''; // Proxied by Vite to http://localhost:3001

export function getToken(): string | null {
  return localStorage.getItem('veil_token');
}

export function setToken(token: string) {
  localStorage.setItem('veil_token', token);
}

export function removeToken() {
  localStorage.removeItem('veil_token');
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (body: any) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  
  // Profile
  saveCompatibility: (body: any) => request('/api/profile/compatibility', { method: 'POST', body: JSON.stringify(body) }),
  getMatches: () => request('/api/profile/matches'),
  searchClassmates: (q: string) => request(`/api/classmates?q=${encodeURIComponent(q)}`),

  // Feed
  getFeed: () => request('/api/feed'),
  createPost: (body: any) => request('/api/feed/post', { method: 'POST', body: JSON.stringify(body) }),
  createPoll: (body: any) => request('/api/feed/poll', { method: 'POST', body: JSON.stringify(body) }),
  votePoll: (postId: string, optionId: string) => request(`/api/feed/${postId}/vote`, { method: 'POST', body: JSON.stringify({ optionId }) }),
  toggleInterest: (postId: string) => request(`/api/feed/${postId}/interest`, { method: 'POST' }),

  // Confessions
  getConfessions: () => request('/api/confessions'),
  createConfession: (content: string) => request('/api/confessions', { method: 'POST', body: JSON.stringify({ content }) }),
  upvoteConfession: (id: string) => request(`/api/confessions/${id}/upvote`, { method: 'POST' }),
  getComments: (id: string) => request(`/api/confessions/${id}/comments`),
  addComment: (id: string, content: string) => request(`/api/confessions/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Rides
  getRides: () => request('/api/rides'),
  createRide: (body: any) => request('/api/rides', { method: 'POST', body: JSON.stringify(body) }),
  bookRide: (id: string) => request(`/api/rides/${id}/book`, { method: 'POST' }),

  // Study Groups
  getStudyGroups: () => request('/api/study-groups'),
  createStudyGroup: (body: any) => request('/api/study-groups', { method: 'POST', body: JSON.stringify(body) }),
  joinStudyGroup: (id: string) => request(`/api/study-groups/${id}/join`, { method: 'POST' }),

  // Tournaments
  getTournaments: () => request('/api/tournaments'),
  registerTournament: (id: string) => request(`/api/tournaments/${id}/register`, { method: 'POST' }),
};
