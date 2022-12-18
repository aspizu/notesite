import { get, post, dateFromEpoch, strftime } from './jixen.js'

function Posts() {
  const posts = `<div class="posts col g1"></div>`
  posts.render = async () => {
    const json = await get('/api/post/all')
    posts.replaceChildren(
      ...json.posts.map((post) => {
        const created = strftime(
          dateFromEpoch(post.created),
          '%a %b %d %I:%M %p'
        )
        return `
          <div class="post col p1 g1">
            <p class="created">{"on "+created+" anon said: "}</p>
            <p class="content">{post.content}</p>
          </div>`
      })
    )
  }
  return posts
}

function Form(posts) {
  const textArea = `<textarea></textarea>`
  const submitButton = `<button onclick={
    post('/api/post/add', {content: textArea.value})
    posts.render()
  }>"Post"</button>`
  const form = `
  <div class="col g1">
    {textArea}
    {submitButton}
  </div>`
  return form
}

function Main() {
  const main = `<div class="row g1 p1"></div>`
  main.posts = `<Posts() style="flex-grow: 2"></Posts>`
  main.form = `<{Form(main.posts)} style="flex-grow: 1"></Form>`
  main.append(main.posts, main.form)
  return main
}

const main = Main()
document.body.append(main)
function renderTimeout() {
  main.posts.render()
  setTimeout(renderTimeout, 60000)
}
renderTimeout()
