import * as React from "react"
import { Helmet } from "react-helmet"

import { useLocalStorage } from "../hooks/useLocalStorage"
import { Link, useStaticQuery, graphql } from "gatsby"
import { useCMS } from 'tinacms'

import { css } from "linaria"

function Layout({ children, enableEditing = false, explain }) {
  const cms = useCMS()
  const [loginState, setLoginState] = useLocalStorage('authenticated', false)

  loginState && enableEditing ? cms.enable() : cms.disable()


  const { site: { siteMetadata: { branch } } } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          branch
        }
      }
    }
  `)
  return (
    <div className={css`
      display: grid;
      height: 100vh;
      grid-template-areas:
        "header"
        "content"
        "footer";
      grid-template-rows: auto 1fr auto;
      gap: 1em
  `}>
      <Helmet>
        <title>{branch} | Movie Database Dgraph + TinaCMS + Gatsby</title>
      </Helmet>
      <header className={css`
        grid-area: header;
        display: flex;
        justify-content: space-between;
        align-items: center
        padding: 0em 1em;
      `} >
        <nav>
          <ol className={css`
            display: flex;
            list-style: none;
            gap: 2em;
            padding: 0;
          `}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/film">Films</Link>
            </li>
          </ol>
        </nav>
        {
          <button onClick={() => setLoginState(!loginState)}>
            {loginState ? 'Logout' : 'Login'}
          </button>
        }
      </header>

      <main className={css`
        grid-area: content;
      `}>{children}</main>
      <footer className={css`
        grid-area: footer;
      `}>
        <h2>How this page works:</h2>
        <p>{explain}</p>
      </footer>
    </div>

  )
}

export default Layout