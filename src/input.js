import React, { useState, Suspense } from "react";
import { fetchTranslation } from "./tranApi";

const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

export function TranslationPage() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = React.unstable_useTransition({
    timeoutMs: 5000
  });

  function handleChange(e) {
    const value = e.target.value;

    setQuery(value);
    startTransition(() => {
      setResource(fetchTranslation(value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
