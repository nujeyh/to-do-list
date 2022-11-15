import React, { useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { FiEdit } from "react-icons/fi";
import { MdArrowBack } from "react-icons/md";
import { MdDone } from "react-icons/md";

import { setLocalStorage } from "../localStorageFn";
import { boardState } from "../recoilAtom";
import { Input } from "../styles/Input";
import DeleteArea from "./DeleteArea";

interface IToDoCard {
  toDo: { id: number; text: string };
  index: number;
  boardId: string;
}

const TaskCard = ({ toDo, index, boardId }: IToDoCard) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editToggle, setEditToggle] = useState(false);
  const setBoard = useSetRecoilState(boardState);

  const onClickEdit = () => {
    setEditToggle(false);

    if (inputRef.current?.value === "" || !inputRef.current?.value) return;

    setBoard((currBoardState) => {
      const sourceBoard = [...currBoardState[boardId]];
      let selectedItem = sourceBoard[index];
      selectedItem = {
        ...selectedItem,
        text: inputRef.current?.value ?? toDo.text,
      };
      sourceBoard.splice(index, 1);
      sourceBoard.splice(index, 0, selectedItem);

      const newBoardState = {
        ...currBoardState,
        [boardId]: sourceBoard,
      };

      setLocalStorage(newBoardState);

      return newBoardState;
    });
  };

  return (
    <Draggable
      draggableId={toDo.id.toString()}
      index={index}
      key={toDo.id.toString()}
    >
      {(provide, snapshot) => (
        <>
          <Card
            ref={provide.innerRef}
            {...provide.draggableProps}
            {...provide.dragHandleProps}
            isDragging={snapshot.isDragging}
          >
            {editToggle ? (
              <>
                <IconWrapper>
                  <GoBackIcon
                    onClick={() => setEditToggle((curr) => !curr)}
                    size={27}
                  />
                  <DoneIcon onClick={onClickEdit} size={30} />
                </IconWrapper>
                <EditInput ref={inputRef} defaultValue={toDo.text} />
              </>
            ) : (
              <>
                <EditIcon
                  onClick={() => setEditToggle((curr) => !curr)}
                  size={21}
                />
                <div>{toDo.text}</div>
              </>
            )}
          </Card>
        </>
      )}
    </Draggable>
  );
};

const Card = styled.li<{ isDragging: boolean }>`
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.colors.card};
  opacity: ${(props) => props.isDragging && "0.6"};
  box-shadow: ${(props) =>
    props.isDragging
      ? props.theme.boxShadow.extend
      : props.theme.boxShadow.normal};
  padding: 15px 25px;
  margin-top: 10px;
  transition: background-color 0.3s ease-in-out;
  min-height: 45px;
  line-height: 1.4;
`;
const EditIcon = styled(FiEdit)`
  color: ${(props) => props.theme.colors.darkGray};
  margin-bottom: 10px;
  &:hover {
    color: green;
  }
  cursor: pointer;
`;
const GoBackIcon = styled(MdArrowBack)`
  color: ${(props) => props.theme.colors.darkGray};
  &:hover {
    color: crimson;
  }
  cursor: pointer;
`;
const DoneIcon = styled(MdDone)`
  color: ${(props) => props.theme.colors.darkGray};
  &:hover {
    color: green;
  }
  cursor: pointer;
`;
const EditInput = styled(Input)`
  width: 90%;
`;
const IconWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

export default React.memo(TaskCard);
