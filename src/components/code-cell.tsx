import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Previerw from './Preview';
import Resizable from './resizable';
import { Cell } from '../redux';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';

const initialvalue = `import React from "react";
import ReactDOM from "react-dom/client";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

const App = () => {
  return <h1>Hello world!</h1>;
};

root.render(<App />);
`

interface CodeCellProps {
  cell: Cell
} 

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id])

  useEffect(() => {
    if(!bundle || (bundle && !bundle.code))
      updateCell(cell.id, initialvalue)

    //createBundle(cell.id, cell.content)
  }, []);

  // const firstBundle = async () => {
  //   const output = await bundle(cell.content);
  // };

  useEffect(() => {
    const timer = setTimeout( async() => {
      createBundle(cell.id, cell.content)
    }, 750)

    return () => {
      clearTimeout(timer)
    }

  }, [cell.content, cell.id, createBundle]);

  return (
    <Resizable direction='vertical'>
      <div style={{height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row'}}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {
          bundle && <Previerw code={bundle.code} bundlingStatus={bundle.err} />
        }
        
      </div>
    </Resizable>
  );
};

export default CodeCell;