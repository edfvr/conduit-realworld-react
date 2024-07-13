export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Token ${token}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
};
