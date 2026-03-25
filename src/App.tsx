/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck, Send, AlertCircle, Play, CheckCircle2, Loader2, Shield, Crown, BookOpen, Palette, Compass, Heart, HandHelping, Laugh } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- DATA ---
const examData = [
  {
    partTitle: "Part 1 – Vocabulary",
    instruction: "Mark the letter A, B, C, or D to indicate the correct answer to each of the following questions.",
    type: "choice",
    questions: [
      { id: "q1", prompt: "Our school is near a __________ site, so we hear loud noises every day.", options: ["A. waste", "B. construction", "C. storage", "D. tourist"], answer: "B" },
      { id: "q2", prompt: "Many foreigners say that Vietnam is a __________ country to live in because the crime rate is low.", options: ["A. safe", "B. dirty", "C. noisy", "D. polluted"], answer: "A" },
      { id: "q3", prompt: "Each province in Vietnam has a unique __________ made from local ingredients.", options: ["A. sky train", "B. police officer", "C. tourist attraction", "D. specialty food"], answer: "D" },
      { id: "q4", prompt: "Sports like jogging and cycling can help prevent heart disease and improve __________ health.", options: ["A. intellectual", "B. mental", "C. physical", "D. emotional"], answer: "C" },
      { id: "q5", prompt: "Watching the sunset __________ us of our holiday in Ha Long Bay.", options: ["A. tells", "B. reminds", "C. shares", "D. holds"], answer: "B" },
      { id: "q6", prompt: "Many Vietnamese families follow the custom of __________ ancestors by setting up an altar at home.", options: ["A. worshipping", "B. distracting", "C. appearing", "D. maintaining"], answer: "A" },
      { id: "q7", prompt: "It started raining while we were trying to __________ a tent in the forest.", options: ["A. make up", "B. take up", "C. put up", "D. turn up"], answer: "C" },
      { id: "q8", prompt: "Our teacher told us to __________ notes of the history lesson carefully for the exam.", options: ["A. get", "B. do", "C. give", "D. take"], answer: "D" },
      { id: "q9", prompt: "Let's go __________ the grammatical points together so we don’t make mistakes in the exam.", options: ["A. up", "B. over", "C. on", "D. off"], answer: "B" },
      { id: "q10", prompt: "The students __________ have great opportunities for the future.", options: ["A. whom study in that university", "B. who study in that university", "C. whose study in that university", "D. which study in that university"], answer: "B" },
      { id: "q11", prompt: "The busier the streets become, __________.", options: ["A. most difficult it is to get around", "B. more difficult it is to get around", "C. the more difficult it is to get around", "D. the most difficult it is to get around"], answer: "C" },
      { id: "q12", prompt: "__________ that everyone enjoys listening to his songs.", options: ["A. Son Tung is too a talented singer", "B. Son Tung is so a talented singer", "C. Son Tung is talented enough", "D. Son Tung is such a talented singer"], answer: "D" }
    ]
  },
  {
    partTitle: "Part 2 – Guided Cloze Test 1",
    instruction: "Read the following announcement and mark the letter A, B, C, or D to indicate the correct option.",
    passage: "NEW SCHOOL RULES ANNOUNCEMENT\nTo make our school a better place, we have some new rules. Students must arrive (13) __________ time and keep classrooms clean. During class, mobile phones are not allowed. If a student (14) __________ a phone without permission, teachers will give a penalty. Students must also (15) __________ their teachers and classmates. (16) __________, shouting, and running in the hallways are not allowed. Teachers will check and remind students about the rules. Please follow the rules to keep our school safe. For more (17) __________, ask your homeroom teacher. Let’s work together to make our school a better place so that everyone can study comfortably.",
    type: "choice",
    questions: [
      { id: "q13", prompt: "Question 13:", options: ["A. for", "B. to", "C. at", "D. on"], answer: "D" },
      { id: "q14", prompt: "Question 14:", options: ["A. uses", "B. will use", "C. using", "D. used"], answer: "A" },
      { id: "q15", prompt: "Question 15:", options: ["A. argue", "B. respect", "C. divide", "D. distract"], answer: "B" },
      { id: "q16", prompt: "Question 16:", options: ["A. Fight", "B. To fighting", "C. Fighting", "D. To fight"], answer: "C" },
      { id: "q17", prompt: "Question 17:", options: ["A. problems", "B. details", "C. lessons", "D. students"], answer: "B" }
    ]
  },
  {
    partTitle: "Part 3 – Guided Cloze Test 2",
    instruction: "Read the following advertisement and mark the letter A, B, C, or D to indicate the correct option.",
    passage: "EXPLORE THE STUNNING DOLOMITES THIS HOLIDAY!\nIf you haven't decided on where to travel this holiday, consider the Dolomites! The Dolomites are a majestic site. They are widely regarded as being among the most (18) __________ mountain landscapes in the world. There are steep rocky cliffs, sharp peaks, narrow and deep valleys, and (19) __________ white snow on the mountain top. Their natural scenery (20) __________ tourists from many parts of the world. The Dolomites are a popular place for winter skiing, mountain climbing, hiking, and cycling any time of the year. An (21) __________ covering seven mountain passes on the Dolomites occurs in the first week of July. So do not hesitate to (22) __________ a tour to the Dolomites to see and do these things for yourself!",
    type: "choice",
    questions: [
      { id: "q18", prompt: "Question 18:", options: ["A. attract", "B. attraction", "C. attractive", "D. attractively"], answer: "C" },
      { id: "q19", prompt: "Question 19:", options: ["A. a", "B. an", "C. the", "D. x (no article)"], answer: "D" },
      { id: "q20", prompt: "Question 20:", options: ["A. attracts", "B. travels", "C. explores", "D. locates"], answer: "A" },
      { id: "q21", prompt: "Question 21:", options: ["A. annual race bicycle", "B. annual bicycle race", "C. bicycle race annual", "D. race bicycle annual"], answer: "B" },
      { id: "q22", prompt: "Question 22:", options: ["A. give", "B. book", "C. set", "D. make"], answer: "B" }
    ]
  },
  {
    partTitle: "Part 4 – Reading Comprehension 1",
    instruction: "Read the following passage and mark the letter A, B, C, or D to indicate the correct answer.",
    passage: "Living in the countryside is very relaxing and peaceful with a slower pace of life. Life in the countryside may be too slow for some people. Most people in the countryside are farmers or fishermen. They grow rice, raise animals, or fish to earn a living. Because of this, people in the countryside lead a healthy life and they seem to be friendly and helpful to their neighbors. However, the countryside does not have as many good schools or hospitals as the bigger cities do. The cost of living in the countryside is much lower than in the cities.\n\nLife in the city is faster and more exciting. There are more things to buy and do in the cities, so you won’t get bored. Young people often leave their villages to go to the cities for work or college. The traffic jams, crime rate, and air pollution in the cities are worse than in the countryside. Thus, some people find living in big cities more dangerous and stressful than in the countryside. In spite of this, more people, especially young people, are moving to the crowded and noisy cities and settling down here.",
    type: "choice",
    questions: [
      { id: "q23", prompt: "Which of the following is the best title of the passage?", options: ["A. Most people like living in the city", "B. Benefits of country and city living", "C. Living in the countryside is better than living in the city", "D. The good and bad things about living in the country and city"], answer: "D" },
      { id: "q24", prompt: "Why does the author mention rice, animals and fish in paragraph 1?", options: ["A. to compare rural jobs with city jobs.", "B. to show how people in the countryside make a living.", "C. to explain why rural areas are busier.", "D. to describe the traditional food in the countryside."], answer: "B" },
      { id: "q25", prompt: "What does the word they in paragraph 1 refer to?", options: ["A. neighbors in the countryside", "B. people in the countryside", "C. people in the city", "D. animals in the countryside"], answer: "B" },
      { id: "q26", prompt: "According to paragraph 2, why don’t people in the city get bored?", options: ["A. Because cities offer a greater variety of activities and shopping options.", "B. Because cities have fewer entertainment choices than the countryside.", "C. Because the cost of living in the city is higher than in the countryside.", "D. Because people in the city rarely go out or explore new places."], answer: "A" },
      { id: "q27", prompt: "Which of the following is NOT mentioned as a problem in the city?", options: ["A. traffic jams", "B. crime rate", "C. job opportunities", "D. air pollution"], answer: "C" },
      { id: "q28", prompt: "The word stressful in paragraph 2 is OPPOSITE in meaning to __________.", options: ["A. difficult", "B. challenging", "C. relaxing", "D. harmful"], answer: "C" }
    ]
  },
  {
    partTitle: "Part 5 – Reading Comprehension 2",
    instruction: "Read the following passage and mark the letter A, B, C, or D to indicate the correct answer.",
    passage: "If we were asked exactly what we were doing a year ago, we would probably have to say that we could not remember. But if we kept a book and wrote in it an account of what we did each day, we should be able to give an answer. In a way, this is similar to history.\n\nMost people are proud to tell you what their ancestors did in the past. We may call this remembered history. But many things have been forgotten because we do not have any written account of them. Sometimes people kept a record of the most important happenings in their country, but often it was destroyed by fire or in a war. Sometimes, there was never any written record because the people of that time and place did not know how to write. For example, we know a lot about the people who lived in China about 2,500 years ago because they could write and leave written records for those who lived after them. But we know little about the people who lived just 200 years ago in central Africa, because they had no writing system.\n\nSometimes, even if people cannot write, they may know something of the past. They have heard about it from older people, and often songs, dances, and stories have been made about the most important past events, and these have been sung about, acted and told for generations.",
    type: "choice",
    questions: [
  { id: "q29", prompt: "What is the main idea of the reading passage?", options: ["A. The importance of keeping written records of history.", "B. The difference between remembered history and written history.", "C. How history is preserved and passed down over time.", "D. Why we know little about some ancient civilizations."], answer: "C" },
      { id: "q30", prompt: "The phrase “similar to” in paragraph 1 is OPPOSITE in meaning to __________.", options: ["A. related to", "B. different from", "C. the same as", "D. dependent on"], answer: "B" },
      { id: "q31", prompt: "“Remembered history” in the passage may refer to __________.", options: ["A. history based on a person’s imagination", "B. record of important happenings destroyed by fire or in a war", "C. stories of important happenings passed down to younger generations", "D. songs, dances, and stories about all events in our everyday lives"], answer: "C" },
      { id: "q32", prompt: "The underlined word “destroyed” in the passage mostly means __________.", options: ["A. protected", "B. maintained", "C. appeared", "D. damaged"], answer: "D" },
      { id: "q33", prompt: "We know very little about the central Africa 200 years ago because __________.", options: ["A. there was nothing to write down at that time", "B. the people there did not keep a record", "C. the written records were destroyed by a fire", "D. the people there did not have a writing system"], answer: "D" },
      { id: "q34", prompt: "The underlined word “They” in the passage refers to __________.", options: ["A. people who cannot write", "B. older people", "C. songs, dances, and stories", "D. the most important happenings"], answer: "A" },
      { id: "q35", prompt: "We can infer from the passage that we could know more about our past if our ancestors had __________.", options: ["A. kept written records of past events", "B. not burnt their written records in wars", "C. told more stories", "D. made more songs and dances"], answer: "A" }
    ]
  },
  {
    partTitle: "Part 6 – Sentence / Paragraph Arrangement",
    instruction: "Mark the letter A, B, C or D to indicate the best arrangement of utterances or sentences.",
    type: "choice",
    questions: [
      { id: "q36", prompt: "a. Linh: Hi, Mai. Long time no see. How're you doing?\nb. Linh: Oh, that's why I haven't seen you at the Art Club recently.\nc. Mai: I'm fine, thanks. By the way, my family just moved to a new apartment in the city center last month.", options: ["A. c – b – a", "B. a – c – b", "C. b – a – c", "D. a – b – c"], answer: "B" },
      { id: "q37", prompt: "a. Jack: You should get enough sleep, eat a balanced diet, and exercise regularly.\nb. Emma: How can we stay physically healthy?\nc. Emma: My parents say that teenagers like us need to sleep at least eight hours a night. Is that true?\nd. Emma: But we often find it hard to sleep well, especially before important exams.\ne. Jack: Yes, it is. Getting enough sleep helps you stay focused and energetic.", options: ["A. b – a – c – e – d", "B. b – e – d – a – c", "C. d – a – b – e – c", "D. d – e – c – a – b"], answer: "A" },
      { id: "q38", prompt: "a. My parents wish I spent more time outside, but gaming is my favorite hobby.\nb. Last night, I joined a game competition and won some matches.\nc. Nowadays, most people, especially teens, use computers or smartphones to play games.\nd. I play computer games every day after school.\ne. I was about to complete the last challenge when my mom stopped me to do my homework.", options: ["A. d – c – a – e – b", "B. e – b – c – a – d", "C. c – d – b – e – a", "D. a – e – d – b – c"], answer: "C" },
      { id: "q39", prompt: "a. First, they wear different clothes and try new hairstyles.\nb. Teenagers in Vietnam are experiencing many changes in their lifestyle.\nc. Second, they are more confident when they talk to others and share their ideas.\nd. However, even though life is changing, they still respect and keep their traditional values.\ne. Third, technology is important in their daily life because they use it for study and entertainment.", options: ["A. e – b – a – d – c", "B. a – c – e – d – b", "C. b – c – a – d – e", "D. b – a – c – e – d"], answer: "D" },
      { id: "q40", prompt: "Dear Mom and Dad,\na. I arrived in Da Nang in the afternoon at about 4 o’clock, and Aunt Hoa met me at the airport.\nb. The next day, I visited Cham Island, swam in the sea, and played water games. The beach is very beautiful with clear blue water and white sand.\nc. I will come home on Monday morning, and my flight will land at about 11 o’clock. Could you please pick me up at Noi Bai airport?\nd. I have had a wonderful trip so far. On the first day, I took a mud bath and ate delicious seafood with Aunt’s family.\ne. Tomorrow, we will go to Son Tra Nature Reserve to see wild animals and enjoy the view. I have also bought some souvenirs for you and my friends.\nYour daughter,\nJane", options: ["A. a – d – b – e – c", "B. a – c – d – e – b", "C. a – b – e – c – d", "D. a – e – d – b – c"], answer: "A" }
    ]
  },
  {
    partTitle: "Part 7 – Sentence Transformation",
    instruction: "Mark the letter A, B, C, or D to indicate the sentence that is closest in meaning to the original sentence.",
    type: "choice",
    questions: [
      { id: "q41", prompt: "It's difficult to find a parking space downtown due to the large number of cars.", options: ["A. Finding parking downtown is not a good idea because there are many big cars.", "B. It's simple to park downtown because there are too many cars.", "C. The large number of cars makes it difficult to find a parking space downtown.", "D. Don't drive downtown because parking spaces are full."], answer: "C" },
      { id: "q42", prompt: "Let's wash our hands before eating dinner.", options: ["A. What about we wash our hands before eating dinner?", "B. How about to wash our hands before eating dinner?", "C. Why don't we wash our hands before eating dinner?", "D. Why not washing our hands before eating dinner?"], answer: "C" },
      { id: "q43", prompt: "It's a pity that I do not live near the beach.", options: ["A. I wish I live near the beach.", "B. I wish I lived near the beach.", "C. Living near the beach is a pity.", "D. Living near the beach is a must."], answer: "B" },
      { id: "q44", prompt: "“Are you sure about these results?” the teacher asked me.", options: ["A. The teacher asked me if I was sure about those results.", "B. The teacher asked me was I sure about those results.", "C. The teacher asked me if I am sure about these results.", "D. The teacher asked me I was sure about these results."], answer: "A" },
      { id: "q45", prompt: "Linh finds it easy to understand native speakers.", options: ["A. It is not simple for Linh to understand native speakers.", "B. Linh can't stand understanding native speakers.", "C. Linh finds it difficult to understand native speakers.", "D. Linh has no difficulty in understanding native speakers."], answer: "D" }
    ]
  },
  {
    partTitle: "Part 8 – Sentence Combination",
    instruction: "Mark the letter A, B, C, or D to indicate the sentence that best combines each pair of sentences.",
    type: "choice",
    questions: [
      { id: "q46", prompt: "You need to make enough time for your schoolwork. You will fall behind in your classes.", options: ["A. If you make sufficient time for your schoolwork, you will fall behind in your classes.", "B. Unless you will make sufficient time for your schoolwork, you fall behind in your classes.", "C. If you do not make sufficient time for your schoolwork, you will fall behind in your classes.", "D. Unless you make sufficient time for your schoolwork, you won't fall behind in your classes."], answer: "C" },
      { id: "q47", prompt: "Linda was reading a book. Her phone rang.", options: ["A. Linda was reading a book when her phone rang.", "B. Her phone rang while Linda is reading a book.", "C. After Linda was reading a book, her phone rang.", "D. Her phone rang but Linda was reading a book."], answer: "A" },
      { id: "q48", prompt: "The test was very difficult. Many students couldn't finish it.", options: ["A. The test was such difficult that many students couldn't finish it.", "B. The test was easy enough for many students to finish.", "C. It was such a difficult test that many students could finish it", "D. The test was so difficult that many students couldn't finish it."], answer: "D" },
      { id: "q49", prompt: "Tokyo is a busy city. It attracts millions of tourists every year.", options: ["A. Tokyo is a busy city which attract millions of tourists every year.", "B. Tokyo is a busy city attracts millions of tourists every year.", "C. Tokyo is a busy city which attracts millions of tourists every year.", "D. Tokyo is a busy city attract millions of tourists every year."], answer: "C" },
      { id: "q50", prompt: "We learnt about climate change on Earth. The temperature of Earth is rising due to greenhouse gas emissions.", options: ["A. We learnt about climate change on Earth, which temperature is rising due to greenhouse gas emissions.", "B. We learnt about climate change on Earth, whose temperature is rising due to greenhouse gas emissions.", "C. We learnt about climate change on Earth, who temperature is rising due to greenhouse gas emissions.", "D. We learnt about climate change on Earth, what temperature is rising due to greenhouse gas emissions."], answer: "B" }
    ]
  }
];

