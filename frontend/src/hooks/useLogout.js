import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser, setIsLoggedIn } = useAuthContext();
  const logout = async () => {
      setLoading(true);
      //TODO: fix cookies, need to be deleted when logged out
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
        const data = await res.json();
        console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      setAuthUser(null);
      setIsLoggedIn(false);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};

export default useLogout;
