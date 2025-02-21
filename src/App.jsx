import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Grid,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Language as LanguageIcon,
  EmojiEmotions as ComedyIcon,
  Group as GroupIcon,
  LocalBar as PartyIcon,
} from '@mui/icons-material';

const translations = {
  uz: {
    appTitle: "VibeLy",
    appSubtitle: "Kayfiyatingizga mos filmlarni toping!",
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
    recommendationsTitle: "Tavsiyalar:",
    errorMessage: "Xatolik yuz berdi: ",
    fillAll: "Iltimos, barcha savollarga javob bering!",
    fillStep: "Iltimos, {step} savolga javob bering!",
    year: "Yil:",
    genres: "Janrlar:",
    actors: "Aktyorlar:",
    description: "Tasnif:",
  },
  ru: {
    appTitle: "VibeLy",
    appSubtitle: "Найдите фильмы по вашему настроению!",
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
    recommendationsTitle: "Рекомендации:",
    errorMessage: "Произошла ошибка: ",
    fillAll: "Пожалуйста, ответьте на все вопросы!",
    fillStep: "Пожалуйста, ответьте на {step} вопрос!",
    year: "Год:",
    genres: "Жанры:",
    actors: "Актеры:",
    description: "Описание:",
  },
  en: {
    appTitle: "VibeLy",
    appSubtitle: "Find movies that match your mood!",
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
    recommendationsTitle: "Recommendations:",
    errorMessage: "An error occurred: ",
    fillAll: "Please answer all the questions!",
    fillStep: "Please answer the {step} question!",
    year: "Year:",
    genres: "Genres:",
    actors: "Actors:",
    description: "Description:",
  },
};

const API_KEY = '45cc22d90672cbbcdb905049fa3bc212d015130b3eddbb40a8c108f613b758a2';
const API_BASE_URL = 'https://api.together.xyz/v1';
const KINOPOISK_API_KEY = 'E032XGP-C0EMA2H-G0CSDZ5-SBAAESF';
const KINOPOISK_API_URL = 'https://api.kinopoisk.dev/v1.3/movie';

const getFilmNameOnly = (name) => {
  const quoteMatch = name.match(/"([^"]+)"/);
  if (quoteMatch) {
    return quoteMatch[1].trim();
  }
  const noStars = name.replace(/\*/g, '').trim();
  const parenMatch = noStars.match(/^([^(]+)/);
  const filmName = parenMatch ? parenMatch[1].trim() : noStars;
  return filmName;
};

