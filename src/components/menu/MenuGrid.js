import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import LoadingSpinner from '../ui/LoadingSpinner';

const MenuGrid = ({ restaurantId, categoryId, searchQuery }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    setMenuItems([]);
    fetchMenuItems(1, true);
  }, [restaurantId, categoryId, searchQuery]);

  const fetchMenuItems = async (pageNum = 1, reset = false) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pageNum,
        limit: 20,
        ...(categoryId && { category: categoryId }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`/api/restaurants/${restaurantId}/menu?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMenuItems(prev => reset ? data.items : [...prev, ...data.items]);
        setHasMore(data.hasMore);
        setError('');
      } else {
        setError('Failed to load menu items');
      }
    } catch (error) {
      setError('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMenuItems(nextPage, false);
    }
  };

  if (isLoading && menuItems.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Menu</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchMenuItems(1, true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
        <p className="text-gray-600">
          {searchQuery 
            ? `No items match "${searchQuery}"`
            : 'No items available in this category'
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                Loading...
              </div>
            ) : (
              'Load More Items'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuGrid;