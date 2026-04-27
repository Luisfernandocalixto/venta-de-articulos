export const isArticles = ({ data }) => {
    return (
        `
        ${data.map(item => {
            return (
                `
                <div
                class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin"
                uk-grid
                >
          <div class="uk-cover-container">
            <img src="/uploads/${item.imageUrl}" alt="" uk-cover />
            <canvas width="600" height="400"></canvas>
          </div>
          <div>
            <div class="uk-card-body">
              <h3 class="uk-card-title">Venta</h3>
              <p>${item.description}.</p>
              <time datetime="${item.createdAt}">${item.createdAt}</time>

              <p class="uk-alert-close uk-text-danger buttonDelete" id="${item.id}" uk-close></p>

              </div>
          </div>
        </div>
                `
            )
        }).join("")
        }
`
    );
}