// --- ARCHETYPES ---
interface Archetype {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const ARCHETYPES: Archetype[] = [
  { id: 'warrior', name: 'Warrior', icon: <Shield className="w-8 h-8" />, color: 'bg-indigo-500' },
  { id: 'leader', name: 'Leader', icon: <Crown className="w-8 h-8" />, color: 'bg-indigo-500' },
  { id: 'sage', name: 'Sage', icon: <BookOpen className="w-8 h-8" />, color: 'bg-indigo-500' },
  { id: 'creator', name: 'Creator', icon: <Palette className="w-8 h-8" />, color: 'bg-indigo-500' },
  { id: 'explorer', name: 'Explorer', icon: <Compass className="w-8 h-8" />, color: 'bg-indigo-500' },
  { id: 'lover', name: 'Lover', icon: <Heart className="w-8 h-8" />, color: 'bg-indigo-500' },
  { id: 'caregiver', name: 'Caregiver', icon: <HandHelping className="w-8 h-8" />, color: 'bg-indigo-500' },
  { id: 'jester', name: 'Jester', icon: <Laugh className="w-8 h-8" />, color: 'bg-indigo-500' },
];

// --- CONSTANTS ---
const BOT_TOKEN = '8260200134:AAFlf6xMu9DAYAKWDJVoLFczYRRzWVqijnY';
const CHAT_ID = '6789535208';

export default function App() {
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);

