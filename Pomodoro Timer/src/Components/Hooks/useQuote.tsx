import { useEffect, useState } from "react";

type quoteResponse = {
  quote: string;
  author: string;
  category: string;
};

export const useQuote = (): [error: boolean, quote: quoteResponse[]] => {
  const [quote, setQuote] = useState<quoteResponse[] | []>([]),
    [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetcher = async () => {
      try {
        let request = await fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": "M/aqxdJ+53m0GtadOf5prg==6ud6untpq0RkGkGd",
          },
        });

        if (!request.ok) {
          setError(true);
        }
        setQuote(await request.json());
      } catch (error) {
        setError(true);
      }
    };
    fetcher();
  }, []);
  return [error, quote];
};
