import React, {useReducer, useCallback} from 'react';
import {DraggableCore} from 'react-draggable';
import uuidv4 from 'uuidv4';


import './App.css';



export function getInitialState() {
  return {
    circles: {
      abc: {
        "id": "abc",
        x: 10,
        y: 10
      },
      def: {
        "id": "def",
        x: 100,
        y: 100
      }
    },
    lines: {
      ghi: {
        from: "abc",
        to: "def"
      }
    }
  }
}


function circlesReducer(state, action) {
  switch (action.type) {
    case "move": {
      const {deltaX, deltaY, id} = action;
      const base = state.circles[id];
      return {
        ...state,
        circles: {
          ...state.circles,
          [id]: {
            ...base,
            x: base.x + deltaX,
            y: base.y + deltaY,
          }
        }
      }
    }
    case "add": {
      const {id, x, y} = action;
      const from = Object.keys(state.circles)[
          Object.keys(state.circles).length - 1
        ];
      return {
        ...state,
        circles: {
          ...state.circles,
          [id]: {id, x, y}
        },
        lines: {
          ...state.lines,
          [uuidv4()]: {from, to: id}
        }
      }
    }
  }
}
const Line = ({line, circles}) => {
  const from = circles[line.from];
  const to = circles[line.to];
  const [x1, y1, x2, y2] = [from.x + 50, from.y + 50, to.x + 50, to.y + 50];
  return <path className="line" d={`M${x1} ${y1} L${x2} ${y2}`} />
};

const Lines = ({lines, circles}) => (
  <svg>
    {Object.keys(lines).map(key => (
      <Line key={key} line={lines[key]} circles={circles} />
    ))}
  </svg>
);


const Circles = ({circles, onHandleDrag, onDragEnd, onDoubleClick}) => {
  return (
    <div className="circles">
      {Object.keys(circles).map(key => (
        <Circle key={key} circle={circles[key]} onHandleDrag={onHandleDrag} onDragEnd={onDragEnd} />
      ))}
    </div>
  )
};

const Circle = ({circle: {x, y, id}, onHandleDrag, onDragEnd}) => {
  const handleDrag = useCallback((_, {deltaX, deltaY}) => {
    onHandleDrag({id, deltaX, deltaY})
  }, []);
  return (
    <DraggableCore onDrag={handleDrag} onStop={onDragEnd}>
      <div className="circle" style={{left: x, top: y}} />
    </DraggableCore>
  )
};


function App() {
  const [state, dispatch] = useReducer(circlesReducer, getInitialState());

  const onHandleDrag = useCallback(({id, deltaX, deltaY}) => {
    dispatch({
      type: "move",
      id,
      deltaX,
      deltaY
    })
  }, []);

  const onDoubleClick = useCallback((e) => {
    dispatch({
      type: "add",
      id: uuidv4(),
      x: e.clientX - 50,
      y: e.clientY - 50
    })
  }, []);

  // const onDragEnd = () => {};
  return (
    <div className="App" onDoubleClick={onDoubleClick}>
      <Lines lines={state.lines} circles={state.circles}/>
      <Circles circles={state.circles} onHandleDrag={onHandleDrag} />
    </div>
  );
}



export default App;
