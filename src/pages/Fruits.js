import Component from '@glimmer/component';
import { setComponentTemplate, createTemplate, templateOnlyComponent } from '@glimmer/core';
import css from '../styled-glimmer.js';

class Fruits extends Component {
  styles = css`
  h1 {
  color: red;
  }
  p {
  color: orange;
  }
  `;

  constructor() {
    super(...arguments);
    const { querystring } = this.args.ctx;
    const [,fruit]  = querystring.split('=');
    this.fruit = fruit;
  }
}

setComponentTemplate(createTemplate(`
<div class={{this.styles}}>
<h1>Fruits page</h1>
<p>Fruit name: {{this.fruit}}</p>
</div>
`),Fruits);

export default Fruits;
