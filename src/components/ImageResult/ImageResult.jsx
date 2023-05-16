import React, { useCallback, useEffect, useRef, useState } from "react";
import useSearchImage from "../../Hooks/useSearch/useSearchImage";

import "./ImageResult.css";

const ImageResult = React.memo(
  ({ photos, isLoading, hasMore, setPage, error, searchHistory }) => {
    const observer = useRef();

    const lastElementRef = useCallback(
      (node) => {
        if (isLoading) return;
        // disconnect from the previous element so the new last element will be hooked up corrctly
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          // isIntersecting = means it's one the page somewhere
          if (entries[0].isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        });
        // if something is actually our last element
        if (node) observer.current.observe(node);
      },
      [isLoading, hasMore]
    );

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const openModal = (photo) => {
      setSelectedPhoto(photo);
      document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
      setSelectedPhoto(null);
      document.body.style.overflow = "";
    };

    return (
      <div className="image_wrapper">
        {selectedPhoto && (
          <div className="modal" onClick={closeModal}>
            <img
              className="modal_image"
              src={`https://live.staticflickr.com/${selectedPhoto.server}/${selectedPhoto.id}_${selectedPhoto.secret}.jpg`}
              alt={selectedPhoto.title}
            />
          </div>
        )}
        <div className="image_container">
          {photos.map((photo, index) => {
            if (photos.length === index + 1) {
              return (
                <img
                  ref={lastElementRef}
                  key={photo.id}
                  src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
                  alt={photo.title}
                  onClick={() => openModal(photo)}
                />
              );
            } else {
              return (
                <img
                  key={photo.id}
                  src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
                  alt={photo.title}
                  onClick={() => openModal(photo)}
                />
              );
            }
          })}
        </div>
        <h1 className="heading">{isLoading && "Loading..."}</h1>
        <h1 className="heading">{error && "Error"}</h1>
      </div>
    );
  }
);

export default ImageResult;
