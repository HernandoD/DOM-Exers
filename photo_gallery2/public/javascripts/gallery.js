
let Model = {
  getPhotos() {
    let photos = fetch('/photos')
              .then((res) => res.json())
              .then((data) => data)

    return photos; 
  },

  init() {
    this.photos = this.getPhotos()
    return this;
  }
}

let View = {
  getAllTemplates() {
    let temps = {};

    document.querySelectorAll("script[type='text/x-handlebars']").forEach(script => {
      temps[script['id']] = Handlebars.compile(script.innerHTML);
    });

    Handlebars.registerPartial('photo_comment', document.querySelector('#photo_comment').innerHTML);

    return temps;
  },

  bindSlideShowClick(handler) {
    document.querySelector('#slideshow').addEventListener('click', handler)
  },

  bindLikeClick(handler) {
   document.querySelector('main>section>header').addEventListener('click', handler);
  },

  bindSubmit(handler) {
    document.querySelector('form').addEventListener('submit', handler);
  },

  getMainFigureID() {
    return this.slides.firstElementChild.dataset.id;
  },

  init() {
    this.slides = document.querySelector('#slides');
    this.comments = document.querySelector('#comments>ul')
    this.photoInfoHeader = document.querySelector('section>header');
    this.templates = this.getAllTemplates();
    return this;
  }
}

let Constructor = {
  renderPhotos() {
    this.model.photos.then((data) => {
      this.view.slides.innerHTML = this.view.templates['photos']({photos: data})
    })
  },

  renderPhotoInformation(id) {
    this.model.photos.then((data) => {
      data.forEach(photo => {
        if (photo.id === id) {
          this.renderComments(id)
          this.view.photoInfoHeader.innerHTML = this.view.templates['photo_information'](photo)
          
        }
      })
    })
  },
  
  renderComments(id) {
    fetch('/comments?photo_id=' + id)
      .then((res) => res.json())
      .then((data) => {
        this.view.comments.innerHTML = this.view.templates['photo_comments']({comments: data})
      })
  },

  handleSlideShow(e) {
    let target = e.target;

    this.allFigures = [...document.querySelectorAll('#slides>figure')];

    if (target.classList.contains('prev')) {
      this.lastSlide = this.allFigures[this.allFigures.length - 1];
      this.view.slides.insertBefore(this.lastSlide, this.view.slides.firstElementChild);
      this.currentID = this.view.getMainFigureID()
      this.renderPhotoInformation(Number(this.currentID))
    } else if (target.classList.contains('next')) {
      this.firstSlide = this.allFigures[0];
      this.view.slides.append(this.firstSlide);
      this.currentID = this.view.getMainFigureID();
      this.renderPhotoInformation(Number(this.currentID))
    }
  },

  handleLikes(e) {
    e.preventDefault();
    let button = e.target;
    let buttonType = button.getAttribute("data-property");

    if (buttonType) {
      let href = button.getAttribute("href");
      let dataId = button.getAttribute("data-id");
      let text = button.textContent;
   
      fetch(href, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
       },
       body: 'photo_id=' + e.target.dataset.id,
      }).then((res) => res.json())
        .then((data) => {
          button.textContent = text.replace(/\d+/, data.total)
        })     
    }
  },

  handleForm(e) {
    e.preventDefault();
    
    let data = new FormData(e.target);

    data = new URLSearchParams(data).toString();

    fetch('/comments/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: data
    }).then((res) => res.json())
      .then((comment) => {
        this.view.comments.insertAdjacentHTML('beforeend', this.view.templates['photo_comment'](comment));
        e.target.reset()
      })

  },

  init(model, view) {
    this.model = model;
    this.view = view;
    this.renderPhotos();
    this.renderPhotoInformation(1);
    this.view.bindSlideShowClick(this.handleSlideShow.bind(this));
    this.view.bindLikeClick(this.handleLikes.bind(this));
    this.view.bindSubmit(this.handleForm.bind(this))
    this.allFigures = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Constructor.init(Model.init(), View.init())
})