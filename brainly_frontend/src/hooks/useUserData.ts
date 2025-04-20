// hooks/useUserData.ts
const backendBaseURL = import.meta.env.VITE_BACKEND_TEST_URL;

export const useUserData = () => {
  const userCheck = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return null;

    const res = await fetch(`${backendBaseURL}/api/v1/me`, {
      method: "POST",
      headers: { "authorization": token }
    });
    return res.json();
  };

  const fetchContent = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return [];

    const res = await fetch(`${backendBaseURL}/api/v1/content`, {
      headers: { "Authorization": token }
    });
    const data = await res.json();
    return data.content || [];
  };

  return { userCheck, fetchContent };
};
