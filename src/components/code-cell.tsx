import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Previerw from './Preview';
import bundle from '../bundler';
import Resizable from './resizable';
import { Cell } from '../redux';
import { useActions } from '../hooks/useActions';

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
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  const { updateCell } = useActions();

  useEffect(() => {
    if(!cell.content)
      updateCell(cell.id, initialvalue)
    firstBundle()
  }, []);

  const firstBundle = async () => {
    const output = await bundle(cell.content);
    setCode(output.code);
    setErr(output.err);
  };

  useEffect(() => {
    const timer = setTimeout( async() => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 1000)

    return () => {
      clearTimeout(timer)
    }

  }, [cell.content]);

  return (
    <Resizable direction='vertical'>
      <div style={{height: '100%', display: 'flex', flexDirection: 'row'}}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Previerw code={code} bundlingStatus={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;