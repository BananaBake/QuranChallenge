import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(url, options) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.headers || {}),
      ...(options?.body ? { "Content-Type": "application/json" } : {})
    }
  });
  await throwIfResNotOk(res);
  return await res.json();
}

export async function apiPost(url, data) {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
  const url = queryKey[0];
  let queryParams = '';
  if (queryKey.length > 1 && typeof queryKey[1] === 'number') {
    const paramName = url.includes('random-ayahs') ? 'count' :
                      url.includes('random-surahs') ? 'count' : '';
    if (paramName) {
      queryParams = `?${paramName}=${queryKey[1]}`;
    }
  }
  const res = await fetch(`${url}${queryParams}`, {
    credentials: "include",
  });
  if (unauthorizedBehavior === "returnNull" && res.status === 401) {
    return null;
  }
  await throwIfResNotOk(res);
  return await res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
