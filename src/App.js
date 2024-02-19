import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to define the .dark-theme and .light-theme classes in your CSS

function App() {
  const [articles, setArticles] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(null);
  const [textSize, setTextSize] = useState(16); // Default text size
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('articles.json'); // New state for managing the source

useEffect(() => {
    setIsLoading(true); // Set loading state
    fetch(source) // Use the 'source' state to determine which JSON file to fetch
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data);
        const today = new Date();
        const todayDutchDate = `${today.getDate()} ${["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"][today.getMonth()]}`;
        const todayIndex = data.findIndex(article => article.Date === todayDutchDate);
        if (todayIndex !== -1) {
          setCurrentArticleIndex(todayIndex);
        } else {
          setError('Geen artikel gevonden voor vandaag.');
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state
      });
  }, [source]); // Add 'source' to the dependency array

  const toggleSource = () => {
    const newSource = source === 'articles.json' ? 'sp.json' : 'articles.json';
    setSource(newSource);
    setCurrentArticleIndex(null); // Reset current article index
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const adjustTextSize = (increment) => {
    setTextSize(currentSize => currentSize + increment);
  };

  const goToNextArticle = () => {
    setCurrentArticleIndex(index => (index + 1) % articles.length);
  };

  const goToPreviousArticle = () => {
    setCurrentArticleIndex(index => (index - 1 + articles.length) % articles.length);
  };

  if (isLoading) return <div>Dagelijkse dosis herstel aan het laden...</div>;
  if (error) return <div>Error: {error}</div>;
  if (currentArticleIndex === null) return <div>Geen J4TD beschikbaar voor vandaag.</div>;

  const article = articles[currentArticleIndex];
  const themeClass = isDarkTheme ? 'dark-theme' : 'light-theme';

  return (
    <div className={`App ${themeClass}`} style={{ fontSize: `${textSize}px`, lineHeight: '1.6' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => adjustTextSize(2)}>A+</button>
        <button onClick={() => adjustTextSize(-2)}>A-</button>
         <button onClick={toggleSource}>
          {source === 'articles.json' ? 'Switch to Spiritual Principles a Day' : 'Switch to Just For Today'}
        </button>
        <button onClick={toggleTheme}>Invert Colors</button>
      </div>
      <div>
        {articles.length > 1 && (
          <>
            <button onClick={goToPreviousArticle}>&lt;</button>
          </>
        )}
        <span>{article.Date}</span>
        {articles.length > 1 && (
          <>
            <button onClick={goToNextArticle}>&gt;</button>
          </>
        )}
      </div>
      <h1>{article.Title}</h1>
      <p>{article.Intro}</p>
      <p>{article.Article}</p>
      <footer>
        <p>{article.Source}</p>
        <blockquote>"{article.Quote}"</blockquote>
      </footer>
    </div>
  );
}

export default App;
