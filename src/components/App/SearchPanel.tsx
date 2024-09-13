// SearchPanel.tsx
import React, { useCallback, useEffect, useState } from 'react';
import SlidingPanel from './SlidingPanel';
import { GET_SEARCH_USERS } from '../../graphql/queries/SearchUsers';
import { useLazyQuery, useQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 2;
  const [getSearchUsers, { data, loading, error, fetchMore }] =
    useLazyQuery(GET_SEARCH_USERS);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length >= 3) {
        getSearchUsers({
          variables: {
            input: {
              searchText: query,
              page: 1,
              pageSize,
            },
          },
        });
      }
    }, 300),
    []
  );
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const loadMore = () => {
    if (!hasMore) return;
    fetchMore({
      variables: {
        input: {
          searchText: searchQuery,
          page: page + 1,
          pageSize,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getSearchForUser.users.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage(page + 1);
        setHasMore(fetchMoreResult.getSearchForUser.users.length === pageSize);
        return {
          getSearchForUser: {
            ...prev.getSearchForUser,
            users: [
              ...prev.getSearchForUser.users,
              ...fetchMoreResult.getSearchForUser.users,
            ],
          },
        };
      },
    });
  };
  return (
    <SlidingPanel isOpen={isOpen} onClose={onClose} position="left">
      <div className="flex items-center mb-4 border border-gray-700 rounded">
        <input
          type="text"
          placeholder="Ara"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-900 text-white"
        />
      </div>
      {/* Arama sonuçları */}
      <div className="flex-grow  overflow-y-auto">
        {searchQuery.trim().length < 3 ? (
          <p>Arama yapmak için en az 3 karakter girin</p>
        ) : loading ? (
          <p>Aranıyor...</p>
        ) : data && data.getSearchForUser.users ? (
          <>
            {data.getSearchForUser.users.map((user: any) => (
              <div className="flex items-center mb-2" key={user._id}>
                <img
                  src={user.profilePhoto || 'https://via.placeholder.com/40'}
                  alt="User"
                  className="rounded-full mr-2"
                />
                <Link to={`user/${user._id}`}>
                  <p className="font-bold">{user.userName}</p>
                  <p className="text-sm text-gray-400">
                    {user.followingCount} Takipçi
                  </p>
                </Link>
              </div>
            ))}
            <div
              onClick={loadMore}
              className={`${
                data.getSearchForUser.totalCount <=
                  data.getSearchForUser.users.length && 'hidden'
              } hover:bg-gray-100  text-center items-center justify-center p-3`}
            >
              +
            </div>
          </>
        ) : (
          <span>Sonuç bulunamadı</span>
        )}
      </div>
    </SlidingPanel>
  );
};

export default SearchPanel;
