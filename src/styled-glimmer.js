import { compile, serialize, stringify } from 'stylis';
import { setComponentTemplate, createTemplate } from '@glimmer/core';
import Component from '@glimmer/component';

const cache = {};
const hash = () =>
  Math.random()
    .toString(36)
    .replace('0.', '');

const sheet = document.createElement('style');
document.head.appendChild(sheet);

const none = hash => `.${hash}{display:none}`;
const hide = hash => (sheet.innerHTML = none(hash) + sheet.innerHTML);
const show = hash =>
  (sheet.innerHTML = sheet.innerHTML.replace(none(hash), ''));

const isExternalStyleSheet = key => /^(\/|https?:\/\/)/.test(key.trim());

const stylis = (hash,string) => serialize(compile(`.${hash}{${string}}`), stringify);

const process = key => hash => rules => {
  sheet.innerHTML += (cache[key] = {
    hash,
    rules: stylis(hash, rules)
  }).rules;
  if (isExternalStyleSheet(key)) show(hash);
};

export default (tag) => {
  return function(strings,...values) {
    const key = strings[0].startsWith('/')
      ? strings[0]
      : strings.reduce(
        (acc, string, i) =>
        (acc += string + (values[i] == null ? '' : values[i])),
        ''
      );

    if (cache[key]) return cache[key].hash;

    const className = 'gsc-' + hash();
    const append = process(key)(className);

    if (isExternalStyleSheet(key)) {
      hide(className);
      fetch(key)
        .then(res => res.text())
        .then(append);
    } else append(key);



    class StyledComponent extends Component  {
      className = className;
    }


    const templateMap = {
      'div': createTemplate(`<div class={{this.className}}>{{yield}}</div>`),
      'button': createTemplate(`<button class={{this.className}} ...attributes>{{yield}}</button>`),
    };

    setComponentTemplate( templateMap[tag], StyledComponent);

    return StyledComponent;
  };
};
