import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  KinopoiskDev,
  MovieQueryBuilder,
  SPECIAL_VALUE,
  SORT_TYPE,
} from '@openmoviedb/kinopoiskdev_client';

const kp = new KinopoiskDev('E032XGP-C0EMA2H-G0CSDZ5-SBAAESF');

const FilmSearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filmName = queryParams.get('q') || ''; // VibeLy.jsx dan kelgan film nomi

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (filmName) {
      searchMovies(filmName); // Film nomi bilan avtomatik qidiruv
    }
  }, [filmName]);

  const searchMovies = async (filmName) => {
    if (!filmName.trim()) {
      setError('Название фильма не указано.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryBuilder = new MovieQueryBuilder();

      const query = queryBuilder
        .select(['id', 'name', 'rating', 'poster', 'year', 'externalId'])
        .filterExact('name', filmName)
        .filterExact('poster.url', SPECIAL_VALUE.NOT_NULL)
        .sort('rating.kp', SORT_TYPE.DESC)
        .paginate(1, 10)
        .build();

      const { data, error, message } = await kp.movie.getByFilters(query);

      if (error) {
        setError(message || 'Произошла ошибка.');
        return;
      }

      if (data && data.docs.length > 0) {
        setMovies(data.docs);
      } else {
        setError('Фильм не найден.');
      }
    } catch (err) {
      setError('Произошла ошибка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Информация о фильме</h1>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        {movies.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {movies.map((movie) => (
              <li key={movie.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <h2>{movie.name.replace(/\*\*/g, '')}</h2>
                <p>Год: {movie.year}</p>
                <p>Рейтинг: {movie.rating.kp}</p>
                {movie.poster?.url && (
                  <img
                    src={movie.poster.url}
                    alt={movie.name}
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                )}
                {/* Ссылка на фильм */}
                {movie.externalId?.kp ? (
                  <p>
                    <a
                      href={`https://www.kinopoisk.ru/film/${movie.externalId.kp}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      Смотреть на Кинопоиске
                    </a>
                  </p>
                ) : movie.id ? (
                  <p>
                    <a
                      href={`https://www.kinopoisk.ru/film/${movie.id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      Смотреть на Кинопоиске
                    </a>
                  </p>
                ) : (
                  <p>Ссылка недоступна</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>Фильм не найден.</p>
        )}
      </div>
    </div>
  );
};

export default FilmSearchPage;