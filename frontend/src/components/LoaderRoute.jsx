import { useEffect, useState } from "react";
import CandleLoader from "./CandleLoader";

export default function LoaderRoute({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <CandleLoader />;

  return children;
}