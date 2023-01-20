document.addEventListener('DOMContentLoaded', () => {
  (() => {
    let modal = document.querySelector('#modal');
    let modalLayer = document.querySelector('#modal-layer');

    let profileModals = {
      changeModals(e) {
        e.preventDefault();

        this.target = e.target;
        if (this.target.tagName === 'A' || this.target.tagName === 'IMG') {
          if (this.target.tagName === 'IMG') { this.target = this.target.closest('a') };
          this.setDataInfo(this.target)
        }
      },

      setDataInfo(link) {
        this.image.src = link.dataset.imageSource;
        this.image.alt = link.dataset.name;
        this.title.textContent = link.dataset.name;
        this.text.textContent = link.dataset.text;
        this.fadeIn()
      },

      fadeIn() {
        
        modalLayer.classList.replace('hide', 'show');
        modal.classList.replace('hide', 'show');
      },

      reset(e) {
        e.preventDefault();
        this.image.src = '';
        this.image.alt = '';
        this.title.textContent = '';
        this.text.textContent = '';
        this.fadeOut()
      },

      fadeOut() {
        modalLayer.classList.replace('show', 'hide');
        modal.classList.replace('show', 'hide');
      },

      bind() {
        this.profiles.addEventListener('click', this.changeModals.bind(this));
        this.link.addEventListener('click', this.reset.bind(this));
        modalLayer.addEventListener('click', this.reset.bind(this));
      },

      init() {
        this.profiles = document.querySelector('#team>article>ul');
        this.link = modal.querySelector('a');
        this.image = modal.querySelector('img');
        this.title = modal.querySelector('h3');
        this.text = modal.querySelector('p');
        this.bind()
      }
    }

    profileModals.init()
  })() 
})