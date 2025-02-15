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
} from '@mui/material';
import {
  Movie as MovieIcon,
  Language as LanguageIcon,
  EmojiEmotions as ComedyIcon, // Komediya uchun ikonka
  Group as GroupIcon, // Birga ko'rish uchun ikonka
  LocalBar as PartyIcon, // Zavq uchun ikonka
} from '@mui/icons-material';

// Tarjimalar JSON fayli
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
  },
};

const API_KEY = '45cc22d90672cbbcdb905049fa3bc212d015130b3eddbb40a8c108f613b758a2';
const API_BASE_URL = 'https://api.together.xyz/v1';

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

  const handleNext = () => {
    if (step === 1 && !genrePreference) {
      alert(translations[language].errorMessage + 'Iltimos, birinchi savolga javob bering!');
      return;
    }
    if (step === 2 && !watchingPreference) {
      alert(translations[language].errorMessage + 'Iltimos, ikkinchi savolga javob bering!');
      return;
    }
    if (step === 3 && !mood) {
      alert(translations[language].errorMessage + 'Iltimos, uchinchi savolga javob bering!');
      return;
    }
    if (step === 4 && !dayType) {
      alert(translations[language].errorMessage + 'Iltimos, to‘rtinchi savolga javob bering!');
      return;
    }
    if (step === 5 && !socialPreference) {
      alert(translations[language].errorMessage + 'Iltimos, beshinchi savolga javob bering!');
      return;
    }
    if (step === 6 && !energyPreference) {
      alert(translations[language].errorMessage + 'Iltimos, oltinchi savolga javob bering!');
      return;
    }
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateRecommendations = async () => {
    if (!genrePreference || !watchingPreference || !mood || !dayType || !socialPreference || !energyPreference) {
      alert(translations[language].errorMessage + 'Iltimos, barcha savollarga javob bering!');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Foydalanuvchi ${genrePreference} janridagi filmlarni yoqtiradi. U ${watchingPreference} tomosha qilishni afzal ko‘radi. Hozir u ${mood} his qilmoqda. Bugun uning kuni ${dayType} o‘tdi. U ${socialPreference}ni afzal ko‘radi va ${energyPreference} bilan to‘lishni xohlaydi. Uning kayfiyatiga mos 3 ta film tavsiya qiling. Iltimos, har bir film uchun quyidagi ma'lumotlarni aniq ko'rsating: 1. Film nomi, 2. Film haqida qisqacha ma'lumot. Javobni ${language} tilida bering.`;

      const response = await axios.post(`${API_BASE_URL}/chat/completions`, {
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 900
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const cleanedResponse = response.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/g, '');
      const recommendations = cleanedResponse
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      const formattedRecommendations = recommendations.map((item) => {
        const [name, description] = item.split('\n');
        return { name, description };
      });

      setResponse(formattedRecommendations);
    } catch (error) {
      console.error('API chaqiruvida xato:', error.response ? error.response.data : error.message);
      setResponse([{ name: translations[language].errorMessage + (error.response ? error.response.data : error.message) }]);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const question = questions[step - 1];

    return (
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend" sx={{ color: 'white', mb: 2, fontSize: '1.2rem', fontWeight: 'bold' }}>
          {question.text}
        </FormLabel>
        <RadioGroup
          value={
            step === 1 ? genrePreference :
            step === 2 ? watchingPreference :
            step === 3 ? mood :
            step === 4 ? dayType :
            step === 5 ? socialPreference :
            step === 6 ? energyPreference : ''
          }
          onChange={(e) => {
            if (step === 1) setGenrePreference(e.target.value);
            else if (step === 2) setWatchingPreference(e.target.value);
            else if (step === 3) setMood(e.target.value);
            else if (step === 4) setDayType(e.target.value);
            else if (step === 5) setSocialPreference(e.target.value);
            else if (step === 6) setEnergyPreference(e.target.value);
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {question.options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.value}
              control={<Radio sx={{ color: 'white' }} />}
              label={
                <Typography sx={{ color: 'white' }}>
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
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: '#1B1B1B' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <MovieIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
              {translations[language].appTitle}
            </Typography>
          </Box>

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="language"
            onClick={handleLanguageMenuOpen}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageMenuClose}
          >
            <MenuItem onClick={() => changeLanguage('uz')}>O'zbek</MenuItem>
            <MenuItem onClick={() => changeLanguage('ru')}>Русский</MenuItem>
            <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Asosiy kontent */}
      <Container maxWidth="md" sx={{ mt: 15 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#1B1B1B', color: 'white' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
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
            <Box sx={{ mt: 4, p: 3, bgcolor: '#1B1B1B', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
                {translations[language].recommendationsTitle}
              </Typography>
              <List>
                {response.map((item, index) => (
                  <ListItem key={index} sx={{ borderBottom: '1px solid #ddd', py: 2 }}>
                    <ListItemAvatar>
                      <Avatar>
                        {item.genre === "comedy" ? <ComedyIcon /> : <MovieIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                          {item.name.replace(/\*\*/g, '')} {/* ** belgilarini olib tashlash */}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;