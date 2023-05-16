import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";

import useSearchImage from "../../Hooks/useSearch/useSearchImage";
import ImageResult from "../ImageResult/ImageResult";

import "./Search.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const {
    photos,
    isLoading,
    hasMore,
    error,
    searchHistory,
    setSearchHistory,
    showSuggestions,
    setShowSuggestions,
  } = useSearchImage(searchQuery, page);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setPage(1);
  };

  const handleClick = (query) => {
    setSearchQuery(query);
  };

  const handleRemove = (query) => {
    const updateHistory = searchHistory.filter((search) => search !== query);
    setSearchHistory(updateHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updateHistory));
    setShowSuggestions(updateHistory.length > 0);
  };

  const handleShowFocus = () => {
    setShowSuggestions(searchHistory.length > 0);
  };

  return (
    <>
      <div className="search_wrapper">
        <h2>Search Photos</h2>
        <div className="search">
          <BiSearchAlt2 style={{ marginLeft: "3px" }} size={21} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleShowFocus}
          />
        </div>
        {showSuggestions && (
          <div className="search_result">
            {searchHistory.map((query) => {
              return (
                <div>
                  <div className="query">
                    <p onClick={() => handleClick(query)}>{query}</p>
                    <AiOutlineClose onClick={() => handleRemove(query)} />
                  </div>
                  <button
                    style={{
                      position: "absolute",
                      right: "0px",
                      bottom: "0px",
                      margin: "5px",
                    }}
                    onClick={() => setShowSuggestions(false)}
                  >
                    close
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ImageResult
        photos={photos}
        isLoading={isLoading}
        hasMore={hasMore}
        error={error}
        searchQuery={searchQuery}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Search;
