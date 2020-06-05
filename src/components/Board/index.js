import React, { useState } from "react";
import { loadLists } from '../../services/api';
import produce from "immer";

import BoardContext from './context';

import List from '../List';

import { Container} from "./estilos";

const data = loadLists();

export default function Board() {
    const [lists, setLists] = useState(data);

    // realiza alteração de posicionamento
    function move(fromList, toList, from, to) {
        setLists(produce(lists, draft => {
            const dragged = draft[fromList].cards[from];

            // altera posição
            draft[fromList].cards.splice(from, 1);
            draft[toList].cards.splice(to, 0, dragged);
        }))
    }

    return (
        <BoardContext.Provider value={{ lists, move }}>
            <Container>
                {lists.map((list, index) => <List key={list.title} index={index} data={list} />)}
            </Container>
        </BoardContext.Provider>
    );
}
