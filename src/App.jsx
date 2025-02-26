import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  LocalMovies as LocalMoviesIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Tarjimalar
const translations = {
  uz: {
    appTitle: "VibeLy",
    appSubtitle: "Kayfiyatingizga mos filmlarni toping!",
    question: "Savol",
    of: "dan",
    question1: "Qaysi janrdagi filmlarni ko‘rishni yoqtirasiz?",
    question2: "Filmni yolg‘iz tomosha qilishni yoqtirasizmi yoki kim bilandir birga?",
    question3: "Hozir o‘zingizni qanday his qilyapsiz?",
    question4: "Bugun kuningiz qanday o‘tdi?",
    question5: "Bugun ko‘proq yolg‘izlik yoqadimi yoki samimiy insonlar bilan birga bo‘lish?",
    question6: "O‘zingizni qanday energiya bilan to‘ldirmoqchisiz?",
    optionFantasy: "Fantastika",
    optionDrama: "Drama",
    optionComedy: "Komediya",
    optionThriller: "Triller",
    optionRomance: "Romantika",
    optionHistorical: "Tarixiy",
    optionHorror: "Qo‘rqinchli film",
    optionAlone: "Yolg‘iz",
    optionTogether: "Birga",
    optionCalm: "Xotirjam",
    optionExcited: "Hayajonlangan",
    optionBored: "Zerikkan",
    optionSad: "Ma’yus",
    optionGood: "Yaxshi",
    optionAverage: "O‘rtacha",
    optionHard: "Og‘ir",
    optionLoneliness: "Yolg‘izlik",
    optionCompany: "Samimiy insonlar bilan birga bo‘lish",
    optionLove: "Sevgi",
    optionAdventure: "Sarguzasht",
    optionWonder: "Hayrat",
    buttonBack: "Orqaga",
    buttonNext: "Keyingi",
    buttonGetRecommendations: "Tavsiyalarni Olish",
    moreRecommendations: "Yana Tavsiyalar",
    recommendationsTitle: "Tavsiyalar:",
    errorMessage: "Xatolik yuz berdi: ",
    fillAll: "Iltimos, barcha savollarga javob bering!",
    fillStep: "Iltimos, {step} savolga javob bering!",
    year: "Yil:",
    genres: "Janrlar:",
    actors: "Aktyorlar:",
    description: "Tasnif:",
    dailyRecommendation: "Kundalik Film Tavsiyasi",
    favorites: "Sevimlilar",
    addToFavorites: "Sevimlilarga qo‘shish",
    removeFromFavorites: "Sevimlilardan olib tashlash",
    aiRecommendation: "AI yordamida tavsiya olish",
  },
  ru: {
    appTitle: "VibeLy",
    appSubtitle: "Найдите фильмы по вашему настроению!",
    question: "Вопрос",
    of: "из",
    question1: "Какие жанры фильмов вы предпочитаете?",
    question2: "Вы хотите смотреть фильм один или с кем-то?",
    question3: "Как вы себя чувствуете сейчас?",
    question4: "Как прошел ваш день?",
    question5: "Сегодня вы предпочитаете одиночество или общение с близкими?",
    question6: "Какой энергией вы хотите наполниться?",
    optionFantasy: "Фантастика",
    optionDrama: "Драма",
    optionComedy: "Комедия",
    optionThriller: "Триллер",
    optionRomance: "Романтика",
    optionHistorical: "Исторический",
    optionHorror: "Ужасы",
    optionAlone: "Один",
    optionTogether: "Вместе",
    optionCalm: "Спокойный",
    optionExcited: "Возбужденный",
    optionBored: "Скучающий",
    optionSad: "Грустный",
    optionGood: "Хороший",
    optionAverage: "Средний",
    optionHard: "Тяжелый",
    optionLoneliness: "Одиночество",
    optionCompany: "Общение с близкими",
    optionLove: "Любовь",
    optionAdventure: "Приключение",
    optionWonder: "Удивление",
    buttonBack: "Назад",
    buttonNext: "Далее",
    buttonGetRecommendations: "Получить рекомендации",
    moreRecommendations: "Ещё рекомендации",
    recommendationsTitle: "Рекомендации:",
    errorMessage: "Произошла ошибка: ",
    fillAll: "Пожалуйста, ответьте на все вопросы!",
    fillStep: "Пожалуйста, ответьте на {step} вопрос!",
    year: "Год:",
    genres: "Жанры:",
    actors: "Актеры:",
    description: "Описание:",
    dailyRecommendation: "Ежедневная рекомендация фильма",
    favorites: "Избранное",
    addToFavorites: "Добавить в избранное",
    removeFromFavorites: "Удалить из избранного",
    aiRecommendation: "Получить рекомендацию с помощью ИИ",
  },
  en: {
    appTitle: "VibeLy",
    appSubtitle: "Find movies that match your mood!",
    question: "Question",
    of: "of",
    question1: "Which movie genres do you prefer?",
    question2: "Do you prefer watching movies alone or with someone?",
    question3: "How are you feeling right now?",
    question4: "How was your day?",
    question5: "Do you prefer loneliness or being with close people today?",
    question6: "What kind of energy do you want to fill yourself with?",
    optionFantasy: "Fantasy",
    optionDrama: "Drama",
    optionComedy: "Comedy",
    optionThriller: "Thriller",
    optionRomance: "Romance",
    optionHistorical: "Historical",
    optionHorror: "Horror",
    optionAlone: "Alone",
    optionTogether: "Together",
    optionCalm: "Calm",
    optionExcited: "Excited",
    optionBored: "Bored",
    optionSad: "Sad",
    optionGood: "Good",
    optionAverage: "Average",
    optionHard: "Hard",
    optionLoneliness: "Loneliness",
    optionCompany: "Being with close people",
    optionLove: "Love",
    optionAdventure: "Adventure",
    optionWonder: "Wonder",
    buttonBack: "Back",
    buttonNext: "Next",
    buttonGetRecommendations: "Get Recommendations",
    moreRecommendations: "More Recommendations",
    recommendationsTitle: "Recommendations:",
    errorMessage: "An error occurred: ",
    fillAll: "Please answer all the questions!",
    fillStep: "Please answer the {step} question!",
    year: "Year:",
    genres: "Genres:",
    actors: "Actors:",
    description: "Description:",
    dailyRecommendation: "Daily Movie Recommendation",
    favorites: "Favorites",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    aiRecommendation: "Get Recommendation with AI",
  },
};

