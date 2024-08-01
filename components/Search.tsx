"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

const Search = ({ search }: { search?: string }) => {
  const router = useRouter();
  const initialRender = useRef(true);
  const [text, setText] = useState(search);
  const [query, setQuery] = useState("");

  const debouncedSearch = useRef(
    debounce((searchText: string) => {
      if (!searchText) {
        router.push("/");
      } else {
        router.push(`?search=${searchText}`);
      }
    }, 750)
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    debouncedSearch.current(query);
  }, [query]);

  const handleClearSearch = () => {
    setText("");
    setQuery("");
    router.push("/");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setText(searchText);
    setQuery(searchText);
  };

  return (
    <div className="flex justify-center w-[90%] mx-auto max-w-[1500px]">
      <input
        type="text"
        value={text}
        placeholder="Search Pokemon..."
        onChange={handleSearchChange}
        className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-yellow-500 sm:text-sm sm:leading-6 mb-10"
      />
      {text && (
        <button
          onClick={handleClearSearch}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6L18 18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Search;