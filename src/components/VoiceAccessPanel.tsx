"use client";
 
import { useEffect, useRef, useState } from "react";
 
type VoiceState = "idle" | "listening" | "processing";
 
declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
 
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
 
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
  }
}
 
const  starterPrompts  =  [
"Tell me about this home.",
"What systems are in this home?",
"Where are the leak sensors?",
"What water risk points are protected?",
"Where are the water shutoff valves?",
"Is the dishwasher protected?",
"What mitigation devices are installed?",
"What rooms are monitored?",
"What was the last service event?",
"What changed recently?",
"What needs attention?",
"What is the risk profile of this house?"
];

export default function VoiceAccessPanel() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("Tap a starter prompt or ask a question by tapping microphone below.");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const clearQuestionTimeoutRef = useRef<number  |  null>(null);
 
  const [speechSupported,  setSpeechSupported] = useState(false);

  useEffect (() => {
    setSpeechSupported(
       Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
    ) ;
}, []);
 
  function speak(text: string) {
    return;
  }

 function  scheduleQuestionClear() {
if  (clearQuestionTimeoutRef.current) {
  window.clearTimeout (clearQuestionTimeoutRef .current);
}

clearQuestionTimeoutRef.current = window.setTimeout(() =>{
  setQuestion("");
    },  10000);
}

  async function sendQuestion(text: string) {
     const cleanedText  =  text.trim();
     if  ( !cleanedText)  {
        setResponse( "Choose a starter prompt or tap the microphone button to ask about the house.");
          return;
}
    setVoiceState("processing");
    setResponse("Checking the house record now...");
     
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: cleanedText })
      });
 
      const data = await res.json();
      const recordResponse = res.ok &&  typeof data?.response  ===  "string"  &&  data.response.trim() ?  data.response.trim() : "No record found.";

     setResponse(recordResponse);
     speak(recordResponse);
     scheduleQuestionClear();
    } catch {
      setResponse("I couldn't reach the house record. Please try again.");
   scheduleQuestionClear();
 } finally {
      setVoiceState("idle");
    }
  }
 
  function startListening() {
    if (!speechSupported || voiceState !== "idle") return;
 
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
 
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
 
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
      setQuestion(transcript.trim());
      recognition.stop();
      if (transcript) {
        void sendQuestion(transcript.trim());
      } else {
        setResponse("I didn't catch a question, please tap the microphone and try again.");
      }
    };
 
    recognition.onend = () => {
      setVoiceState((current) => (current === "processing" ? "processing" : "idle"));
    };
 
    recognition.onerror = () => {
      setVoiceState("idle");
      setResponse("Microphone capture failled. Please tap the microphone and try again.");
    };
 
    recognitionRef.current = recognition;
    setResponse("");
    setVoiceState("listening");
    recognition.start();
  }
 
  return (
    <div className="voice-shell">
      <div className="callout">
        Tap a starter prompt or use the microphone to ask about the house. Responses appear on screen for quick review and follow-up.
      </div>
 <div className="starter-prompts">
  <strong>Try asking...</strong>
  <div className="starter-prompt-list">
    {starterPrompts.map((prompt) => (
      <button
        key={prompt}
        type="button"
        className="starter-prompt"
        onClick={() => {
          setQuestion(prompt);
          void sendQuestion(prompt);
        }}
        disabled={voiceState !== "idle"}
      >
        {prompt}
      </button>
    ))}
  </div>
</div>

      <div className="voice-controls">
        <button
          type="button"
          className={`voice-button ${voiceState === "listening" ? "active" : ""}`}
          onClick={startListening}
          disabled={!speechSupported || voiceState === "processing"}
        >
          {speechSupported ? "microphone" : "🎙 Speech not supported here"}
        </button>
 
        {voiceState === "listening" ? <span className="listening-indicator">Listening...</span> : null}
        {voiceState === "processing" ? <span className="listening-indicator">Processing...</span> : null}
      </div>
 
      <textarea
        className="voice-input"
        value={question}
        readOnly
        placeholder="Your question will appear here."
      />
 
     
      <div className="voice-response">
        <strong>Record response</strong>
        <p>{response}</p>
        <div className="voice-caption">Answers are drawn only from the structured house record.</div>
      </div>
    </div>
  );
}
