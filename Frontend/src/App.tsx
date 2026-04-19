import { useState } from 'react'
import './App.css'
import api from './api'

function App() {

  const [split, setSplit] = useState(50); // 0 = liberal, 100 = conservative
  const [ratio,setRatio] = useState([0.5,0.5])
  const [inputText,setInputText] = useState<string|null>()

  // const fetchScore = async() =>{
  //   if(!inputText) 
  //     return

  //   // const randomN = Math.ceil(Math.random() * 100) /100
    
  //   // console.log([randomN, Math.ceil((1 - randomN)*100)/100])
    
  //   // setRatio(randomN > 0.5 ?[randomN, Math.ceil((1 - randomN)*100)/100] : [Math.ceil((1 - randomN)*100)/100, randomN])

  //   const response = await api.post('/predict',{text:inputText})
  //   const dataResponse = response.data

    
  //   console.log('dataResponse: ',dataResponse)
  //   const firstScore = Math.ceil(dataResponse.scores[0] * 100) /100
    
  //   alert(`${dataResponse.label}: ${firstScore}`)
  //   if(dataResponse.label === "conservative"){
  //     const firstScore = Math.ceil(dataResponse.scores[0] * 100) /100
  //     setRatio([ Math.ceil((1- firstScore)*100)/100, firstScore])
  //   }
  //   else{
  //     setRatio([firstScore, Math.ceil((1- firstScore)*100)/100])
  //   }
    
  // }

  // 🎬 smooth animation helper
  const animateSplit = (from: number, to: number, duration = 600) => {
    const start = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const value = from + (to - from) * progress;

      setSplit(value);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const fetchScore = async () => {
    if (!inputText) return;
  
    const response = await api.post("/predict", { text: inputText });
    const data = response.data;
  
    console.log("dataResponse:", data);
  
    const maxScore = Math.max(...data.scores);
    const minScore = Math.min(...data.scores);
    
    console.log([minScore, maxScore], minScore + maxScore === 1)

    let liberal: number;
    let conservative: number;
  
    if (data.label === "liberal") {
      liberal = maxScore;
      conservative = minScore;
    } else {
      conservative = maxScore;
      liberal = minScore;
    }
  
    const newSplit = conservative * 100;
  
    alert(
      `Liberal: ${liberal.toFixed(2)} | Conservative: ${conservative.toFixed(2)}`
    );
  
    animateSplit(split, newSplit);
  };

  return (
    <>
      <div className="container" style={{
           transition: "background 6s ease",
           background: `linear-gradient(
            to right,
            rgba(1, 51, 100, 1) ${100 - split}%,
            rgba(211, 11, 13, 1) ${split}%
          )`,
        }}>
        <div className='input-container'>
          Hello
        <input type='text' value={inputText} onChange={(e)=>setInputText(e.target.value)} placeholder='Obama sucks'/>
        <button onClick={fetchScore}> Click me</button>
        </div>
      </div>
    </>
  )
}

export default App
