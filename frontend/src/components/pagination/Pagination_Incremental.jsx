import { useState } from "react";
import './LoadMorePagination.css';

export default function LoadMorePagination({ totalItems, loadMoreItems, pageItems = 10 }) {
  const [loadedItems, setLoadedItems] = useState(pageItems);

  function handleLoadMore() {
    
    const newLoadedItems = loadedItems + pageItems;
    if (newLoadedItems <= totalItems) {
      setLoadedItems(newLoadedItems);
      loadMoreItems({ limit: newLoadedItems }); 
    }
  }

  return (
    <div className="load-more-pagination">
     
      {loadedItems < totalItems && (
        <button onClick={handleLoadMore} className="load-more-button">
          Cargar 10 productos más
        </button>
      )}
    </div>
  );
}
