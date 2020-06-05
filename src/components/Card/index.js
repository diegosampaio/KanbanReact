import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from 'react-dnd';

import BoardContext from '../Board/context';

import { Container, Label } from "./estilos";

export default function Card({ data, index, listIndex }) {
    const ref = useRef();
    const { move } = useContext(BoardContext);

    // função de Drag
    const [{ isDragging }, dragRef] = useDrag({
        item: {
            type: 'CARD',
            id: data.id,
            index,
            listIndex,
            content: data.content
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })

    // função de Drop
    const [, dropRef] = useDrop({
        accept: 'CARD',
        hover(item, monitor) {
            const draggedListIndex = item.listIndex;
            const targetListIndex = listIndex;

            const draggedIndex = item.index;
            const targetIndex = index;

            if (draggedIndex === targetIndex && draggedListIndex == targetListIndex) {
                return;
            }

            // calcula ponto central do card para movimentação drag
            const targetSize = ref.current.getBoundingClientRect();
            const targetCenter = (targetSize.bottom - targetSize.top) / 2;

            const draggedOffset = monitor.getClientOffset();
            const draggedTop = draggedOffset.y - targetSize.top;

            if (draggedIndex < targetIndex && draggedTop < targetCenter) {
                return;
            }
            if (draggedIndex > targetIndex && draggedTop > targetCenter) {
                return;
            }

            // realiza alteração de posição
            move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
            // salva nova posição do item
            item.index = targetIndex;
            // salva em qual lista o elemento esta
            item.listIndex = targetListIndex;
        }
    });
    // acopla referencia de drag e drop
    dragRef(dropRef(ref));

    return (
        <Container ref={ref} isDragging={isDragging}>
            <header>
                {data.labels.map(label => <Label key={label} color={label} />)}
            </header>
            <p>{data.content}</p>
            {data.user && (<img src={data.user} alt=""/>)}
        </Container>
    );
}
