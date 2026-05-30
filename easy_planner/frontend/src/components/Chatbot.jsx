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
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition-transform hover:scale-105 z-[9999]">
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-creme-200 overflow-hidden flex flex-col z-[9999] transition-all duration-300" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="bg-burgundy-700 text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🤖</div>
            <div>
              <h3 className="font-bold text-sm">Voyara Assistant</h3>
              <p className="text-xs text-white/70">Always ready to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-creme-50 space-y-4 h-[320px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-burgundy-600 text-white rounded-tr-none' : 'bg-white border border-creme-200 text-gray-700 rounded-tl-none shadow-sm'}`}>
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
              className="flex-1 px-3 py-2 bg-creme-50 border border-creme-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-300"
            />
            <button type="submit" disabled={!input.trim()} className="bg-burgundy-600 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
