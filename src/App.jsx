import wordData from './assets/mostUsedWords.json'
import {useEffect, useState } from 'react'


function App() {

  const [input, setInput] = useState('')
  const [words, setWords] = useState([])
  const [wordIndex, setWordIndex] = useState(0)
  const [letterIndex, setLetterIndex] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [correctLetterIndex, setCorrectLetterIndex] = useState(0)

  const renderedWords = 50
  
  useEffect(() => {
    generateWords()
  }, [])

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
    setInput(e.target.value)
    setLetterIndex(letterIndex + e.target.value.length - input.length)
    setWrong(!words[wordIndex].startsWith(e.target.value))
    if (!wrong) {
      setCorrectLetterIndex(letterIndex)
    }
    console.log(e.target.value === words[wordIndex]);
    console.log('current word', words[wordIndex], 'current letter', words[wordIndex][letterIndex], 'word index',wordIndex, 'letter index', letterIndex)
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
    let name =  className.join(' ')
    console.log(name);
    return name

  }

  return (
    <div className='mainview'>
      <div>

        <div className='p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 textcontainer'>
          <div className='mb-3 font-normal text-gray-700 dark:text-gray-400 wordcontainer'>
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
        </div>
        <div>
          <input type='text' value={input} onChange={onType} className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' />
        </div>
      </div>
    </div>
  );
}

export default App;
