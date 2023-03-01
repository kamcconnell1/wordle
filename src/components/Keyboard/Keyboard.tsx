import { IKeyColors } from '../App';

interface KeyboardProps {
  keyColors: IKeyColors;
  onKeyboardClick: (l: string) => void;
}

export const ENTER = '✓';
export const BACKSPACE = '←';
export const KEYS = ['qwertyuiop', 'asdfghjkl', `${ENTER}zxcvbnm${BACKSPACE}`];

const Keyboard = ({ keyColors, onKeyboardClick }: KeyboardProps) => {
  return (
    <div className="keyboard">
      {KEYS.map((row, i) => (
        <div className="keyboardRow" key={`row-${i}`}>
          {row.split('').map((l) => (
            <button
              className={`key ${keyColors[l] ? keyColors[l] : ''} ${l === ENTER ? 'enterKey' : ''}`}
              key={l}
              onClick={() => onKeyboardClick(l)}>
              {l === ENTER ? 'ENTER' : l}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Keyboard;
