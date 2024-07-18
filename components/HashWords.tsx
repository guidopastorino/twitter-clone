import React from 'react';
import Link from 'next/link';

interface HashWordsProps {
  text: string;
}

const HashWords: React.FC<HashWordsProps> = ({ text }) => {
  // Utilizar una expresión regular para capturar palabras que comienzan con # o @
  const words = text.split(/(\s+)/);

  const transformWord = (word: string) => {
    let path = '';
    let transformedWord = word;

    if (word.startsWith('#')) {
      path = `/i/hashtags/${word.substring(1)}`;
      transformedWord = word;
    } else if (word.startsWith('@')) {
      path = `/i/${word.substring(1)}`;
      transformedWord = word;
    }

    return (
      <Link key={word} href={path} className="text-blue-500 hover:underline">
        {transformedWord}
      </Link>
    );
  };

  const transformedText = words.map((word, index) => {
    if (word.startsWith('#') || word.startsWith('@')) {
      return (
        <React.Fragment key={index}>
          {transformWord(word)}
          {''}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment key={index}>
          {word}
          {''}
        </React.Fragment>
      );
    }
  });

  return <div>{transformedText}</div>;
};

export default HashWords;