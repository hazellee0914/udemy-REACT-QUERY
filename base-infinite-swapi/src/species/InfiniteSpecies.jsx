import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from 'react-query';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery(
    'sw-species',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isLoading) return <div className='loading'>Loading...</div>;
  if (isError) return <div className='Error!'>{error.toString()}</div>;

  return (
    <>
      {isFetching && <div className='loading'>Loading...</div>}
      isF
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((species) => {
            return (
              <Species
                key={species.name}
                name={species.name}
                hairColor={species.hair_color}
                eyeColor={species.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
