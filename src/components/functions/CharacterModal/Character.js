import React, { useRef, memo, useState, useEffect } from 'react';
import './Character.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectCharacter } from '../../../_actions/characterSelected_actions';
import {addEvent, removeAllEvents} from '../handleEventListener';

function Character(props) {
  const dispatch = useDispatch();

  const { charSchema, GameCharacterList, setCharacterList , index, CharacterList } = props;

  const element_X = useRef();
  const element_Y = useRef();

  const [clicked,setClicked] = useState(true);
  const [moving, setMoving] = useState(true);
  const [sizing, setSizing] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);

  const background_element = document.getElementById("backgroundImg_container");

  let pivot = [0,0];
  let drag = false;

  function mouseMove(e) {
    const page = [e.pageX,e.pageY];
    if (drag && clicked && moving) {
      if (pivot[0]-e.pageX>3 || pivot[1]-e.pageY>3 || pivot[0]-e.pageX<-3 || pivot[1]-e.pageY<-3) {
        const background_width = background_element.offsetWidth;
        const background_height = background_element.offsetHeight;
        const prev_posX = Number(element_X.current.style.left.replace( /%/g, '' ));
        const prev_posY = Number(element_Y.current.style.top.replace( /%/g, '' ).replace( /px/g, '' ));
        const next_posX = prev_posX + 100*(e.pageX-pivot[0])/background_width;
        const next_posY = prev_posY + 100*(e.pageY-pivot[1])/background_height;
        element_X.current.style.left = String(next_posX)+'%';
        element_Y.current.style.top = String(next_posY)+'%';
        pivot = page;
      }
    } else if (drag && clicked && sizing) {
      if (pivot[0] - e.pageX>7 || pivot[0] - e.pageX<-7 ) {
        const image_width = document.getElementById(`${index}`).offsetWidth;
        const prev_size = Number(element_Y.current.style.height.replace( /%/g, '' ));
        let next_size = 0;
        if(pivot[0]-page[0] < 0){
          next_size = prev_size*(image_width-1*(pivot[0]-page[0]))/image_width;
        } else {
          next_size = prev_size*(image_width-1*(pivot[0]-page[0]))/image_width;
        }
        if (next_size > 20){
          element_Y.current.style.height = String(next_size)+'%';
        }
        pivot = page;
      }
    }
    setImgWidth(document.getElementById(`${index}`).offsetWidth);
    e.stopPropagation()
    e.preventDefault()
  }

  useEffect(() => {
    addEvent(background_element, "mousemove", mouseMove, false);
    addEvent(background_element, "mouseup", onMouseUp, false);
    setImgWidth(document.getElementById(`${index}`).offsetWidth);
    return () => {
      removeAllEvents(background_element, "mousemove");
      removeAllEvents(background_element, "mouseup");
    }
  }, [])

  const onMouseDown = (e) => {
    addEvent(background_element, "mousemove", mouseMove, false);
    addEvent(background_element, "mouseup", onMouseUp, false);
    pivot = [e.pageX,e.pageY];
    drag = true;
  }

  const onMouseUp = (e) => {
    removeAllEvents(background_element, "mousemove");
    removeAllEvents(background_element, "mouseup");
    setCharacterList((oldArray)=> {
      return [
        ...oldArray.slice(0,index), 
        {...oldArray[index], posX: Number(element_X.current.style.left.replace( /%/g, '' )), posY: Number(element_Y.current.style.top.replace( /%/g, '' ).replace( /px/g, '' ))},
        ...oldArray.slice(index+1,4)
      ]
    })
    setCharacterList((oldArray)=> {
      return [...oldArray.slice(0,index), {...oldArray[index], size: Number(element_Y.current.style.height.replace( /%/g, '' ))} ,...oldArray.slice(index+1,4)]
    })
    pivot = [e.pageX,e.pageY];
    drag = false;
    setSizing(false);
    setMoving(true);
    dispatch(selectCharacter({...GameCharacterList[charSchema.index], index: charSchema.index}));
  }

  const onMouseOver = (e) => {
    setMoving(false);
    setSizing(true);
  }

  const onMouseOut = (e) => {
    setMoving(true);
    setSizing(false);
  }

  return (
    <div 
      ref={element_X}
      key={index} 
      className="CharacterBlock"
      style={{ left: `${charSchema.posX}%`}}
    >
      <div 
        ref={element_Y}
        className="character__container"
        style={{height: `${charSchema.size}%`,
                top: `${charSchema.posY}%`}}
      >
          <img
            onMouseDown={onMouseDown}
            className={`${clicked ? "characterImg_clicked" : "characterImg"}`}
            id={`${index}`}
            src={charSchema.image}
            alt="img"
          />
          <div 
            className={`${sizing ? "btn_sizing_clicked" : "btn_sizing"}`} 
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onMouseDown={onMouseDown}
            style={{left: `${imgWidth-3}px`}}
          ></div>
      </div>
    </div>
  )
}

export default memo(Character)
