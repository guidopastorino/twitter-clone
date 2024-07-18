// Hook para implementar cualquier funcionalidad de comentarios (comentar) en cualquier lado
// puede crear comentarios en cualquier componente que se lo implemente

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { EmojiClickData } from 'emoji-picker-react';
import { CommentsActivity, TargetContent } from '@/types/types';
import axios from 'axios';
import useToast from '@/hooks/useToast';
import { useTheme } from 'next-themes';

const useMakeComment = () => {
  const user = useSelector((state: RootState) => state.user);

  const pathname = usePathname();
  const [replyingTo, setReplyingTo] = useState<Set<string>>(new Set())
  const [draft, setDraft] = useState<boolean>(false); // Draft comments (if cancel submit)
  const [text, setText] = useState<string>('');
  const [postReplyingId, setPostReplyingId] = useState<string>('');
  const [replyType, setReplyType] = useState<TargetContent>('post')

  // useEffect(() => console.log("postReplyingId: ", postReplyingId), [postReplyingId])
  // useEffect(() => console.log("replying to: ", replyingTo), [replyingTo])

  const { showToast } = useToast();
  const { setTheme: setNextTheme, resolvedTheme } = useTheme();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText(prevComment => prevComment + emojiData.emoji);
    setDraft(true);
  };

  // when comment box changes
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    setDraft(true);
  };

  const addReplyingTo = (id: string) => {
    setReplyingTo(prev => new Set(prev).add(id))
  }

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(`/api/posts/${postReplyingId}/comments`, { postReplyingId: postReplyingId, author_id: user?._id, comment: text, replyingTo: Array.from(replyingTo), type: replyType, date: Date.now() })

      console.log(response)
      showToast(response.statusText)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    currentUser: user.username, // username del usuario actualmente logeado
    currentTheme: resolvedTheme,
    replyingTo,
    addReplyingTo,
    draft,
    text,
    setText,
    setPostReplyingId,
    replyType,
    setReplyType,
    handleEmojiClick,
    handleChange,
    handleCommentSubmit,
  };
}

export default useMakeComment;