// API sozlamalari
const API_KEY = '45cc22d90672cbbcdb905049fa3bc212d015130b3eddbb40a8c108f613b758a2';
const API_BASE_URL = 'https://api.together.xyz/v1';
const KINOPOISK_API_KEY = 'E032XGP-C0EMA2H-G0CSDZ5-SBAAESF';
const KINOPOISK_API_URL = 'https://api.kinopoisk.dev/v1.3/movie';

// Film nomini tozalash funksiyasi
const getFilmNameOnly = (name) => {
  const quoteMatch = name.match(/"([^"]+)"/);
  if (quoteMatch) return quoteMatch[1].trim();
  const noStars = name.replace(/\*/g, '').trim();
  const parenMatch = noStars.match(/^([^(]+)/);
  return parenMatch ? parenMatch[1].trim() : noStars;
};

function App() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [genrePreference, setGenrePreference] = useState('');
  const [watchingPreference, setWatchingPreference] = useState('');
  const [mood, setMood] = useState('');
  const [dayType, setDayType] = useState('');
  const [socialPreference, setSocialPreference] = useState('');
  const [energyPreference, setEnergyPreference] = useState('');
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('uz');
  const [anchorEl, setAnchorEl] = useState(null);
  const [dailyMovies, setDailyMovies] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [usedMovieIds, setUsedMovieIds] = useState(new Set());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Kundalik tavsiyalarni har safar yangilash
  useEffect(() => {
    const fetchDailyRecommendations = async () => {
      try {
        const res = await axios.get(KINOPOISK_API_URL, {
          params: { 'votes.kp': '10000-10000000', sortField: 'random', limit: 6 },
          headers: { 'X-API-KEY': KINOPOISK_API_KEY },
        });
        const movies = res.data.docs.map(movie => ({
          id: movie.id,
          name: movie.name || movie.alternativeName || movie.enName || 'Unknown',
          poster: movie.poster?.url || null,
          link: `https://www.kinopoisk.ru/film/${movie.id}/`,
          rating: movie.rating?.kp?.toFixed(1) || 'N/A',
          year: movie.year || 'N/A',
          genres: movie.genres?.map(g => g.name) || [],
          actors: movie.persons?.filter(p => p.enProfession === 'actor').map(a => a.name).join(', ') || 'N/A',
          description: movie.description || 'N/A',
        }));
        setDailyMovies(movies);
      } catch (error) {
        console.error('Kundalik tavsiyalar xatosi:', error);
      }
    };
    fetchDailyRecommendations();
  }, []);

  // Savollar ro'yxati
  const questions = useMemo(() => [
    {
      text: translations[language].question1,
      options: [
        { value: "fantasy", label: translations[language].optionFantasy },
        { value: "drama", label: translations[language].optionDrama },
        { value: "comedy", label: translations[language].optionComedy },
        { value: "thriller", label: translations[language].optionThriller },
        { value: "romance", label: translations[language].optionRomance },
        { value: "historical", label: translations[language].optionHistorical },
        { value: "horror", label: translations[language].optionHorror },
      ],
    },
    {
      text: translations[language].question2,
      options: [
        { value: "alone", label: translations[language].optionAlone },
        { value: "together", label: translations[language].optionTogether },
      ],
    },
    {
      text: translations[language].question3,
      options: [
        { value: "calm", label: translations[language].optionCalm },
        { value: "excited", label: translations[language].optionExcited },
        { value: "bored", label: translations[language].optionBored },
        { value: "sad", label: translations[language].optionSad },
      ],
    },
    {
      text: translations[language].question4,
      options: [
        { value: "good", label: translations[language].optionGood },
        { value: "average", label: translations[language].optionAverage },
        { value: "hard", label: translations[language].optionHard },
      ],
    },
    {
      text: translations[language].question5,
      options: [
        { value: "loneliness", label: translations[language].optionLoneliness },
        { value: "company", label: translations[language].optionCompany },
      ],
    },
    {
      text: translations[language].question6,
      options: [
        { value: "love", label: translations[language].optionLove },
        { value: "adventure", label: translations[language].optionAdventure },
        { value: "wonder", label: translations[language].optionWonder },
      ],
    },
  ], [language]);

  // Til menyusi handlerlari
  const handleLanguageMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleLanguageMenuClose = () => setAnchorEl(null);
  const changeLanguage = (lang) => {
    setLanguage(lang);
    handleLanguageMenuClose();
  };

  // Sevimlilarga qo‘shish/olib tashlash
  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== movie.id);
    } else {
      newFavorites = [...favorites, movie];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Zaxira filmlarni olish
  const getBackupMovies = async () => {
    try {
      const res = await axios.get(KINOPOISK_API_URL, {
        params: { 'votes.kp': '10000-10000000', sortField: 'random', limit: 10 },
        headers: { 'X-API-KEY': KINOPOISK_API_KEY },
      });
      return res.data.docs
        .filter(movie => !usedMovieIds.has(movie.id))
        .map(movie => ({
          id: movie.id,
          name: movie.name || movie.alternativeName || movie.enName || 'Unknown',
          poster: movie.poster?.url || null,
          link: `https://www.kinopoisk.ru/film/${movie.id}/`,
          rating: movie.rating?.kp?.toFixed(1) || 'N/A',
          year: movie.year || 'N/A',
          genres: movie.genres?.map(g => g.name) || [],
          actors: movie.persons?.filter(p => p.enProfession === 'actor').map(a => a.name).join(', ') || 'N/A',
          description: movie.description || 'N/A',
        }));
    } catch (error) {
      console.error('Zaxira filmlar xatosi:', error);
      return [];
    }
  };

  // Kinopoiskdan film ma'lumotlarini olish
  const fetchMovieDetails = async (movieName) => {
    try {
      const cleanedName = movieName.replace(/\*\*/g, '').replace(/"/g, '').trim();
      const filmNameOnly = getFilmNameOnly(cleanedName);
      const res = await axios.get(KINOPOISK_API_URL, {
        params: { name: filmNameOnly },
        headers: { 'X-API-KEY': KINOPOISK_API_KEY },
      });
      if (res.data.docs && res.data.docs.length > 0) {
        const movie = res.data.docs[0];
        if (usedMovieIds.has(movie.id)) return null;
        return {
          id: movie.id,
          name: movie.name || movie.alternativeName || movie.enName || filmNameOnly,
          poster: movie.poster ? movie.poster.url : null,
          link: `https://www.kinopoisk.ru/film/${movie.id}/`,
          rating: movie.rating?.kp || 'N/A',
          year: movie.year || 'N/A',
          genres: movie.genres?.map(g => g.name) || [],
          actors: movie.persons?.filter(p => p.enProfession === 'actor').map(a => a.name).join(', ') || 'N/A',
          description: movie.description || 'N/A',
        };
      }
      return null;
    } catch (error) {
      console.error('Kinopoisk API xatosi:', error);
      return null;
    }
  };

  // Film tavsiyalarini generatsiya qilish
  const generateRecommendations = async (isMore = false) => {
    if (!genrePreference || !watchingPreference || !mood || !dayType || !socialPreference || !energyPreference) {
      alert(translations[language].fillAll);
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const prompt = `Foydalanuvchi ${translations[language][`option${genrePreference.charAt(0).toUpperCase() + genrePreference.slice(1)}`]} janridagi filmlarni yoqtiradi. `
        + `U filmlarni ${translations[language][`option${watchingPreference.charAt(0).toUpperCase() + watchingPreference.slice(1)}`]} tomosha qilishni afzal ko‘radi. `
        + `Hozir u o‘zini ${translations[language][`option${mood.charAt(0).toUpperCase() + mood.slice(1)}`]} his qilmoqda. `
        + `Bugun uning kuni ${translations[language][`option${dayType.charAt(0).toUpperCase() + dayType.slice(1)}`]} o‘tdi. `
        + `U ${translations[language][`option${socialPreference.charAt(0).toUpperCase() + socialPreference.slice(1)}`]}ni afzal ko‘radi va o‘zini ${translations[language][`option${energyPreference.charAt(0).toUpperCase() + energyPreference.slice(1)}`]} energiyasi bilan to‘ldirmoqchi. `
        + `5 ta TURli filmlar tavsiya qiling, har biri turli yillar va kichik janrlardan bo‘lsin. `
        + `Faqat nomlarni yangi qatordan yozing. Takrorlanishlardan saqlaning va mashhur blokbasterlardan qoching. Misol:\n1. "Назад в будущее"\n2. "Достучаться до небес"...`;

      const res = await axios.post(
        `${API_BASE_URL}/chat/completions`,
        {
          model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const cleanedResponse = res.data.choices[0].message.content
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .replace(/\d+\.\s*/g, '')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 2 && !line.startsWith("Foydalanuvchi"))
        .slice(0, 5);

      const recommendations = await Promise.all(
        cleanedResponse.map(async (name) => {
          let retries = 2;
          while (retries > 0) {
            const details = await fetchMovieDetails(name);
            if (details) return details;
            retries--;
          }
          return null;
        })
      );

      let validRecommendations = recommendations.filter(r => r !== null);
      if (validRecommendations.length < 5) {
        const backup = await getBackupMovies();
        validRecommendations = [
          ...validRecommendations,
          ...backup.slice(0, 5 - validRecommendations.length)
        ];
      }

      const newIds = validRecommendations.map(m => m.id);
      setUsedMovieIds(prev => new Set([...prev, ...newIds]));
      setRecommendedMovies(prev => isMore ? [...prev, ...validRecommendations] : validRecommendations);
      setOpenDialog(false);
    } catch (error) {
      console.error('API xatosi:', error);
      setErrorMessage(translations[language].errorMessage + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigatsiya handlerlari
  const handleNext = () => {
    if (step === 1 && !genrePreference) return alert(translations[language].fillStep.replace('{step}', '1'));
    if (step === 2 && !watchingPreference) return alert(translations[language].fillStep.replace('{step}', '2'));
    if (step === 3 && !mood) return alert(translations[language].fillStep.replace('{step}', '3'));
    if (step === 4 && !dayType) return alert(translations[language].fillStep.replace('{step}', '4'));
    if (step === 5 && !socialPreference) return alert(translations[language].fillStep.replace('{step}', '5'));
    if (step === 6 && !energyPreference) return alert(translations[language].fillStep.replace('{step}', '6'));
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Bosqich kontentini render qilish
  const renderStepContent = () => {
    const question = questions[step - 1];
    const currentValue =
      step === 1 ? genrePreference :
      step === 2 ? watchingPreference :
      step === 3 ? mood :
      step === 4 ? dayType :
      step === 5 ? socialPreference :
      step === 6 ? energyPreference : '';

    return (
      <Fade in={true} key={step} timeout={300}>
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <Typography sx={{ color: 'white', mb: 2, fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 'bold' }}>
            {`${translations[language].question} ${step} ${translations[language].of} 6`}
          </Typography>
          <FormLabel component="legend" sx={{ color: 'white', mb: 2, fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 'bold' }}>
            {question.text}
          </FormLabel>
          <RadioGroup
            value={currentValue}
            onChange={(e) => {
              const val = e.target.value;
              if (step === 1) setGenrePreference(val);
              else if (step === 2) setWatchingPreference(val);
              else if (step === 3) setMood(val);
              else if (step === 4) setDayType(val);
              else if (step === 5) setSocialPreference(val);
              else if (step === 6) setEnergyPreference(val);
            }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option.value}
                control={<Radio sx={{ color: 'white' }} />}
                label={<Typography sx={{ color: 'white', fontSize: isMobile ? '0.9rem' : '1rem' }}>{option.label}</Typography>}
                aria-label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Fade>
    );
  };

  // Film kartasini render qilish
  const renderMovieCard = (item, index) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    return (
      <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: '#2C2C2C', color: 'white', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {item.poster ? (
              <Avatar variant="square" src={item.poster} sx={{ width: '100%', height: 200, borderRadius: 2, objectFit: 'cover' }} alt={item.name} />
            ) : (
              <Avatar sx={{ width: '100%', height: 200, borderRadius: 2 }}><MovieIcon fontSize="large" /></Avatar>
            )}
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem', mb: 1, textAlign: 'center' }}>
              {item.name} {item.rating !== 'N/A' && `(${item.rating})`}
            </Typography>
            <Box sx={{ textAlign: 'left', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2" color="#FFFFFF">{translations[language].year} {item.year || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalMoviesIcon fontSize="small" />
                <Typography variant="body2" color="#FFFFFF">{translations[language].genres} {item.genres.join(', ') || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon fontSize="small" />
                <Typography variant="body2" color="#FFFFFF">{translations[language].actors} {item.actors || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DescriptionIcon fontSize="small" />
                <Typography variant="body2" color="#FFFFFF">{translations[language].description} {item.description || 'N/A'}</Typography>
              </Box>
            </Box>
            {item.link && (
              <Typography variant="body2" color="#FFFFFF" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1565C0', textDecoration: 'none', fontWeight: 'bold' }}>
                  Kinopoiskda ko‘rish
                </a>
              </Typography>
            )}
            <IconButton onClick={() => toggleFavorite(item)} sx={{ mt: 1, color: isFavorite ? '#FF4081' : 'white' }} aria-label={isFavorite ? translations[language].removeFromFavorites : translations[language].addToFavorites}>
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#1B1B1B' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'white' }}>
              <img width={120} height={40} src="./src/assets/VibeLy.png" alt="VibeLy logo" />
            </Typography>
          </Box>
          <IconButton size="large" color="inherit" onClick={() => setShowFavorites(true)} aria-label={translations[language].favorites}>
            <FavoriteIcon />
          </IconButton>
          <IconButton size="large" edge="end" color="inherit" onClick={handleLanguageMenuOpen}>
            <LanguageIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLanguageMenuClose}>
            <MenuItem onClick={() => changeLanguage('uz')}>O'zbek</MenuItem>
            <MenuItem onClick={() => changeLanguage('ru')}>Русский</MenuItem>
            <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: isMobile ? 5 : 15 }}>
        <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 2, bgcolor: '#1B1B1B', color: 'white' }}>
          {/* Kundalik Tavsiyalar */}
          {dailyMovies.length > 0 && !showFavorites && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>{translations[language].dailyRecommendation}</Typography>
              <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={3000} cssEase="linear">
                {dailyMovies.map((movie, index) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <a href={movie.link} target="_blank" rel="noopener noreferrer">
                      <Avatar variant="square" src={movie.poster} sx={{ width: '100%', height: 400, borderRadius: 2, objectFit: 'cover' }} alt={movie.name} />
                      <Typography sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}>{movie.name}</Typography>
                    </a>
                  </Box>
                ))}
              </Slider>
            </Box>
          )}

          {/* Loyha haqida matn va AI tugmasi */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>{translations[language].appSubtitle}</Typography>
            <Button variant="contained" onClick={() => setOpenDialog(true)}>{translations[language].aiRecommendation}</Button>
          </Box>

          {/* Tavsiya qilingan filmlar */}
          {recommendedMovies.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                {translations[language].recommendationsTitle}
              </Typography>
              <Grid container spacing={2}>
                {recommendedMovies.map((item, index) => renderMovieCard(item, index))}
              </Grid>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button variant="outlined" onClick={() => generateRecommendations(true)} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : translations[language].moreRecommendations}
                </Button>
              </Box>
            </Box>
          )}

          {/* Savollar dialogi */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            TransitionComponent={Fade}
            PaperProps={{ sx: { bgcolor: '#2C2C2C', color: 'white' } }}
          >
            <DialogTitle>{translations[language].appSubtitle}</DialogTitle>
            <DialogContent>{renderStepContent()}</DialogContent>
            <DialogActions>
              <Button onClick={handleBack} disabled={step === 1} sx={{ color: 'white' }}>{translations[language].buttonBack}</Button>
              {step < 6 ? (
                <Button onClick={handleNext} sx={{ color: 'white' }}>{translations[language].buttonNext}</Button>
              ) : (
                <Button onClick={() => generateRecommendations(false)} disabled={loading} sx={{ color: 'white' }}>
                  {loading ? <CircularProgress size={24} /> : translations[language].buttonGetRecommendations}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;