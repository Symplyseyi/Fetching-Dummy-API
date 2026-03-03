const cards = document.getElementById("cards");

// Fetch all 3 APIs in parallel and combine the data
Promise.all([
  fetch("https://jsonplaceholder.typicode.com/users").then((res) => res.json()),
  fetch("https://jsonplaceholder.typicode.com/posts").then((res) => res.json()),
  fetch("https://jsonplaceholder.typicode.com/comments").then((res) =>
    res.json(),
  ),
]).then(([users, posts, comments]) => {
  console.log(users);
  console.log(posts);
  console.log(comments);

  // Combine: attach comments to posts, then posts to users
  users.forEach((user) => {
    // Get this user's posts
    const userPosts = posts.filter((post) => post.userId === user.id);

    // Attach comments to each post
    userPosts.forEach((post) => {
      post.comments = comments.filter((comment) => comment.postId === post.id);
    });

    // Build the card
    const userCard = buildUserCard(user, userPosts);
    cards.append(userCard);
  });
});

// ─── Build a complete user card ───
function buildUserCard(user, userPosts) {
  const userCardDiv = document.createElement("div");
  userCardDiv.classList.add("user-card");

  // ── Name and Username ──
  const nameAndUsernameDiv = document.createElement("div");
  nameAndUsernameDiv.classList.add("name-and-username");

  const userName = document.createElement("h3");
  userName.textContent = user.name;

  const userUsername = document.createElement("p");
  userUsername.textContent = `@${user.username}`;

  nameAndUsernameDiv.append(userName, userUsername);

  // ── Details Container (email, phone, address) ──
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-container");

  // Email
  const email = document.createElement("div");
  email.classList.add("email");

  const emailSpan = document.createElement("span");
  emailSpan.classList.add("material-symbols-outlined");
  emailSpan.textContent = "mail";

  const emailText = document.createElement("p");
  emailText.textContent = user.email;

  email.append(emailSpan, emailText);

  // Phone
  const phone = document.createElement("div");
  phone.classList.add("phone");

  const phoneSpan = document.createElement("span");
  phoneSpan.classList.add("material-symbols-outlined");
  phoneSpan.textContent = "call";

  const phoneText = document.createElement("p");
  phoneText.textContent = user.phone;

  phone.append(phoneSpan, phoneText);

  // Address
  const address = document.createElement("div");
  address.classList.add("address");

  const addressSpan = document.createElement("span");
  addressSpan.classList.add("material-symbols-outlined");
  addressSpan.textContent = "home_pin";

  const addressText = document.createElement("p");
  addressText.textContent = `${user.address.street}, ${user.address.city}`;

  address.append(addressSpan, addressText);

  detailsContainer.append(email, phone, address);

  // ── Post Container ──
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  // Post header row (clickable)
  const postTextArrowDown = document.createElement("div");
  postTextArrowDown.classList.add("posttext-and-arrowicon");

  const postTextDiv = document.createElement("div");
  postTextDiv.classList.add("posttext");

  const postChatIcon = document.createElement("span");
  postChatIcon.classList.add("material-symbols-outlined");
  postChatIcon.textContent = "chat_bubble";

  const postLabel = document.createElement("p");
  postLabel.textContent = `Posts (${userPosts.length})`;

  postTextDiv.append(postChatIcon, postLabel);

  const arrowIcon = document.createElement("span");
  arrowIcon.classList.add("material-symbols-outlined", "arrow-icon");
  arrowIcon.textContent = "keyboard_arrow_down";

  postTextArrowDown.append(postTextDiv, arrowIcon);

  // Posts and comments container (hidden by default)
  const postsAndCommentsCont = document.createElement("div");
  postsAndCommentsCont.classList.add("posts-and-comments-container");

  // Build each post (pass container ref for accordion)
  userPosts.forEach((post) => {
    const postAndComments = buildPostAndComments(post, postsAndCommentsCont);
    postsAndCommentsCont.append(postAndComments);
  });

  postContainer.append(postTextArrowDown, postsAndCommentsCont);

  // ── Click: toggle posts visibility ──
  postTextArrowDown.addEventListener("click", () => {
    postsAndCommentsCont.classList.toggle("expanded");
    arrowIcon.classList.toggle("rotated");
  });

  // Assemble card
  userCardDiv.append(nameAndUsernameDiv, detailsContainer, postContainer);

  return userCardDiv;
}

// ─── Build a single post with its comments ───
function buildPostAndComments(post, postsContainer) {
  const postAndComments = document.createElement("div");
  postAndComments.classList.add("post-and-comments");

  // ── Post Title Header (clickable row with arrow) ──
  const postTitleRow = document.createElement("div");
  postTitleRow.classList.add("post-title-row");

  const postTitle = document.createElement("p");
  postTitle.classList.add("post-title");
  postTitle.textContent = post.title;

  const postArrow = document.createElement("span");
  postArrow.classList.add("material-symbols-outlined", "arrow-icon");
  postArrow.textContent = "keyboard_arrow_down";

  postTitleRow.append(postTitle, postArrow);

  // ── Post Body + Comments wrapper (hidden by default) ──
  const postContent = document.createElement("div");
  postContent.classList.add("post-content");

  const postBody = document.createElement("p");
  postBody.classList.add("post-body");
  postBody.textContent = post.body;

  // ── Comments Section ──
  const commentsDiv = document.createElement("div");
  commentsDiv.classList.add("comments");

  // Comments header
  const commentTextDiv = document.createElement("div");
  commentTextDiv.classList.add("comment-text");

  const commentLabel = document.createElement("p");
  commentLabel.textContent = `Comments (${post.comments.length})`;

  commentTextDiv.append(commentLabel);
  commentsDiv.append(commentTextDiv);

  // Each comment
  post.comments.forEach((comment) => {
    const commentItem = document.createElement("div");
    commentItem.classList.add("commenttitle-and-comment");

    const commentName = document.createElement("p");
    commentName.classList.add("comment-name");
    commentName.textContent = comment.name;

    const commentBody = document.createElement("p");
    commentBody.classList.add("comment-body");
    commentBody.textContent = comment.body;

    commentItem.append(commentName, commentBody);
    commentsDiv.append(commentItem);
  });

  postContent.append(postBody, commentsDiv);
  postAndComments.append(postTitleRow, postContent);

  // ── Click: accordion toggle (close others, open this) ──
  postTitleRow.addEventListener("click", () => {
    const isExpanded = postContent.classList.contains("expanded");

    // Close all other open posts in this card
    const allPostContents = postsContainer.querySelectorAll(".post-content");
    const allPostArrows = postsContainer.querySelectorAll(
      ".post-title-row .arrow-icon",
    );

    allPostContents.forEach((pc) => pc.classList.remove("expanded"));
    allPostArrows.forEach((arrow) => arrow.classList.remove("rotated"));

    // Toggle current post (if it was closed, open it)
    if (!isExpanded) {
      postContent.classList.add("expanded");
      postArrow.classList.add("rotated");
    }
  });

  return postAndComments;
}
