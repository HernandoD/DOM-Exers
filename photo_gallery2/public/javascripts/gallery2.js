class Model {
  constructor() {
    this.photos;
    this.comments;
  }

  async getPhotos() {
    this.photos = await fetch('/photos').then((res) => res.json());
    return this.photos
  }

  async getComments(id) {
    this.commentID = id;
    this.comments = await fetch('/comments?photo_id=' + id).then((res) => res.json());
    return this.comments;
  }

  async updateLikes(id) {
    let obj = {photo_id: id};
    let likes = await fetch('/photos/like', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(obj)
    }).then((res) => res.json())

    return likes
  }

  async postComment(data) {
    let comment = await fetch('/comments/new', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',},
      body: data
    }).then((res) => res.json());

    console.log(comment)

    return comment;
  }

  async updateFavorites(id) {
    let obj = {photo_id: id};
    let favorites = await fetch('/photos/favorite', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(obj)
    }).then((res) => res.json())

    return favorites    
  }
}

class View {
  constructor() {
    this.templates = this.registerTemplates();
    this.slides = document.querySelector('#slides');
    this.infoSection = document.querySelector('section>header');
    this.commentsList = document.querySelector('#comments>ul');
    this.slideShow = document.querySelector('#slideshow');
  }

  registerTemplates() {
    let temps = {};

    [...document.querySelectorAll("script[type='text/x-handlebars']")].forEach(script => {
      temps[script.id] = Handlebars.compile(script.innerHTML);
    })

    Handlebars.registerPartial('photo_comment', document.querySelector('#photo_comment').innerHTML);
    
    return temps;
  }

  renderPhotos(photos) {
    this.slides.insertAdjacentHTML('beforeend', this.templates['photos']({photos: photos}))
  }

  renderPhotoInfo(photo) {
    this.infoSection.innerHTML = "";
    this.infoSection.insertAdjacentHTML('beforeend', this.templates['photo_information'](photo))
  }

  renderComments(comments) {
    this.commentsList.innerHTML = ""
    this.commentsList.insertAdjacentHTML('beforeend', this.templates['photo_comments']({comments: comments}))
  }

  renderLikes(likes) {
    document.querySelector('.like').textContent = document.querySelector('.like').textContent.replace(/\d+/g, likes.total);
  }

  renderFavorites(favorites) {
    document.querySelector('.favorite').textContent = document.querySelector('.favorite').textContent.replace(/\d+/g, favorites.total); 
  }

  renderNewComment(comment) {
    document.querySelector('#comments>ul').insertAdjacentHTML('beforeend', this.templates['photo_comment'](comment))
  }

  bindClick(handler) {
    this.slideShow.addEventListener('click', handler)
  }

  bindLikesAndFavorites(handler) {
    document.addEventListener('click', handler);
  }

  bindCommentSubmit(handler) {
    document.addEventListener('click', handler)
  }

}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.displayPhotos();
    this.bindSlideShowClicks();
    this.bindLikesAndFavorites();
    this.bindSubmit()
  }

  bindSubmit() {
    this.view.bindCommentSubmit(this.handleCommentSub.bind(this))
  }

  bindLikesAndFavorites() {
    this.view.bindLikesAndFavorites(this.handleLikesAndFavsClick.bind(this))
  }

  bindSlideShowClicks() {
    this.view.bindClick(this.handleSlideShow.bind(this))
  }

  async handleCommentSub(e) {
    e.preventDefault();
    let target = e.target;
    let form = document.querySelector("form[method='post']");
    form.querySelector("input[name='photo_id']").setAttribute('value', this.model.commentID);
    let formattedData = this.getFormattedData(form);

    if (target.tagName === 'INPUT' && target.getAttribute('value') === 'Post Comment') {
      let comment = await this.model.postComment(formattedData);
      this.view.renderNewComment(comment);
      form.reset()
    }
  }

  getFormattedData(form) {
     let data = new FormData(form);
     let string = new URLSearchParams(data).toString();
     return string;
  }

  async handleLikesAndFavsClick(e) {
    e.preventDefault();
    let target = e.target;
    let href = target.href;
    let property = target.dataset.property;
    let photoID = target.dataset.id
    let likes;
    let favorites;

    if (property === 'likes') {
      likes = await this.model.updateLikes(photoID);
    }

    if (property === 'favorites') {
      favorites = await this.model.updateFavorites(photoID)
    }

    if (likes) { this.view.renderLikes(likes) }
    if (favorites) { this.view.renderFavorites(favorites)}
  }

  handleSlideShow(e) {
    e.preventDefault();
    let target = e.target;

    if (target.classList.contains('next')) {
      let oldInd = this.order[0];
      let newInd = this.order[1];
      let spliced = this.order.splice(0, 1)[0];
      this.order.push(spliced);

      this.fadeFigures(oldInd, newInd);
    }

    if (target.classList.contains('prev')) {
      let oldInd = this.order[0];
      let newInd = this.order[this.order.length - 1];
      let spliced = this.order.splice(this.order.length - 1)[0];
      this.order.unshift(spliced);

      this.fadeFigures(oldInd, newInd)
    }
  }

  fadeFigures(oldInd, newInd) {
    [...this.view.slides.querySelectorAll('figure')].forEach((figure, ind) => {
      figure.classList.add('hide');

      if (ind === oldInd) {
        figure.classList.remove('show')
        figure.classList.add('hide')
      }

      if (ind === newInd) {
        figure.classList.remove('hide')
        figure.classList.add('show');
        this.displayPhotoInfo(newInd)
      }
    })
  }

  async displayPhotos() {
    let photos = await this.collectPhotos();
    this.view.renderPhotos(photos);
    this.displayPhotoInfo(0);
    this.setOrder();
  }

  setOrder() {
    if (this.view.slides.querySelector('figure')) {
      this.order = [...this.view.slides.querySelectorAll('figure')].map((_, ind) => ind)
    }  
  }

  async displayPhotoInfo(index) {
    let photos = await this.collectPhotos();
    this.view.renderPhotoInfo(photos[index]);
    this.displayComments(index)
  }

  async displayComments(index) {
    let photos = await this.collectPhotos();
    let comments  = await this.model.getComments(photos[index].id)
    this.view.renderComments(comments)
  }

  async collectPhotos() {
    let photos = await this.model.getPhotos();
    return photos;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Controller(new Model(), new View())
})