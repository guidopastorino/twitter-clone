// Hook para implementar cualquier funcionalidad de implementacion de posts en cualquier lado
// puede crear posts en cualquier componente que se lo implemente

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { EmojiClickData } from 'emoji-picker-react';
import { PostType, WhoCanReplyPost } from '@/types/types';
import axios from 'axios';
import useToast from '@/hooks/useToast';
import { useTheme } from 'next-themes';

const useComposePost = () => {
  const user = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const [userMentioned, setUserMentioned] = useState<string>('');
  const [draft, setDraft] = useState<boolean>(false); // Draft posts (if cancel submit)
  const [text, setText] = useState<string>('');
  const [replyOption, setReplyOption] = useState<WhoCanReplyPost>('Everyone');

  const { showToast } = useToast();
  const { setTheme: setNextTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const excludedWords = ["home", "explore", "notifications", "messages", "bookmarks", "communities", "profile", "search", "inbox"];
    const regex = new RegExp(`\\b(${excludedWords.join('|')})\\b`, 'i');

    if (!regex.test(pathname)) {
      const username = pathname.split("i/")[1]; // pathname could be: /i/username
      if (username && username != user.username) { // if it is other account
        setUserMentioned(username);
      }
    }
  }, [pathname]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText(prevText => prevText + emojiData.emoji);
    setDraft(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    setDraft(true);
  };

  const handleReplyOptionChange = (option: WhoCanReplyPost) => {
    setReplyOption(option);
  };

  const handlePostSubmit = async () => {
    const post: PostType = {
      _id: "",
      author_id: user._id,
      description: text,
      files: [],
      likes: [],
      comments: [],
      saved: [],
      whoCanReply: replyOption,
      repostedBy: []
    };

    try {
      const response = await axios.post("/api/posts", post);
      showToast(response.statusText);
      if (response.status === 201) {
        setText('');
        setDraft(false);
      }
    } catch (error) {
      showToast('Failed to create post');
    }
  };

  return {
    currentUser: user.username, // username del usuario actualmente logeado
    currentTheme: resolvedTheme,
    text,
    draft,
    userMentioned,
    replyOption,
    handleChange,
    handleEmojiClick,
    handleReplyOptionChange,
    handlePostSubmit
  };
}

export default useComposePost;
