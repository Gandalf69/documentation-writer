import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Previerw from './Preview';
import bundle from '../bundler';
import Resizable from './resizable';

const CodeCell = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const timer = setTimeout( async() => {
      const output = await bundle(input);
      setCode(output);
    }, 1000)

    return () => {
      clearTimeout(timer)
    }

  }, [input]);

  return (
    <Resizable direction='vertical'>
      <div style={{height: '100%', display: 'flex', flexDirection: 'row'}}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Previerw code={code}/>
      </div>
    </Resizable>
  );
};

export default CodeCell;