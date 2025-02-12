import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, CircularProgress, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';

const API_KEY = '45cc22d90672cbbcdb905049fa3bc212d015130b3eddbb40a8c108f613b758a2';
const API_BASE_URL = 'https://api.together.xyz/v1';

function App() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [genrePreference, setGenrePreference] = useState('');
  const [lifeMovieGenre, setLifeMovieGenre] = useState('');
  const [dayType, setDayType] = useState('');
  const [step, setStep] = useState(1);

  const questions = [
    "Qaysi janrdagi filmlarni ko'proq yoqtirasiz? (Masalan: Jangari, romantik, komediya, fantastika, qo'rqinchli, dramatik, ilmiy-fantastik, tarixiy, va boshqalar)",
    "Hayotingiz haqida film ishlansa, uning janri qanday bo‘lar edi?",
    "Bugun qanday kun o‘tdi: quvnoq, stressli, zerikarli yoki juda band?"
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateRecommendations = async () => {
    if (!genrePreference.trim() || !lifeMovieGenre.trim() || !dayType.trim()) {
      alert('Iltimos, barcha savollarga javob bering!');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Foydalanuvchi ${genrePreference} janridagi filmlarni yoqtiradi. Uning hayoti haqida film ishlansa, uning janri ${lifeMovieGenre} bo'lardi. Bugun uning kuni ${dayType} o'tdi. Uning kayfiyatiga mos 3 ta film tavsiya qiling. Iltimos, har bir film uchun quyidagi ma'lumotlarni aniq ko'rsating: 1. Film nomi, 2. Janri, 3. Qisqa tavsifi. Javobni o'zbek tilida bering.`;

      const response = await axios.post(`${API_BASE_URL}/chat/completions`, {
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const cleanedResponse = response.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/g, '');
      setResponse(cleanedResponse.trim());
    } catch (error) {
      console.error('API chaqiruvida xato:', error.response ? error.response.data : error.message);
      setResponse('Xatolik yuz berdi: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#0A0B14', color: 'white' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <MovieIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            VibeLy
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#FFFFFF' }}>
            Kayfiyatingizga mos filmlarni toping!
          </Typography>
        </Box>

        {step === 1 && (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ color: 'white', mb: 2 }}>{questions[0]}</FormLabel>
            <TextField
              value={genrePreference}
              onChange={(e) => setGenrePreference(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            />
          </FormControl>
        )}

        {step === 2 && (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ color: 'white', mb: 2 }}>{questions[1]}</FormLabel>
            <TextField
              value={lifeMovieGenre}
              onChange={(e) => setLifeMovieGenre(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            />
          </FormControl>
        )}

        {step === 3 && (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ color: 'white', mb: 2 }}>{questions[2]}</FormLabel>
            <RadioGroup
              value={dayType}
              onChange={(e) => setDayType(e.target.value)}
            >
              <FormControlLabel value="quvnoq" control={<Radio />} label="Quvnoq" sx={{ color: 'white' }} />
              <FormControlLabel value="stressli" control={<Radio />} label="Stressli" sx={{ color: 'white' }} />
              <FormControlLabel value="zerikarli" control={<Radio />} label="Zerikarli" sx={{ color: 'white' }} />
              <FormControlLabel value="juda band" control={<Radio />} label="Juda band" sx={{ color: 'white' }} />
            </RadioGroup>
          </FormControl>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={handleBack} disabled={step === 1} variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
            Orqaga
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} variant="contained">
              Keyingi
            </Button>
          ) : (
            <Button onClick={generateRecommendations} disabled={loading} variant="contained">
              {loading ? <CircularProgress size={24} /> : 'Tavsiyalarni Olish'}
            </Button>
          )}
        </Box>

        {response && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#0A0B14' }}>
              Tavsiyalar:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#0A0B14' }}>
              {response}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;