import {useEffect, useState} from "react";
import './App.css';
import MovieCard from "./conponents/movie-card";
import Youtube from 'react-youtube';
import { getByName, getDiscover, getWithVideos, IMAGE_PATH, pageTypeMap  } from "./api";
import { MovieList } from "./conponents/movie-list";
import { Header } from "./conponents/header";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [playTrailer, setPlayTrailer] = useState(false);
  const [page, setPage] = useState(1);
  const [pageType, setPageType] = useState(Object.keys(pageTypeMap)[0]);

  useEffect(() => {
    async function callApi() {
      const results = await getDiscover();
     
      setMovies(results); 
      selectMovie(results[0]);
    }
    callApi();
  }, []);

  useEffect(() => {
    async function callApi() {
      // let results;
      // if(pageType == 'poopular')
      const results = await pageTypeMap[pageType](page);
      selectMovie(results[0]);
      setMovies([...movies, ...results]);
    }

    callApi();
  }, [page]);

  useEffect(() => {
    async function callApi() {
      let results = await pageTypeMap[pageType]()
      // if(pageType == 'poopular')
      // const results = await getDiscover(page);
      selectMovie(results[0]);
      setMovies(results);
    }

    callApi();
  }, [pageType]);


  
  const searchMovies = async (e) => {
    e.preventDefault();
    const results = await getByName(searchKey);
    await selectMovie(results[0]);
    setMovies(results);
  }

 const selectMovie = async(movie) => {
    setPlayTrailer(false);
    const data = await getWithVideos(movie.id);
    setSelectedMovie(data);
  }

  const renderTrailer = () => {
    const { results } = selectedMovie.videos
    const trailer =results.length ? results.find(vid => vid.name === 'Official Trailer') : {key: 'xkfrrkqlKGE'};
    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;

    return (
      <Youtube
      videoId = {key}
      className={"youtube-container"}
      opts={{
        width:'100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0
        }
      }}
      />
    )
  }

  const renderPageTypes = () => {
    return Object.keys(pageTypeMap).map(item => {
      return( <button 
      className={item === pageType && 'page-type-current'} 
      onClick={() => {setPageType(item)}}>
       {item}
       </button>
    )});
  }

  return (
    <div className="App">
      <Header
        searchMovies={searchMovies}
        setSearchKey={setSearchKey}
      />

      {renderPageTypes()}


      <div className="hero" style={{ backgroundImage: `url(${IMAGE_PATH + selectedMovie.backdrop_path})` }}>
        <div className="content">
          {selectedMovie.videos && playTrailer && renderTrailer()}
          <button onClick={() => setPlayTrailer(true)} className="button">Play Trailer</button>
          <h1>{selectedMovie.title}</h1>
          {selectedMovie.overview && <p className="overview">{selectedMovie.overview}</p>}
        </div>
      </div>

      <MovieList
        movies={movies}
        selectMovie={selectMovie}
        onLoadMore={() => setPage(page + 1)} 
      />

    </div>
  );
} 
export default App;