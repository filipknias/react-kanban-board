import { useState } from "react";

export default function useAsync(asyncCallback: () => Promise<void>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [data, setData] = useState<unknown|null>(null);
  
  const trigger = () => {
    // Reset state
    setError(null);
    setData(null);
    setLoading(true);
    // Return data
    const result = asyncCallback();
    result
      .then((data) => setData(data))
      .catch((err) => setError(err.code))
      .finally(() => setLoading(false));
  };

  return { loading, error, data, trigger };
};