
import React from "react"
import type { NextPage } from 'next'
import Link from "next/link"
import Header from "components/Header"
import Grid from 'components/Grid'
import Card from 'components/Card'
import Spinner from 'components/Spinner'
import Hero from 'components/Hero'
import { useFetchMovies } from 'services/fetchHooks'
import { IMAGE_BASE_URL, BACKDROP_SIZE } from "config"

const Home: NextPage = () => {
  const [query, setQuery] = React.useState("")

  const { data, fetchNextPage, isLoading, isFetching, error} = useFetchMovies(query)

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) fetchNextPage();
  };

  if (error) return <div>Oh noooooooo something went wrong!</div>;


  return (
   <main className='relative h-screen overflow-y-scroll' onScroll={handleScroll}>
    <Header setQuery={setQuery} />
    {!query && data && data.pages ? (
      <Hero
      title={data?.pages[0].results[0].original_title}
      text={data?.pages[0].results[0].overview}
      imgUrl={data?.pages[0]?.results[0]?.backdrop_path ? IMAGE_BASE_URL + BACKDROP_SIZE + data.pages[0].results[0].backdrop_path : "/no_image.jpg"}/>
    ) : null}
    <Grid className="p-4 max-w-7xl m-auto" title={query ? `Search Results: ${data?.pages[0].total_results} ` : "Popular Movies"}>
      {data && data.pages ? (
        data.pages.map( page => page.results.map(movie => (
        <Link key={movie.id} href={`/${movie.id}`}>
        <div className="cursor-pointer hover:opacity-80 duration-300">
          <Card imgUrl={movie.poster_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.poster_path}` : '/no_image.jpg' } title={movie.original_title}/>
        </div>
        </Link>
         )))
      ): null}
    </Grid>
    {isLoading || isFetching ? <Spinner /> : null}
   </main>
   )
}

export default Home
