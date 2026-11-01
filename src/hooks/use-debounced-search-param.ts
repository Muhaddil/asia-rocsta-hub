import { useEffect, useRef, useState } from "react";

/**
 * Keeps a local draft of a search input and commits it to the URL after a delay.
 * Avoids creating a history entry for every keystroke.
 */
export function useDebouncedSearchParam(
  value: string,
  onCommit: (value: string) => void,
  delay = 250,
) {
  const [input, setInput] = useState(value);
  const committedRef = useRef(value);
  const onCommitRef = useRef(onCommit);

  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  useEffect(() => {
    if (value !== committedRef.current) {
      committedRef.current = value;
      setInput(value);
    }
  }, [value]);

  useEffect(() => {
    if (input === committedRef.current) return;
    const id = setTimeout(() => {
      committedRef.current = input;
      onCommitRef.current(input);
    }, delay);
    return () => clearTimeout(id);
  }, [input, delay]);

  return [input, setInput] as const;
}
