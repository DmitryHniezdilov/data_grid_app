import { useRef, useEffect } from "react"
import { useRouter } from 'next/router'

const useWarningOnExit = (shouldWarn) => {
  const message = "Are you sure that you want to leave?"
  const Router = useRouter()

  const lastHistoryState = useRef(global?.history?.state)
  useEffect(() => {
    const storeLastHistoryState = () => {
      lastHistoryState.current = history.state
    }
    Router.events.on("routeChangeComplete", storeLastHistoryState)
    return () => {
      Router.events.off("routeChangeComplete", storeLastHistoryState)
    }
  }, [])

  useEffect(() => {
    let isWarned = false

    const routeChangeStart = (url) => {
      if (Router.asPath !== url && shouldWarn && !isWarned) {
        isWarned = true
        if (window.confirm(message)) {
          Router.push(url)
        } else {
          isWarned = false
          Router.events.emit("routeChangeError")

          // HACK
          const state = lastHistoryState.current
          if (state != null && history.state != null && state.idx !== history.state.idx) {
            history.go(state.idx < history.state.idx ? -1 : 1)
          }

          // eslint-disable-next-line no-throw-literal
          throw "Abort route change. Please ignore this error."
        }
      }
    }

    const beforeUnload = (e) => {
      if (shouldWarn && !isWarned) {
        const event = e || window.event
        event.returnValue = message
        return message
      }
      return null
    }

    Router.events.on("routeChangeStart", routeChangeStart)
    window.addEventListener("beforeunload", beforeUnload)

    return () => {
      Router.events.off("routeChangeStart", routeChangeStart)
      window.removeEventListener("beforeunload", beforeUnload)
    }
  }, [message, shouldWarn])
}

export default useWarningOnExit