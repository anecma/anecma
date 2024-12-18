interface User {
  // id: string;
  email: string | null | undefined;
  // name: string | null | undefined;
  // expires_at: number | null | undefined;
  // image: string | null | undefined;
}

export default async function getTokenFromApiServer(
  provider: string,
  user: User
) {
  try {
    const response = await fetch(
      "http://localhost:8000/api/istri/login-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          user,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();

    // Assuming your API returns an object with a property called accessToken
    return data.data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
}
