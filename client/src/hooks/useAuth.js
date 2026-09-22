import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, loading, initialized } = useSelector((state) => state.auth);
  return { user, loading, initialized };
};