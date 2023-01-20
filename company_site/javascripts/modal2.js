document.addEventListener('DOMContentLoaded', () => {
  let modalTemp = Handlebars.compile(document.querySelector('#modal-temp').innerHTML);
  //Handlebars.registerPartial(document.querySelector('#modal-partial').innerHTML)

  let Modals = {
    handleClick(e) {
      this.target = e.target;

      if (this.target.dataset.type === 'non-modal') {
        e.preventDefault()
        this.renderHiddenTemplate();
        this.showModal()
      }

      if (this.target.dataset.type === 'modal') {
        e.preventDefault();
        this.closeModal()
      }
    },

    closeModal() {
      document.querySelector('#modal').remove();
      document.querySelector('#modal-layer').remove();
    },

    renderHiddenTemplate() {
      this.getProfileObj();
      this.team.insertAdjacentHTML('afterbegin', modalTemp(this.profileObj))
    },

    showModal() {
      document.querySelector('#modal').classList.replace('hide','show');
      document.querySelector('#modal-layer').classList.replace('hide','show');
    },

    getProfileObj() {
      this.profileObj = {};

      if (this.target.tagName === 'IMG') { this.target = this.target.closest('a') };

      this.profileObj.source = this.target.dataset.imageSource;
      this.profileObj.name = this.target.dataset.name;
      this.profileObj.text = this.target.dataset.text;
      this.profileObj.information = {}
    },

    bind() {
      document.addEventListener('click', this.handleClick.bind(this));
    },

    init() {
      this.article = document.querySelector('article');
      this.team = document.querySelector('#team');
      this.bind()
    }
  }

  Modals.init()
})