const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return (total = blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0));
};

const findMostLiked = (blogs) => {
  let mostLiked = null;

  for (const blog of blogs) {
    if (mostLiked === null || blog.likes > mostLiked.likes) {
      mostLiked = blog;
    }
  }

  return mostLiked;
};

const mostBlogs = (blogs) => {
  const authorObject = blogs.reduce((result, blog) => {
    const { author } = blog;
    if (result[author]) {
      result[author].blogs++;
    } else {
      result[author] = { author: author, blogs: 1 };
    }
    return result;
  }, {});

  // console.log(authorObject);
  // {
  //   'Michael Chan': { author: 'Michael Chan', blogs: 1 },
  //   'Edsger W. Dijkstra': { author: 'Edsger W. Dijkstra', blogs: 2 },
  //   'Robert C. Martin': { author: 'Robert C. Martin', blogs: 3 }
  // }

  // console.log(Object.values(authorObject));
  // [
  //   { author: 'Michael Chan', blogs: 1 },
  //   { author: 'Edsger W. Dijkstra', blogs: 2 },
  //   { author: 'Robert C. Martin', blogs: 3 },
  // ];

  let mostBlog = null;

  Object.values(authorObject).forEach((obj) => {
    if (mostBlog === null || obj.blogs > mostBlog.blogs) {
      mostBlog = obj;
    }
  });

  return mostBlog;
};

const mostLikes = (blogs) => {
  const authorObject = blogs.reduce((result, blog) => {
    const { author, likes } = blog;
    if (result[author]) {
      result[author].likes += likes;
    } else {
      result[author] = { author: author, likes: likes };
    }
    return result;
  }, {});

  let mostLikes = null;

  Object.values(authorObject).forEach((obj) => {
    if (mostLikes === null || obj.likes > mostLikes.likes) {
      mostLikes = obj;
    }
  });

  return mostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  findMostLiked,
  mostBlogs,
  mostLikes,
};
