import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  // This function tests if Tailwind's build/rebuild process is fast
  // by quickly changing a class that forces a re-render and CSS compilation
  const dynamicClass = count % 2 === 0 ? 'bg-indigo-600' : 'bg-pink-600';

  return (
    
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      
      {/* This div applies a complex combination of classes 
        to confirm Tailwind is correctly generating and applying styles.
      */}
      <div 
        className={`
          max-w-4xl w-full p-6 sm:p-10 
          shadow-2xl rounded-xl 
          ${dynamicClass} 
          text-white 
          transition-all duration-300 ease-in-out
          transform hover:scale-[1.01]
        `}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 border-b-2 border-white/30 pb-3">
          Tailwind CSS Performance Check
        </h1>
        
        <p className="text-lg sm:text-xl font-light mb-6">
          If you see complex styling, **Tailwind is working.** To test **Vite's HMR/JIT build speed**, click the button to quickly change the background color.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
          
          <button
            onClick={() => setCount(c => c + 1)}
            className="
              px-6 py-3 
              text-lg font-semibold 
              rounded-lg 
              bg-white text-gray-800 
              hover:bg-gray-200 
              transition duration-150 
              shadow-md
            "
          >
            Clicks: {count} (Change BG)
          </button>
          
          {/* A demonstration of responsive and utility classes */}
          <div className="
            text-2xl font-mono 
            p-3 rounded-md 
            bg-white/10 
            text-yellow-300 
            hidden sm:block
          ">
            Utilities: ✅ Ready
          </div>
        </div>
        
      </div>
      
      {/* This small line checks if the "JIT" mode (or equivalent 
        in Tailwind v3) is fast enough to immediately inject 
        a new, unique, and unused class. 
      */}
      <p className="mt-8 text-gray-500 text-sm">
        Testing JIT speed with a unique class: <span className="text-3xl text-[#10b981]">Hello!</span>
      </p>
    </div>
  );
}

export default App
