import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  createTemplate,
  setComponentTemplate,
  templateOnlyComponent,
  getOwner
} from '@glimmer/core';

import { on, action } from '@glimmer/modifier';
import OtherComponent from '../OtherComponent.js';
import { fn as helper } from '@glimmer/helper';
import styled from '../styled-glimmer.js';

const myHelper = helper(function (name, greeting) {
  return `Helper:   ${greeting} ${name}`;
});

const StyledDiv = styled('div')`
color: red;
font-size: 2em;
border: 1px solid #fff;
`;


const ThemedButton = (primary) => styled('button')`
    background:  ${ primary ? "palevioletred" : "white" };
    color: ${primary ? "white" : "palevioletred" };
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
`;

const StyledButton = styled('button')`
    background:  palevioletred;
    color: white;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
`;
const PrimaryButton = ThemedButton(true);
const SecondaryButton = ThemedButton(false);

class Home extends Component {
  message = 'hello world';
  @tracked count = 55;

  get currentLocale() {
    return getOwner(this).services.locale.currentLocale;
  }

  @action
  increment() {
    this.count++;
  }
}

const TemplateOnlyComponent = setComponentTemplate(
  createTemplate(`<h1>I am rendered by a template only component: {{@name}}</h1>`),
  templateOnlyComponent()
);


setComponentTemplate(
  createTemplate(
    { myHelper, TemplateOnlyComponent, OtherComponent, on, StyledDiv, StyledButton, PrimaryButton },
    `
      <StyledDiv>Styled Component</StyledDiv>
      <p>{{this.count}}</p>
      <p> {{myHelper "foo" "hello" }}</p>
      <p>Curent Locale: {{this.currentLocale}}</p>
      <StyledButton {{on "click" this.increment}}>Increment</StyledButton>
      <TemplateOnlyComponent @name="Glimmer"/>
      <OtherComponent @count="22"/>
    `
  ),
  Home
);

export default Home;