function App() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genrePreference, setGenrePreference] = useState('');
  const [watchingPreference, setWatchingPreference] = useState('');
  const [mood, setMood] = useState('');
  const [dayType, setDayType] = useState('');
  const [socialPreference, setSocialPreference] = useState('');
  const [energyPreference, setEnergyPreference] = useState('');
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('uz');
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    handleLanguageMenuClose();
  };

  const questions = [
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
  ];

  const cleanMovieName = (name) => {
    const cleaned = name.replace(/\*\*/g, '').replace(/"/g, '').trim();
    return cleaned;
  };

  const fetchMovieDetails = async (movieName) => {
    try {
      const cleanedName = cleanMovieName(movieName);
      const filmNameOnly = getFilmNameOnly(cleanedName);
      console.log('Fetching details for:', filmNameOnly);
      const res = await axios.get(KINOPOISK_API_URL, {
        params: { name: filmNameOnly },
        headers: { 'X-API-KEY': KINOPOISK_API_KEY },
      });
      console.log('Kinopoisk API response:', res.data);
      if (res.data.docs && res.data.docs.length > 0) {
        const movie = res.data.docs[0];
        return {
          name: movie.name || movie.alternativeName || movie.enName || filmNameOnly,
          poster: movie.poster ? movie.poster.url : null,
          link: `https://www.kinopoisk.ru/film/${movie.id}/`,
          rating: movie.rating?.kp || 'N/A',
          year: movie.year || 'N/A',
          genres: movie.genres || [],
          actors: movie.persons?.filter(person => person.enProfession === 'actor').map(actor => actor.name).join(', ') || 'N/A',
          description: movie.description || 'N/A',
        };
      } else {
        console.warn(`No movie found for: ${filmNameOnly}`);
        return null;
      }
    } catch (error) {
      console.error('Kinopoisk API error:', error);
      return null;
    }
  };

  const generateRecommendations = async () => {
    if (!genrePreference || !watchingPreference || !mood || !dayType || !socialPreference || !energyPreference) {
      alert(translations[language].fillAll);
      return;
    }
    setLoading(true);
    try {
      const prompt = `Пользователь предпочитает фильмы в жанре ${genrePreference}. Он предпочитает смотреть фильмы ${watchingPreference}. Сейчас он чувствует себя ${mood}. Сегодня его день прошел ${dayType}. Он предпочитает ${socialPreference} и хочет наполниться энергией ${energyPreference}. Пожалуйста, порекомендуйте 3 фильма, которые подходят его настроению, и укажите только название фильма. Ответ должен быть на русском языке.`;

      const res = await axios.post(
        `${API_BASE_URL}/chat/completions`,
        {
          model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 900,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const cleanedResponse = res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/g, '');
      const filmNames = cleanedResponse
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => getFilmNameOnly(line));

      const formattedRecommendations = (await Promise.all(
        filmNames.map(async (name) => {
          const movieDetails = await fetchMovieDetails(name);
          return movieDetails ? { name, details: movieDetails } : null;
        })
      )).filter(item => item !== null);

      setResponse(formattedRecommendations);
    } catch (error) {
      console.error('API error:', error.response ? error.response.data : error.message);
      setResponse([{ name: translations[language].errorMessage + (error.response ? JSON.stringify(error.response.data) : error.message) }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !genrePreference) {
      alert(translations[language].fillStep.replace('{step}', '1'));
      return;
    }
    if (step === 2 && !watchingPreference) {
      alert(translations[language].fillStep.replace('{step}', '2'));
      return;
    }
    if (step === 3 && !mood) {
      alert(translations[language].fillStep.replace('{step}', '3'));
      return;
    }
    if (step === 4 && !dayType) {
      alert(translations[language].fillStep.replace('{step}', '4'));
      return;
    }
    if (step === 5 && !socialPreference) {
      alert(translations[language].fillStep.replace('{step}', '5'));
      return;
    }
    if (step === 6 && !energyPreference) {
      alert(translations[language].fillStep.replace('{step}', '6'));
      return;
    }
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

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
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
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
              label={
                <Typography sx={{ color: 'white', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  {option.label}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#1B1B1B' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <MovieIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
            <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'white' }}>
              {translations[language].appTitle}
            </Typography>
          </Box>
          <IconButton size="large" edge="end" color="inherit" aria-label="language" onClick={handleLanguageMenuOpen}>
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', fontSize: isMobile ? '1.5rem' : '2rem' }}>
              {translations[language].appSubtitle}
            </Typography>
          </Box>

          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
            <Button onClick={handleBack} disabled={step === 1} variant="outlined" sx={{ color: 'white', borderColor: '#1565C0' }}>
              {translations[language].buttonBack}
            </Button>
            {step < 6 ? (
              <Button onClick={handleNext} variant="contained">
                {translations[language].buttonNext}
              </Button>
            ) : (
              <Button onClick={generateRecommendations} disabled={loading} variant="contained">
                {loading ? <CircularProgress size={24} /> : translations[language].buttonGetRecommendations}
              </Button>
            )}
          </Box>

          {response.length > 0 && (
            <Box sx={{ mt: 4, p: isMobile ? 1 : 3, bgcolor: '#1B1B1B', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                {translations[language].recommendationsTitle}
              </Typography>
              <Grid container spacing={2}>
                {response.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: '#2C2C2C', color: 'white' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        {item.details.poster ? (
                          <Avatar
                            variant="square"
                            src={item.details.poster}
                            sx={{ 
                              width: '100%', 
                              height: isMobile ? 150 : 200,
                              borderRadius: 2,
                            }}
                          />
                        ) : (
                          <Avatar sx={{ 
                            width: isMobile ? 60 : 80, 
                            height: isMobile ? 60 : 80,
                            borderRadius: 2,
                          }}>
                            {item.name.toLowerCase().includes("comedy") ? (
                              <ComedyIcon fontSize={isMobile ? 'small' : 'medium'} />
                            ) : (
                              <MovieIcon fontSize={isMobile ? 'small' : 'medium'} />
                            )}
                          </Avatar>
                        )}
                        <Typography 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 'bold', 
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            mb: 1,
                            textAlign: 'center',
                          }}
                        >
                          🎬{item.name}
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="body2" 
                            color="#FFFFFF" 
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            <strong>📅{translations[language].year}</strong> {item.details.year || 'N/A'}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="#FFFFFF" 
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            <strong>⭐{translations[language].genres}</strong> {Array.isArray(item.details.genres) ? item.details.genres.map(genre => genre.name).join(', ') : 'N/A'}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="#FFFFFF" 
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            <strong>{translations[language].actors}</strong> {item.details.actors || 'N/A'}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="#FFFFFF" 
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            <strong>{translations[language].description}</strong> {item.details.description || 'N/A'}
                          </Typography>
                          {item.details.link && (
                            <Typography 
                              variant="body2" 
                              color="#FFFFFF" 
                              sx={{ display: 'block', mt: 1 }}
                            >
                              <a
                                href={item.details.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ 
                                  color: '#1565C0', 
                                  textDecoration: 'none',
                                  fontWeight: 'bold',
                                }}
                              >
                                Посмотреть на Кинопоиске
                              </a>
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;