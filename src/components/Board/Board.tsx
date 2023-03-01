import { IBoard } from '../App/';

interface BoardProps {
  boardColours: IBoard;
  lettersGuessed: IBoard;
}

const Board = ({ boardColours, lettersGuessed }: BoardProps) => {
  return (
    <div className="board">
      {[...Array(6)].map((e, rowI) => (
        <div className="row" key={rowI}>
          {[...Array(5)].map((e, colI) => (
            <div className={`box ${boardColours[rowI][colI]}`} key={colI}>
              {lettersGuessed[rowI][colI]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
