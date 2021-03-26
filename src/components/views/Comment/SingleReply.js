import React from 'react'

function SingleReply() {
  const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => {
    if (state.user.userData){
      return state.user.userData.isAuth;
    } else {
      return null;
    }
  });
  const user_id = useSelector((state) => {
    if (state.user.userData){
      return state.user.userData._id;
    } else {
      return null;
    }
  });

  const reference = useRef();

  const [update, setUpdate] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [Replys, setReplys] = useState([]);
  const [writeReply, setWriteReply] = useState(false);

  const updateToggle = () => {
    setUpdate((state) => !state);
  }

  const variable = {
    gameId: gameId,
    responseTo: comment._id.toString()
  }

  useEffect(() => {
    axios.post('/api/comment/getReply', variable).then(response => {
      if (response.data.success) {
        setReplys(response.data.result);
      } else {
        message.error('대댓글을 불러오는데 실패했습니다.')
      }
    })
  }, [update])

  const onClick_writeReply = () => {
    setWriteReply((state) => !state);
  }

  const onClick_displayReply = () => {
    if (reference.current.style.display === 'block') {
      reference.current.style.display = 'none'
    } else {
      reference.current.style.display = 'block'
    }
  }
  
  const onChange_comment = (event) => {
    setCommentContent(event.currentTarget.value);
  }

  const onSubmit_response = (event) => {
    event.preventDefault();
    if(commentContent === ""){
      return;
    }
    const variables = {
      content: commentContent,
      writer: user.userData._id,
      gameId: gameId,
      responseTo: comment._id.toString()
    };

    axios.post('/api/comment/saveComment', variables).then(response => {
      if(response.data.success) {
        message.success('댓글 감사합니다!');
        updateToggle();
        setCommentContent("");
        if (reference.current.style.display !== 'block') {
          reference.current.style.display = 'block'
        } 
      } else {
        message.error('댓글 저장에 실패했습니다.');
      }
    })
  }

  const onClick_removeComment = () => {
    axios.post('/api/comment/removeComment', {commentId: comment._id}).then(response => {
      if(response.data.success) {
        message.success('댓글이 삭제되었습니다.');
        updateToggle_comment();
      } else {
        message.error('댓글 삭제에 실패했습니다.');
      }
    })
  }

  return (
    <div className="container_box">
      <div className="comment_container">
        <img src={comment.writer.image} alt="img" className="img"/>
        <div className="comment_contents">
          <div className="nickname">{comment.writer.nickname}</div>
          <div className="content">{comment.content}</div>
          <div className="comment_info">
            <div className="comment_like">좋아요 : 0 {}</div>
            <div className="comment_dislike">싫어요 : 0 {}</div>
            { comment.writer._id === user_id&&
            <div onClick={onClick_removeComment} className="comment_delete">댓글 삭제</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleReply
