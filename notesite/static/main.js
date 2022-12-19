import { get, post, dateFromEpoch, strftime } from './jixen.js'

function Post(created, content) {
  const created_str =
    'on ' +
    strftime(dateFromEpoch(created), '%a %b %d %I:%M %p') +
    ' anon said:'
  return `
    <div class="post col g1">
      <p class="created">{created_str}</p>
      <div class="row g3">
        <img style="width: 32px; height: 32px"
             class="pfp"
             src="https://ui-avatars.com/api/?name=Elon+Musk&size=32">
        </img>
        <div class="expand bubble col p1 g1">
          <p class="content">{content}</p>
        </div>
      </div>
    </div>`
}

function Posts() {
  const posts = `<div class="posts col g1"></div>`
  posts.render = async () => {
    const json = await get('/api/post/all')
    posts.replaceChildren(
      ...json.posts.map((post) => Post(post.created, post.content))
    )
  }
  return posts
}

function Form(posts) {
  const textArea = `<textarea></textarea>`
  const submitButton = `<button class="primary" onclick={
    post('/api/post/add', {content: textArea.value})
    posts.render()
  }>"Post"</button>`
  const form = `
  <div class="form col">
    <div class="form-page col p1 g1">
      {textArea}
      <div class="row">{submitButton}</div>
    </div>
  </div>`
  return form
}

function Main() {
  const main = `<div class="main row g4 p4"></div>`
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
