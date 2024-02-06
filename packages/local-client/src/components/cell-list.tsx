import './cell-list.css';
import { useTypedSelector } from "../hooks/useTypedSelector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import {Fragment} from 'react';

const CellList: React.FC = () => {
    const { data, order } = useTypedSelector((state) => state.cells)
    const cells = order.map((id) => data[id]);

    const renderedCells = cells.map(cell => (
        <Fragment key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
        </Fragment>
    ))

    return <div className='cell-list'>
        <AddCell forceVisible={cells.length === 0} previousCellId={null} />
        {renderedCells}
    </div>
}

export default CellList;