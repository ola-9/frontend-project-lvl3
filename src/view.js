/* eslint-disable no-param-reassign */
const createBlock = (blockname) => {
  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('card', 'border-0');
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('card-body');
  blockWrapper.appendChild(headerWrapper);
  const headerTitle = document.createElement('h2');
  headerWrapper.appendChild(headerTitle);
  headerTitle.classList.add('card-title', 'h4');
  headerTitle.textContent = `${blockname}`;
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  blockWrapper.appendChild(list);
  return blockWrapper;
};

const createFeedItem = (feed) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0', 'border-end-0');
  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = feed.title;
  item.appendChild(title);
  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = feed.description;
  item.appendChild(description);
  return item;
};

const createPostItem = (post) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const aEl = document.createElement('a');
  aEl.href = post.link;
  aEl.classList.add('fw-bold');
  aEl.rel = 'noopener, noreferrer';
  aEl.dataset.id = post.id;
  aEl.target = '_blank';
  const description = document.createTextNode(post.postTitle);
  aEl.appendChild(description);
  item.appendChild(aEl);
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.id = post.id;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = 'Просмотр';
  item.appendChild(button);
  return item;
};

const render = (i18nIntance, state, elements) => (path, value) => {
  const feedbackEl = elements.feedback;
  switch (value) {
    case 'error': {
      elements.urlInput.readOnly = false;
      elements.addButton.disabled = false;
      elements.urlInput.classList.add('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.processState.error);
      feedbackEl.classList.add('text-danger');
      feedbackEl.classList.remove('text-success');
      break;
    }
    case 'received': {
      elements.urlInput.readOnly = false;
      elements.addButton.disabled = false;
      elements.urlInput.classList.remove('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.processState.success);
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-success');
      elements.form.reset();
      elements.urlInput.focus();
      if (state.data.feeds.length === 1) {
        const feeds = createBlock('Фиды');
        elements.feeds.appendChild(feeds);
        const posts = createBlock('Посты');
        elements.posts.prepend(posts);
      }
      const feedsList = elements.feeds.querySelector('ul');
      const [currentFeed] = state.data.feeds
        .filter((feed) => feed.id === state.data.currentFeedId);
      const feedItem = createFeedItem(currentFeed);
      feedsList.prepend(feedItem);
      const postsList = elements.posts.querySelector('ul');
      const currentPosts = state.data.posts
        .filter((post) => post.feedId === state.data.currentFeedId);
      currentPosts.forEach((post) => {
        const postItem = createPostItem(post);
        postsList.append(postItem);
      });
      break;
    }
    case 'receiving': {
      elements.urlInput.readOnly = true;
      elements.addButton.disabled = true;
      break;
    }
    case 'updated': {
      const postsList = elements.posts.querySelector('ul');
      state.update.postsToRender.forEach((post) => {
        const postItem = createPostItem(post);
        postsList.prepend(postItem);
      });
      break;
    }
    case 'previewPost': {
      const readPost = elements.posts.querySelector(`[data-id="${state.data.lastReadPostId}"]`);
      console.log('>>>>', readPost);
      const readPostUrl = readPost.href;
      readPost.classList.remove('fw-bold');
      readPost.classList.add('fw-normal', 'link-secondary');
      const [selectedPost] = state.data.posts
        .filter((post) => post.id === state.data.lastReadPostId);
      const title = elements.modal.querySelector('.modal-title');
      const description = elements.modal.querySelector('.modal-body');
      const readFullPostLink = elements.modal.querySelector('.full-article');
      readFullPostLink.href = readPostUrl;
      title.textContent = selectedPost.postTitle;
      description.textContent = selectedPost.postDesc;
      break;
    }
    case 'openPost': {
      const openedPost = elements.posts.querySelector(`a[data-id=${state.data.lastReadPostId}`);
      openedPost.classList.remove('fw-bold');
      openedPost.classList.add('fw-normal', 'link-secondary');
      break;
    }
    default:
      throw new Error(`unknown path: ${path}`);
  }
};

export default render;
