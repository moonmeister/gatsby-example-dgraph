import * as React from "react"

import { useLocalStorage } from "../hooks/useLocalStorage"
import { Link } from "gatsby"
import { useCMS } from 'tinacms'

import { css } from "linaria"

function Layout({ children, enableEditing = false }) {
  const cms = useCMS()
  const [loginState, setLoginState] = useLocalStorage('authenticated', false)

  loginState && enableEditing ? cms.enable() : cms.disable()
  return (
    <div>
      <header className={css`
        display: flex;
        justify-content: space-between;
        align-items: center
        padding: 0em 1em;
      `} >
        <nav >
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

      <main>{children}</main>
      <footer>

      </footer>
    </div>

  )
}

export default Layout