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
  TextField,
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
  Person as PersonIcon,
  Group as GroupIcon,
  Mood as MoodIcon,
  MoodBad as MoodBadIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

// Tarjimalar JSON fayli
const translations = {
  uz: {
    appTitle: "VibeLy",
    appSubtitle: "Kayfiyatingizga mos filmlarni toping!",
    question1: "Hozir yolg‘iz filmsizmi yoki kim bilandir birga ko‘rmoqchimisiz?",
    question2: "Qaysi janrdagi filmlarni ko'proq yoqtirasiz? (Masalan: Jangari, romantik, komediya, fantastika, qo'rqinchli, dramatik, ilmiy-fantastik, tarixiy, va boshqalar)",
    question3: "Bugun qanday kun o‘tdi: quvnoq, stressli, zerikarli yoki juda band?",
    optionAlone: "Yolg‘iz",
    optionTogether: "Birga",
    optionHappy: "Quvnoq",
    optionStressed: "Stressli",
    optionBored: "Zerikarli",
    optionBusy: "Juda band",
    buttonBack: "Orqaga",
    buttonNext: "Keyingi",
    buttonGetRecommendations: "Tavsiyalarni Olish",
    recommendationsTitle: "Tavsiyalar:",
    errorMessage: "Xatolik yuz berdi: ",
  },
  ru: {
    appTitle: "VibeLy",
    appSubtitle: "Найдите фильмы по вашему настроению!",
    question1: "Сейчас вы хотите смотреть фильм один или с кем-то?",
    question2: "Какие жанры фильмов вы предпочитаете? (Например: Боевик, романтический, комедия, фантастика, ужасы, драма, научная фантастика, исторический и другие)",
    question3: "Как прошел ваш день: радостный, стрессовый, скучный или очень занятой?",
    optionAlone: "Один",
    optionTogether: "Вместе",
    optionHappy: "Радостный",
    optionStressed: "Стрессовый",
    optionBored: "Скучный",
    optionBusy: "Очень занятой",
    buttonBack: "Назад",
    buttonNext: "Далее",
    buttonGetRecommendations: "Получить рекомендации",
    recommendationsTitle: "Рекомендации:",
    errorMessage: "Произошла ошибка: ",
  },
  en: {
    appTitle: "VibeLy",
    appSubtitle: "Find movies that match your mood!",
    question1: "Are you watching alone or with someone?",
    question2: "Which movie genres do you prefer? (For example: Action, romantic, comedy, fantasy, horror, drama, sci-fi, historical, and others)",
    question3: "How was your day: happy, stressful, boring, or very busy?",
    optionAlone: "Alone",
    optionTogether: "Together",
    optionHappy: "Happy",
    optionStressed: "Stressful",
    optionBored: "Boring",
    optionBusy: "Very busy",
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
  const [watchingPreference, setWatchingPreference] = useState('');
  const [genrePreference, setGenrePreference] = useState('');
  const [dayType, setDayType] = useState('');
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('uz');
  const [anchorEl, setAnchorEl] = useState(null); // Til tanlash menyusi uchun

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
        { value: "yolg'iz", label: translations[language].optionAlone, icon: <PersonIcon fontSize="large" /> },
        { value: "birga", label: translations[language].optionTogether, icon: <GroupIcon fontSize="large" /> },
      ],
    },
    {
      text: translations[language].question2,
      options: null,
    },
    {
      text: translations[language].question3,
      options: [
        { value: "quvnoq", label: translations[language].optionHappy, icon: <MoodIcon fontSize="large" /> },
        { value: "stressli", label: translations[language].optionStressed, icon: <MoodBadIcon fontSize="large" /> },
        { value: "zerikarli", label: translations[language].optionBored, icon: <SentimentDissatisfiedIcon fontSize="large" /> },
        { value: "juda band", label: translations[language].optionBusy, icon: <SentimentSatisfiedIcon fontSize="large" /> },
      ],
    },
  ];

  const handleNext = () => {
    if (step === 1 && !watchingPreference) {
      alert(translations[language].errorMessage + 'Iltimos, birinchi savolga javob bering!');
      return;
    }
    if (step === 2 && !genrePreference) {
      alert(translations[language].errorMessage + 'Iltimos, ikkinchi savolga javob bering!');
      return;
    }
    if (step === 3 && !dayType) {
      alert(translations[language].errorMessage + 'Iltimos, uchinchi savolga javob bering!');
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateRecommendations = async () => {
    if (!watchingPreference.trim() || !genrePreference.trim() || !dayType.trim()) {
      alert(translations[language].errorMessage + 'Iltimos, barcha savollarga javob bering!');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Foydalanuvchi hozir ${watchingPreference} ko'rmoqchi. U ${genrePreference} janridagi filmlarni yoqtiradi. Bugun uning kuni ${dayType} o'tdi. Uning kayfiyatiga mos 3 ta film tavsiya qiling. Iltimos, har bir film uchun quyidagi ma'lumotlarni aniq ko'rsating: 1. Film nomi, 2. Janri, 3. Qisqa tavsifi, 4. Film rasmi (URL), 5. Film havolasi (URL). Javobni o'zbek tilida bering.`;

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

      // Tavsiyalarni obyekt shaklida saqlash
      const formattedRecommendations = recommendations.map((item) => {
        const [name, genre, description, imageUrl, link] = item.split('\n');
        return { name, genre, description, imageUrl, link };
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
        {question.options ? (
          <RadioGroup
            value={step === 1 ? watchingPreference : step === 3 ? dayType : ''}
            onChange={(e) => {
              if (step === 1) setWatchingPreference(e.target.value);
              else if (step === 3) setDayType(e.target.value);
            }}
            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}
          >
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option.value}
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 2,
                      border: '2px solid',
                      borderColor: (step === 1 ? watchingPreference === option.value : step === 3 ? dayType === option.value : false) ? 'primary.main' : 'grey.500',
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: (step === 1 ? watchingPreference === option.value : step === 3 ? dayType === option.value : false) ? 'primary.dark' : 'background.paper',
                      color: (step === 1 ? watchingPreference === option.value : step === 3 ? dayType === option.value : false) ? 'white' : 'grey.500',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        color: 'white',
                      },
                    }}
                  >
                    {option.icon}
                    <Typography sx={{ mt: 1 }}>{option.label}</Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
        ) : (
          <TextField
            value={genrePreference}
            onChange={(e) => setGenrePreference(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ bgcolor: 'white', borderRadius: 1 }}
            placeholder={translations[language].question2}
          />
        )}
      </FormControl>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: '#1B1B1B' }}>
        <Toolbar>
          {/* Chap tomonda logo va loyha nomi */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <MovieIcon sx={{ fontSize: 40, color: 'write', mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
              {translations[language].appTitle}
            </Typography>
          </Box>

          {/* O'ng tomonda til tanlash */}
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

          <Box  sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
            <Button onClick={handleBack} disabled={step === 1} variant="outlined" sx={{ color: 'white', borderColor: '#1565C0' }}>
              {translations[language].buttonBack}
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} variant="contained" disabled={!watchingPreference && step === 1 || !genrePreference && step === 2}>
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
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white ' }}>
                {translations[language].recommendationsTitle}
              </Typography>
              <List>
                {response.map((item, index) => (
                  <ListItem  key={index} sx={{ borderBottom: '1px solid #ddd', py: 2 }}>
                    <ListItemAvatar>
                      <Avatar src={item.imageUrl} alt={item.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
                          {item.name}
                        </a>
                      }
                      secondary={
                        <>
                          <Typography  variant="body2" color="text.secondary">
                            {item.genre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </>
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