import axios from "axios";
import React, { useEffect, useState } from "react";

export default function useSearchImage(searchQuery, page) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "searchHistory",
      JSON.stringify(searchHistory).toLowerCase()
    );
  }, [searchHistory]);

  useEffect(() => {
    setPhotos([]);
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    let apiUrl;
    let cancel;

    if (searchQuery) {
      apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=149d24ad859d677f39d445b673d0fd65&text=${searchQuery}&page=${page}&per_page=20&format=json&nojsoncallback=1`;
    } else {
      apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=149d24ad859d677f39d445b673d0fd65&page=${page}&per_page=20&format=json&nojsoncallback=1`;
    }
    axios
      .get(apiUrl, { cancelToken: new axios.CancelToken((c) => (cancel = c)) })
      .then((res) => {
        setPhotos((prevPhotos) => {
          return [...new Set([...prevPhotos, ...res.data.photos.photo])];
        });
        setHasMore(res.data.photos.photo.length > 0);
        setIsLoading(false);
        if (
          searchQuery &&
          searchQuery.trim() !== "" &&
          !searchHistory.includes(searchQuery.toLowerCase())
        ) {
          setSearchHistory((prevHistory) => [...prevHistory, searchQuery]);
          setShowSuggestions(true);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    // Cancel the ongoing request when the component unmounts or a new request is made
    return () => cancel();
  }, [searchQuery, page]);

  return {
    isLoading,
    error,
    hasMore,
    photos,
    searchHistory,
    setSearchHistory,
    showSuggestions,
    setShowSuggestions,
  };
}
