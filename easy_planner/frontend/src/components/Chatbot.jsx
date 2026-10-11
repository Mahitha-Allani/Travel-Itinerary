import { useState, useRef, useEffect } from 'react'
import api from '../api/axios.js'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am Voyara, your travel assistant. Where do you want to go today?' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    const history = messages
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setTyping(true)

    try {
      const { data } = await api.post('/chat', { message: userMsg, history })
      let replyText = data.reply

      // Check for hidden JSON action block (handling potential formatting variations and code blocks)
      const actionRegex = /(?:```(?:json)?\s*)?(\{\s*"action"\s*:\s*"save_trip"[\s\S]*?\})(?:\s*```)?/
      const actionMatch = replyText.match(actionRegex)
      
      if (actionMatch) {
        // Strip the entire matched block (including code block wrappers) from the visible text
        replyText = replyText.replace(actionMatch[0], '').trim()
        
        try {
          const actionData = JSON.parse(actionMatch[1])
          const token = localStorage.getItem('token')

          if (!token) {
            replyText += '\n\n⚠️ Please log in to your account first so I can save this trip to your itinerary!'
          } else {
            // Automatically save the trip to the database!
            await api.post('/trips', {
              source: actionData.source || 'Mumbai',
              destination: actionData.destination || 'Delhi',
              days: parseInt(actionData.days) || 3,
              tripType: 'Solo'
            })
            // Dispatch event so Itinerary page immediately refreshes in real time!
            window.dispatchEvent(new CustomEvent('trip-saved'))
            replyText += `\n\n✅ I have successfully saved your trip to ${actionData.destination || 'Delhi'} (${actionData.days || 3} days)! Check your "Your Itinerary" tab.`
          }
        } catch (saveErr) {
          console.error("Failed to execute AI save action:", saveErr)
          replyText += '\n\n(Could not auto-save trip. Please check your connection or log in.)'
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', text: replyText }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now." }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setOpen(!open)}
        aria-label="Open AI Travel Assistant"
        className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 w-13 h-13 sm:w-14 sm:h-14 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition-transform hover:scale-105 active:scale-95 z-[9999]">
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Window — Fully mobile responsive */}
      {open && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-96 max-w-[400px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-creme-200 overflow-hidden flex flex-col z-[9999] transition-all duration-300 max-h-[75vh]">
          {/* Header */}
          <div className="bg-burgundy-700 text-white px-4 py-3 sm:py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🤖</div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Voyara Assistant</h3>
                <p className="text-[11px] text-white/70">Always ready to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-lg p-1">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto bg-creme-50 space-y-3.5 h-[300px] sm:h-[340px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-burgundy-600 text-white rounded-tr-none' : 'bg-white border border-creme-200 text-gray-700 rounded-tl-none shadow-xs'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-creme-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-creme-200 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-1 px-3 py-2 bg-creme-50 border border-creme-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-300"
            />
            <button type="submit" disabled={!input.trim()} className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold disabled:opacity-50 transition-colors">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
