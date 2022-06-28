import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import * as goFetch from '../fetch'


export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const token = localStorage.getItem('token');
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => {navigate('/articles')}

  const logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      setMessage('Goodbye!')
      redirectToLogin();
    }
  }

  const login = ({ username, password }) => {
      setCurrentArticleId();
      setMessage('');
      setSpinnerOn(true);
      goFetch.login({username, password})
      .then(res => {
        setMessage(res.message);
        setSpinnerOn(false);
        redirectToArticles();
  })
}

const getArticles = () => {
  setMessage('');
  setSpinnerOn(true);
  goFetch.getArticles(token)
    .then(res => {
    if (res.message) {
    setArticles(res.articles);
    setMessage(res.message);
    } else if (res === 401) {
      console.error("Resubmit for a token!");
      redirectToLogin();
    }
    setSpinnerOn(false);
  })
    .catch(err => console.error(err));
  }

  const postArticle = article => {
    setSpinnerOn(true);
    goFetch.addArticle(token, article)
    .then(res => {
      setArticles([...articles, res.article]);
      setMessage(res.message);
      setSpinnerOn(false);
    })
  }

  const updateArticle = ( article_id, article ) => {
    setSpinnerOn(true);
    goFetch.editArticle(token, article, article_id)
    .then(res => {
      setArticles([
        ...articles.filter(item => item.article_id !== article_id), res.article
      ]);
    
      setMessage(res.message);
      setSpinnerOn(false);
    });
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true);
    goFetch.deleteArticle(token, article_id)
    .then(res => {
      setArticles([
        ...articles.filter(item => item.article_id !== article_id)
      ]);
      setMessage(res.message);
      setSpinnerOn(false);
    })
  }

  return (
    <React.StrictMode>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              currentArticleId={currentArticleId}
              updateArticle={updateArticle}
              postArticle={postArticle}
              setCurrentArticleId={setCurrentArticleId}

              articles={articles}/>
              <Articles getArticles={getArticles} 
              articles={articles} 
              redirectToLogin={redirectToLogin} 
              token={token}
              setCurrentArticleId={setCurrentArticleId}
              deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
