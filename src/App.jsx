import wordData from './assets/mostUsedWords.json'
import {useEffect, useState } from 'react'


function App() {

  const [input, setInput] = useState('')
  const [words, setWords] = useState([])
  const [wordIndex, setWordIndex] = useState(0)
  const [letterIndex, setLetterIndex] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [correctLetterIndex, setCorrectLetterIndex] = useState(0)

  const [running, setRunning] = useState(false)

  const [letterCounter, setLetterCounter] = useState(0)

  const [isActive, setIsActive] = useState(false)
  const [time, setTime] = useState(0);

  const [isFinished, setIsFinished] = useState(false)

  const [renderedWords, setRenderedWords] = useState(50)

  
  useEffect(() => {
    generateWords()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const reset = () => {
    setInput('')
    setWordIndex(0)
    setLetterIndex(0)
    setWrong(false)
    setCorrectLetterIndex(0)
    setLetterCounter(0)

    setTime(0)
    setIsFinished(false)
  }

  const generateWords = () => {
    let tmp = []
    for (let i = 0; i < renderedWords; i++) {
      let idx = Math.floor(Math.random() * wordData.words.length);
      let randomWord = wordData.words[idx]
      tmp.push(randomWord + ' ')
    }
    setWords(tmp)
  }

  const onType = (e) => {
    if (!running){
      setRunning(true)
      setIsActive(true)
    }
    setInput(e.target.value)
    setLetterIndex(letterIndex + e.target.value.length - input.length)
    setWrong(!words[wordIndex].startsWith(e.target.value))
    if (!wrong) {
      setCorrectLetterIndex(letterIndex)
    }
    setLetterCounter(letterCounter +1)
    console.log('current word', words[wordIndex], 'current letter', words[wordIndex][letterIndex], 'word index',wordIndex, 'letter index', letterIndex)

    if (wordIndex === words.length -1 && e.target.value === words[wordIndex].replace(' ', '')) {
        setRunning(false)
        setIsActive(false)
        setIsFinished(true)
        setInput('')
    }

    if (e.target.value.endsWith(' ') && words[wordIndex][letterIndex] === ' ' && e.target.value === words[wordIndex]) {
      setWordIndex(wordIndex + 1)
      setLetterIndex(0)

      setInput('')
      setCorrectLetterIndex(0)
    }
  }

  const letterClassName = (index, index2) => {
    let className = []
    if (index === wordIndex  && letterIndex > index2) {
      if (index2 >= correctLetterIndex && wrong) {
        className.push('wrong')
      } else {
        className.push('correct')
      }
    }
    if (index === wordIndex && index2 === letterIndex) {
      className.push('currentLetter')
    }
    return className.join(' ')

  }
  
  useEffect(() => {
    let interval = null
  
    if (isActive && running) {
      interval = setInterval(() => {
        setTime((time) => time + 10)
      }, 10)
    } else {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isActive, running])

  const changeRenderedWords = (e) => {
    let number = e.target.value
    if (number <= 0) number = 1
    else if (number > 300) number = 300
    setRenderedWords(number)
  }

  useEffect(() => {
    reset()
    generateWords()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderedWords])
  

  return (
    <div className='mainview'>
      <div>

        <div className='p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 textcontainer'>
          {
            isFinished
            ?
              <div className="mb-3 text-gray-700 dark:text-gray-400">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                  Result: 
                  <div>
                    {renderedWords} words in 
                  </div>
                  <span className="digits">
                    {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                  </span>
                  <span className="digits">
                    {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
                  </span>
                  <span className="digits mili-sec">
                    {("0" + ((time / 10) % 100)).slice(-2)}
                  </span>  
                </h5>
                <div className='result'>
                  <ul className="w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <li className="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                        WPM: { ("0" + Math.floor(words.length / ((time / 60000) % 60))).slice(-2)}
                      </li>
                      <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                        Accuarcy: { String( (words.map(words => [...words].length).reduce((acc, curr) => acc + curr) -1) / letterCounter).slice(0, 4)}%
                      </li>
                  </ul>
                </div>
              </div>
            :
            <div className='mb-3 text-xl text-gray-700 dark:text-gray-400 wordcontainer'>
              {
                words.map((word, index) => {
                  return (
                    <span key={index + word} className={ index === wordIndex ? 'word' : '' }>
                      {
                        [...word].map((letter, index2) => {
                          return (
                            <span key={index + letter + index2} className={letterClassName(index, index2)}>
                              {letter}
                            </span>
                          )
                        })
                      }
                    </span>
                  )
                })
              }

            </div>
          }
        </div>
        <div className='actionbar'>
          <input type='text' value={input} onChange={onType} disabled={ isFinished} className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' />
          <button onClick={ () => {
            reset()
            generateWords()
          }} type='button' className='p-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' /></svg>
          </button>
          <div className="clock">
            <span className="digits">
              {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
            </span>
            <span className="digits mili-sec">
              {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
            </span>
          </div>
          <input type='number' value={renderedWords} onChange={changeRenderedWords} className=' number shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' />

        </div>
      </div>
    </div>
  );
}

export default App;
