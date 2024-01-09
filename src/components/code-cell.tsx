import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Previerw from './Preview';
import Resizable from './resizable';
import { Cell } from '../redux';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';



interface CodeCellProps {
  cell: Cell
} 

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id])

  const cells = useTypedSelector((state) => state.cells)
  const findCellOrder = cells.order.findIndex(id => id === cell.id)
  
  useEffect(() => {
    if(bundle)
      createBundle(cell.id, cell.content);

  }, [findCellOrder])

  useEffect(() => {
    if(!bundle)
    {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout( async() => {
      createBundle(cell.id, cell.content);
    }, 750)

    return () => {
      clearTimeout(timer)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className='progress-wrapper'>
        {
          !bundle || bundle.loading ? 
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading
              </progress>
            </div>
          : <Previerw code={bundle.code} bundlingStatus={bundle.err} />
        }  
        </div>      
      </div>
    </Resizable>
  );
};

export default CodeCell;