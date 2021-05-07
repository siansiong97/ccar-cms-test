// log the pageview with their URL
export const pageview = (url) => {
  if(typeof(_.get(window , `gtag`)) == 'function'){
    console.log(window);
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    })
  }
}

// log specific events happening.
export const event = ({ action, params }) => {
  if(typeof(_.get(window , `gtag`)) == 'function'){
    window.gtag('event', action, params)
  }
}