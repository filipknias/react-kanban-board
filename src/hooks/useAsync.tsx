import { useState } from "react";

export default function useAsync(asyncCallback: () => Promise<void>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const trigger = () => {
    // Reset state
    setError(null);
    setSuccess(false);
    setLoading(true);
    // Perform async function
    const result = asyncCallback();
    result
      .then(() => setSuccess(true))
      .catch((err) => setError(err.code))
      .finally(() => setLoading(false));
  };

  return { loading, error, success, trigger };
};