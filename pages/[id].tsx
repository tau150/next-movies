import { movieUrl, creditsUrl, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '../config';
import { basicFetch } from 'services/fetchFunctions';
import Header from 'components/Header/Header';
import Breadcrumb from 'components/Breadcrumb';
import MovieInfo from 'components/MovieInfo';
import Grid from 'components/Grid/Grid';
import Card from 'components/Card/Card';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { Movie, Credits, Crew, Cast } from 'services/types';

type Props = {
  movie: Movie;
  directors: Crew[];
  cast: Cast[];
};

const Movie: NextPage<Props> = ({ movie, cast, directors }) => (
  <main>
    <Header />
    <Breadcrumb title={movie.original_title} />
    <MovieInfo
      thumbUrl={movie.poster_path ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path : '/no_image.jpg'}
      rating={movie.vote_average}
      year={movie.release_date.split('-')[0]}
      backgroundImgUrl={movie.backdrop_path ? IMAGE_BASE_URL + BACKDROP_SIZE + movie.backdrop_path : '/no_image.jpg'}
      title={movie.original_title}
      summary={movie.overview}
      directors={directors}
      time={movie.runtime}
      budget={movie.budget}
      revenue={movie.revenue}
    />
    <Grid className='p-4 max-w-7xl m-auto' title='Actors'>
      {cast.map(actor => (
        <Card
          key={actor.credit_id}
          imgUrl={actor.profile_path ? IMAGE_BASE_URL + POSTER_SIZE + actor.profile_path : '/no_image.jpg'}
          title={actor.name}
          subtitle={actor.character}
        />
      ))}
    </Grid>
  </main>
);

export default Movie;

export const getStaticProps: GetStaticProps = async context => {
  const id = context.params?.id as string;

  const movieEndpoint: string = movieUrl(id);
  const creditsEndpoint: string = creditsUrl(id);

  const movie = await basicFetch<Movie>(movieEndpoint);
  const credits = await basicFetch<Credits>(creditsEndpoint);

  const directors = credits.crew.filter(member => member.job === 'Director');

  return {
    props: {
      movie,
      directors,
      cast: credits.cast
    },
    revalidate: 60 * 60 * 24 // Re-build page every 24 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};