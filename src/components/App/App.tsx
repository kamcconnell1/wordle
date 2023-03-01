import { ReactNode, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchRandomWord, fetchWordDefinition } from '../../api';
import { useKeyPress } from '../../hooks/useKeyPress';
import Board from '../Board';
import Keyboard, { BACKSPACE, ENTER } from '../Keyboard';
import Modal from '../Modal';
import './App.css';

type Colors = 'correct' | 'present' | 'absent';

export type IBoard = Record<number, string[]>;
export type IKeyColors = Record<string, Colors>;

const initialState = (): IBoard => ({
  0: Array(5).fill(false),
  1: Array(5).fill(false),
  2: Array(5).fill(false),
  3: Array(5).fill(false),
  4: Array(5).fill(false),
  5: Array(5).fill(false)
});

const initalGuess = { row: 0, col: 0 };
const initalKeyColours = {};

function App() {
  const [numberGuess, setNumberGuess] = useState({ ...initalGuess });
  const [lettersGuessed, setLettersGuessed] = useState<IBoard>(initialState());
  const [boardColours, setBoardColours] = useState<IBoard>(initialState());
  const [keyColors, setKeyColors] = useState<IKeyColors>({ ...initalKeyColours });
  const [proposedWord, setProposedWord] = useState('');
  const [message, setMessage] = useState<ReactNode | null>(null);

  const key = useKeyPress();

  const {
    data: word = '',
    refetch: fetchNewRandomWord,
    isFetching
  } = useQuery<string>('randomWord', fetchRandomWord);

  const { isLoading } = useQuery(
    ['wordDefinition', proposedWord],
    () => fetchWordDefinition(proposedWord),
    {
      enabled: !!proposedWord,
      onSuccess: (res) => onWordExists(res[0].meanings[0].definitions[0].definition),
      onError: () => onAnswerIncorrect(),
      retry: false
    }
  );

  useEffect(() => {
    if (message) {
      if (proposedWord !== word) {
        const timer = setTimeout(() => setMessage(null), 1000);

        () => clearTimeout(timer);
      }
    }
  }, [message]);

  useEffect(() => {
    if (key) {
      onKeyboardClick(key);
    }
  }, [key]);

  const checkRowGuess = (row: number) => {
    return word.split('').reduce((acc, curr, i) => {
      const key = curr;
      const guess = lettersGuessed[row][i];
      if (key === guess) {
        acc = [...acc, 'correct'];
      } else if (word.split('').includes(guess)) {
        acc = [...acc, 'present'];
      } else {
        acc = [...acc, 'absent'];
      }
      return acc;
    }, [] as string[]);
  };

  const setKeyColours = (row: number, colors: string[]) => {
    const guess = lettersGuessed[row];
    const guessedLetters = guess.reduce((acc, letter, i) => {
      acc[letter] = acc[letter] === 'correct' ? 'correct' : (colors[i] as Colors);
      return acc;
    }, keyColors);

    setKeyColors(guessedLetters);
  };

  console.log('out initial state', initialState());

  const onReplayButtonClick = async () => {
    await fetchNewRandomWord();
    setBoardColours(initialState());
    setKeyColors({ ...initalKeyColours });
    setLettersGuessed(initialState());
    setNumberGuess({ ...initalGuess });
    setMessage(null);
  };

  const onWordExists = (def: string) => {
    const colors = checkRowGuess(numberGuess.row);
    const newCheck = { ...boardColours };
    newCheck[numberGuess.row] = colors;
    setBoardColours(newCheck);
    setKeyColours(numberGuess.row, colors);

    if (proposedWord === word) {
      setMessage(
        <div>
          <p>Congratulations</p>
          <p>{`${word.toUpperCase()}: ${def}`}</p>
          <button onClick={onReplayButtonClick} className="replayButton">
            Play again
          </button>
        </div>
      );
    } else {
      setNumberGuess({ row: numberGuess.row + 1, col: 0 });
    }
  };

  const onAnswerIncorrect = () => setMessage("This word doesn't exist");

  const onEnterClick = async () => {
    if (numberGuess.col === word.length) {
      const guess = lettersGuessed[numberGuess.row];
      setProposedWord(guess.join(''));
    } else {
      setMessage('Not enough letters');
    }
  };

  const onBackspaceClick = () => {
    const newGuess = { ...lettersGuessed };
    const lastGuessNum = numberGuess.col - 1;

    if (lastGuessNum >= 0) {
      newGuess[numberGuess.row][lastGuessNum] = '';
      setLettersGuessed(newGuess);
      setNumberGuess({ row: numberGuess.row, col: lastGuessNum });
    }
  };

  const onKeyboardClick = (letter: string) => {
    if (letter === 'Backspace' || letter === BACKSPACE) return onBackspaceClick();
    if (letter === 'Enter' || letter === ENTER) return onEnterClick();

    if (numberGuess.col < word.length) {
      const newGuess = { ...lettersGuessed };
      newGuess[numberGuess.row][numberGuess.col] = letter;
      setLettersGuessed(newGuess);

      setNumberGuess({ row: numberGuess.row, col: numberGuess.col + 1 });
    }
  };

  const loading = isLoading || isFetching;
  if (loading || !word) <div>Loading...</div>;

  return (
    <div className="App">
      <h1>Wordle</h1>
      {message && <Modal message={message} />}
      <Board boardColours={boardColours} lettersGuessed={lettersGuessed} />
      <Keyboard keyColors={keyColors} onKeyboardClick={onKeyboardClick} />
    </div>
  );
}

export default App;
