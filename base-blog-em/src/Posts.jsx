import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  // queryClient 의존성
  useEffect(() => {
    // 9 page 이전이라면 프리페칭이 이루어지지만 10페이지면 가져올 데이터가 없다.
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(['posts', nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  // const data = [];
  const { data, isError, isLoading } = useQuery(
    // query key 가 바뀌면 useQuery 에 새로운 쿼리로 알려주고 데이터를 다시 가져옴.
    ['posts', currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true,
    }
  );
  // fetchposts 가 해결될때까지 데이터는 거짓이되고, 해결되면 데이터에 배열이 포함 => 컴포넌트가 다시 렌더링되어 매핑!!
  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>Oops, something went wrong</h3>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className='post-title'
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previousValus) => previousValus - 1);
          }}
        >
          Previous page
        </button>
        {/* page1 가 일때 보여줌 */}
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((previousValus) => previousValus + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