  const totalQuestions = examData.reduce((acc, part) => acc + part.questions.length, 0);

  const handleStartTest = async () => {
    if (!name.trim() || !selectedArchetype) {
      setError("Please enter your name and select an archetype.");
      return;
    }
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setTestStarted(true);
      setError(null);
      setAnswers({});
      setResult(null);
    } catch (err) {
      setTestStarted(true);
    }
  };

  const resetTest = useCallback(async () => {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (err) {}
    }
    setTestStarted(false);
    setAnswers({});
    setResult(null);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted) {
        alert("Fullscreen exited! The test has been reset for security reasons.");
        resetTest();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [testStarted, resetTest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let score = 0;
    let detailReport = "";

    examData.forEach((part) => {
      part.questions.forEach((q) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.answer;
        if (isCorrect) score++;

        detailReport += `${q.id.toUpperCase()}: ${userAnswer || 'Skipped'} (Target: ${q.answer}) - ${isCorrect ? '✅' : '❌'}\n`;
      });
    });

    setResult({ score, total: totalQuestions });
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    try {
      const message = `🎯 GVP High School - Unit 7 Test 2\n\n👤 Name: ${name}\n🎭 Archetype: ${selectedArchetype?.name}\n📊 Score: ${score}/${totalQuestions}\n📈 Percentage: ${((score / totalQuestions) * 100).toFixed(2)}%\n⏰ Time: ${new Date().toLocaleString()}\n\n-- DETAILS --\n${detailReport}`;
      
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
      });
    } catch (err) {
      console.error("Telegram report failed", err);
    } finally {
      setIsSubmitting(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleOptionSelect = (qId: string, optionValue: string) => {
    const letter = optionValue.charAt(0); // Extract 'A', 'B', 'C', or 'D'
    setAnswers(prev => ({ ...prev, [qId]: letter }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!testStarted && !result ? (
          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-5xl mx-auto">
            <div className="w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex w-20 h-20 bg-indigo-50 rounded-3xl items-center justify-center mb-6 border border-indigo-100">
                  <ClipboardCheck className="w-10 h-10 text-indigo-600" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 text-slate-800">
                  Đề 3
                </h1>
              </div>
              
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="max-w-md mx-auto">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Your Identity</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest text-center">Select Archetype</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ARCHETYPES.map((arch) => (
                      <button key={arch.id} onClick={() => setSelectedArchetype(arch)} className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all group ${selectedArchetype?.id === arch.id ? 'border-indigo-600 bg-indigo-50 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 bg-indigo-100 text-indigo-600`}>{arch.icon}</div>
                        <h4 className="font-bold text-sm text-slate-600 mb-1">{arch.name}</h4>
                      </button>
                    ))}
                  </div>
                </div>

                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-50 py-3 px-4 rounded-lg max-w-md mx-auto border border-red-200"><AlertCircle className="w-5 h-5" />{error}</motion.div>}

                <div className="max-w-md mx-auto pt-4">
                  <button onClick={handleStartTest} className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-5 px-8 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)] uppercase tracking-widest">
                    <Play className="w-5 h-5 fill-current" /> {selectedArchetype ? `START AS ${selectedArchetype.name.toUpperCase()}` : 'CHOOSE ARCHETYPE'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center w-full max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 border-4 border-indigo-100 relative shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-slate-800">Test Completed, {name}!</h2>
            <p className="text-slate-500 mb-8">Your results have been securely recorded.</p>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 w-full shadow-xl">
              <div className="text-6xl font-black text-indigo-600 mb-2">{result.score}<span className="text-slate-400 text-3xl">/{result.total}</span></div>
              <div className="text-sm text-slate-400 uppercase tracking-widest mb-6">Final Score</div>
            </div>
            <button onClick={resetTest} className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-bold underline underline-offset-4">Return to Headquarters</button>
          </motion.div>
        ) : (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-12">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl py-4 mb-12 border-b border-slate-200 flex items-center justify-between shadow-sm rounded-b-2xl px-6">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600`}>{selectedArchetype?.icon}</div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{name}</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Fullscreen Active</p>
                </div>
              </div>
              <div className="text-sm font-mono bg-slate-100 px-4 py-2 rounded-full border border-slate-200 text-slate-600 font-bold">
                {Object.keys(answers).length}/{totalQuestions}
              </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-16 pb-32">
              {examData.map((part, pIdx) => (
                <section key={pIdx} className="space-y-6">
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <h3 className="text-2xl font-black text-slate-800">{part.partTitle}</h3>
                    <p className="text-slate-500 text-sm mt-2 font-medium">{part.instruction}</p>
                  </div>
                  
                  {part.passage && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6 text-slate-700 leading-relaxed whitespace-pre-wrap font-serif text-lg shadow-sm">
                      {part.passage}
                    </div>
                  )}

                  <div className="grid gap-6">
                    {part.questions.map((q) => {
                      return (
                        <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                          <p className="text-slate-800 font-medium mb-4 whitespace-pre-wrap leading-relaxed text-lg">
                            <span className="text-indigo-600 mr-2 font-black">{q.id.replace('q', 'Q')}.</span>
                            {q.prompt}
                          </p>
                          
                          <div className="flex flex-col gap-3 ml-8">
                            {q.options.map(opt => {
                              const letter = opt.charAt(0);
                              const isSelected = answers[q.id] === letter;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleOptionSelect(q.id, opt)}
                                  className={`text-left px-5 py-3 rounded-lg font-medium transition-all border-2 ${
                                    isSelected
                                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-white'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex justify-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <button type="submit" disabled={isSubmitting} className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 uppercase tracking-widest">
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Final Test</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
